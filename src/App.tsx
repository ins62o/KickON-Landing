import { useEffect, useRef } from "react";
import "./App.css";
import { FaApple, FaCamera, FaFutbol, FaGooglePlay } from "react-icons/fa";

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
    <path d="M10 21h4" />
  </svg>
);

const marqueeTeams = [
  ["gangwon", "강원 FC"],
  ["gwangju", "광주 FC"],
  ["gimcheon", "김천 상무"],
  ["daejeon", "대전 하나 시티즌"],
  ["bucheon", "부천 FC 1995"],
  ["seoul", "FC 서울"],
  ["anyang", "FC 안양"],
  ["ulsan", "울산 HD FC"],
  ["incheon", "인천 유나이티드"],
  ["jeonbuk", "전북 현대"],
  ["jeju", "제주 SK FC"],
  ["pohang", "포항 스틸러스"],
  ["gyeongnam", "경남 FC"],
  ["gimpo", "김포 FC"],
  ["gimhae", "김해 FC"],
  ["daegu", "대구 FC"],
  ["busan-ipark", "부산 아이파크"],
  ["seoul-eland", "서울 이랜드 FC"],
  ["seongnam", "성남 FC"],
  ["suwon-bluewings", "수원 삼성 블루윙즈"],
  ["suwon-fc", "수원 FC"],
  ["ansan-greeners", "안산 그리너스 FC"],
  ["yongin", "용인 FC"],
  ["jeonnam", "전남 드래곤즈"],
  ["cheonan-city", "천안시티 FC"],
  ["chungnam-asan", "충남 아산 FC"],
  ["chungbuk-cheongju", "충북 청주 FC"],
  ["paju", "파주 프런티어 FC"],
  ["hwaseong", "화성 FC"],
] as const;

function createMarqueeRow(offset: number, step: number) {
  return Array.from(
    { length: marqueeTeams.length },
    (_, index) => marqueeTeams[(offset + index * step) % marqueeTeams.length],
  );
}

const marqueeRows = [
  createMarqueeRow(0, 1),
  createMarqueeRow(9, 7),
  createMarqueeRow(18, 11),
];

function TeamMarqueeSection() {
  return (
    <section
      className="fan-section team-marquee-section section"
      id="fans"
      aria-labelledby="fan-section-title"
    >
      <div className="container team-marquee-header">
        <h2 id="fan-section-title">K리그의 모든 팀을 한곳에서</h2>
        <p>K리그1 K리그2, 응원하는 팀을 만나보세요.</p>
      </div>

      <div
        className="container team-marquee"
        aria-label="KickON에서 만나는 K리그 팀"
      >
        {marqueeRows.map((teams, rowIndex) => (
          <div className="team-marquee-row" key={rowIndex}>
            <div className="team-marquee-track">
              {[0, 1].map((copyIndex) => (
                <div
                  className="team-marquee-group"
                  key={copyIndex}
                  aria-hidden={copyIndex === 1 ? "true" : undefined}
                >
                  {teams.map(([slug, name], teamIndex) => (
                    <figure
                      className="team-marquee-item"
                      key={`${copyIndex}-${teamIndex}-${slug}`}
                    >
                      <img
                        src={`/teams/${slug}.webp`}
                        alt={copyIndex === 0 ? `${name} 엠블럼` : ""}
                        width="72"
                        height="72"
                        loading="lazy"
                      />
                      <figcaption>{name}</figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const heroCollageScreens = [
  "seoul-home",
  "jeonbuk-match",
  "ulsan-community",
  "incheon-match",
  "daegu-home",
  "busan-ipark-community",
  "suwon-bluewings-match",
  "chungnam-asan-home",
];

function HeroCollage() {
  return (
    <div className="hero-collage" aria-hidden="true">
      {heroCollageScreens.map((screen, index) => (
        <div className="hero-collage-item" key={screen}>
          <img
            className="hero-collage-screen"
            src={`/screens/hero-collage/${screen}.png`}
            alt=""
            width="1206"
            height="2622"
            fetchPriority={index === 0 ? "high" : undefined}
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

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

function StadiumLightRig({ side }: { side: "left" | "right" }) {
  return (
    <div className={`stadium-light-rig stadium-light-rig-${side}`}>
      <div className="stadium-light-bank">
        {Array.from({ length: 8 }, (_, index) => (
          <i className="stadium-light-bulb" key={index} />
        ))}
      </div>
    </div>
  );
}

function App() {
  const featuresRef = useRef<HTMLElement>(null);
  const downloadRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = featuresRef.current;

    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const cards = section.querySelectorAll<HTMLElement>(".feature-card");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        cards.forEach((card) => {
          card.classList.add("is-revealed");
        });
        observer.unobserve(section);
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => {
      card.classList.add("is-reveal-ready");
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const download = downloadRef.current;

    if (!download) return;

    download.classList.add("is-glow-ready");

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      download.classList.add("is-glow-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        download.classList.add("is-glow-revealed");
        observer.unobserve(download);
      },
      { threshold: 0.25 },
    );

    observer.observe(download);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      <main>
        <section className="hero" id="top">
          <HeroCollage />

          <div className="container hero-inner">
            <div className="hero-copy">
              <h1>
                <img
                  className="hero-brand-logo"
                  src="/branding/kickon-logo.webp"
                  alt="킥온 KickON"
                  width="132"
                  height="44"
                />
                모두를 위한
                <br />
                K리그 커뮤니티
              </h1>

              <p className="hero-description">
                경기 일정과 순위부터 라인업, 득점 알림
                <br />
                직관 인증과 나만의 경기 기록까지
              </p>

              <StoreButtons />
            </div>
          </div>
        </section>

        <TeamMarqueeSection />

        <section className="features section" ref={featuresRef}>
          <div className="container">
            <div className="section-title">
              <h2>
                경기 전부터 경기 후까지,
                <br />
                <em>
                  팬의 하루를 이어줍니다.
                </em>
              </h2>

              <p>
                경기 정보부터 직관의 순간까지.
                <br className="mobile-only" />
                K리그를 즐기는 새로운 방법을
                킥온에서 만나보세요.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-top">
                  <strong className="feature-phase">
                    경기 전
                  </strong>

                  <div className="feature-icon">
                    <CalendarIcon />
                  </div>
                </div>

                <h3>
                  오늘의 경기를 한눈에
                </h3>

                <p>
                  응원팀 경기 일정과 결과,
                  리그 순위를 빠르게 확인하세요.
                </p>

                <div className="schedule-demo">
                  <div className="fixture-preview-top">
                    <span>09. 20 (일) 19:00</span>
                    <span>예정</span>
                  </div>

                  <div className="fixture-preview-match">
                    <div className="fixture-preview-team">
                      <img
                        className="schedule-emblem"
                        src="/teams/incheon.webp"
                        alt="인천 유나이티드 엠블럼"
                        width="48"
                        height="48"
                        loading="lazy"
                      />

                      <strong>인천</strong>
                    </div>

                    <div className="fixture-preview-score">
                      <b>VS</b>
                      <span>30 라운드</span>
                    </div>

                    <div className="fixture-preview-team">
                      <img
                        className="schedule-emblem"
                        src="/teams/daejeon.webp"
                        alt="대전 하나 시티즌 엠블럼"
                        width="48"
                        height="48"
                        loading="lazy"
                      />

                      <strong>대전</strong>
                    </div>
                  </div>

                  <div className="fixture-preview-venue">
                    <PinIcon />
                    <span>인천축구전용경기장</span>
                  </div>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-top">
                  <strong className="feature-phase">
                    경기 중
                  </strong>

                  <div className="feature-icon">
                    <BellIcon />
                  </div>
                </div>

                <h3>
                  중요한 순간을 놓치지 않게
                </h3>

                <p>
                  라인업 공개와 득점 소식을 킥온 알림으로 확인하세요.
                </p>

                <div className="notification-stack">
                  <div className="notification-demo">
                    <div className="notification-logo">
                      <img
                        src="/branding/kickon-app-icon.png"
                        alt="KickON 앱 아이콘"
                        width="180"
                        height="180"
                        loading="lazy"
                      />
                    </div>

                    <div>
                      <strong>
                        선발 라인업 공개
                      </strong>

                      <span>
                        오늘 경기의 선발 명단을 확인해보세요.
                      </span>
                    </div>

                    <time>
                      지금
                    </time>
                  </div>

                  <div className="notification-demo">
                    <div className="notification-logo">
                      <img
                        src="/branding/kickon-app-icon.png"
                        alt=""
                        width="180"
                        height="180"
                        loading="lazy"
                      />
                    </div>

                    <div>
                      <strong>
                        ⚽ 무고사 골! · 9&apos;
                      </strong>

                      <span>
                        인천 유나이티드 1 : 0 전북 현대
                      </span>
                    </div>

                    <time>
                      지금
                    </time>
                  </div>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-top">
                  <strong className="feature-phase">
                    경기 후
                  </strong>

                  <div className="feature-icon">
                    <PinIcon />
                  </div>
                </div>

                <h3>
                  내 직관을 기록하다
                </h3>

                <p>
                  경기장에서 직관을 인증하고 오늘의 경기를 내 기록으로 남기세요.
                </p>

                <div className="attendance-summary-preview">
                  <div className="attendance-summary-header">
                    <strong>ALL SEASONS</strong>
                    <span>3연승</span>
                  </div>

                  <div className="attendance-summary-stats">
                    <div className="attendance-summary-stat">
                      <strong>3</strong>
                      <span>경기</span>
                    </div>

                    <div className="attendance-summary-stat win">
                      <strong>3</strong>
                      <span>승</span>
                    </div>

                    <div className="attendance-summary-stat draw">
                      <strong>0</strong>
                      <span>무</span>
                    </div>

                    <div className="attendance-summary-stat loss">
                      <strong>0</strong>
                      <span>패</span>
                    </div>

                    <div className="attendance-summary-stat rate">
                      <span>승률</span>
                      <strong>100%</strong>
                    </div>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </section>

        <section className="experience-section section">
          <div className="container experience-inner">
            <div className="record-story-content">
              <div className="record-copy">
                <h2>
                  오늘의 함성을
                  <br />

                  <em>
                    기록으로 남기세요.
                  </em>
                </h2>

                <p>
                  직관 인증부터 경기 결과,
                  <br />
                  직접 찍은 사진 한 장까지 나만의 기록으로 남겨보세요.
                </p>
              </div>

              <div className="record-list">
                <article className="record-card record-card-gps">
                  <div className="record-card-top">
                    <span className="record-gps-signal" aria-hidden="true">
                      <span className="record-gps-wave record-gps-wave-one" />
                      <span className="record-gps-wave record-gps-wave-two" />
                      <span className="record-card-icon">
                        <PinIcon />
                      </span>
                    </span>
                    <small>GPS CHECK-IN</small>
                  </div>

                  <div className="record-card-copy">
                    <strong>GPS 직관 인증</strong>
                    <p>경기장 위치를 확인하고 간편하게 직관을 인증하세요.</p>
                  </div>
                </article>

                <article className="record-card record-card-result">
                  <div className="record-card-top">
                    <span className="record-card-icon result-feature-icon">
                      <FaFutbol />
                    </span>
                    <small>MATCH RECORD</small>
                  </div>

                  <div className="record-card-copy">
                    <strong>모든 경기의 결과</strong>
                    <p>승리와 무승부, 패배까지 함께한 경기를 차곡차곡 남겨보세요.</p>
                  </div>
                </article>

                <article className="record-card record-card-latest">
                  <div className="record-card-top">
                    <span className="record-card-icon photo-feature-icon">
                      <FaCamera />
                    </span>
                    <small>LATEST CHECK-IN</small>
                  </div>

                  <div className="record-card-copy">
                    <strong>마지막 직관 인증</strong>
                    <p>가장 최근에 함께한 경기의 결과와 사진을 다시 확인하세요.</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          className="download-section"
          id="download"
          ref={downloadRef}
        >
          <div className="download-glow" />
          <div className="stadium-light-scene" aria-hidden="true">
            <span className="stadium-light-beam stadium-light-beam-left" />
            <span className="stadium-light-beam stadium-light-beam-right" />
            <StadiumLightRig side="left" />
            <StadiumLightRig side="right" />
          </div>

          <div className="container download-inner">
            <h2>
              K리그의 모든 순간을
              <br />

              <em>
                킥온과 함께
              </em>
            </h2>

            <StoreButtons light />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img
              className="footer-brand-logo"
              src="/branding/kickon-logo.webp"
              alt="KickON"
              width="132"
              height="44"
              loading="lazy"
            />
          </div>

          <div className="footer-links" aria-label="정책 및 계정 안내">
            <a
              href="/terms/"
            >
              이용약관
            </a>
            <a
              href="/privacy/"
            >
              개인정보 처리방침
            </a>
            <a
              href="/account-deletion/"
            >
              계정 삭제 요청
            </a>
          </div>

          <div className="footer-meta">
            <p className="copyright">
              © 2026 KICKON. All rights reserved.
            </p>
            <span className="footer-credit">INSEONG JUNG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
