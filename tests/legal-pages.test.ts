import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

test("legal URLs render the restored document, including direct index.html requests", async (t) => {
  const server = await createServer({
    configFile: false,
    appType: "custom",
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  t.after(() => server.close());
  const { getLegalPage } = await server.ssrLoadModule("/src/legal-routes.ts");

  for (const [path, title, sections] of [
    ["privacy", "개인정보 처리방침", 11],
    ["terms", "이용약관", 15],
    ["account-deletion", "계정 삭제 요청", 6],
  ] as const) {
    for (const suffix of ["", "/", "/index.html"]) {
      const html = renderToStaticMarkup(createElement(getLegalPage(`/${path}${suffix}`)));
      assert.ok(html.includes(`<h1>${title}</h1>`));
      assert.equal((html.match(/class="legal-section"/g) ?? []).length, sections);
      assert.match(html, /href="\/privacy\/"/);
      assert.match(html, /href="\/terms\/"/);
      assert.match(html, /href="\/account-deletion\/"/);
    }
  }
  assert.throws(() => getLegalPage("/missing/"), /Unknown legal page/);
});

test("landing footer links only to privacy and terms", async (t) => {
  const server = await createServer({
    configFile: false,
    appType: "custom",
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  t.after(() => server.close());
  const { DownloadSection } = await server.ssrLoadModule("/src/DownloadSection.tsx");
  const html = renderToStaticMarkup(createElement(DownloadSection));
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer);
  assert.deepEqual([...footer.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(([, href, label]) => ({ href, label })), [
    { href: "/privacy/", label: "개인정보처리방침" },
    { href: "/terms/", label: "이용약관" },
  ]);
  assert.doesNotMatch(footer, /서비스 소개|문의하기/);
});
