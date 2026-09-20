import type { FanCounts } from "./fan-status";

export type FanCountConfig = {
  url: string;
  publishableKey: string;
};

export type FanCountResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

export type FanCountFetcher = (
  url: string,
  init: RequestInit,
) => Promise<FanCountResponse>;

type FanCountRow = {
  team_id: string;
  fan_count: number | string;
};

function isFanCountRow(value: unknown): value is FanCountRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const row = value as Record<string, unknown>;
  const count = typeof row.fan_count === "string"
    ? Number(row.fan_count)
    : row.fan_count;

  return typeof row.team_id === "string"
    && row.team_id.length > 0
    && typeof count === "number"
    && Number.isSafeInteger(count)
    && count >= 0;
}

export function parseFanCountRows(value: unknown): FanCounts {
  if (!Array.isArray(value) || !value.every(isFanCountRow)) {
    throw new Error("INVALID_FAN_COUNT_RESPONSE");
  }

  return Object.fromEntries(value.map((row) => [
    row.team_id,
    Number(row.fan_count),
  ]));
}

export async function fetchFanCounts(
  config: FanCountConfig,
  fetcher: FanCountFetcher = fetch,
): Promise<FanCounts> {
  const url = config.url.replace(/\/$/, "");
  const key = config.publishableKey.trim();

  if (!url || !key) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const response = await fetcher(
    `${url}/rest/v1/rpc/public_team_fan_counts`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    },
  );

  if (!response.ok) {
    throw new Error(`FAN_COUNT_REQUEST_FAILED:${response.status}`);
  }

  return parseFanCountRows(await response.json());
}
