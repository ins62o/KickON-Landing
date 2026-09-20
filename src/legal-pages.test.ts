import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

async function renderPage(modulePath: string, exportName: string) {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });

  const pageModule = await server.ssrLoadModule(modulePath);
  const html = renderToStaticMarkup(createElement(pageModule[exportName]));

  return { html, close: () => server.close() };
}

test("개인정보 처리방침은 제공된 11개 항목과 실제 처리 내용을 안내한다", async () => {
  const page = await renderPage("/src/legal/PrivacyPage.tsx", "PrivacyPage");

  try {
    assert.match(page.html, /개인정보 처리방침/);
    assert.match(page.html, /시행일/);
    assert.match(page.html, /2026년 9월 4일/);
    assert.equal((page.html.match(/class="legal-section"/g) ?? []).length, 11);
    assert.match(page.html, /현재 위치 확인/);
    assert.match(page.html, /백그라운드에서 위치를 지속적으로 추적하지 않습니다/);
    assert.match(page.html, /복원할 수 없는 로그인 식별자 해시/);
    assert.match(page.html, /7일간/);
    assert.match(page.html, /Supabase, Inc\./);
    assert.match(page.html, /kickon\.offical@gmail\.com/);
    assert.match(page.html, /href="\/account-deletion\/"/);
  } finally {
    await page.close();
  }
});

test("계정 삭제 요청은 앱과 이메일 요청 방법 및 삭제 범위를 안내한다", async () => {
  const page = await renderPage(
    "/src/legal/AccountDeletionPage.tsx",
    "AccountDeletionPage",
  );

  try {
    assert.match(page.html, /계정 삭제 요청/);
    assert.match(page.html, /2026년 9월 4일/);
    assert.equal((page.html.match(/class="legal-section"/g) ?? []).length, 6);
    assert.match(page.html, /마이페이지/);
    assert.match(page.html, /계정 탈퇴/);
    assert.match(page.html, /Apple 또는 Kakao/);
    assert.match(page.html, /비밀번호, 인증번호, 소셜 로그인 토큰은 보내지 마세요/);
    assert.match(page.html, /단방향 변환한 해시/);
    assert.match(page.html, /href="\/privacy\/"/);
  } finally {
    await page.close();
  }
});

test("정적 빌드는 세 법적 문서 직접 경로를 입력으로 사용한다", async () => {
  const config = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");

  assert.match(config, /terms\/index\.html/);
  assert.match(config, /privacy\/index\.html/);
  assert.match(config, /account-deletion\/index\.html/);
});
