import { ArrowUpRight } from "lucide-react";
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
      <header className="product-heading"><h2 id="download-heading">이제, 당신의 킥온을<br className="mobile-break" /> 시작하세요</h2><p>경기의 설렘부터 응원의 순간까지,<br className="mobile-break" /> 언제나 킥온과 함께</p></header>
      <div className="store-links">{stores.map(({ name, href, Icon }) => <motion.a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name}에서 킥온 다운로드 (새 탭)`} whileHover={reduced ? undefined : { y: -3 }} whileTap={reduced ? undefined : { scale: 0.98 }}><Icon size={23} aria-hidden="true" /><span>{name}</span><ArrowUpRight size={16} aria-hidden="true" /></motion.a>)}</div>
    </section>
    <footer className="product-footer">
      <img src="/branding/kickon-wordmark-light.webp" alt="축구공과 파란 링이 포함된 KICKON 로고" width="2172" height="724" loading="lazy" />
      <nav aria-label="하단 안내"><a href="#match-experience">서비스 소개</a><span>개인정보처리방침</span><span>이용약관</span><span>문의하기</span></nav>
      <small>© KICKON</small>
    </footer>
  </>;
}
