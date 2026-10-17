// Launch day is D+0; keep this date in YYYY-MM-DD format.
export const KICKON_START_DATE = '2026-09-10';

const DAY_MS = 86_400_000;
const KOREA_OFFSET_MS = 9 * 60 * 60 * 1000;
const START_DAY = Date.parse(`${KICKON_START_DATE}T00:00:00Z`) / DAY_MS;

export function getKickonDays(now: number): number {
  return Math.max(0, Math.floor((now + KOREA_OFFSET_MS) / DAY_MS) - START_DAY);
}

export function untilNextKoreanDay(now: number): number {
  return DAY_MS - ((now + KOREA_OFFSET_MS) % DAY_MS);
}
