import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

test('month preview aligns every October date to the correct weekday and shows the referenced fixture', async t => {
  const server = await createServer({ configFile: false, cacheDir: `/private/tmp/kickon-landing-tests-${process.pid}`, appType: 'custom', plugins: [react()], server: { middlewareMode: true, hmr: false, ws: false } });
  t.after(() => server.close());
  const { FeaturesView } = await server.ssrLoadModule('/src/landing/Views.tsx');
  const html = renderToStaticMarkup(createElement(FeaturesView));
  const days = [...html.matchAll(/data-calendar-day="(\d*)"/g)].map(match => match[1]);
  assert.equal(days.length,35);
  assert.equal(days.filter(Boolean).length,31);
  for (const [index,day] of days.entries()) {
    if (day) assert.equal(new Date(Date.UTC(2026,9,Number(day))).getUTCDay(),index%7);
  }
  assert.match(html,/2026년 10월/);
  assert.doesNotMatch(html,/calendar-today/);
  assert.match(html,/calendar-selected[^>]*aria-label="10월 18일 경기 있음"/);
  assert.match(html,/10\. 18 \(일\) 16:30/);
  assert.match(html,/32 라운드/);
  assert.match(html,/강릉종합운동장/);
  assert.doesNotMatch(html,/schedule-shadow|schedule-check/);
});
