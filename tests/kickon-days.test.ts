import assert from 'node:assert/strict';
import test from 'node:test';
import { getKickonDays, untilNextKoreanDay } from '../src/kickon-days.ts';

test('launch day starts at D+0 in Korea and changes at Korean midnight', () => {
  for (const [instant, days] of [
    ['2026-09-09T14:59:59.999Z', 0],
    ['2026-09-09T15:00:00.000Z', 0],
    ['2026-09-10T14:59:59.999Z', 0],
    ['2026-09-10T15:00:00.000Z', 1],
    ['2026-10-16T15:00:00.000Z', 37],
    ['2027-01-01T00:00:00.000+09:00', 113],
  ] as const) {
    assert.equal(getKickonDays(Date.parse(instant)), days);
  }
});

test('next update is scheduled at Korean midnight regardless of browser timezone', () => {
  assert.equal(untilNextKoreanDay(Date.parse('2026-10-17T14:59:59.999Z')), 1);
  assert.equal(untilNextKoreanDay(Date.parse('2026-10-17T15:00:00.000Z')), 86_400_000);
  assert.equal(getKickonDays(Date.parse('2026-10-17T08:00:00-07:00')), 38);
});
