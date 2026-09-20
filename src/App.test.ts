import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import react from "@vitejs/plugin-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

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

test("팀 마키는 실제 엠블럼과 팀 이름을 빈틈없는 세 줄로 보여준다", async () => {
  const app = await renderApp();
  const source = await readFile(new URL("./App.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.equal(app.html.match(/class="team-marquee-row/g)?.length, 3);
    assert.equal(app.html.match(/class="team-marquee-item"/g)?.length, 174);
    assert.match(app.html, /class="container team-marquee"/);
    assert.match(app.html, /K리그1 K리그2, 응원하는 팀을 만나보세요\./);
    assert.match(app.html, /\/teams\/incheon\.webp/);
    assert.match(app.html, /\/teams\/ulsan\.webp/);
    assert.match(app.html, /\/teams\/gimhae\.webp/);
    assert.match(app.html, /인천 유나이티드/);
    assert.match(app.html, /울산 HD FC/);
    assert.match(app.html, /김해 FC/);
    assert.doesNotMatch(app.html, /KickON 가입 팬/);
    assert.doesNotMatch(app.html, /role="tablist"/);
    assert.doesNotMatch(source, /fetchFanCounts|getFanBoard|getFanSummary/);
    assert.doesNotMatch(source, /fillMarqueeRow/);
    assert.match(source, /createMarqueeRow\(0, 1\)/);
    assert.match(source, /createMarqueeRow\(9, 7\)/);
    assert.match(source, /createMarqueeRow\(18, 11\)/);
    assert.match(css, /@keyframes team-marquee-forward/);
    assert.match(css, /@keyframes team-marquee-reverse/);
    assert.match(css, /\.team-marquee-track\s*\{[^}]*132s linear infinite/s);
    assert.match(css, /\.team-marquee-row:nth-child\(2\)[^{]*\.team-marquee-track\s*\{[^}]*team-marquee-reverse/s);
    assert.match(css, /\.team-marquee-row:nth-child\(2\)[^{]*\.team-marquee-track\s*\{[^}]*animation-duration:\s*143s/s);
    assert.match(css, /\.team-marquee-row:nth-child\(3\)[^{]*\.team-marquee-track\s*\{[^}]*animation-duration:\s*155s/s);
    assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.team-marquee-track\s*\{[^}]*animation-play-state:\s*paused/s);
  } finally {
    await app.close();
  }
});

test("기능 미리보기는 실제 경기 카드와 ON 앱 아이콘을 사용한다", async () => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });

  try {
    const appModule = await server.ssrLoadModule("/src/App.tsx");
    const html = renderToStaticMarkup(createElement(appModule.default));

    assert.match(html, /인천 유나이티드 엠블럼/);
    assert.match(html, /대전 하나 시티즌 엠블럼/);
    assert.match(html, /09\. 20 \(일\) 19:00/);
    assert.match(html, /30 라운드/);
    assert.match(html, /<span>예정<\/span>/);
    assert.match(
      html,
      /class="notification-logo"><img src="\/branding\/kickon-app-icon\.png" alt="KickON 앱 아이콘"/,
    );
    assert.equal(html.match(/class="notification-demo"/g)?.length, 2);
    assert.doesNotMatch(html, /<small>\s*KICKON\s*<\/small>/);
    assert.equal(html.match(/<time>\s*지금\s*<\/time>/g)?.length, 2);
    assert.match(html, /선발 라인업 공개/);
    assert.match(html, /오늘 경기의 선발 명단을 확인해보세요\./);
    assert.match(html, /⚽ 무고사 골! · 9&#x27;/);
    assert.match(html, /인천 유나이티드 1 : 0 전북 현대/);

    const notificationOrder = [
      "선발 라인업 공개",
      "⚽ 무고사 골!",
    ].map((text) => html.indexOf(text));

    assert.ok(notificationOrder.every((index) => index >= 0));
    assert.deepEqual(
      notificationOrder,
      [...notificationOrder].sort((a, b) => a - b),
    );
  } finally {
    await server.close();
  }
});

test("경기 후 미리보기는 실제 시즌 요약과 회색 무승부를 보여준다", async () => {
  const app = await renderApp();
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.equal(app.html.match(/class="feature-card"/g)?.length, 3);
    assert.match(app.html, /<strong class="feature-phase">\s*경기 후\s*<\/strong>/);
    assert.match(app.html, /내 직관을 기록하다/);
    assert.match(app.html, /ALL SEASONS/);
    assert.match(app.html, /3연승/);
    assert.match(app.html, /<strong>3<\/strong>\s*<span>경기<\/span>/);
    assert.match(app.html, /<strong>3<\/strong>\s*<span>승<\/span>/);
    assert.match(app.html, /<strong>0<\/strong>\s*<span>무<\/span>/);
    assert.match(app.html, /<strong>0<\/strong>\s*<span>패<\/span>/);
    assert.match(app.html, /<strong>100%<\/strong>/);
    assert.match(
      css,
      /\.attendance-summary-stat\.draw\s+strong\s*\{[^}]*color:\s*#78889a/s,
    );
    assert.match(css, /\.feature-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s);
  } finally {
    await app.close();
  }
});

test("직관 소개는 GPS 인증, 모든 경기 결과, 마지막 직관 인증 카드를 보여준다", async () => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });

  try {
    const appModule = await server.ssrLoadModule("/src/App.tsx");
    const html = renderToStaticMarkup(createElement(appModule.default));

    assert.match(html, /class="record-card record-card-gps"/);
    assert.match(html, /class="record-card record-card-result"/);
    assert.match(html, /class="record-card record-card-latest"/);
    assert.match(html, /GPS 직관 인증/);
    assert.match(html, /모든 경기의 결과/);
    assert.match(html, /마지막 직관 인증/);
    assert.match(html, /\/teams\/incheon\.webp/);
    assert.match(html, /\/teams\/daejeon\.webp/);
    assert.doesNotMatch(html, /record-result-backdrop/);
    assert.doesNotMatch(html, /record-result-card/);
    assert.doesNotMatch(html, /\/screens\/attendance-history\.png/);
    assert.doesNotMatch(html, /MY KICKON/);
  } finally {
    await server.close();
  }
});

test("GPS 카드는 파동으로 인증을 표현하고 나머지 카드는 특정 경기 수치를 만들지 않는다", async () => {
  const app = await renderApp();
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.match(app.html, /class="record-gps-signal"/);
    assert.match(app.html, /class="record-gps-wave record-gps-wave-one"/);
    assert.match(app.html, /class="record-gps-wave record-gps-wave-two"/);
    assert.match(app.html, /승리/);
    assert.match(app.html, /무승부/);
    assert.match(app.html, /패배/);
    assert.doesNotMatch(app.html, /class="record-win-scoreboard"/);
    assert.doesNotMatch(app.html, /class="record-win-score"/);
    assert.doesNotMatch(app.html, /class="record-latest-meta"/);
    assert.match(
      app.html,
      /record-card record-card-result[\s\S]*?record-card-icon result-feature-icon[\s\S]*?MATCH RECORD/,
    );
    assert.match(
      app.html,
      /record-card record-card-latest[\s\S]*?record-card-icon photo-feature-icon[\s\S]*?LATEST CHECK-IN/,
    );
    assert.match(css, /\.record-card-top\s*\{[^}]*min-height:\s*43px/s);
    assert.match(css, /@keyframes\s+record-gps-ripple/);
    assert.match(
      css,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.record-gps-wave\s*\{[^}]*animation:\s*none/s,
    );
  } finally {
    await app.close();
  }
});

test("기록 카드는 장소 행 없이 공 회전과 카메라 셔터 애니메이션을 보여준다", async () => {
  const app = await renderApp();
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.doesNotMatch(app.html, /class="record-gps-place"/);
    assert.match(css, /@keyframes\s+record-ball-spin/);
    assert.match(css, /@keyframes\s+record-camera-shutter/);
    assert.match(css, /@keyframes\s+record-camera-flash/);
    assert.match(
      css,
      /\.record-card-icon\.result-feature-icon svg\s*\{[^}]*animation:\s*record-ball-spin/s,
    );
    assert.match(
      css,
      /\.record-card-icon\.photo-feature-icon svg\s*\{[^}]*animation:\s*record-camera-shutter/s,
    );
    assert.match(
      css,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.record-card-icon\.result-feature-icon svg,[\s\S]*?\.record-card-icon\.photo-feature-icon svg,[\s\S]*?\.record-card-icon\.photo-feature-icon::after\s*\{[^}]*animation:\s*none/s,
    );
  } finally {
    await app.close();
  }
});

test("모바일 보정은 720px 이하에만 적용하고 데스크톱 카드 규칙을 유지한다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");
  const mobileRules = css.match(
    /@media \(max-width: 720px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 400px\)/,
  )?.[1];

  assert.ok(mobileRules);
  assert.match(mobileRules, /\.features\s*\{[^}]*padding-top:\s*120px/s);
  assert.match(
    mobileRules,
    /\.hero h1\s*\{[^}]*font-size:\s*clamp\(43px,\s*11\.63vw,\s*50px\)/s,
  );
  assert.match(
    mobileRules,
    /\.record-copy\s*>\s*p br\s*\{[^}]*display:\s*none/s,
  );
  assert.match(mobileRules, /\.feature-card\s*\{[^}]*padding:\s*22px/s);
  assert.match(css, /\.feature-card\s*\{[^}]*min-height:\s*440px/s);
  assert.doesNotMatch(css, /overflow-x:\s*hidden/);
});

test("모바일은 배경과 버튼을 유지하고 기능·기록 카드를 긴 1열 카드로 보여준다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");
  const mobileRules = css.match(
    /@media \(max-width: 720px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 400px\)/,
  )?.[1];

  assert.ok(mobileRules);
  assert.match(
    mobileRules,
    /\.hero-collage\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*170px\)[^}]*filter:\s*saturate\(0\.8\) brightness\(0\.72\)[^}]*rotate\(0deg\)/s,
  );
  assert.match(
    mobileRules,
    /\.store-buttons\s*\{[^}]*flex-direction:\s*row[^}]*gap:\s*8px/s,
  );
  assert.match(
    mobileRules,
    /\.feature-grid\s*\{[^}]*grid-template-columns:\s*1fr[^}]*gap:\s*16px/s,
  );
  assert.doesNotMatch(
    mobileRules,
    /\.feature-card\s*>\s*p,\s*\.schedule-demo,\s*\.notification-stack,\s*\.attendance-summary-preview\s*\{[^}]*display:\s*none/s,
  );
  assert.match(
    mobileRules,
    /\.record-list\s*\{[^}]*grid-template-columns:\s*1fr[^}]*gap:\s*14px/s,
  );
  assert.doesNotMatch(
    mobileRules,
    /\.record-card-copy p,\s*\.record-card-top small\s*\{[^}]*display:\s*none/s,
  );
  assert.match(
    mobileRules,
    /\.record-copy\s*>\s*p\s*\{[^}]*word-break:\s*keep-all[^}]*overflow-wrap:\s*break-word/s,
  );
  assert.doesNotMatch(css, /overflow-x:\s*hidden/);
});

test("모바일 히어로는 불필요한 하단 여백 없이 콘텐츠를 세로 중앙에 배치한다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");
  const mobileRules = css.match(
    /@media \(max-width: 720px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 400px\)/,
  )?.[1];

  assert.ok(mobileRules);
  assert.match(
    mobileRules,
    /\.hero\s*\{[^}]*min-height:\s*680px/s,
  );
  assert.match(
    mobileRules,
    /\.hero-inner\s*\{[^}]*min-height:\s*680px[^}]*padding:\s*48px 0[^}]*align-items:\s*center/s,
  );
  assert.match(css, /\.hero-inner\s*\{[^}]*padding-bottom:\s*108px/s);
});

test("모바일 기록 소개 문구는 가운데 정렬하고 데스크톱 정렬은 유지한다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");
  const mobileRules = css.match(
    /@media \(max-width: 720px\) \{([\s\S]*?)\n\}\n\n@media \(max-width: 400px\)/,
  )?.[1];

  assert.ok(mobileRules);
  assert.match(
    mobileRules,
    /\.record-copy\s*\{[^}]*margin-inline:\s*auto[^}]*text-align:\s*center/s,
  );
  assert.doesNotMatch(
    css.match(/\.record-copy\s*\{([^}]*)\}/)?.[1] ?? "",
    /text-align:\s*center/,
  );
});

test("기록 소개는 영문 라벨과 시즌 누적 문구를 노출하지 않는다", async () => {
  const app = await renderApp();

  try {
    assert.doesNotMatch(app.html, /YOUR FOOTBALL MEMORY/);
    assert.doesNotMatch(app.html, /시즌이 쌓일수록/);
    assert.match(app.html, /직접 찍은 사진 한 장까지 나만의 기록으로 남겨보세요\./);
  } finally {
    await app.close();
  }
});

test("랜딩은 히어로 다음에 모든 팀을 먼저 보여주고 경기 여정을 이어간다", async () => {
  const app = await renderApp();

  try {
    assert.match(app.html, /모두를 위한/);
    assert.match(app.html, /K리그 커뮤니티/);
    assert.doesNotMatch(app.html, />앱 다운로드</);
    assert.doesNotMatch(app.html, /href="#download"/);
    assert.match(app.html, /id="download"/);
    assert.match(app.html, /경기 전/);
    assert.match(app.html, /경기 중/);
    assert.match(app.html, /경기 후/);

    const order = [
      "모두를 위한",
      "K리그의 모든 팀을 한곳에서",
      "경기 전부터 경기 후까지,",
      "오늘의 함성을",
      "K리그의 모든 순간을",
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

test("스토어 버튼은 스토어 이름과 공식 보조 문구를 함께 보여준다", async () => {
  const app = await renderApp();

  try {
    assert.equal(app.html.match(/<strong>App Store<\/strong>/g)?.length, 2);
    assert.equal(app.html.match(/<strong>Google Play<\/strong>/g)?.length, 2);
    assert.equal(app.html.match(/<small>Download on the<\/small>/g)?.length, 2);
    assert.equal(app.html.match(/<small>GET IT ON<\/small>/g)?.length, 2);
    assert.equal(
      app.html.match(/aria-label="KickON App Store에서 다운로드"/g)?.length,
      2,
    );
    assert.equal(
      app.html.match(/aria-label="KickON Google Play에서 다운로드"/g)?.length,
      2,
    );
  } finally {
    await app.close();
  }
});

test("기능 카드는 경기 전·중·후 단계와 실제 자산을 함께 보여준다", async () => {
  const app = await renderApp();

  try {
    assert.doesNotMatch(app.html, /ALL ABOUT YOUR MATCH DAY/);
    assert.match(app.html, /경기 전부터 경기 후까지,/);
    assert.match(app.html, /팬의 하루를 이어줍니다\./);
    assert.match(app.html, /경기 전/);
    assert.match(app.html, /경기 중/);
    assert.match(app.html, /경기 후/);
    assert.match(app.html, /응원팀 경기 일정과 결과, 리그 순위를 빠르게 확인하세요\./);
    assert.match(app.html, /라인업 공개와 득점 소식을 킥온 알림으로 확인하세요\./);
    assert.match(app.html, /경기장에서 직관을 인증하고 오늘의 경기를 내 기록으로 남기세요\./);
    assert.doesNotMatch(app.html, /class="feature-number"/);
    assert.match(app.html, /\/teams\/incheon\.webp/);
    assert.match(app.html, /\/teams\/daejeon\.webp/);
    assert.match(app.html, /\/branding\/kickon-app-icon\.png/);
  } finally {
    await app.close();
  }
});

test("기록 카드는 배경이 아니라 전면의 세 카드로 배치된다", async () => {
  const app = await renderApp();
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.equal(app.html.match(/class="record-card record-card-/g)?.length, 3);
    assert.match(
      css,
      /\.record-story-content\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*minmax\(0,\s*0\.9fr\)\s+minmax\(0,\s*1\.1fr\)/s,
    );
    assert.match(
      css,
      /\.record-list\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s,
    );
    assert.match(css, /\.record-card\s*\{[^}]*position:\s*relative/s);
    assert.doesNotMatch(app.html, /record-result-backdrop/);
    assert.doesNotMatch(css, /\.record-result-backdrop\s*\{/);
    assert.doesNotMatch(app.html, /class="attendance-screen"/);
    assert.doesNotMatch(app.html, /class="community-screen"/);
  } finally {
    await app.close();
  }
});

test("팀 마키 영역은 팬 수 집계 대신 모든 팀을 안내한다", async () => {
  const app = await renderApp();

  try {
    assert.match(app.html, /K리그의 모든 팀을 한곳에서/);
    assert.match(app.html, /K리그1 K리그2, 응원하는 팀을 만나보세요\./);
    assert.doesNotMatch(app.html, /팬 현황|집계 중|다시 불러오기/);
  } finally {
    await app.close();
  }
});

test("커뮤니티 소개 블록은 제거하고 Footer는 가짜 링크를 만들지 않는다", async () => {
  const app = await renderApp();

  try {
    assert.doesNotMatch(app.html, /같은 팀을 응원하는 팬들과/);
    assert.doesNotMatch(app.html, /\/screens\/community-incheon\.png/);
    assert.doesNotMatch(app.html, /class="community-inner"/);
    assert.match(app.html, /K리그의 모든 순간을/);
    assert.match(app.html, /킥온과 함께/);
    assert.match(app.html, /id="download"/);
    assert.doesNotMatch(app.html, /href="\/">(?:이용약관|개인정보처리방침|문의하기)/);
  } finally {
    await app.close();
  }
});

test("Footer는 이용약관과 개인정보 처리방침 및 계정 삭제 요청을 실제 안내 페이지로 연결한다", async () => {
  const app = await renderApp();

  try {
    assert.match(
      app.html,
      /href="\/terms\/"[^>]*>이용약관<\/a>/,
    );
    assert.match(
      app.html,
      /href="\/privacy\/"[^>]*>개인정보 처리방침<\/a>/,
    );
    assert.match(
      app.html,
      /href="\/account-deletion\/"[^>]*>계정 삭제 요청<\/a>/,
    );
    assert.doesNotMatch(app.html, /admin\.kickon\.kr/);
    assert.doesNotMatch(app.html, /이용약관 준비 중/);
    assert.doesNotMatch(app.html, /개인정보처리방침 준비 중/);
    assert.doesNotMatch(app.html, /문의하기 준비 중/);
  } finally {
    await app.close();
  }
});

test("Footer는 실제 KickON 로고와 우측 제작자 이름을 보여준다", async () => {
  const app = await renderApp();

  try {
    assert.match(app.html, /class="footer-brand-logo"/);
    assert.match(app.html, /src="\/branding\/kickon-logo\.webp"/);
    assert.match(app.html, /alt="KickON"/);
    assert.match(app.html, /class="footer-credit">INSEONG JUNG<\/span>/);
    assert.doesNotMatch(app.html, /모두를 위한 K리그 커뮤니티/);
  } finally {
    await app.close();
  }
});

test("기록 섹션은 팀 마키 이후에 단독으로 이어진다", async () => {
  const app = await renderApp();
  const source = await readFile(new URL("./App.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.equal(app.html.match(/class="experience-section section/g)?.length, 1);
    assert.doesNotMatch(app.html, /class="record-section section"/);
    assert.doesNotMatch(app.html, /class="community-section section"/);

    const marqueeIndex = app.html.indexOf("K리그의 모든 팀을 한곳에서");
    const experienceIndex = app.html.indexOf('class="experience-section section');
    const recordIndex = app.html.indexOf('class="record-story-content"');

    assert.ok(marqueeIndex >= 0);
    assert.ok(experienceIndex > marqueeIndex);
    assert.ok(recordIndex > experienceIndex);
    assert.doesNotMatch(source, /experienceRef/);
    assert.doesNotMatch(source, /experience\.classList\.add\("is-glow-revealed"\)/);
    assert.match(
      css,
      /\.experience-inner\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2/s,
    );
    assert.doesNotMatch(source, /community-inner/);
    assert.doesNotMatch(app.html, /class="experience-glow"/);
    assert.doesNotMatch(css, /\.experience-glow/);
    assert.doesNotMatch(css, /@keyframes experience-glow-reveal/);
  } finally {
    await app.close();
  }
});

test("최종 슬로건의 파란 빛은 화면에 들어오면 천천히 나타난다", async () => {
  const app = await renderApp();
  const source = await readFile(new URL("./App.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.match(app.html, /K리그의 모든 순간을/);
    assert.match(app.html, /킥온과 함께/);
    assert.doesNotMatch(app.html, /class="download-brand"/);
    const downloadStart = app.html.indexOf('class="download-section"');
    const downloadEnd = app.html.indexOf("</section>", downloadStart);
    const downloadHtml = app.html.slice(downloadStart, downloadEnd);

    assert.doesNotMatch(downloadHtml, /<p>/);
    assert.match(
      css,
      /\.download-inner h2\s*\{[^}]*color:\s*#f2f5f8/s,
    );
    assert.match(
      css,
      /\.download-inner em\s*\{[^}]*color:\s*#ddeeff/s,
    );
    assert.match(
      css,
      /\.download-section\s+\.store-button\.light\s*\{[^}]*background:\s*rgba\(5, 13, 23, 0\.76\)[^}]*color:\s*#fff[^}]*border-color:\s*rgba\(255, 255, 255, 0\.2\)/s,
    );
    assert.match(
      css,
      /\.download-section\s+\.store-button\.light\s+small\s*\{[^}]*color:\s*#9eafc1/s,
    );
    assert.match(source, /downloadRef/);
    assert.match(source, /download\.classList\.add\("is-glow-revealed"\)/);
    assert.match(css, /\.download-glow\s*\{[^}]*opacity:\s*0/s);
    assert.match(
      css,
      /\.download-glow\s*\{[^}]*width:\s*900px[^}]*background:\s*rgba\(0, 106, 204, 0\.38\)[^}]*filter:\s*blur\(95px\)/s,
    );
    assert.match(
      css,
      /\.download-section\.is-glow-ready\.is-glow-revealed\s+\.download-glow\s*\{[^}]*animation:\s*download-glow-reveal 3200ms/s,
    );
    assert.match(css, /@keyframes download-glow-reveal/);
    assert.match(
      css,
      /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.download-glow\s*\{[^}]*opacity:\s*1[^}]*animation:\s*none/s,
    );
  } finally {
    await app.close();
  }
});

test("최종 CTA의 경기장 투광등이 아래에서 순차적으로 켜진다", async () => {
  const app = await renderApp();
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    const downloadStart = app.html.indexOf('class="download-section"');
    const downloadEnd = app.html.indexOf("</section>", downloadStart);
    const downloadHtml = app.html.slice(downloadStart, downloadEnd);

    assert.match(downloadHtml, /class="stadium-light-scene" aria-hidden="true"/);
    assert.match(downloadHtml, /stadium-light-rig-left/);
    assert.match(downloadHtml, /stadium-light-rig-right/);
    assert.equal(
      downloadHtml.match(/class="stadium-light-bulb"/g)?.length,
      16,
    );
    assert.match(
      css,
      /\.download-section\.is-glow-ready\.is-glow-revealed\s+\.stadium-light-bulb\s*\{[^}]*animation:\s*stadium-light-on/s,
    );
    assert.match(
      css,
      /\.download-section\.is-glow-ready\.is-glow-revealed\s+\.stadium-light-beam\s*\{[^}]*animation:\s*stadium-beam-on 3200ms/s,
    );
    assert.match(css, /@keyframes stadium-light-on/);
    assert.match(css, /@keyframes stadium-beam-on/);
    assert.match(
      css,
      /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.stadium-light-bulb,[\s\S]*?\.stadium-light-beam\s*\{[^}]*opacity:\s*1[^}]*animation:\s*none/s,
    );
  } finally {
    await app.close();
  }
});

test("최종 CTA의 상단 경계는 그라데이션으로 자연스럽게 이어진다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  assert.match(
    css,
    /\.download-section::before\s*\{[^}]*height:\s*180px[^}]*background:\s*linear-gradient\([^}]*rgba\(8, 19, 31, 0\)[^}]*pointer-events:\s*none/s,
  );
  assert.doesNotMatch(
    css,
    /\.download-section\s*\{[^}]*border-top/s,
  );
});

test("히어로는 실제 구단 앱 화면 콜라주 위에 브랜드 메시지를 보여준다", async () => {
  const app = await renderApp();
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  try {
    assert.doesNotMatch(app.html, /<header/);
    assert.match(app.html, /class="hero-brand-logo"/);
    assert.match(app.html, /경기 일정과 순위부터 라인업, 득점 알림/);
    assert.match(app.html, /직관 인증과 나만의 경기 기록까지/);
    assert.match(
      app.html,
      /득점 알림<br\/>직관 인증과 나만의 경기 기록까지/,
    );
    assert.doesNotMatch(app.html, /득점 알림,/);
    assert.doesNotMatch(app.html, /경기 기록까지\./);
    assert.doesNotMatch(
      css,
      /\.hero-description br\s*\{[^}]*display:\s*none/s,
    );
    assert.equal(
      app.html.match(/class="hero-collage-screen/g)?.length,
      8,
    );
    assert.match(app.html, /\/screens\/hero-collage\/seoul-home\.png/);
    assert.match(app.html, /\/screens\/hero-collage\/jeonbuk-match\.png/);
    assert.match(app.html, /\/screens\/hero-collage\/ulsan-community\.png/);
    assert.match(app.html, /\/screens\/hero-collage\/incheon-match\.png/);
    assert.match(app.html, /\/screens\/hero-collage\/daegu-home\.png/);
    assert.match(app.html, /\/screens\/hero-collage\/busan-ipark-community\.png/);
    assert.match(app.html, /\/screens\/hero-collage\/suwon-bluewings-match\.png/);
    assert.match(app.html, /\/screens\/hero-collage\/chungnam-asan-home\.png/);
    assert.doesNotMatch(app.html, /class="phone-area"/);
  } finally {
    await app.close();
  }
});

test("히어로 카피는 데스크톱 좌측 중앙에 놓이고 작은 화면에서는 좌측 하단에 놓인다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  assert.match(
    css,
    /\.hero-inner\s*\{[^}]*display:\s*grid[^}]*align-items:\s*center/s,
  );
  assert.match(
    css,
    /\.hero-copy\s*\{[^}]*margin-left:\s*0[^}]*margin-right:\s*auto[^}]*text-align:\s*left/s,
  );
  assert.match(
    css,
    /\.hero-copy \.store-buttons\s*\{[^}]*justify-content:\s*flex-start/s,
  );
  assert.match(
    css,
    /@media \(max-width:\s*1000px\)[\s\S]*?\.hero-inner\s*\{[^}]*align-items:\s*end[^}]*\}[\s\S]*?\.hero-copy\s*\{[^}]*text-align:\s*left/s,
  );
  assert.doesNotMatch(
    css,
    /@media \(min-width:\s*1001px\)[\s\S]*?\.hero-copy\s*\{[^}]*transform:\s*translateY/s,
  );
});

test("히어로 메시지는 데스크톱에서 더 크게 강조하고 모바일 비율은 유지한다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  assert.match(
    css,
    /@media \(min-width:\s*1001px\)[\s\S]*?\.hero-copy\s*\{[^}]*width:\s*min\(100%,\s*760px\)[^}]*max-width:\s*760px[^}]*\}[\s\S]*?\.hero-brand-logo\s*\{[^}]*width:\s*148px[^}]*\}[\s\S]*?\.hero h1\s*\{[^}]*font-size:\s*clamp\(60px,\s*5\.3vw,\s*80px\)[^}]*\}[\s\S]*?\.hero-description\s*\{[^}]*font-size:\s*20px/s,
  );
  assert.match(
    css,
    /@media \(max-width:\s*720px\)[\s\S]*?\.hero-brand-logo\s*\{[^}]*width:\s*112px[^}]*\}[\s\S]*?\.hero h1\s*\{[^}]*font-size:\s*clamp\(43px,\s*11\.63vw,\s*50px\)/s,
  );
});

test("히어로의 실제 앱 화면들은 촘촘하고 일정한 간격으로 배치된다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  assert.match(css, /\.hero-collage\s*\{[^}]*gap:\s*16px/s);
  assert.match(
    css,
    /\.hero-collage-item:nth-child\(2\),\s*\.hero-collage-item:nth-child\(4\),\s*\.hero-collage-item:nth-child\(6\),\s*\.hero-collage-item:nth-child\(8\)\s*\{[^}]*translateY\(36px\)/s,
  );
  assert.match(
    css,
    /@media \(max-width:\s*720px\)[\s\S]*?\.hero-collage\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*170px\)[^}]*gap:\s*10px[^}]*rotate\(0deg\)[^}]*\}[\s\S]*?\.hero-collage-item:nth-child\(2\),\s*\.hero-collage-item:nth-child\(4\),\s*\.hero-collage-item:nth-child\(6\),\s*\.hero-collage-item:nth-child\(8\)\s*\{[^}]*transform:\s*none/s,
  );
});

test("주요 섹션은 히어로의 딥 네이비 배경을 이어간다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");

  for (const selector of [
    "features",
    "fan-section",
    "experience-section",
    "download-section",
    "footer",
  ]) {
    assert.match(
      css,
      new RegExp(`\\.${selector}\\s*\\{[^}]*background:\\s*#08131f`, "s"),
    );
  }
  assert.match(
    css,
    /\.feature-card\s*\{[^}]*border:\s*1px solid rgba\(126, 168, 207, 0\.14\)[^}]*background:\s*#101e2c[^}]*color:\s*#edf4fb[^}]*box-shadow:\s*0 22px 60px rgba\(2, 10, 18, 0\.34\)/s,
  );
  assert.match(
    css,
    /@media \(max-width:\s*720px\)[\s\S]*?\.features\s*\{[^}]*padding-top:\s*120px/s,
  );
});

test("기능 카드는 특정 단계만 고정 강조하지 않는다", async () => {
  const app = await renderApp();

  try {
    assert.doesNotMatch(app.html, /feature-card highlighted/);
  } finally {
    await app.close();
  }
});

test("기능 카드는 1번부터 천천히 점등되며 같은 밝기로 남는다", async () => {
  const css = await readFile(new URL("./App.css", import.meta.url), "utf8");
  const source = await readFile(new URL("./App.tsx", import.meta.url), "utf8");

  assert.match(
    css,
    /@keyframes feature-card-drop\s*\{[\s\S]*?from\s*\{[^}]*opacity:\s*0[^}]*translateY\(-36px\)[^}]*\}[\s\S]*?72%\s*\{[^}]*translateY\(4px\)[^}]*\}[\s\S]*?to\s*\{[^}]*opacity:\s*1[^}]*translateY\(0\)/s,
  );
  assert.match(
    css,
    /\.feature-card\.is-reveal-ready\s*\{[^}]*opacity:\s*0/s,
  );
  assert.match(
    css,
    /\.feature-card\.is-reveal-ready\.is-revealed\s*\{[^}]*animation:\s*feature-card-drop 700ms[^}]*var\(--feature-delay\)[^}]*forwards/s,
  );
  assert.match(
    css,
    /\.feature-card:nth-child\(1\)\s*\{[^}]*--feature-delay:\s*0ms[^}]*\}[\s\S]*?\.feature-card:nth-child\(2\)\s*\{[^}]*--feature-delay:\s*450ms[^}]*\}[\s\S]*?\.feature-card:nth-child\(3\)\s*\{[^}]*--feature-delay:\s*900ms/s,
  );
  assert.match(source, /cards\.forEach\(\(card\) => \{\s*card\.classList\.add\("is-revealed"\)/s);
  assert.match(source, /observer\.observe\(section\)/);
  assert.match(
    css,
    /\.feature-card::before\s*\{[^}]*background:\s*#11253a[^}]*box-shadow:\s*0 24px 64px rgba\(0, 78, 151, 0\.2\)[^}]*opacity:\s*0/s,
  );
  assert.match(
    css,
    /\.feature-card\.is-reveal-ready\.is-revealed::before\s*\{[^}]*animation:\s*feature-card-light-up 700ms[^}]*var\(--feature-delay\)[^}]*forwards/s,
  );
  assert.match(
    css,
    /@keyframes feature-card-light-up\s*\{[\s\S]*?from\s*\{[^}]*opacity:\s*0[^}]*\}[\s\S]*?to\s*\{[^}]*opacity:\s*1/s,
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.feature-card::before\s*\{[^}]*opacity:\s*1[^}]*animation:\s*none/s,
  );
});
