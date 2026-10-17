import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('CloudFront routing maps known paths to existing files without altering assets or query parameters',()=>{
  const handle=vm.runInNewContext(readFileSync(new URL('../hosting/cloudfront-routing.js',import.meta.url),'utf8')+'\nhandler;');
  for(const route of ['features','matchday','policies','terms','privacy','account-deletion']) {
    for(const suffix of ['','/','/index.html']) {
      const querystring={ref:{value:'mail%20campaign'}};
      const request={uri:`/${route}${suffix}`,querystring,headers:{}};
      const result=handle({request});
      assert.equal(result,request);
      assert.equal(result.uri,`/${route}/index.html`);
      assert.equal(result.querystring,querystring);
    }
  }
  for(const uri of ['/','/assets/main.js','/product/memory-stadium.webp','/missing','/features/unknown'])assert.equal(handle({request:{uri}}).uri,uri);
});
