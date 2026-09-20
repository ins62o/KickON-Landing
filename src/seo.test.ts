import assert from "node:assert/strict";
import test from "node:test";
import {
  SEO_BY_PATH,
  SITE_ORIGIN,
  getSeoDefinition,
  renderSeoHead,
} from "./seo.ts";

test("SEO 설정은 kickon.kr의 네 공개 경로를 완전하게 정의한다", () => {
  assert.equal(SITE_ORIGIN, "https://kickon.kr");
  assert.deepEqual(Object.keys(SEO_BY_PATH), [
    "/",
    "/terms/",
    "/privacy/",
    "/account-deletion/",
  ]);

  for (const definition of Object.values(SEO_BY_PATH)) {
    assert.ok(definition.title);
    assert.ok(definition.description);
    assert.match(definition.canonical, /^https:\/\/kickon\.kr\//);
    assert.ok(["index, follow", "noindex, follow"].includes(definition.robots));
  }
});

test("메인 SEO는 승인된 키워드와 공유 정보를 사용한다", () => {
  const main = getSeoDefinition("/");

  assert.equal(main.title, "킥온 | K리그 커뮤니티·일정·순위·직관 기록");
  assert.match(main.description, /K리그 경기 일정과 순위/);
  assert.match(main.description, /직관 인증과 경기 기록/);
  assert.equal(main.openGraph.title, "킥온 | 모두를 위한 K리그 커뮤니티");
  assert.equal(main.openGraph.image, "https://kickon.kr/branding/kickon-og.png");
  assert.equal(main.openGraph.imageWidth, 1200);
  assert.equal(main.openGraph.imageHeight, 630);
  assert.equal(main.twitterCard, "summary_large_image");
});

test("계정 삭제 안내는 noindex이며 sitemap 대상이 아니다", () => {
  const deletion = getSeoDefinition("/account-deletion/");

  assert.equal(deletion.robots, "noindex, follow");
  assert.equal(deletion.includeInSitemap, false);
  assert.equal(deletion.canonical, "https://kickon.kr/account-deletion/");
});

test("SEO head 직렬화는 HTML 문자와 JSON-LD 닫힘 태그를 안전하게 처리한다", () => {
  const base = getSeoDefinition("/");
  const html = renderSeoHead({
    ...base,
    title: 'A & "B" <C>',
    structuredData: { value: "</script><script>alert(1)</script>" },
  });

  assert.match(html, /<title>A &amp; &quot;B&quot; &lt;C&gt;<\/title>/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /\\u003c\/script>/);
});

test("메인 구조화 데이터는 검증 가능한 세 타입과 실제 스토어 URL만 사용한다", () => {
  const main = getSeoDefinition("/");
  const graph = main.structuredData?.["@graph"];

  assert.ok(Array.isArray(graph));
  assert.deepEqual(graph.map((entry) => entry["@type"]), [
    "WebSite",
    "Organization",
    "MobileApplication",
  ]);

  const app = graph[2];
  assert.equal(app.applicationCategory, "SportsApplication");
  assert.equal(app.operatingSystem, "iOS, Android");
  assert.deepEqual(app.downloadUrl, [
    "https://apps.apple.com/kr/app/id6809176002",
    "https://play.google.com/store/apps/details?id=kr.kickon.app",
  ]);
  assert.equal("aggregateRating" in app, false);
  assert.equal("offers" in app, false);
});

test("robots와 sitemap은 kickon.kr의 indexable 경로만 공개한다", async () => {
  const { readFile } = await import("node:fs/promises");
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");

  assert.match(robots, /^User-agent: \*\nAllow: \/\n\nSitemap: https:\/\/kickon\.kr\/sitemap\.xml\n$/);
  assert.match(sitemap, /<loc>https:\/\/kickon\.kr\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/kickon\.kr\/terms\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/kickon\.kr\/privacy\/<\/loc>/);
  assert.doesNotMatch(sitemap, /account-deletion/);
  assert.doesNotMatch(sitemap, /<lastmod>|<changefreq>|<priority>/);
});
