import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { stores } from "./stores";

export function DownloadSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  return <>
    <section id="download" ref={ref} className="product-section download-section product-scene" data-active={inView && !reduced} aria-labelledby="download-heading">
      <div className="download-icon-wrap"><div className="download-glow" aria-hidden="true" /><img src="/branding/kickon-app-icon.png" alt="ON 킥온 앱 아이콘" width="180" height="180" loading="lazy" className="download-icon ambient-motion" /></div>
      <header className="product-heading"><h2 id="download-heading">당신의 K리그 일상,<br className="mobile-break" /> 킥온에서</h2><p>경기 소식과 팬들의 이야기,<br className="mobile-break" /> 직관의 순간까지 함께해요</p></header>
      <div className="store-links">{stores.map(({ name, href, Icon }) => <motion.a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name}에서 킥온 다운로드 (새 탭)`} whileHover={reduced ? undefined : { y: -3 }} whileTap={reduced ? undefined : { scale: 0.98 }}><Icon size={23} aria-hidden="true" /><span>{name}</span></motion.a>)}</div>
    </section>
    <footer className="product-footer">
      <img src="/branding/kickon-on-hires.webp" alt="ON 킥온 로고" width="768" height="768" loading="lazy" />
      <nav aria-label="하단 안내"><a href="/privacy">개인정보처리방침</a><a href="/terms">이용약관</a></nav>
      <small>© KICKON</small>
    </footer>
  </>;
}
