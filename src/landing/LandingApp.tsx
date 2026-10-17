import { useLayoutEffect, useState } from "react";
import type { MouseEvent } from "react";
import { initNavigation } from "../../navigation.js";
import { canonicalLandingPath, landingRoute } from "../landing-routes";
import { HomeView, FeaturesView, MatchdayView } from "./Views";
import { PolicyHubView, LegalDocumentView } from "./PolicyViews";
import { ContactModal } from "./ContactModal";
import { sendContact } from "../contact";
import type { ContactData } from "../contact";
import stadiumNight from "../../assets/stadium-night.webp";
import logoWhite from "../../assets/logo-white.svg";
import logoDark from "../../assets/logo-dark.svg";

export default function LandingApp() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [contactOpen, setContactOpen] = useState(false);
  const route = landingRoute(path) ?? 'home';
  const legalRoute = ['policies', 'terms', 'privacy', 'account-deletion'].includes(route);
  useLayoutEffect(initNavigation, []);
  useLayoutEffect(() => {
    const canonical = canonicalLandingPath(path);
    if (canonical && canonical !== window.location.pathname) {
      window.history.replaceState(window.history.state, '', canonical + window.location.search + window.location.hash);
    }
  }, [path]);
  useLayoutEffect(() => {
    const onBack = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, []);
  useLayoutEffect(() => {
    const titles = { home: '킥온(KICKON) | K리그 팬들과 함께하는 직관기록', features: '주요 기능 | 킥온(KICKON)', matchday: '직관 기록 | 킥온(KICKON)', policies: '이용 안내 | 킥온(KICKON)', terms: '이용약관 | 킥온(KICKON)', privacy: '개인정보 처리방침 | 킥온(KICKON)', 'account-deletion': '계정 삭제 요청 | 킥온(KICKON)' };
    document.title = titles[route];
  }, [route]);

  function navigate(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest('a');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || !landingRoute(url.pathname) || url.hash) return;
    event.preventDefault();
    url.pathname = canonicalLandingPath(url.pathname)!;
    if (url.href === window.location.href) return;
    window.history.pushState(null, '', url);
    setPath(url.pathname);
  }

  async function submitContact(data: ContactData, requestId: string) {
    await sendContact({
      url: import.meta.env.VITE_SUPABASE_URL ?? '',
      publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
    }, data, requestId);
    return '문의가 접수되었어요 · 남겨주신 이메일로 답변드릴게요';
  }

  return (
    <div className={route === 'home' ? undefined : `product-page ${route}-page${legalRoute ? " policies-theme" : ""}`} onClick={navigate}>
    <div className="bg" aria-hidden="true">
      <img className="bg-image" src={stadiumNight} alt="" fetchPriority="high" decoding="async" />
      <div className="pitch-mist">
        <span className="mist-wisp mist-wisp--far"></span>
        <span className="mist-wisp mist-wisp--near"></span>
      </div>
    </div>
      <div className="page">
      <header className="header">
        <button className="logo logo-toggle" type="button" aria-label="Dark logo" aria-pressed="false" title="Flip logo">
          <span className="logo-coin" aria-hidden="true">
            <span className="logo-face logo-face--white"><img src={logoWhite} alt="" width="52" height="52" /></span>
            <span className="logo-face logo-face--dark"><img src={logoDark} alt="" width="52" height="52" /></span>
          </span>
        </button>
        <nav className="nav-pill" aria-label="주 메뉴" lang="ko">
          <a className={route === "home" ? "nav-link active" : "nav-link"} href="/" aria-current={route === "home" ? "page" : undefined}>홈</a>
          <a className={route === "features" ? "nav-link active" : "nav-link"} href="/features" aria-current={route === "features" ? "page" : undefined}>주요 기능</a>
          <a className={route === "matchday" ? "nav-link active" : "nav-link"} href="/matchday" aria-current={route === "matchday" ? "page" : undefined}>직관 기록</a>
          <a className={legalRoute ? "nav-link active" : "nav-link"} href="/policies" aria-current={legalRoute ? "page" : undefined}>이용 약관</a>
        </nav>
        <button className="sign-in desktop-sign-in" type="button" data-contact-trigger="" aria-haspopup="dialog" onClick={() => setContactOpen(true)}>문의 하기</button>
        <button className="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </header>
        {route === 'home' ? <HomeView /> : route === 'features' ? <FeaturesView /> : route === 'matchday' ? <MatchdayView /> : route === 'policies' ? <PolicyHubView /> : <LegalDocumentView key={route} path={path} />}
      </div>
    <div className="menu-overlay" hidden></div>
    <nav className="mobile-menu" id="mobile-menu" aria-label="모바일 메뉴" lang="ko" hidden>
      <a className={route === "home" ? "mobile-link active" : "mobile-link"} href="/" aria-current={route === "home" ? "page" : undefined}>홈</a>
      <a className={route === "features" ? "mobile-link active" : "mobile-link"} href="/features" aria-current={route === "features" ? "page" : undefined}>주요 기능</a>
      <a className={route === "matchday" ? "mobile-link active" : "mobile-link"} href="/matchday" aria-current={route === "matchday" ? "page" : undefined}>직관 기록</a>
      <a className={legalRoute ? "mobile-link active" : "mobile-link"} href="/policies" aria-current={legalRoute ? "page" : undefined}>이용 약관</a>
      <button className="sign-in mobile-sign-in" type="button" data-contact-trigger="" aria-haspopup="dialog" onClick={() => setContactOpen(true)}>문의 하기</button>
    </nav>
    {contactOpen ? <ContactModal onClose={() => setContactOpen(false)} onConfirm={submitContact} /> : null}
    </div>
  );
}
