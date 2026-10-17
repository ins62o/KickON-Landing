export function initProductMotion() {
  const cleanups = [];
  function listen(target, event, callback) {
    target.addEventListener(event, callback);
    cleanups.push(() => target.removeEventListener(event, callback));
  }

  const featureView = document.querySelector('[data-feature-view]');
  if (featureView) {
    const buttons = [...featureView.querySelectorAll('[data-scene-button]')];
    const screens = [...featureView.querySelectorAll('[data-scene-screen]')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0;
    let playing = !reduced.matches;
    let autoAdvance = true;
    let timer;
    cleanups.push(() => clearInterval(timer));

    function schedule() {
      clearInterval(timer);
      featureView.dataset.playing = String(playing && !document.hidden);
      if (playing && autoAdvance && !document.hidden) timer = setInterval(() => select((active + 1) % buttons.length), 10000);
    }

    function select(index) {
      active = index;
      featureView.dataset.scene = buttons[index].dataset.sceneButton;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      screens.forEach((screen, i) => { screen.hidden = i !== index; });
    }

    buttons.forEach((button, index) => listen(button, 'click', () => {
      autoAdvance = false;
      playing = !reduced.matches;
      select(index);
      schedule();
    }));
    listen(reduced, 'change', () => { playing = !reduced.matches; schedule(); });
    listen(document, 'visibilitychange', schedule);
    listen(window, 'pagehide', () => clearInterval(timer));
    select(0);
    schedule();
  }

  return () => cleanups.forEach(cleanup => cleanup());
}
