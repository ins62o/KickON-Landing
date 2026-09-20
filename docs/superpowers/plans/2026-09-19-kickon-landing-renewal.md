# KickON Landing Renewal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder and refine the KickON landing page so it communicates the match-day journey, real attendance records, live KickON signup counts, community value, and app-download action without inventing product UI.

**Architecture:** Preserve the existing single-page React structure and all fan-data modules. Make focused changes in `App.tsx` and `App.css`, add only one verified community screenshot asset, and extend the current static-render regression tests before each implementation step. Keep the Supabase request and aggregation path unchanged.

**Tech Stack:** Vite 8, React 19, TypeScript 6, native CSS, react-icons, Supabase REST RPC, Node Test Runner

**Spec:** `docs/superpowers/specs/2026-09-19-kickon-landing-renewal-design.md`

## Global Constraints

- Preserve the existing dirty working tree. Never run `git reset`, `git restore`, or `git checkout` to remove changes.
- Do not rewrite `src/App.tsx` or `src/App.css` wholesale.
- Do not modify `src/fan-data.ts`, `src/fan-status.ts`, their public interfaces, or the `public_team_fan_counts` RPC flow.
- Do not add dependencies.
- Use only real assets from `public/` or verified current assets from `../app`.
- Do not create fake app screens, fake posts, fake analytics, or hard-coded fan counts.
- Use `KickON 가입 팬` for counts that could otherwise be mistaken for all K League fans.
- Do not use `object-fit: cover` for `attendance-history.png`.
- Desktop feature cards remain 440px tall at 1200px and above. Tablet and mobile do not inherit this fixed height.
- Preserve `킥온 | K리그 커뮤니티`, the KickON favicon, and the app icon.
- Product-code commits are intentionally omitted because `App.tsx`, `App.css`, and tests were already dirty at baseline. Each task ends with a scoped diff checkpoint instead of committing unrelated user changes.

## Review Focus

- At 320px, transformed phone visuals, store buttons, and long Korean copy must fit without horizontal overflow. Task 7 measures `scrollWidth` at 320px.
- At 768px and 1024px, feature cards must not remain in a forced 3-column layout. Task 7 checks computed grid columns at both widths.
- The attendance screenshot must remain fully visible at every viewport. Task 4 pins the CSS policy and Task 7 verifies rendered image geometry.
- The community screenshot must match the current `CommunityScreen.tsx`, not the older September 1 QA layout. Task 6 uses the September 13 Incheon capture and records why.
- Missing Supabase configuration and request failures must still show the existing error and retry UI. Task 5 reruns all fan-data and fan-status tests without changing the data modules.

---

### Task 1: Lock the renewed information architecture in regression tests

**Files:**
- Modify: `src/App.test.ts`

**Interfaces:**
- Consumes: default export from `src/App.tsx`
- Produces: regression expectations for final section order, hero copy, journey labels, header CTA, download anchor, and safe footer markup

- [ ] **Step 1: Add a shared static-render helper**

Add this helper below the imports in `src/App.test.ts`:

```ts
async function renderApp() {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });

  const appModule = await server.ssrLoadModule("/src/App.tsx");
  const html = renderToStaticMarkup(createElement(appModule.default));

  return { html, close: () => server.close() };
}
```

Do not rewrite the existing tests in this step. The helper is used only by new tests to keep the scope small.

- [ ] **Step 2: Write the failing information-architecture test**

Append:

```ts
test("랜딩은 경기 여정부터 가입 팬과 설치 CTA까지 순서대로 안내한다", async () => {
  const app = await renderApp();

  try {
    assert.match(app.html, /K리그의 오늘을 보고,/);
    assert.match(app.html, /내가 함께한 경기를 기록하세요\./);
    assert.match(app.html, /href="#download"/);
    assert.match(app.html, /id="download"/);
    assert.match(app.html, /경기 전/);
    assert.match(app.html, /경기 중/);
    assert.match(app.html, /경기 후/);

    const order = [
      "K리그의 오늘을 보고,",
      "경기 전부터 경기 후까지,",
      "오늘의 함성을",
      "지금 KickON에서 함께 응원하는 팬들",
      "같은 팀을 응원하는 팬들과",
      "다음 K리그 경기는",
    ].map((text) => app.html.indexOf(text));

    assert.ok(order.every((index) => index >= 0));
    assert.deepEqual(order, [...order].sort((a, b) => a - b));
    assert.doesNotMatch(app.html, /href="\/">이용약관/);
    assert.doesNotMatch(app.html, /href="\/">개인정보처리방침/);
    assert.doesNotMatch(app.html, /href="\/">문의하기/);
  } finally {
    await app.close();
  }
});
```

- [ ] **Step 3: Run the new test and verify the expected failure**

Run:

```bash
npm test -- --test-name-pattern="랜딩은 경기 여정부터 가입 팬과 설치 CTA까지 순서대로 안내한다"
```

Expected: FAIL because the current Hero copy, header CTA, section order, and download ID do not match.

- [ ] **Step 4: Record the baseline without committing dirty files**

Run:

```bash
git status --short
git diff -- src/App.test.ts
```

Expected: only the new regression test and pre-existing user changes are visible. Do not stage or commit `src/App.test.ts`.

---

### Task 2: Add the header download action and rewrite the Hero

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Test: `src/App.test.ts`

**Interfaces:**
- Consumes: existing `PhonePreview`, App Store URL, Google Play URL, and `.header-button` styling
- Produces: `StoreButtons` component with optional light presentation, `#download` navigation target, and approved Hero content

- [ ] **Step 1: Extract the duplicated store links without changing URLs**

Add above `App`:

```tsx
function StoreButtons({ light = false }: { light?: boolean }) {
  return (
    <div className={`store-buttons${light ? " centered" : ""}`}>
      <a
        className={`store-button${light ? " light" : ""}`}
        href="https://apps.apple.com/kr/app/id6809176002"
        target="_blank"
        rel="noreferrer"
        aria-label="KickON App Store에서 다운로드"
      >
        <FaApple />
        <span className="store-copy">
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </a>

      <a
        className={`store-button${light ? " light" : ""}`}
        href="https://play.google.com/store/apps/details?id=kr.kickon.app"
        target="_blank"
        rel="noreferrer"
        aria-label="KickON Google Play에서 다운로드"
      >
        <FaGooglePlay />
        <span className="store-copy">
          <small>GET IT ON</small>
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  );
}
```

Replace both duplicated store-link groups with `<StoreButtons />` and `<StoreButtons light />`.

- [ ] **Step 2: Add the header CTA and approved Hero copy**

Update the header container:

```tsx
<a className="header-button" href="#download">
  앱 다운로드
</a>
```

Update the Hero content:

```tsx
<h1>
  K리그의 오늘을 보고,
  <br />
  내가 함께한 경기를 기록하세요.
</h1>

<p className="hero-description">
  경기 일정과 순위부터 라인업·득점 알림,
  <br />
  직관 인증과 나만의 경기 기록까지.
</p>

<StoreButtons />
```

Keep `PhonePreview` and both real screenshot paths unchanged.

- [ ] **Step 3: Rebalance Hero CSS without shrinking the visual to fit one viewport**

Use these layout rules as the target:

```css
.header-inner {
  height: 76px;
}

.header-button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hero,
.hero-inner {
  min-height: 900px;
}

.hero-inner {
  padding-top: 112px;
  padding-bottom: 72px;
  grid-template-columns: minmax(0, 0.95fr) minmax(420px, 1.05fr);
}

.hero h1 {
  font-size: clamp(54px, 5vw, 72px);
  line-height: 1.12;
}
```

Do not reduce `.phone` below its current 320px desktop width. At `max-width: 1000px`, keep the existing stacked order and let the visual continue below the first viewport.

- [ ] **Step 4: Run the targeted regression test**

Run the Task 1 command again.

Expected: the Hero and header assertions pass; the test still fails on section order, journey labels, fan copy, community, CTA, or footer.

- [ ] **Step 5: Review the scoped diff**

Run:

```bash
git diff -- src/App.tsx src/App.css src/App.test.ts
```

Expected: no store URL, logo path, phone-screen path, or fan-data import changed.

---

### Task 3: Turn the feature cards into a match-day journey

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Test: `src/App.test.ts`

**Interfaces:**
- Consumes: existing `CalendarIcon`, `BellIcon`, `PinIcon`, team emblems, and notification logo
- Produces: `.feature-step`, `.feature-phase`, and subordinate `.feature-number` presentation

- [ ] **Step 1: Add a failing journey-copy test**

Append to `src/App.test.ts`:

```ts
test("기능 카드는 경기 전·중·후 단계와 실제 자산을 함께 보여준다", async () => {
  const app = await renderApp();

  try {
    assert.match(app.html, /경기 전부터 경기 후까지,/);
    assert.match(app.html, /팬의 하루를 이어줍니다\./);
    assert.match(app.html, /경기 전/);
    assert.match(app.html, /경기 중/);
    assert.match(app.html, /경기 후/);
    assert.match(app.html, /응원팀 경기 일정과 결과, 리그 순위를 빠르게 확인하세요\./);
    assert.match(app.html, /라인업 공개와 득점 소식을 KickON 알림으로 확인하세요\./);
    assert.match(app.html, /경기장에서 직관을 인증하고 오늘의 경기를 내 기록으로 남기세요\./);
    assert.match(app.html, /\/teams\/incheon\.webp/);
    assert.match(app.html, /\/teams\/seoul\.webp/);
    assert.match(app.html, /\/branding\/kickon-logo\.webp/);
  } finally {
    await app.close();
  }
});
```

- [ ] **Step 2: Run the journey test and verify it fails**

Run:

```bash
npm test -- --test-name-pattern="기능 카드는 경기 전·중·후 단계와 실제 자산을 함께 보여준다"
```

Expected: FAIL on the new section and card copy.

- [ ] **Step 3: Update the section title, labels, and card copy**

Use this structure in each `.feature-top`:

```tsx
<div className="feature-step">
  <strong className="feature-phase">경기 전</strong>
  <span className="feature-number">01</span>
</div>
```

Use `경기 중 / 02` and `경기 후 / 03` for the following cards. Apply the exact copy from the test. Keep all existing image sources.

- [ ] **Step 4: Make the journey phase visually primary**

Replace the current square number treatment with:

```css
.feature-step {
  display: flex;
  align-items: baseline;
  gap: 9px;
}

.feature-phase {
  color: #245478;
  font-size: 17px;
  font-weight: 900;
}

.feature-number {
  width: auto;
  height: auto;
  display: inline;
  border: 0;
  background: transparent;
  color: #91a4b6;
  font-size: 12px;
  letter-spacing: 0.5px;
}
```

Keep `.feature-card { min-height: 440px; }` for desktop. Do not add fixed mobile heights.

- [ ] **Step 5: Run the journey test and inspect the diff**

Expected: PASS. Then run:

```bash
git diff -- src/App.tsx src/App.css src/App.test.ts
```

Confirm team paths and notification-logo path are unchanged.

---

### Task 4: Show the attendance history without cropping

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/App.test.ts`

**Interfaces:**
- Consumes: `/screens/attendance-history.png` at 1206 by 2622 pixels
- Produces: `.attendance-preview` and `.attendance-screen` visuals that use contain or natural image height only

- [ ] **Step 1: Add a CSS-policy regression test**

Import `readFile` at the top of `src/App.test.ts`:

```ts
import { readFile } from "node:fs/promises";
```

Append:

```ts
test("직관 기록 화면은 원본 비율을 유지하고 잘리지 않는다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  assert.match(css, /\.attendance-preview img\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(css, /\.attendance-screen img\s*\{[^}]*object-fit:\s*contain/s);
  assert.doesNotMatch(
    css,
    /\.attendance-(?:preview|screen) img\s*\{[^}]*object-fit:\s*cover/s,
  );
});
```

- [ ] **Step 2: Run the CSS-policy test and verify it fails**

Run:

```bash
npm test -- --test-name-pattern="직관 기록 화면은 원본 비율을 유지하고 잘리지 않는다"
```

Expected: FAIL because both current image rules use `cover`.

- [ ] **Step 3: Update the feature-card preview**

Keep the full screenshot visible inside a dark miniature frame:

```css
.attendance-preview {
  height: 150px;
  padding: 8px;
  display: grid;
  place-items: center;
  background: #07101a;
}

.attendance-preview img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
}
```

- [ ] **Step 4: Update the main attendance visual and supporting copy**

Add below the existing record description:

```tsx
<p className="record-supporting-copy">
  시즌이 쌓일수록 나만의 K리그 이야기도 함께 쌓입니다.
</p>
```

Use a natural-ratio frame:

```css
.attendance-screen {
  width: min(100%, 360px);
  height: auto;
  padding: 8px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  background: #050b12;
}

.attendance-screen img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}
```

Remove fixed 580px and 550px heights from `.attendance-screen` and its mobile override.

- [ ] **Step 5: Run both attendance tests**

Run:

```bash
npm test -- --test-name-pattern="직관 소개는 실제 상세 기록 화면과 사진 보관 기능을 보여준다|직관 기록 화면은 원본 비율을 유지하고 잘리지 않는다"
```

Expected: both tests PASS.

- [ ] **Step 6: Inspect the scoped diff**

Run `git diff -- src/App.tsx src/App.css src/App.test.ts` and confirm the image source and intrinsic dimensions remain `1206` by `2622`.

---

### Task 5: Move live signup counts into the social-proof position

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Test: `src/App.test.ts`
- Preserve unchanged: `src/fan-data.ts`
- Preserve unchanged: `src/fan-status.ts`

**Interfaces:**
- Consumes: `fetchFanCounts`, `getFanBoard`, `getFanSummary`, `FanStatusSection`
- Produces: revised fan-section copy and the new location after the attendance section

- [ ] **Step 1: Add a failing copy and behavior-preservation test**

Append:

```ts
test("팬 현황은 KickON 가입 팬으로 명확하게 표현한다", async () => {
  const app = await renderApp();

  try {
    assert.match(app.html, /지금 KickON에서 함께 응원하는 팬들/);
    assert.match(app.html, /K리그1·K리그2 팀별 KickON 가입 팬 현황을 확인해보세요\./);
    assert.match(app.html, /<dt>KickON 가입 팬<\/dt>/);
    assert.match(app.html, /K리그1 가입 팬/);
    assert.doesNotMatch(app.html, /<dt>함께하는 팬<\/dt>/);
  } finally {
    await app.close();
  }
});
```

- [ ] **Step 2: Run the copy test and verify it fails**

Run:

```bash
npm test -- --test-name-pattern="팬 현황은 KickON 가입 팬으로 명확하게 표현한다"
```

Expected: FAIL on the old heading and summary labels.

- [ ] **Step 3: Change presentation copy only**

Update `FanStatusSection`:

```tsx
<h2 id="fan-section-title">지금 KickON에서 함께 응원하는 팬들</h2>
<p>K리그1·K리그2 팀별 KickON 가입 팬 현황을 확인해보세요.</p>
```

Use these definition labels:

```tsx
<dt>KickON 가입 팬</dt>
<dt>가입 팬이 있는 팀</dt>
<dt>{league === "K1" ? "K리그1 가입 팬" : "K리그2 가입 팬"}</dt>
```

Do not change any values or calculations.

- [ ] **Step 4: Move `<FanStatusSection />` after the attendance section**

The page order must be Hero, features, record, fan status. Do not duplicate the component.

- [ ] **Step 5: Run all fan and app tests**

Run:

```bash
npm test
```

Expected: all tests PASS, including parsing, RPC, sorting, summary, error, and retry-related behavior.

- [ ] **Step 6: Prove the data modules did not change**

Run:

```bash
git diff -- src/fan-data.ts src/fan-status.ts
```

Expected: no new diff from this renewal task. Record any pre-existing diff without editing it.

---

### Task 6: Add the verified current community screen, final CTA, and safe footer

**Files:**
- Create: `public/screens/community-incheon.png`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/App.test.ts`
- Source asset: `../app/docs/store-screenshots/team-fanpages-2026-09-13/raw/incheon-community.png`

**Interfaces:**
- Consumes: current `CommunityScreen.tsx` structure and the September 13 Incheon capture
- Produces: `CommunitySection`, `#download`, final CTA copy, and non-interactive footer status text

- [ ] **Step 1: Record the app-to-asset comparison**

Confirm the source asset contains all current `CommunityScreen.tsx` landmarks:

- community title and write button
- free board and team-board selector with active underline
- latest, popular, and notice sorting
- search action
- unread notice banner
- category filters
- feed rows with category, title, author, time, views, and likes

Do not use `ios-qa-07-community.png`, which shows the older search field and featured-post-card layout.

- [ ] **Step 2: Copy the verified asset**

Run:

```bash
cp ../app/docs/store-screenshots/team-fanpages-2026-09-13/raw/incheon-community.png public/screens/community-incheon.png
```

Expected: a 1206 by 2622 PNG using the Incheon blue theme.

- [ ] **Step 3: Add a failing community and footer test**

Append:

```ts
test("커뮤니티는 현재 앱 화면을 사용하고 Footer는 가짜 링크를 만들지 않는다", async () => {
  const app = await renderApp();

  try {
    assert.match(app.html, /같은 팀을 응원하는 팬들과/);
    assert.match(app.html, /\/screens\/community-incheon\.png/);
    assert.match(app.html, /KickON 실제 커뮤니티 화면/);
    assert.match(app.html, /다음 K리그 경기는/);
    assert.match(app.html, /id="download"/);
    assert.doesNotMatch(app.html, /href="\/">(?:이용약관|개인정보처리방침|문의하기)/);
  } finally {
    await app.close();
  }
});
```

- [ ] **Step 4: Run the new test and verify it fails**

Run:

```bash
npm test -- --test-name-pattern="커뮤니티는 현재 앱 화면을 사용하고 Footer는 가짜 링크를 만들지 않는다"
```

Expected: FAIL because the section and download ID do not exist and footer links still point to `/`.

- [ ] **Step 5: Add the community section**

Place this section after `<FanStatusSection />`:

```tsx
<section className="community-section section">
  <div className="container community-inner">
    <div className="community-copy">
      <h2>같은 팀을 응원하는 팬들과</h2>
      <p>
        응원팀을 중심으로 경기 이야기를 나누고
        <br />
        K리그의 순간을 함께 즐겨보세요.
      </p>
    </div>

    <figure className="community-screen">
      <img
        src="/screens/community-incheon.png"
        alt="KickON 실제 커뮤니티 화면"
        width="1206"
        height="2622"
        loading="lazy"
      />
    </figure>
  </div>
</section>
```

Use the same natural-ratio pattern as attendance, with `object-fit: contain` and no fake overlay.

- [ ] **Step 6: Update the final CTA and Footer**

Add `id="download"` to `.download-section`. Use:

```tsx
<h2>
  다음 K리그 경기는
  <br />
  <em>KickON과 함께하세요.</em>
</h2>
<p>
  오늘의 경기를 확인하고
  <br />
  내가 함께한 순간을 기록해보세요.
</p>
```

Replace the three destination-less footer anchors with:

```tsx
<div className="footer-links" aria-label="준비 중인 안내">
  <span>이용약관 준비 중</span>
  <span>개인정보처리방침 준비 중</span>
  <span>문의하기 준비 중</span>
</div>
```

The spans must use muted text with no border, hover state, pointer cursor, or button background.

- [ ] **Step 7: Run the full app test file**

Run:

```bash
node --test src/App.test.ts
```

Expected: all App tests PASS.

- [ ] **Step 8: Inspect asset and source diffs**

Run:

```bash
file public/screens/community-incheon.png
git diff -- src/App.tsx src/App.css src/App.test.ts
git status --short
```

Expected: one new verified community asset and only intended source changes alongside the preserved baseline.

---

### Task 7: Make tablet and mobile layouts stable across all requested widths

**Files:**
- Modify: `src/App.css`
- Test: browser-rendered page at 320, 375, 430, 768, 1024, 1280, and 1440px

**Interfaces:**
- Consumes: final DOM from Tasks 2-6
- Produces: explicit desktop, tablet, and mobile layout rules with no horizontal overflow

- [ ] **Step 1: Replace the current 1000px feature breakpoint with the approved tablet rule**

At `max-width: 1199px`:

```css
.feature-grid {
  grid-template-columns: 1fr;
}

.feature-card {
  min-height: auto;
}
```

Keep the Hero and record split transition at `max-width: 1000px`. Do not force a 2-column feature layout merely to fill tablet width.

- [ ] **Step 2: Add community responsive rules**

Desktop:

```css
.community-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.78fr);
  align-items: center;
  gap: 96px;
}

.community-screen {
  width: min(100%, 360px);
  margin: 0 auto;
}

.community-screen img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}
```

At `max-width: 1000px`, switch `.community-inner` to one column with a 64-70px gap. At `max-width: 720px`, use the existing 16px container gutters and cap the visual at the available width.

- [ ] **Step 3: Check small-screen risk selectors before hiding overflow**

Review and adjust these selectors instead of adding a new global overflow mask:

- `.phone-area`
- `.phone`
- `.hero h1`
- `.store-button`
- `.fan-summary`
- `.fan-team-card`
- `.attendance-screen`
- `.community-screen`

At `max-width: 400px`, remove negative horizontal offsets if they cause overflow. Keep phone scale large enough to remain legible.

- [ ] **Step 4: Start the development server and open the page**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 4175
```

Use browser automation to load `http://127.0.0.1:4175` and wait for the page to settle.

- [ ] **Step 5: Verify all seven viewport widths with rendered metrics**

For each width `320, 375, 430, 768, 1024, 1280, 1440`, use a viewport height of at least 844px and collect:

```js
({
  width: innerWidth,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  gridColumns: getComputedStyle(document.querySelector('.feature-grid')).gridTemplateColumns,
  attendance: (() => {
    const image = document.querySelector('.attendance-screen img');
    const box = image.getBoundingClientRect();
    return {
      loaded: image.complete && image.naturalWidth === 1206,
      renderedRatio: box.width / box.height,
      naturalRatio: image.naturalWidth / image.naturalHeight,
    };
  })(),
  communityLoaded: (() => {
    const image = document.querySelector('.community-screen img');
    return image.complete && image.naturalWidth === 1206;
  })(),
})
```

Expected at every width:

- `overflow` is `false`.
- Both images are loaded.
- Attendance rendered and natural ratios differ only by padding or rounding, not by cropping.
- 768px and 1024px feature grids report one column.
- 1280px and 1440px feature grids report three columns.

- [ ] **Step 6: Visually inspect each breakpoint**

Capture or inspect the Hero, feature cards, attendance, fan status, community, and final CTA at every width. Confirm:

- Hero typography was not reduced merely to fit the phone above the fold.
- Phone visual remains prominent on desktop and readable on mobile.
- Journey labels are more prominent than 01, 02, 03.
- Attendance and community screens show their full height.
- Fan numbers do not shift card geometry.
- Store button labels stay on one line.

- [ ] **Step 7: Check console output**

Read browser logs for error and warning levels.

Expected: no application console errors, Vite overlay, failed local image request, or React key/hydration warning.

- [ ] **Step 8: Stop the development server and inspect the CSS diff**

Run:

```bash
git diff -- src/App.css
```

Confirm no new `overflow-x: hidden` was added solely to mask an overflowing child.

---

### Task 8: Run the complete verification and audit the final diff

**Files:**
- Verify: `index.html`
- Verify: `src/App.tsx`
- Verify: `src/App.css`
- Verify: `src/App.test.ts`
- Verify: `src/fan-data.ts`
- Verify: `src/fan-status.ts`
- Verify: `public/screens/community-incheon.png`

**Interfaces:**
- Consumes: all completed tasks
- Produces: final evidence for lint, tests, build, console, overflow, Supabase preservation, and diff scope

- [ ] **Step 1: Run static verification in parallel or as separate commands**

Run:

```bash
npm run lint
npm test
npm run build
git diff --check
```

Expected:

- ESLint exits 0.
- All tests pass with 0 failures.
- TypeScript and Vite production build exit 0.
- `git diff --check` reports no whitespace errors.

- [ ] **Step 2: Verify metadata and banned visible punctuation**

Run:

```bash
rg -n "킥온 \| K리그 커뮤니티|kickon-favicon|kickon-app-icon" index.html
rg -n "—|–" index.html src public
```

Expected: metadata remains present and the punctuation scan finds no visible em-dash or en-dash characters.

- [ ] **Step 3: Prove Supabase aggregation was preserved**

Run:

```bash
git diff -- src/fan-data.ts src/fan-status.ts
npm test -- --test-name-pattern="Supabase|팬 수|리그별 팬 수"
```

Expected: no renewal-task changes in the two data modules and all matching tests PASS.

- [ ] **Step 4: Review the complete working-tree scope**

Run:

```bash
git status --short
git diff --stat
git diff -- src/App.tsx src/App.css src/App.test.ts index.html package.json tsconfig.app.json
```

Compare the final status to the recorded baseline. Confirm no unrelated file was deleted, reset, restored, or overwritten.

- [ ] **Step 5: Prepare the final report**

Report these exact evidence categories:

- final section order
- community asset used and the older QA asset rejected
- responsive changes at all seven requested widths
- Supabase aggregation preservation
- ESLint exit result
- test count and failure count
- production build exit result
- browser console error count
- overflow result for each width
- intentional new and modified files
- confirmation that no unexpected final diff was found
