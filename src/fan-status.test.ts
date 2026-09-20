import assert from "node:assert/strict";
import test from "node:test";
import { getFanBoard, getFanSummary } from "./fan-status.ts";

test("K리그1 팬 현황을 팬 수가 많은 순서로 보여준다", () => {
  const board = getFanBoard("K1", {
    incheon: 3,
    seoul: 5,
  });

  assert.equal(board.length, 12);
  assert.equal(board[0]?.name, "FC 서울");
  assert.equal(board[0]?.count, 5);
  assert.equal(board[1]?.name, "인천 유나이티드");
  assert.equal(board[1]?.count, 3);
});

test("리그별 팬 수와 전체 팬 수를 계산한다", () => {
  assert.deepEqual(getFanSummary("K2", {
    daegu: 2,
    incheon: 3,
  }), {
    totalFans: 5,
    totalTeams: 2,
    leagueFans: 2,
    leagueTeams: 17,
  });
});
