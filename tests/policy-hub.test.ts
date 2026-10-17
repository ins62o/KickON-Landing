import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { landingRoute } from '../src/landing-routes.ts';

test('policy hub and all legal documents resolve within the shared React shell', () => {
  for (const route of ['policies', 'terms', 'privacy', 'account-deletion']) {
    for (const suffix of ['', '/', '/index.html']) assert.equal(landingRoute(`/${route}${suffix}`), route);
  }
});

test('policy hub exposes exactly the three existing documents', async t => {
  const server = await createServer({ configFile: false, cacheDir: `/private/tmp/kickon-landing-tests-${process.pid}`, appType: 'custom', plugins: [react()], server: {middlewareMode: true, hmr: false, ws: false} });
  t.after(() => server.close());
  const { PolicyHubView } = await server.ssrLoadModule('/src/landing/PolicyViews.tsx');
  const html = renderToStaticMarkup(createElement(PolicyHubView));
  assert.deepEqual([...html.matchAll(/class="policy-card" href="([^"]+)"/g)].map(match => match[1]), ['/terms', '/privacy', '/account-deletion']);
});
