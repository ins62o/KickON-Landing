# KickON SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `https://kickon.kr` fully crawlable and shareable with route-specific metadata, structured data, crawl directives, a branded social image, and build-time rendered React content without changing the visible landing design.

**Architecture:** Keep the existing Vite multi-page React application and introduce a pure SEO configuration module plus a shared route registry. Vite builds the client first, then a dependency-free Node script loads the same React route registry through Vite SSR, renders every known route into its output HTML, and injects metadata from the shared SEO module; the browser hydrates that markup instead of replacing it.

**Tech Stack:** Vite 8, React 19, TypeScript 6, React DOM server rendering, native Node.js scripts, native HTML/XML, Node Test Runner

**Spec:** `docs/superpowers/specs/2026-09-20-kickon-seo-design.md`

## Global Constraints

- Use `https://kickon.kr` for every canonical, sitemap, Open Graph, and JSON-LD site URL.
- Prioritize `K리그 커뮤니티`, then `K리그 일정` and `K리그 순위`, then `K리그 직관 기록` and `축구 직관 인증`.
- Preserve the existing visible landing design and user-facing page copy.
- Preserve the existing App Store and Google Play URLs.
- Do not change the Supabase fan-data modules or runtime request flow.
- Do not add dependencies.
- Do not add `meta keywords`, hidden SEO copy, unverifiable ratings, review counts, prices, or fabricated product UI.
- Use only existing real KickON logo and app-screen assets in the social image.
- Keep `/account-deletion/` publicly accessible but `noindex, follow` and excluded from the sitemap.
- A missing route definition, SEO field, render target, or output marker must fail tests or the production build.
- Preserve the dirty-worktree safety rule: never use `git reset`, `git restore`, or `git checkout` to discard changes.

## File Structure

- Create `src/seo.ts`: typed SEO route data, JSON-LD data, escaping, and head serialization.
- Create `src/seo.test.ts`: exact metadata, URL, indexing, serialization, and malicious-closing-tag regression tests.
- Create `src/site-routes.tsx`: normalized route lookup and React component/output-file registry shared by client and prerendering.
- Create `src/site-routes.test.ts`: route normalization, known-route output, and unknown-route fallback tests.
- Modify `src/main.tsx`: use the shared route registry and choose hydration or client render based on existing markup.
- Verify `vite.config.ts`: retain all four existing HTML build inputs; no change is needed unless the verification test fails.
- Modify `src/legal-pages.test.ts`: pin the hydration contract and four HTML SEO marker contracts.
- Modify `index.html`, `terms/index.html`, `privacy/index.html`, `account-deletion/index.html`: add replaceable SEO head markers while preserving existing icons and theme metadata.
- Create `public/robots.txt`: allow crawling and declare the sitemap.
- Create `public/sitemap.xml`: list only the three indexable canonical URLs.
- Create `scripts/og-card.html`: reproducible 1200×630 branded social-card source using existing local assets.
- Create `public/branding/kickon-og.png`: rendered 1200×630 social image.
- Create `scripts/prerender.mjs`: render known React routes, inject SEO heads, validate output, and write final build files.
- Create `scripts/prerender.test.ts`: source-level and failure-policy tests for the build script.
- Modify `package.json`: run the prerender script after the existing TypeScript and Vite build.

## Review Focus

- A pathname with query/hash/trailing slashes must select the same component and canonical route as its clean form; Task 2 tests normalization and fallback.
- Metadata containing `&`, quotes, or a closing `</script>` sequence must not create invalid HTML or executable markup; Task 1 tests escaping and JSON-LD serialization.
- A build whose HTML template is missing the root or SEO marker must fail instead of silently shipping empty or duplicate content; Task 5 tests both failures.
- Runtime-only state must not make server and client trees differ during hydration; Task 2 and Task 6 check hydration warnings on all four routes.
- `account-deletion` must remain crawlable enough to read `noindex` while staying out of the sitemap; Tasks 1 and 3 pin both sides of that policy.

---

### Task 1: Create the single source of truth for SEO metadata

**Files:**
- Create: `src/seo.ts`
- Create: `src/seo.test.ts`

**Interfaces:**
- Produces: `SITE_ORIGIN`, `SitePath`, `SeoDefinition`, `SEO_BY_PATH`, `getSeoDefinition(path)`, `renderSeoHead(definition)`
- Consumes: the existing App Store and Google Play URLs copied exactly from `src/App.tsx`

- [ ] **Step 1: Write failing route-data tests**

Create `src/seo.test.ts` with these assertions:

```ts
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
```

- [ ] **Step 2: Run the route-data tests and verify RED**

Run:

```bash
node --test src/seo.test.ts
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/seo.ts`.

- [ ] **Step 3: Add failing serializer safety tests**

Append to `src/seo.test.ts`:

```ts
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
```

- [ ] **Step 4: Implement the typed SEO module**

Create `src/seo.ts` with these public types and values:

```ts
export const SITE_ORIGIN = "https://kickon.kr";

export type SitePath = "/" | "/terms/" | "/privacy/" | "/account-deletion/";

export interface SeoDefinition {
  path: SitePath;
  title: string;
  description: string;
  canonical: string;
  robots: "index, follow" | "noindex, follow";
  includeInSitemap: boolean;
  openGraph: {
    title: string;
    image: string;
    imageWidth: 1200;
    imageHeight: 630;
  };
  twitterCard: "summary_large_image";
  structuredData?: Record<string, unknown>;
}

const DESCRIPTION =
  "K리그 경기 일정과 순위, 라인업·득점 알림을 확인하고 직관 인증과 경기 기록, 팀별 커뮤니티를 함께 즐겨보세요.";
const OG_IMAGE = `${SITE_ORIGIN}/branding/kickon-og.png`;

const APP_STORE_URL = "https://apps.apple.com/kr/app/id6809176002";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=kr.kickon.app";
```

Define `SEO_BY_PATH` in the exact path order asserted by the test. Use these titles and descriptions:

- `/`: title `킥온 | K리그 커뮤니티·일정·순위·직관 기록` and the `DESCRIPTION` constant above;
- `/terms/`: title `이용약관 | KICKON` and description `KickON 서비스 이용에 필요한 회원의 권리와 의무, 이용 조건과 운영 정책을 안내합니다.`;
- `/privacy/`: title `개인정보 처리방침 | KICKON` and description `KickON이 처리하는 개인정보의 항목, 이용 목적, 보관 기간과 이용자 권리를 안내합니다.`;
- `/account-deletion/`: title `계정 삭제 요청 | KICKON` and description `KickON 계정과 개인정보 및 활동 데이터를 삭제하는 방법과 처리 범위를 안내합니다.`.

All routes use `https://kickon.kr/branding/kickon-og.png`; each Open Graph URL equals its canonical. The main route's JSON-LD `@graph` must exactly implement the `WebSite`, `Organization`, and `MobileApplication` fields in the design spec. Implement `getSeoDefinition(path)` as an exact lookup that throws `Unknown SEO path: ${path}` for an undefined path.

Implement HTML escaping for text and attribute contexts and serialize JSON-LD with `<` replaced by `\\u003c`. `renderSeoHead()` must return exactly one title, description, robots, canonical, Open Graph group, Twitter group, and optional JSON-LD script. Do not emit `meta keywords`.

- [ ] **Step 5: Run SEO tests and the existing unit suite**

Run:

```bash
node --test src/seo.test.ts
npm test
```

Expected: all SEO tests and the full existing suite PASS.

- [ ] **Step 6: Commit the SEO configuration**

```bash
git add src/seo.ts src/seo.test.ts
git commit -m "feat: add typed SEO metadata"
```

---

### Task 2: Share route resolution and hydrate prerendered markup

**Files:**
- Create: `src/site-routes.tsx`
- Create: `src/site-routes.test.ts`
- Modify: `src/main.tsx`
- Modify: `src/legal-pages.test.ts`
- Verify unchanged: `vite.config.ts`

**Interfaces:**
- Consumes: `SitePath` and `getSeoDefinition()` from `src/seo.ts`
- Produces: `SiteRoute`, `SITE_ROUTES`, `normalizePathname(pathname)`, `getSiteRoute(pathname)`

- [ ] **Step 1: Write failing route normalization tests**

Create `src/site-routes.test.ts`:

```ts
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
      routes.SITE_ROUTES.map((route) => route.outputFile),
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
```

- [ ] **Step 2: Run the route tests and verify RED**

Run `node --test src/site-routes.test.ts`.

Expected: FAIL because `src/site-routes.tsx` does not exist.

- [ ] **Step 3: Create the shared route registry**

Create `src/site-routes.tsx`:

```tsx
import type { ComponentType } from "react";
import App from "./App.tsx";
import { AccountDeletionPage } from "./legal/AccountDeletionPage.tsx";
import { PrivacyPage } from "./legal/PrivacyPage.tsx";
import { TermsPage } from "./legal/TermsPage.tsx";
import { getSeoDefinition, type SitePath } from "./seo.ts";

export interface SiteRoute {
  path: SitePath;
  outputFile: string;
  component: ComponentType;
  seo: ReturnType<typeof getSeoDefinition>;
}

const routeDefinitions: Array<Omit<SiteRoute, "seo">> = [
  { path: "/", outputFile: "index.html", component: App },
  { path: "/terms/", outputFile: "terms/index.html", component: TermsPage },
  { path: "/privacy/", outputFile: "privacy/index.html", component: PrivacyPage },
  {
    path: "/account-deletion/",
    outputFile: "account-deletion/index.html",
    component: AccountDeletionPage,
  },
];

export const SITE_ROUTES: SiteRoute[] = routeDefinitions.map((route) => ({
  ...route,
  seo: getSeoDefinition(route.path),
}));

export function normalizePathname(pathname: string): string {
  const clean = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  return clean ? `${clean}/` : "/";
}

export function getSiteRoute(pathname: string): SiteRoute {
  const normalized = normalizePathname(pathname);
  return SITE_ROUTES.find((route) => route.path === normalized) ?? SITE_ROUTES[0];
}
```

- [ ] **Step 4: Add a failing hydration contract test**

Append to `src/legal-pages.test.ts`:

```ts
test("클라이언트는 프리렌더 마크업을 hydrate하고 빈 root만 새로 렌더링한다", async () => {
  const source = await readFile(new URL("./main.tsx", import.meta.url), "utf8");

  assert.match(source, /import\s*\{\s*createRoot,\s*hydrateRoot\s*\}/);
  assert.match(source, /root\.hasChildNodes\(\)/);
  assert.match(source, /hydrateRoot\(root,\s*app\)/);
  assert.match(source, /createRoot\(root\)\.render\(app\)/);
  assert.doesNotMatch(source, /document\.title\s*=/);
});
```

- [ ] **Step 5: Replace inline routing and add hydration**

Update `src/main.tsx` to import `createRoot` and `hydrateRoot`, obtain the route through `getSiteRoute(window.location.pathname)`, create the shared `<StrictMode><RootPage /></StrictMode>` element once, and choose:

```tsx
const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

const RootPage = getSiteRoute(window.location.pathname).component;
const app = (
  <StrictMode>
    <RootPage />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
```

Remove the inline route object and `document.title` assignment.

- [ ] **Step 6: Run route, hydration, and full tests**

Run:

```bash
node --test src/site-routes.test.ts
node --test src/legal-pages.test.ts
npm test
```

Expected: all tests PASS.

- [ ] **Step 7: Commit shared routing and hydration**

```bash
git add src/site-routes.tsx src/site-routes.test.ts src/main.tsx src/legal-pages.test.ts
git commit -m "refactor: share routes for SEO rendering"
```

---

### Task 3: Add HTML SEO markers and crawl directives

**Files:**
- Modify: `index.html`
- Modify: `terms/index.html`
- Modify: `privacy/index.html`
- Modify: `account-deletion/index.html`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Modify: `src/seo.test.ts`
- Modify: `src/legal-pages.test.ts`

**Interfaces:**
- Consumes: the four `SitePath` values from `src/seo.ts`
- Produces: one replaceable `seo-head` block in each HTML template and two static crawl files copied by Vite

- [ ] **Step 1: Write failing template and crawl-file tests**

Append to `src/legal-pages.test.ts`:

```ts
test("네 HTML 템플릿은 정확히 하나의 SEO 교체 블록을 제공한다", async () => {
  const files = [
    "../index.html",
    "../terms/index.html",
    "../privacy/index.html",
    "../account-deletion/index.html",
  ];

  for (const file of files) {
    const html = await readFile(new URL(file, import.meta.url), "utf8");
    assert.equal((html.match(/<!-- seo-head:start -->/g) ?? []).length, 1);
    assert.equal((html.match(/<!-- seo-head:end -->/g) ?? []).length, 1);
  }
});
```

Append to `src/seo.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
node --test src/seo.test.ts src/legal-pages.test.ts
```

Expected: FAIL because the markers and crawl files are absent.

- [ ] **Step 3: Add an SEO marker block to every HTML template**

Wrap the existing title in every file with these exact comments:

```html
<!-- seo-head:start -->
<title>existing route title</title>
<!-- seo-head:end -->
```

Keep charset, icons, viewport, and theme color outside this block so the prerender script cannot remove them.

- [ ] **Step 4: Create crawl files**

Create `public/robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://kickon.kr/sitemap.xml
```

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kickon.kr/</loc></url>
  <url><loc>https://kickon.kr/terms/</loc></url>
  <url><loc>https://kickon.kr/privacy/</loc></url>
</urlset>
```

- [ ] **Step 5: Run focused and full tests**

Run:

```bash
node --test src/seo.test.ts src/legal-pages.test.ts
npm test
```

Expected: all tests PASS.

- [ ] **Step 6: Commit templates and crawl files**

```bash
git add index.html terms/index.html privacy/index.html account-deletion/index.html public/robots.txt public/sitemap.xml src/seo.test.ts src/legal-pages.test.ts
git commit -m "feat: add crawl and canonical templates"
```

---

### Task 4: Create the branded social preview image

**Files:**
- Create: `scripts/og-card.html`
- Create: `public/branding/kickon-og.png`
- Modify: `src/seo.test.ts`

**Interfaces:**
- Consumes: `/branding/kickon-logo.webp` and current real images under `/screens/hero-collage/`
- Produces: `/branding/kickon-og.png` at exactly 1200×630

- [ ] **Step 1: Write the failing asset test**

Append to `src/seo.test.ts`:

```ts
test("공유 이미지는 PNG이며 정확히 1200x630이다", async () => {
  const { readFile } = await import("node:fs/promises");
  const png = await readFile(new URL("../public/branding/kickon-og.png", import.meta.url));

  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
```

- [ ] **Step 2: Run the asset test and verify RED**

Run `node --test src/seo.test.ts`.

Expected: FAIL with `ENOENT` for `public/branding/kickon-og.png`.

- [ ] **Step 3: Create the reproducible OG-card source**

Create `scripts/og-card.html` as a fixed 1200×630 page with:

- background `#08121e`
- the actual `/branding/kickon-logo.webp` at the upper left
- white text `모두를 위한 K리그 커뮤니티`
- blue supporting text `경기 일정·순위부터 직관 기록까지`
- three existing real screenshots: `incheon-match.png`, `ulsan-community.png`, and `suwon-bluewings-match.png`
- screenshots darkened with a gradient overlay so text remains readable
- no invented score, post, user, notification, or analytics content

Use semantic `<img>` tags and native CSS only. Set `html`, `body`, and `.og-card` to exactly 1200×630 with no margin or overflow.

- [ ] **Step 4: Render the PNG from the local source**

Start Vite:

```bash
npm run dev -- --host 127.0.0.1 --port 4175
```

Use browser automation with a 1200×630 viewport and device scale factor 1 to open `http://127.0.0.1:4175/scripts/og-card.html`, wait for all four images to report `complete && naturalWidth > 0`, and capture only `.og-card` to `public/branding/kickon-og.png`. Stop the server after capture. The exported bitmap, not merely the CSS box, must pass the PNG-header dimension test.

- [ ] **Step 5: Inspect and test the asset**

Run:

```bash
file public/branding/kickon-og.png
node --test src/seo.test.ts
```

Expected: PNG reports 1200×630 and all SEO tests PASS. Visually confirm the logo and both approved text lines remain readable at a 600×315 preview size.

- [ ] **Step 6: Commit the social image source and output**

```bash
git add scripts/og-card.html public/branding/kickon-og.png src/seo.test.ts
git commit -m "feat: add KickON social preview"
```

---

### Task 5: Add fail-closed build-time prerendering

**Files:**
- Create: `scripts/prerender.mjs`
- Create: `scripts/prerender.test.ts`
- Modify: `package.json`
- Modify: `src/legal-pages.test.ts`

**Interfaces:**
- Consumes: `SITE_ROUTES` from `src/site-routes.tsx` and `renderSeoHead()` from `src/seo.ts`
- Produces: non-empty prerendered `dist` roots and route-specific SEO heads for all four output files

- [ ] **Step 1: Write failing prerender policy tests**

Create `scripts/prerender.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the policy tests and verify RED**

Run `node --test scripts/prerender.test.ts`.

Expected: FAIL with `ENOENT` for `scripts/prerender.mjs`.

- [ ] **Step 3: Implement the prerender script**

Create `scripts/prerender.mjs` using only `node:fs/promises`, `node:path`, React, `react-dom/server`, and Vite.

The script must:

1. create a Vite middleware server with React support and HMR disabled;
2. load `/src/site-routes.tsx` and `/src/seo.ts` with `ssrLoadModule()`;
3. iterate exactly `SITE_ROUTES`;
4. reject a route not present in `SEO_BY_PATH` with `Unknown prerender route`;
5. reject an empty title, description, canonical, or robots value before rendering;
6. read each route's `dist/${outputFile}`;
7. require exactly one `<div id="root"></div>` or throw `Missing empty root marker`;
8. require exactly one `<!-- seo-head:start -->...<!-- seo-head:end -->` block or throw `Missing SEO head marker`;
9. render `<StrictMode><RouteComponent /></StrictMode>` with `renderToString()`;
10. replace the empty root and SEO block;
11. verify the final root is non-empty or throw `root must not be empty`;
12. verify the canonical starts with `https://kickon.kr/` or throw `canonical must use kickon.kr`;
13. extract the main route's JSON-LD script, parse it with `JSON.parse()`, and reject a missing graph or non-absolute `@id`, `url`, `logo`, or `downloadUrl` value;
14. verify account deletion contains `noindex, follow` and the other routes contain `index, follow`;
15. write the final UTF-8 HTML;
16. always close the Vite server in `finally`.

Export pure helpers `replaceRoot(html, markup)` and `replaceSeoHead(html, head)` before the script entry guard so the tests can import and directly exercise marker-count failures without running a build.

- [ ] **Step 4: Add direct helper failure tests**

Append to `scripts/prerender.test.ts`:

```ts
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
```

- [ ] **Step 5: Attach prerendering to production build**

Change the `test` and `build` scripts in `package.json` to:

```json
"test": "node --test src/*.test.ts scripts/*.test.ts",
"build": "tsc -b && vite build && node scripts/prerender.mjs"
```

Keep `test:integration` unchanged. Including `scripts/*.test.ts` in `npm test` ensures the prerender failure-policy suite cannot be skipped during final verification.

- [ ] **Step 6: Add a build-output contract test**

Append to `src/legal-pages.test.ts`:

```ts
test("프로덕션 빌드는 프리렌더 단계를 필수로 실행한다", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.equal(
    packageJson.scripts.build,
    "tsc -b && vite build && node scripts/prerender.mjs",
  );
  assert.equal(
    packageJson.scripts.test,
    "node --test src/*.test.ts scripts/*.test.ts",
  );
});
```

- [ ] **Step 7: Run focused tests, then build**

Run:

```bash
node --test scripts/prerender.test.ts src/legal-pages.test.ts
npm run build
```

Expected: tests PASS and build exits 0.

- [ ] **Step 8: Inspect all built documents**

Run:

```bash
rg -n "<div id=\"root\">.+</div>|<link rel=\"canonical\"|application/ld\+json|noindex, follow" dist/index.html dist/terms/index.html dist/privacy/index.html dist/account-deletion/index.html
rg -n "오늘의 함성을|개인정보 처리방침|계정 삭제 요청" dist/index.html dist/privacy/index.html dist/account-deletion/index.html
```

Expected:

- every output root contains rendered markup;
- every file contains one canonical and robots tag;
- only the main document contains JSON-LD;
- account deletion contains `noindex, follow`;
- visible H1/body phrases exist before JavaScript executes.

- [ ] **Step 9: Commit the prerender pipeline**

```bash
git add scripts/prerender.mjs scripts/prerender.test.ts package.json src/legal-pages.test.ts
git commit -m "feat: prerender SEO content at build time"
```

---

### Task 6: Run full static, browser, and production verification

**Files:**
- Verify: `index.html`
- Verify: `terms/index.html`
- Verify: `privacy/index.html`
- Verify: `account-deletion/index.html`
- Verify: `src/seo.ts`
- Verify: `src/site-routes.tsx`
- Verify: `src/main.tsx`
- Verify: `scripts/prerender.mjs`
- Verify: `public/robots.txt`
- Verify: `public/sitemap.xml`
- Verify: `public/branding/kickon-og.png`

**Interfaces:**
- Consumes: all completed SEO tasks
- Produces: release evidence for metadata, crawlability, hydration, responsiveness, application behavior, and diff scope

- [ ] **Step 1: Run all static verification**

Run in parallel or separately:

```bash
npm run lint
npm test
npm run build
git diff --check
```

Expected: ESLint exits 0, all tests pass, production build exits 0, and diff check reports no whitespace errors.

- [ ] **Step 2: Run the existing production Supabase integration test**

Map the existing ignored `.env.local` Vite variable names to the integration test names without printing their values:

```bash
set -a
source .env.local
export SUPABASE_URL="$VITE_SUPABASE_URL"
export SUPABASE_PUBLISHABLE_KEY="$VITE_SUPABASE_PUBLISHABLE_KEY"
npm run test:integration
```

Expected: 1 pass, 0 fail. Do not add `.env.local` to git.

- [ ] **Step 3: Serve the production output**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4175
```

Open the preview with browser automation and wait for network idle.

- [ ] **Step 4: Verify metadata and prerender state in the browser**

For `/`, `/terms/`, `/privacy/`, and `/account-deletion/`, collect before navigation completes any client mutation is unnecessary because the final head is static. Evaluate:

```js
({
  path: location.pathname,
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.content,
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  robots: document.querySelector('meta[name="robots"]')?.content,
  rootChildren: document.querySelector('#root')?.childElementCount,
  h1: document.querySelector('h1')?.textContent?.trim(),
})
```

Expected: correct route-specific values, non-empty root, visible H1, and account deletion alone reports `noindex, follow`. Hydration warnings are measured from the browser warning/error log in Step 7, not inferred from resource timing entries.

- [ ] **Step 5: Verify JavaScript-disabled HTML directly**

Fetch each preview URL as text with the browser or a read-only HTTP client and confirm the returned response body already contains its H1 and metadata without executing scripts.

Expected: all four response bodies contain non-empty `#root` markup and their exact canonical.

- [ ] **Step 6: Re-run the seven responsive widths**

At 320, 375, 430, 768, 1024, 1280, and 1440px, collect:

```js
({
  width: innerWidth,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  h1: document.querySelector('h1')?.textContent?.trim(),
  storeButtons: document.querySelectorAll('.store-button').length,
  brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
})
```

Expected: `overflow` false, H1 present, both store buttons retained where rendered, and `brokenImages` 0 at every width.

- [ ] **Step 7: Check browser logs and hydration**

Read warning and error logs after loading each of the four routes.

Expected: no React hydration mismatch, Vite overlay, missing local image, or application error. Browser-internal updater or display-driver messages are not application console errors and must be reported separately if present.

- [ ] **Step 8: Run Lighthouse SEO**

Run the available Lighthouse audit against `http://127.0.0.1:4175/` or use Chrome DevTools Lighthouse if no CLI is installed.

Expected: SEO audit has no failed audit caused by missing title, description, crawlability, canonical, image alt text, or invalid status code. Record the score and any environment-only warning instead of hiding it.

- [ ] **Step 9: Stop the preview and audit the final scope**

Run:

```bash
git status --short
git diff --stat
git diff -- src/seo.ts src/site-routes.tsx src/main.tsx scripts/prerender.mjs package.json index.html terms/index.html privacy/index.html account-deletion/index.html public/robots.txt public/sitemap.xml
```

Confirm no Supabase module, visible landing section, or unrelated asset changed.

- [ ] **Step 10: Prepare the final report**

Report:

- final title and description;
- canonical and indexing policy for all four paths;
- JSON-LD types;
- sitemap included and excluded paths;
- OG image path and dimensions;
- prerendered H1 evidence for all four outputs;
- test count and failures;
- integration test result;
- lint and build exit results;
- Lighthouse SEO result;
- hydration/application console error count;
- overflow result at all seven widths;
- intentional files changed and confirmation of no unexpected diff.
