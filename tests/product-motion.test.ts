import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function boot(reducedMotion = false) {
  const handlers = new Map();
  const timers = new Map();
  const buttons = ['fixtures', 'live', 'community'].map(scene => ({
    dataset: { sceneButton: scene }, attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { handlers.set(`${scene}:${name}`, callback); },
  }));
  const screens = [{ hidden: false }, { hidden: true }, { hidden: true }];
  const feature = {
    dataset: {},
    querySelectorAll(selector) { return selector.includes('button') ? buttons : screens; },

  };
  const document = {
    hidden: false,
    querySelector(selector) { return selector.includes('feature') ? feature : null; },
    addEventListener(name, callback) { handlers.set(name, callback); },
  };
  const media = { matches: reducedMotion, addEventListener(name, callback) { handlers.set(`media:${name}`, callback); } };
  function removeListener(_name, callback) {
    for (const [key, value] of handlers) if (value === callback) handlers.delete(key);
  }
  const window = { matchMedia() { return media; }, addEventListener(name, callback) { handlers.set(name, callback); } };
  for (const target of [...buttons, document, media, window]) target.removeEventListener = removeListener;
  let timerId = 0;
  const dispose = vm.runInNewContext(readFileSync(new URL('../product.js', import.meta.url), 'utf8').replace(/^import .*;\n/gm, '').replace(/^export /gm, '') + '\ninitProductMotion();', {
    document,
    window,
    setInterval(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearInterval(id) { timers.delete(id); },
  });
  return { feature, buttons, screens, document, media, handlers, timers, dispose };
}

test('scenes cycle automatically and manual selection keeps its choreography running', () => {
  const app = boot();
  assert.equal(app.feature.dataset.scene, 'fixtures');
  [...app.timers.values()][0]();
  assert.equal(app.feature.dataset.scene, 'live');
  assert.equal(app.screens[1].hidden, false);
  assert.equal(app.screens[0].hidden, true);
  app.handlers.get('community:click')();
  assert.equal(app.feature.dataset.scene, 'community');
  assert.equal(app.timers.size, 0);
  assert.equal(app.feature.dataset.playing, 'true');
  assert.equal(app.feature.dataset.scene, 'community');
});

test('hidden pages stop autoplay and reduced motion keeps scenes manually selectable', () => {
  const app = boot();
  app.document.hidden = true;
  app.handlers.get('visibilitychange')();
  assert.equal(app.timers.size, 0);
  app.document.hidden = false;
  app.handlers.get('visibilitychange')();
  assert.equal(app.timers.size, 1);
  app.media.matches = true;
  app.handlers.get('media:change')();
  assert.equal(app.timers.size, 0);
  assert.equal(app.feature.dataset.playing, 'false');
  app.handlers.get('live:click')();
  assert.equal(app.feature.dataset.scene, 'live');
  const still = boot(true);
  assert.equal(still.timers.size, 0);
  assert.equal(still.screens[0].hidden, false);
});

test('leaving the features route disposes autoplay and its listeners', () => {
  const app = boot();
  assert.equal(app.timers.size, 1);
  app.dispose();
  assert.equal(app.timers.size, 0);
  assert.equal(app.handlers.size, 0);
});
