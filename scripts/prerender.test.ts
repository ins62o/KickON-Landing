import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("프리렌더 스크립트는 root와 SEO marker 누락 시 실패한다", async () => {
  const source = await readFile(new URL("./prerender.mjs", import.meta.url), "utf8");

  assert.match(source, /Missing empty root marker/);
  assert.match(source, /Missing SEO head marker/);
  assert.match(source, /Unknown prerender route/);
});

test("프리렌더 스크립트는 네 경로와 최종 결과를 검증한다", async () => {
  const source = await readFile(new URL("./prerender.mjs", import.meta.url), "utf8");

  assert.match(source, /SITE_ROUTES/);
  assert.match(source, /renderToString/);
  assert.match(source, /renderSeoHead/);
  assert.match(source, /root must not be empty/);
  assert.match(source, /canonical must use kickon\.kr/);
});

test("replaceRoot는 비어 있거나 중복된 root marker를 거부한다", async () => {
  const { replaceRoot } = await import("./prerender.mjs");

  assert.throws(() => replaceRoot("<main></main>", "<h1>x</h1>"), /Missing empty root marker/);
  assert.throws(
    () => replaceRoot('<div id="root"></div><div id="root"></div>', "<h1>x</h1>"),
    /Missing empty root marker/,
  );
});

test("replaceSeoHead는 비어 있거나 중복된 marker를 거부한다", async () => {
  const { replaceSeoHead } = await import("./prerender.mjs");
  const block = "<!-- seo-head:start --><title>x</title><!-- seo-head:end -->";

  assert.throws(() => replaceSeoHead("<head></head>", "<title>x</title>"), /Missing SEO head marker/);
  assert.throws(() => replaceSeoHead(`${block}${block}`, "<title>x</title>"), /Missing SEO head marker/);
});
