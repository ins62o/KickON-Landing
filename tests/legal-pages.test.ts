import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

test("legal URLs render the restored document, including direct index.html requests", async (t) => {
  const server = await createServer({
    configFile: false, cacheDir: `/private/tmp/kickon-landing-tests-${process.pid}`,
    appType: "custom",
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  t.after(() => server.close());
  const { LegalDocumentView } = await server.ssrLoadModule("/src/landing/PolicyViews.tsx");

  for (const [path, title, sections] of [
    ["privacy", "개인정보 처리방침", 11],
    ["terms", "이용약관", 15],
    ["account-deletion", "계정 삭제 요청", 6],
  ] as const) {
    for (const suffix of ["", "/", "/index.html"]) {
      const html = renderToStaticMarkup(createElement(LegalDocumentView, { path: `/${path}${suffix}` }));
      assert.ok(html.includes(`<h1>${title}</h1>`));
      assert.equal((html.match(/class="legal-section"/g) ?? []).length, sections);
      assert.match(html, /href="\/privacy"/);
      assert.match(html, /href="\/terms"/);
      assert.match(html, /href="\/account-deletion"/);
    }
  }
});
