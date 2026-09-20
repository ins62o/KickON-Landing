import assert from "node:assert/strict";
import test from "node:test";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

test("사이트 경로는 trailing slash와 query/hash를 정규화한다", async () => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });

  try {
    const routes = await server.ssrLoadModule("/src/site-routes.tsx");
    assert.equal(routes.normalizePathname("/"), "/");
    assert.equal(routes.normalizePathname("/terms"), "/terms/");
    assert.equal(routes.normalizePathname("/privacy/?from=footer#top"), "/privacy/");
    assert.equal(routes.normalizePathname("/account-deletion///"), "/account-deletion/");
  } finally {
    await server.close();
  }
});

test("알 수 없는 경로의 브라우저 fallback은 메인 페이지를 사용한다", async () => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });

  try {
    const routes = await server.ssrLoadModule("/src/site-routes.tsx");
    assert.equal(routes.getSiteRoute("/missing").path, "/");
    assert.equal(routes.SITE_ROUTES.length, 4);
    assert.deepEqual(
      routes.SITE_ROUTES.map((route: { outputFile: string }) => route.outputFile),
      [
        "index.html",
        "terms/index.html",
        "privacy/index.html",
        "account-deletion/index.html",
      ],
    );
  } finally {
    await server.close();
  }
});
