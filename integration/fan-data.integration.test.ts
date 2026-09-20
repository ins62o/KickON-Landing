import assert from "node:assert/strict";
import test from "node:test";
import { fetchFanCounts } from "../src/fan-data.ts";

test("운영 Supabase가 가입 완료 사용자 팀별 집계를 공개한다", async () => {
  const url = process.env.SUPABASE_URL ?? "";
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";

  assert.ok(url, "SUPABASE_URL is required");
  assert.ok(publishableKey, "SUPABASE_PUBLISHABLE_KEY is required");

  const counts = await fetchFanCounts({ url, publishableKey });

  assert.ok(Object.values(counts).every((count) => (
    Number.isSafeInteger(count) && count >= 0
  )));
});
