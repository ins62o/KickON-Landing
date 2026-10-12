export type LandingStats = { users: number; attendances: number | null };
export type StatsConfig = { url: string; publishableKey: string };

function parseCount(value: unknown): number {
  const count = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) {
    throw new Error("INVALID_STATS_COUNT");
  }
  return count;
}

export function formatMilestone(count: number): string {
  parseCount(count);
  if (count < 10) return String(count);
  const step = 10 ** Math.max(1, String(count).length - 2);
  return `${(Math.floor(count / step) * step).toLocaleString("en-US")}+`;
}

export async function fetchLandingStats(config: StatsConfig, signal?: AbortSignal, fetcher: typeof fetch = fetch): Promise<LandingStats> {
  const url = config.url.trim().replace(/\/$/, "");
  const key = config.publishableKey.trim();
  if (!url || !key.startsWith("sb_publishable_")) throw new Error("STATS_NOT_CONFIGURED");
  const request = (name: string) => fetcher(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: "{}",
    signal,
  });

  const response = await request("public_landing_stats");
  if (response.ok) {
    const rows: unknown = await response.json();
    if (!Array.isArray(rows) || rows.length !== 1 || !rows[0] || typeof rows[0] !== "object") {
      throw new Error("INVALID_STATS_RESPONSE");
    }
    return { users: parseCount(rows[0].user_count), attendances: parseCount(rows[0].attendance_count) };
  }
  if (response.status !== 404) throw new Error(`STATS_REQUEST_FAILED:${response.status}`);

  // Keep the existing user count live until the new aggregate RPC is installed.
  const fallback = await request("public_team_fan_counts");
  if (!fallback.ok) throw new Error(`STATS_REQUEST_FAILED:${fallback.status}`);
  const rows: unknown = await fallback.json();
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("INVALID_STATS_RESPONSE");
  const teams = new Set<string>();
  let users = 0;
  for (const row of rows) {
    if (!row || typeof row !== "object" || typeof row.team_id !== "string" || !row.team_id || teams.has(row.team_id)) {
      throw new Error("INVALID_STATS_RESPONSE");
    }
    teams.add(row.team_id);
    users += parseCount(row.fan_count);
  }
  return { users: parseCount(users), attendances: null };
}
