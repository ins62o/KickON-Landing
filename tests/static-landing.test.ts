import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { fetchLandingStats, formatMilestone, getMilestone } from '../src/landing-stats.ts';
import { getKickonDays, untilNextKoreanDay } from '../src/kickon-days.ts';

function boot({ reducedMotion = false, animate = false, fetcher = async () => new Response(JSON.stringify([{ user_count: 1319, attendance_count: 116 }])) } = {}) {
  const listeners = new Map();
  const frames = [];
  const observers = [];
  let now = Date.parse('2026-10-17T14:59:59.999Z');
  const timers = new Map();
  let timerId = 0;
  const elapsedDays = {
    dataset: {}, textContent: '', attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
  };
  const counters = [['users', '100'], ['attendances', '10']].map(([stat, step]) => ({
    dataset: { stat, step }, textContent: '—', attributes: { 'aria-busy': 'true' },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
  }));
  const [signupCounter, attendanceCounter] = counters;
  const links = Array.from({ length: 5 }, () => ({ focused: false, focus() { this.focused = true; } }));
  const button = {
    expanded: 'false', label: 'Open menu', focused: false,
    getAttribute() { return this.expanded; },
    setAttribute(name, value) { if (name === 'aria-expanded') this.expanded = value; else this.label = value; },
    addEventListener(name, handler) { listeners.set(`button:${name}`, handler); },
    focus() { this.focused = true; },
  };
  const logoButton = {
    pressed: 'false',
    getAttribute() { return this.pressed; },
    setAttribute(name, value) { if (name === 'aria-pressed') this.pressed = value; },
    addEventListener(name, handler) { listeners.set(`logo:${name}`, handler); },
  };
  const menu = {
    hidden: true, lastElementChild: links.at(-1),
    addEventListener(name, handler) { listeners.set(`menu:${name}`, handler); },
  };
  const overlay = {
    hidden: true,
    addEventListener(name, handler) { listeners.set(`overlay:${name}`, handler); },
  };
  const content = [{ inert: false }, { inert: false }, { inert: false }];
  let menuOpen = false;
  const video = { pause() {}, play() { return Promise.resolve(); } };
  const document = {
    activeElement: button,
    body: { classList: { toggle(_name, value) { menuOpen = value; } } },
    querySelector(selector) { return { '.logo-toggle': logoButton, '.menu-toggle': button, '.mobile-menu': menu, '.menu-overlay': overlay, '.bg-video': video, '[data-kickon-days]': elapsedDays }[selector]; },
    querySelectorAll(selector) {
      if (selector === '.hero, .stats, .logo, .product-view') return content;
      if (selector === '.counter') return counters;
      return [];
    },
    addEventListener(name, handler) { listeners.set(name, handler); },
  };
  function removeListener(_name, callback) {
    for (const [key, value] of listeners) if (value === callback) listeners.delete(key);
  }
  const window = {
    addEventListener(name, handler) { listeners.set(`window:${name}`, handler); },
    matchMedia(query) {
      return {
        removeEventListener: removeListener,
        matches: query.includes('max-width') || (query.includes('prefers-reduced-motion') && reducedMotion),
        addEventListener(name, handler) { listeners.set(`media:${query}`, handler); },
      };
    },
  };
  if (animate) {
    window.IntersectionObserver = class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe() {}
      disconnect() { this.disconnected = true; }
    };
  }
  for (const target of [button, logoButton, menu, overlay, document, window]) target.removeEventListener = removeListener;
  const code = (readFileSync(new URL('../navigation.js', import.meta.url), 'utf8') + '\n' + readFileSync(new URL('../main.js', import.meta.url), 'utf8'))
    .replace(/^import .*;\n/gm, '')
    .replace(/^export /gm, '')
    .replaceAll('import.meta.env', 'buildEnv');
  const dispose = vm.runInNewContext(code + '\nconst stopNav = initNavigation(); const stopHome = initHome(); () => { stopHome(); stopNav(); };', {
    document, window, IntersectionObserver: window.IntersectionObserver, navigator: { userAgent: 'test' }, performance,
    fetchLandingStats: (config, signal) => fetchLandingStats(config, signal, fetcher),
    formatMilestone, getMilestone, AbortController,
    getKickonDays, untilNextKoreanDay,
    Date: class extends Date { static now() { return now; } },
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    buildEnv: { VITE_SUPABASE_URL: 'https://test.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' },
    requestAnimationFrame(callback) { if (animate) frames.push(callback); else callback(performance.now() + 10000); },
  });
  return { dispose, elapsedDays, timers, frames, observers, setNow(value) { now = Date.parse(value); }, signupCounter, attendanceCounter, logoButton, button, menu, overlay, content, links, document, listeners, isOpen: () => menuOpen };
}

test('mobile menu closes on Escape, backdrop, navigation, and desktop resize', () => {
  const app = boot();
  const toggle = app.listeners.get('button:click');
  toggle();
  assert.equal(app.menu.hidden, false);
  assert.equal(app.overlay.hidden, false);
  assert.equal(app.button.expanded, 'true');
  assert.equal(app.isOpen(), true);
  assert.ok(app.content.every(element => element.inert));
  app.listeners.get('keydown')({ key: 'Escape' });
  assert.equal(app.menu.hidden, true);
  assert.equal(app.overlay.hidden, true);
  assert.equal(app.button.expanded, 'false');
  assert.equal(app.button.focused, true);
  assert.ok(app.content.every(element => !element.inert));

  toggle();
  app.listeners.get('overlay:click')();
  assert.equal(app.menu.hidden, true);
  toggle();
  app.listeners.get('menu:click')({ target: { closest: () => ({}) } });
  assert.equal(app.menu.hidden, true);
  toggle();
  app.listeners.get('media:(max-width: 720px)')({ matches: false });
  assert.equal(app.menu.hidden, true);
});


test('logo toggles from white to dark and back on each click', () => {
  const app = boot();
  const flip = app.listeners.get('logo:click');
  assert.equal(typeof flip, 'function');
  assert.equal(app.logoButton.pressed, 'false');
  flip();
  assert.equal(app.logoButton.pressed, 'true');
  flip();
  assert.equal(app.logoButton.pressed, 'false');
});


test('server counts stay formatted when motion is reduced or IntersectionObserver is unavailable', async () => {
  for (const reducedMotion of [false, true]) {
    const app = boot({ reducedMotion });
    assert.equal(app.signupCounter.textContent, '—');
    assert.equal(app.attendanceCounter.textContent, '—');
    await new Promise(setImmediate);
    assert.equal(app.signupCounter.textContent, '1,300+');
    assert.equal(app.attendanceCounter.textContent, '110+');
    assert.equal(app.signupCounter.attributes['aria-busy'], 'false');
    assert.equal(app.attendanceCounter.attributes['aria-busy'], 'false');
  }
});

test('failed server requests never turn into hardcoded or zero counts', async () => {
  const app = boot({ fetcher: async () => new Response('{}', { status: 503 }) });
  await new Promise(setImmediate);
  for (const counter of [app.signupCounter, app.attendanceCounter]) {
    assert.equal(counter.textContent, '—');
    assert.equal(counter.attributes['aria-busy'], 'false');
    assert.match(counter.attributes['aria-label'], /조회 불가/);
  }
});

test('unavailable attendance remains unknown while the existing user-count fallback still works', async () => {
  const app = boot({ fetcher: async url => String(url).endsWith('public_landing_stats')
    ? new Response('{}', { status: 404 })
    : new Response(JSON.stringify([{ team_id: 'incheon', fan_count: 1319 }])) });
  await new Promise(setImmediate);
  assert.equal(app.signupCounter.textContent, '1,300+');
  assert.equal(app.attendanceCounter.textContent, '—');
});




test('elapsed days advance at Korean midnight and refresh after returning to the tab', () => {
  const app = boot();
  assert.equal(app.elapsedDays.textContent, 'D+37');
  const midnightTimer = [...app.timers.values()].find(timer => timer.delay === 1);
  assert.ok(midnightTimer);
  app.setNow('2026-10-17T15:00:00.000Z');
  midnightTimer.callback();
  assert.equal(app.elapsedDays.textContent, 'D+38');
  assert.equal(app.elapsedDays.attributes['aria-label'], '킥온 시작 후 38일');
  app.setNow('2026-10-20T16:00:00.000Z');
  app.listeners.get('visibilitychange')();
  assert.equal(app.elapsedDays.textContent, 'D+41');
});


test('elapsed-day count animates from D+0 to the current day and honors reduced motion', () => {
  const app = boot({ animate: true });
  assert.equal(app.observers.length, 1);
  app.observers[0].callback([{ isIntersecting: true }]);
  assert.equal(app.elapsedDays.textContent, 'D+0');
  const during = app.frames.shift();
  during(performance.now() + 800);
  assert.match(app.elapsedDays.textContent, /^D\+\d+$/);
  const intermediate = Number(app.elapsedDays.textContent.slice(2));
  assert.ok(intermediate > 0 && intermediate < 37);
  app.frames.shift()(performance.now() + 10000);
  assert.equal(app.elapsedDays.textContent, 'D+37');

  const still = boot({ animate: true, reducedMotion: true });
  assert.equal(still.elapsedDays.textContent, 'D+37');
  assert.equal(still.frames.length, 0);
  assert.equal(still.observers.length, 0);
});

test('changing the day during animation keeps the final value', () => {
  const app = boot({ animate: true });
  app.observers[0].callback([{ isIntersecting: true }]);
  const staleFrame = app.frames.shift();
  app.setNow('2026-10-17T15:00:00Z');
  app.listeners.get('visibilitychange')();
  staleFrame(performance.now() + 10000);
  assert.equal(app.elapsedDays.textContent, 'D+38');
});


test('unmount clears the Korean-midnight timer, requests, observers and event listeners', async () => {
  const app = boot({ animate: true });
  app.dispose();
  await new Promise(setImmediate);
  assert.equal(app.timers.size, 0);
  assert.equal(app.listeners.size, 0);
  assert.ok(app.observers.every(observer => observer.disconnected));
  assert.equal(app.signupCounter.textContent, '—');
});
