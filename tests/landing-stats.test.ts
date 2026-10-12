import assert from "node:assert/strict";
import test from "node:test";
import { fetchLandingStats, formatMilestone } from "../src/landing-stats.ts";

const config = { url: "https://test.supabase.co/", publishableKey: "sb_publishable_test" };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

test("milestones round down without inflating small or boundary counts", () => {
  for (const [count, formatted] of [[0, "0"], [9, "9"], [10, "10+"], [87, "80+"], [99, "90+"], [100, "100+"], [999, "990+"], [1240, "1,200+"], [1246, "1,200+"], [9999, "9,900+"], [10000, "10,000+"]] as const) {
    assert.equal(formatMilestone(count), formatted);
  }
  for (const invalid of [-1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => formatMilestone(invalid));
  }
});

test("reads both real totals using only the public API key", async () => {
  const stats = await fetchLandingStats(config, undefined, async (url, init) => {
    assert.equal(url, "https://test.supabase.co/rest/v1/rpc/public_landing_stats");
    assert.deepEqual(init?.headers, { apikey: "sb_publishable_test", "Content-Type": "application/json" });
    return reply([{ user_count: "1246", attendance_count: 87 }]);
  });
  assert.deepEqual(stats, { users: 1246, attendances: 87 });
});

test("missing new RPC falls back to real users without inventing attendance", async () => {
  const stats = await fetchLandingStats(config, undefined, async (url) => String(url).endsWith("public_landing_stats")
    ? reply({ code: "PGRST202" }, 404)
    : reply([{ team_id: "incheon", fan_count: "1200" }, { team_id: "ulsan", fan_count: 46 }]));
  assert.deepEqual(stats, { users: 1246, attendances: null });
});

test("invalid totals, duplicate teams and failed requests never become plausible stats", async () => {
  for (const payload of [[], null, [{ user_count: 12, attendance_count: -1 }], [{ user_count: null, attendance_count: 0 }], [{ user_count: true, attendance_count: 3 }], [{ user_count: "", attendance_count: 4 }]]) {
    await assert.rejects(fetchLandingStats(config, undefined, async () => reply(payload)));
  }
  await assert.rejects(fetchLandingStats(config, undefined, async () => reply({}, 503)), /STATS_REQUEST_FAILED:503/);
  await assert.rejects(fetchLandingStats(config, undefined, async (url) => String(url).endsWith("public_landing_stats")
    ? reply({}, 404)
    : reply([{ team_id: "incheon", fan_count: 10 }, { team_id: "incheon", fan_count: 10 }])));
  await assert.rejects(fetchLandingStats({ ...config, publishableKey: "sb_secret_not_for_browser" }), /STATS_NOT_CONFIGURED/);
});

test("passes cancellation to fetch", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchLandingStats(config, controller.signal, async (_url, init) => {
    assert.equal(init?.signal, controller.signal);
    init?.signal?.throwIfAborted();
    return reply([]);
  }), { name: "AbortError" });
});
