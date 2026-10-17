import { useLayoutEffect } from "react";
import type { CSSProperties } from "react";
import { initHome } from "../../main.js";
import { initProductMotion } from "../../product.js";
import incheon from "../../assets/teams/incheon.webp";
import jeonbuk from "../../assets/teams/jeonbuk.webp";
import seoul from "../../assets/teams/seoul.webp";
import members from "../../assets/stats/members.svg";
import clock from "../../assets/stats/clock.svg";
import notification from "../../assets/stats/notification.svg";
import matchday from "../../assets/stats/matchday.svg";
import gangwon from "../../assets/teams/gangwon.webp";
import kickonLogo from "../../assets/logo-white.svg";
import pohang from "../../assets/teams/pohang.webp";

export function HomeView() {
  useLayoutEffect(initHome, []);
  return (<>
      <main className="hero" id="main">
        <div className="trust-row anim" lang="ko" style={{"--d": "0.05s"} as CSSProperties}>
          <div className="avatars" role="img" aria-label="인천 유나이티드, 전북 현대, FC서울">
            <span className="avatar a1"><span className="avatar-inner"><img src={incheon} alt="" width="32" height="32" /></span></span>
            <span className="avatar a2"><span className="avatar-inner"><img src={jeonbuk} alt="" width="32" height="32" /></span></span>
            <span className="avatar a3"><span className="avatar-inner"><img src={seoul} alt="" width="32" height="32" /></span></span>
          </div>
          <span className="trust-pill">K리그를 즐기는 팬들의 공간</span>
        </div>

        <h1 className="headline anim" lang="ko" aria-label="K리그가 일상이 되는 순간"><span>K<i className="headline-glyph-ri">리</i>그가</span> <span>일상이 되는 순간</span></h1>
        <p className="subhead anim" lang="ko" style={{"--d": "0.28s"} as CSSProperties}>응원의 순간부터 직관의 추억까지<br />K리그를 즐기는 새로운 방법</p>
        <div className="cta-wrap anim" style={{"--d": "0.4s"} as CSSProperties} role="group" aria-label="킥온 앱 다운로드">
          <a className="cta" href="https://apps.apple.com/kr/app/id6809176002" aria-label="App Store에서 킥온 다운로드"><i className="fa-brands fa-apple" aria-hidden="true"></i>App Store</a>
          <a className="cta" href="https://play.google.com/store/apps/details?id=kr.kickon.app" aria-label="Google Play에서 킥온 다운로드"><i className="fa-brands fa-google-play" aria-hidden="true"></i>Google Play</a>
        </div>
      </main>

      <footer className="stats" aria-label="킥온 서비스 지표">
        <div className="stat anim" style={{"--d": "0.5s"} as CSSProperties}>
          <span className="stat-icon" aria-hidden="true"><img src={members} alt="" width="28" height="28" /></span>
          <span className="stat-value counter" data-stat="users" data-step="100" aria-busy="true" aria-label="집계 불러오는 중">—</span>
          <span className="stat-label">누적 가입자</span>
        </div>
        <div className="stat anim" style={{"--d": "0.58s"} as CSSProperties}>
          <span className="stat-icon" aria-hidden="true"><img src={clock} alt="" width="28" height="28" /></span>
          <span className="stat-value" data-kickon-days="" aria-label="킥온 시작 후 경과 일수">D+—</span>
          <span className="stat-label">킥온이 달려온 시간</span>
        </div>
        <div className="stat anim" style={{"--d": "0.66s"} as CSSProperties}>
          <span className="stat-icon" aria-hidden="true"><img src={notification} alt="" width="28" height="28" /></span>
          <span className="stat-value">LIVE</span>
          <span className="stat-label">실시간 경기 알림</span>
        </div>
        <div className="stat anim" style={{"--d": "0.74s"} as CSSProperties}>
          <span className="stat-icon" aria-hidden="true"><img src={matchday} alt="" width="28" height="28" /></span>
          <span className="stat-value counter" data-stat="attendances" data-step="10" aria-busy="true" aria-label="집계 불러오는 중">—</span>
          <span className="stat-label">누적 직관 기록</span>
        </div>
      </footer>
  </>);
}

export function FeaturesView() {
  useLayoutEffect(initProductMotion, []);
  return (<>
      <main className="product-view feature-view" data-feature-view="" data-scene="fixtures" data-playing="true" aria-labelledby="features-title">
        <div className="feature-copy">
          <h1 className="headline product-title" id="features-title"><span>경기의 모든 순간,</span><span>킥온으로 함께</span></h1>
          <p className="product-lede">다음 경기를 기다리는 설렘부터<br />함께 터뜨리는 함성까지, 손안에서 연결돼요</p>
          <div className="feature-selectors" role="group" aria-label="앱 미리보기 기능 선택">
            <button className="feature-selector" data-scene-button="fixtures" aria-pressed="true"><span className="scene-number">01</span><span className="scene-title">경기 일정<small>내 팀의 다음 경기부터 리그 순위까지</small></span></button>
            <button className="feature-selector" data-scene-button="live" aria-pressed="false"><span className="scene-number">02</span><span className="scene-title">실시간 경기<small>라인업과 득점, 놓치고 싶지 않은 순간</small></span></button>
            <button className="feature-selector" data-scene-button="community" aria-pressed="false"><span className="scene-number">03</span><span className="scene-title">팬 커뮤니티<small>같은 팀을 응원하는 우리들의 이야기</small></span></button>
          </div>
          <div className="feature-stores"><a href="https://apps.apple.com/kr/app/id6809176002" aria-label="App Store에서 킥온 다운로드"><i className="fa-brands fa-apple" aria-hidden="true"></i>App Store</a><a href="https://play.google.com/store/apps/details?id=kr.kickon.app" aria-label="Google Play에서 킥온 다운로드"><i className="fa-brands fa-google-play" aria-hidden="true"></i>Google Play</a></div>
        </div>
        <div className="feature-stage" role="region" aria-label="킥온 주요 기능 모션 디자인">
          <div className="motion-scene" data-scene-screen="fixtures">
            <div className="motion-canvas schedule-canvas" aria-label="2026년 10월 경기 일정 예시">
              <div className="schedule-month motion-piece">
                <div className="month-navigation"><i className="fa-solid fa-angle-left" aria-hidden="true"></i><strong>2026년 10월</strong><i className="fa-solid fa-angle-right" aria-hidden="true"></i></div>
                <span className="current-month">이번 달<i className="fa-regular fa-calendar" aria-hidden="true"></i></span>
              </div>
              <div className="calendar-ribbon motion-piece">
                <div className="calendar-weekdays" aria-hidden="true">{['일', '월', '화', '수', '목', '금', '토'].map(day => <span key={day}>{day}</span>)}</div>
                <div className="calendar-dates">
                  {Array.from({ length: 4 }, (_, index) => <span key={`empty-${index}`} data-calendar-day="" aria-hidden="true" />)}
                  {Array.from({ length: 31 }, (_, index) => {
                    const day = index + 1;
                    return <span key={day} data-calendar-day={day} className={`calendar-date${day === 18 ? ' calendar-selected' : ''}`} aria-label={`10월 ${day}일${[10, 18, 24].includes(day) ? ' 경기 있음' : ''}`}>
                      <span>{day}</span>{[10, 18, 24].includes(day) ? <i className="calendar-fixture-dot" aria-hidden="true" /> : null}
                      {day === 18 ? <b className="calendar-selection motion-piece" aria-hidden="true" /> : null}
                    </span>;
                  })}
                </div>
              </div>
              <div className="match-motion-card motion-piece" aria-label="10월 18일 강원 대 인천 경기 예시">
                <div className="match-motion-top"><span>10. 18 (일) 16:30</span><span className="match-status">예정</span></div>
                <div className="match-motion-teams"><div><img src={gangwon} alt="" width="64" height="64" /><strong>강원</strong></div><div className="match-versus"><span className="versus">VS</span><small>32 라운드</small></div><div><img src={incheon} alt="" width="64" height="64" /><strong>인천</strong></div></div>
                <div className="match-motion-location"><i className="fa-solid fa-location-dot" aria-hidden="true"></i> 강릉종합운동장</div>
              </div>
            </div>
            <p className="motion-caption">기다리던 경기가, 한눈에</p>
          </div>
          <div className="motion-scene" data-scene-screen="live" hidden>
            <div className="motion-canvas live-canvas" role="img" aria-label="경기 카드 등장, 킥오프와 경기 시작 알림, 진행 중 인천 득점으로 0대0에서 1대0, 경기 종료 알림으로 이어지는 모션 예시">
              <div className="signal-ring signal-ring-one motion-piece" aria-hidden="true"></div><div className="signal-ring signal-ring-two motion-piece" aria-hidden="true"></div>
              <div className="live-motion-board motion-piece">
                <div className="match-motion-top"><span className="live-indicator"><b className="motion-piece"></b>경기의 순간</span><span>실시간 경기 정보</span></div>
                <div className="live-scoreboard"><div className="live-team"><img src={incheon} alt="" width="64" height="64" /><strong>인천</strong></div><div className="score-digits" aria-label="킥오프 0 대 0에서 인천 득점 후 1 대 0으로 유지되는 스코어 예시"><span className="score-reel" aria-hidden="true"><span className="score-reel-track motion-piece"><b>0</b><b>1</b></span></span><span aria-hidden="true">:</span><span aria-hidden="true">0</span></div><div className="live-team"><img src={pohang} alt="" width="64" height="64" /><strong>포항</strong></div></div>
                <div className="match-clock-line"><span>킥오프</span><span>함께 뛰는 90분</span><span>종료 휘슬</span></div>
                <div className="match-progress"><span className="motion-piece"></span><b className="motion-piece"></b></div>
              </div>
              <svg className="notification-route" viewBox="0 0 400 500" fill="none" aria-hidden="true"><path className="motion-piece" d="M280 280C350 280 350 340 288 365" stroke="#70caff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="140" /></svg>
              <div className="goal-notification motion-piece">
                <span className="goal-icon"><img src={kickonLogo} alt="킥온" width="32" height="24" /></span>
                <div className="notification-copy">
                  {[
                    { phase: 'kickoff', title: '경기가 시작됐어요', detail: '인천 vs 포항 · 킥오프' },
                    { phase: 'goal', title: '인천유나이티드 골!', detail: '후반 23분 · 인천 1 : 0 포항' },
                    { phase: 'fulltime', title: '경기가 종료됐어요', detail: '경기 종료 · 인천 1 : 0 포항' },
                  ].map(({ phase, title, detail }) => (
                    <div className="notification-message motion-piece" data-live-notice={phase} key={phase}>
                      <strong>{title}</strong><span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              {[
                { phase: 'kickoff', label: 'KICKOFF!' },
                { phase: 'goal', label: 'GOAL!' },
                { phase: 'fulltime', label: 'FULL TIME' },
              ].map(({ phase, label }) => (
                <div className="goal-word motion-piece" data-live-cue={phase} aria-hidden="true" key={phase}><span>{label}</span></div>
              ))}
            </div>
            <p className="motion-caption">스코어가 바뀌는 순간, 알림도 함께</p>
          </div>
          <div className="motion-scene" data-scene-screen="community" hidden>
            <div className="motion-canvas community-canvas">
              <div className="community-motion-heading"><img src={incheon} alt="" width="38" height="38" /><div><strong>같은 팀을 응원하는 우리</strong><span>우리 팀 팬들의 공간</span></div><span className="community-online motion-piece"></span></div>
              <div className="chat-motion chat-motion-one motion-piece"><span className="chat-author">인천 팬</span><p>골!!!! 오늘도 끝까지 가보자!</p><small>함께 외치는 순간</small></div>
              <div className="chat-motion chat-motion-two motion-piece"><span className="chat-author">직관 중인 팬</span><p>이 맛에 직관 오지!</p><i className="fa-solid fa-heart" aria-hidden="true"></i></div>
              <div className="typing-motion motion-piece" aria-hidden="true"><i></i><i></i><i></i></div>
              <div className="chat-motion chat-motion-three motion-piece"><span className="chat-author">같은 팀 팬</span><p>그날의 이야기도, 우리끼리 나눠요.</p></div>
              <div className="cheer-wave" aria-hidden="true"><i className="motion-piece"></i><i className="motion-piece"></i><i className="motion-piece"></i><i className="motion-piece"></i><i className="motion-piece"></i><i className="motion-piece"></i><i className="motion-piece"></i><i className="motion-piece"></i><i className="motion-piece"></i></div>
            </div>
            <p className="motion-caption">함성은 같이, 이야기는 더 가까이</p>
          </div>
        </div>
      </main>
  </>);
}

export function MatchdayView() {
  return (<>
      <main className="product-view ticket-view" aria-labelledby="tickets-title">
        <div className="memory-line" aria-label="경기장에서 남긴 사진들">
          <svg className="memory-string" viewBox="0 0 1000 160" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M-10 28 Q500 120 1010 28" stroke="currentColor" strokeWidth="1.5" /></svg>
          <figure className="hanging-photo hanging-photo--stadium">
            <div className="photo-sway"><span className="photo-peg" aria-hidden="true"></span><img src="/product/memory-stadium.webp" width="960" height="640" alt="노을 아래 축구장을 바라본 경기장 연출 이미지" /><figcaption>킥오프를 기다리던 순간</figcaption></div>
          </figure>
          <figure className="hanging-photo hanging-photo--supporter">
            <div className="photo-sway"><span className="photo-peg" aria-hidden="true"></span><img src="/product/memory-supporter.webp" width="800" height="534" alt="응원 머플러를 들고 함께한 경기장 연출 이미지" /><figcaption>함께 외쳤던 그날의 함성</figcaption></div>
          </figure>
        </div>
        <div className="ticket-vignette" aria-hidden="true"></div>
        <div className="ticket-copy">
          <h1 className="headline product-title" id="tickets-title"><span>경기는 끝나도,</span><span>사진은 남으니까</span></h1>
          <p className="product-lede">함께 뛰고, 목이 쉬도록 응원한 그날<br />사진과 함께 나만의 직관 기록으로 남겨보세요.</p>
          <div className="cta-wrap" role="group" aria-label="킥온 앱 다운로드"><a className="cta" href="https://apps.apple.com/kr/app/id6809176002" aria-label="App Store에서 킥온 다운로드"><i className="fa-brands fa-apple" aria-hidden="true"></i>App Store</a><a className="cta" href="https://play.google.com/store/apps/details?id=kr.kickon.app" aria-label="Google Play에서 킥온 다운로드"><i className="fa-brands fa-google-play" aria-hidden="true"></i>Google Play</a></div>
          <span className="ticket-note">나의 직관 기록은 앱에서 남길 수 있어요.</span>
        </div>
      </main>
  </>);
}
