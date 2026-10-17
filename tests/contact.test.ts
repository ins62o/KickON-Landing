import assert from 'node:assert/strict';
import test from 'node:test';
import { parseContactData, sendContact } from '../src/contact.ts';
import { createContactHandler } from '../supabase/functions/landing-contact/handler.ts';

const input = { category: 'app', name: '  킥온 팬  ', email: '  fan@example.com  ', message: '  앱 문의입니다\n알림 설정이 궁금해요  ' };
const requestId = '20e398b9-56ce-44b1-b3ba-a84aa6166f07';
const config = { apiKey: 're_server_secret', from: 'KICKON <contact@kickon.kr>', supabaseUrl: 'https://test.supabase.co', serviceKey: 'server_only', origins: ['https://kickon.kr'] };
const clientConfig = { url: config.supabaseUrl, publishableKey: 'sb_publishable_test' };
function request(body: unknown = {...input, requestId}, headers: Record<string,string> = {}) {
  return new Request('https://test.supabase.co/functions/v1/landing-contact', { method: 'POST', headers: { origin: config.origins[0], 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.1', ...headers }, body: JSON.stringify(body) });
}

test('all enquiry types trim fields and retain Korean multiline text', () => {
  for (const category of ['event','collaboration','app']) assert.deepEqual(parseContactData({...input,category}), {category,name:'킥온 팬',email:'fan@example.com',message:'앱 문의입니다\n알림 설정이 궁금해요'});
});

test('untrusted input and header injection are rejected', () => {
  for (const bad of [null, [], 'string', {}, {...input,name:12}, {...input,category:'other'}, {...input,name:'팬\nBcc: other@example.com'}, {...input,email:'fan@example.com\nBcc: other@example.com'}, {...input,email:'invalid'}, {...input,message:' '}, {...input,message:'가'.repeat(3001)}]) assert.throws(()=>parseContactData(bad));
});

test('client posts to the edge function and accepts only a confirmed provider receipt', async () => {
  const data=parseContactData(input);
  let count=0;
  const result=await sendContact(clientConfig,data,requestId,async (url,init)=>{
    count++;
    assert.equal(String(url),'https://test.supabase.co/functions/v1/landing-contact');
    assert.equal(init?.method,'POST');
    assert.equal(new Headers(init?.headers).get('apikey'),clientConfig.publishableKey);
    assert.deepEqual(JSON.parse(String(init?.body)),{...data,requestId});
    return Response.json({id:'resend-receipt'});
  });
  assert.equal(count,1); assert.equal(result,'resend-receipt');
  for (const response of [Response.json({}),Response.json({id:''}),new Response('upstream', {status:502}),new Response('{}',{status:429}),new Response('{}',{status:503})]) {
    await assert.rejects(sendContact(clientConfig,data,requestId,async()=>response));
  }
  await assert.rejects(sendContact(clientConfig,data,requestId,async()=>{throw new Error('network') }));
});

test('server checks durable limits before sending to the fixed recipient with safe Reply-To', async () => {
  const calls: string[]=[];
  const handler=createContactHandler(config,async (url,init)=>{
    calls.push(String(url));
    const body=JSON.parse(String(init?.body));
    const headers=new Headers(init?.headers);
    if(String(url).includes('/rpc/')) {
      assert.match(body.p_ip_hash,/^[a-f0-9]{64}$/);
      assert.ok(!JSON.stringify(body).includes('203.0.113.1'));
      assert.equal(headers.get('authorization'),'Bearer server_only');
      return Response.json(true);
    }
    assert.equal(String(url),'https://api.resend.com/emails');
    assert.equal(headers.get('authorization'),'Bearer re_server_secret');
    assert.equal(headers.get('idempotency-key'),`landing-contact/${requestId}`);
    assert.deepEqual(body.to,['kickon.offical@gmail.com']);
    assert.equal(body.from,config.from);assert.equal(body.reply_to,'fan@example.com');
    assert.equal(body.subject,'[킥온 앱 문의] 킥온 팬');
    assert.ok(body.text.endsWith('앱 문의입니다\n알림 설정이 궁금해요'));
    assert.equal(body.html,undefined);
    return Response.json({id:'resend-receipt'});
  });
  const response=await handler(request({...input,requestId,to:'attacker@example.com'}));
  assert.equal(response.status,200); assert.deepEqual(await response.json(),{id:'resend-receipt'});
  assert.equal(response.headers.get('access-control-allow-origin'),'https://kickon.kr');
  assert.equal(calls.length,2);
});

test('invalid origin, methods, bodies and request IDs never reach the provider', async () => {
  let calls=0;
  const handler=createContactHandler(config,async()=>{calls++;throw new Error('must not call')});
  for (const [req,status] of [
    [request(undefined,{origin:'https://evil.example'}),403],
    [new Request('https://test.supabase.co',{headers:{origin:config.origins[0]}}),405],
    [request(null),400],[request({...input,requestId:'bad'}),400],
    [request({...input,message:'x'.repeat(17000),requestId}),413],
    [new Request('https://test.supabase.co',{method:'POST',headers:{origin:config.origins[0],'content-type':'application/json'},body:'{'}),400],
  ] as const) assert.equal((await handler(req)).status,status);
  assert.equal(calls,0);
  const preflight=await handler(new Request('https://test.supabase.co',{method:'OPTIONS',headers:{origin:config.origins[0]}}));
  assert.equal(preflight.status,204);
});

test('rate limits and missing configuration fail closed', async () => {
  for (const [limitResponse,status] of [[Response.json(false),429],[new Response('{}',{status:500}),503]] as const) {
    let calls=0;
    const response=await createContactHandler(config,async()=>{calls++;return limitResponse})(request());
    assert.equal(response.status,status);assert.equal(calls,1);
  }
  let calls=0;
  assert.equal((await createContactHandler({...config,apiKey:''},async()=>{calls++;return Response.json({})})(request())).status,503);
  assert.equal(calls,0);
});

test('provider errors, ambiguous responses and network failure never become success or disclose secrets', async () => {
  for (const provider of [new Response('re_server_secret',{status:422}),Response.json({}),Response.json({id:''}),null]) {
    let calls=0;
    const response=await createContactHandler(config,async()=>{
      if(++calls===1)return Response.json(true);
      if(!provider)throw new Error('re_server_secret');
      return provider;
    })(request());
    assert.equal(response.status,502); assert.ok(!(await response.text()).includes('re_server_secret'));
  }
});
