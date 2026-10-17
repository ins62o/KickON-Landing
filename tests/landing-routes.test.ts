import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalLandingPath, landingRoute } from '../src/landing-routes.ts';
import { createServer } from 'vite';

const routes=['features','matchday','policies','terms','privacy','account-deletion'];

test('all landing entries resolve and normalize to paths without a trailing slash', () => {
  for (const route of routes) {
    for (const suffix of ['', '/', '/index.html']) {
      assert.equal(landingRoute(`/${route}${suffix}`),route);
      assert.equal(canonicalLandingPath(`/${route}${suffix}`),`/${route}`);
    }
  }
  for (const path of ['/','/index.html']) {
    assert.equal(landingRoute(path),'home');
    assert.equal(canonicalLandingPath(path),'/');
  }
  for (const path of ['/missing/','/features/unknown','/assets/logo.svg']) {
    assert.equal(landingRoute(path),null);
    assert.equal(canonicalLandingPath(path),null);
  }
});

test('direct requests to clean routes serve the right HTML without adding a slash', async t => {
  const server=await createServer({cacheDir:`/private/tmp/kickon-routing-tests-${process.pid}`,optimizeDeps:{noDiscovery:true,include:[]},server:{host:'127.0.0.1',port:0,hmr:false,ws:false,preTransformRequests:false}});
  t.after(()=>server.close());
  await server.listen();
  const address=server.httpServer!.address();
  assert.ok(address && typeof address==='object');
  for(const route of routes) {
    const response=await fetch(`http://127.0.0.1:${address.port}/${route}?from=test`,{redirect:'manual',signal:AbortSignal.timeout(5000)});
    assert.equal(response.status,200,route);
    assert.equal(response.headers.get('location'),null);
    assert.match(await response.text(),/\/src\/main.tsx/);
  }
});
