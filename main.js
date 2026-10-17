import { fetchLandingStats, getMilestone, formatMilestone } from './src/landing-stats.ts';

import { getKickonDays, untilNextKoreanDay } from './src/kickon-days.ts';

export function initHome() {
  const cleanups = [];
  function listen(target, event, callback) {
    target.addEventListener(event, callback);
    cleanups.push(() => target.removeEventListener(event, callback));
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const requestController = new AbortController();
  const observers = [];
  let disposed = false;
  let requestTimeout;

  const elapsedDays = document.querySelector('[data-kickon-days]');
  let dayTimer;
  function updateElapsedDays(animate = false) {
    clearTimeout(dayTimer);
    if (disposed) return;
    const now = Date.now();
    const days = getKickonDays(now);
    elapsedDays.dataset.target = String(days);
    elapsedDays.dataset.prefix = 'D+';
    elapsedDays.dataset.display = `D+${days.toLocaleString('en-US')}`;
    elapsedDays.textContent = elapsedDays.dataset.display;
    elapsedDays.setAttribute('aria-label', `킥온 시작 후 ${days}일`);
    if (animate) animateCounters([elapsedDays]);
    dayTimer = setTimeout(() => updateElapsedDays(), untilNextKoreanDay(now));
  }
  listen(document, 'visibilitychange', () => {
    if (!document.hidden) updateElapsedDays();
  });

  const counters = [...document.querySelectorAll('.counter')];

  function finishCounters() {
    [elapsedDays, ...counters].forEach(counter => {
      if (counter.dataset.display !== undefined) counter.textContent = counter.dataset.display;
    });
  }

  function showUnavailable(counter) {
    delete counter.dataset.target;
    delete counter.dataset.display;
    counter.textContent = '—';
    counter.setAttribute('aria-busy', 'false');
    counter.setAttribute('aria-label', '현재 집계 조회 불가');
  }

  function countUp(counter, index) {
    const display = counter.dataset.display;
    const prefix = counter.dataset.prefix ?? "";
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.display.endsWith('+') ? '+' : '';
    const duration = 1500 + index * 80;
    const start = performance.now() + 480 + index * 90;
    counter.textContent = `${prefix}0${suffix}`;
    function frame(now) {
      if (disposed) return;
      if (counter.dataset.display !== display) return;
      if (reducedMotion.matches) {
        finishCounters();
        return;
      }
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - (1 - progress) ** 3;
      counter.textContent = `${prefix}${Math.round(target * eased).toLocaleString('en-US')}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function animateCounters(elements) {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      finishCounters();
      return;
    }
    if (!elements.length) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      elements.forEach(countUp);
      observer.disconnect();
    }, { threshold: 0.25 });
    observers.push(observer);
    observer.observe(document.querySelector('.stats'));
  }

  async function loadCounters() {
    const controller = requestController;
    requestTimeout = setTimeout(() => controller.abort(), 8000);
    try {
      const stats = await fetchLandingStats({
        url: import.meta.env.VITE_SUPABASE_URL ?? '',
        publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
      }, controller.signal);
      if (disposed) return;
      counters.forEach(counter => {
        const count = stats[counter.dataset.stat];
        if (typeof count !== 'number') {
          showUnavailable(counter);
          return;
        }
        const step = Number(counter.dataset.step);
        counter.dataset.target = String(getMilestone(count, step));
        counter.dataset.display = formatMilestone(count, step);
        counter.setAttribute('aria-busy', 'false');
        counter.removeAttribute('aria-label');
      });

      animateCounters(counters.filter(counter => counter.dataset.target !== undefined));
    } catch {
      if (!disposed) counters.forEach(showUnavailable);
    } finally {
      clearTimeout(requestTimeout);
    }
  }

  updateElapsedDays(true);
  loadCounters();
  listen(reducedMotion, 'change', () => {
    if (reducedMotion.matches) finishCounters();
  });

  return () => {
    disposed = true;
    clearTimeout(dayTimer);
    clearTimeout(requestTimeout);
    requestController.abort();
    observers.forEach(observer => observer.disconnect());
    cleanups.forEach(cleanup => cleanup());
  };
}
