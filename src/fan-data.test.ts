import assert from "node:assert/strict";
import test from "node:test";
import {
  fetchFanCounts,
  parseFanCountRows,
} from "./fan-data.ts";

test("Supabase 집계 응답의 문자열 수치를 팀별 숫자로 변환한다", () => {
  assert.deepEqual(parseFanCountRows([
    { team_id: "incheon", fan_count: "4" },
    { team_id: "seoul", fan_count: 2 },
  ]), {
    incheon: 4,
    seoul: 2,
  });
});

test("잘못된 Supabase 집계 응답은 화면에 사용하지 않는다", () => {
  assert.throws(
    () => parseFanCountRows([
      { team_id: "incheon", fan_count: -1 },
    ]),
    /INVALID_FAN_COUNT_RESPONSE/,
  );
});

test("공개 집계 RPC를 publishable key로 호출한다", async () => {
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;

  const counts = await fetchFanCounts(
    {
      url: "https://example.supabase.co/",
      publishableKey: "pk_test",
    },
    async (url, init) => {
      requestedUrl = url;
      requestedInit = init;

      return {
        ok: true,
        status: 200,
        json: async () => [
          { team_id: "incheon", fan_count: 4 },
        ],
      };
    },
  );

  const headers = new Headers(requestedInit?.headers);

  assert.equal(
    requestedUrl,
    "https://example.supabase.co/rest/v1/rpc/public_team_fan_counts",
  );
  assert.equal(requestedInit?.method, "POST");
  assert.equal(headers.get("apikey"), "pk_test");
  assert.equal(headers.get("Authorization"), "Bearer pk_test");
  assert.deepEqual(counts, { incheon: 4 });
});

test("Supabase 설정이 없으면 명확한 오류를 반환한다", async () => {
  await assert.rejects(
    () => fetchFanCounts({ url: "", publishableKey: "" }),
    /SUPABASE_NOT_CONFIGURED/,
  );
});
