import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { stores } from "./stores";
import { HeroStats } from "./HeroStats";

const HERO_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const syncPlayback = () => {
      if (reduceMotion || !visible || document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [reduceMotion]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-section relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col"
    >
      <div className="hero-video-scene absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
        <div className="hero-video-stage">
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
            className="w-full h-full object-cover"
          />
          <img
            src="/branding/kickon-on-hires.webp"
            alt=""
            width="768"
            height="768"
            className="hero-surface-logo"
            style={{ opacity: videoReady ? 1 : 0 }}
          />
        </div>
      </div>

      <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
        <motion.div
          initial={reduceMotion ? false : { y: 18 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="w-full min-w-0"
        >
          <h1 id="hero-heading" className="hero-heading font-display font-medium tracking-tight leading-[1.08] text-[#0a1b33]">
            K리그가 일상이 되는 순간
          </h1>
          <p className="mt-6 max-w-[400px] font-sans text-[14px] md:text-[15px] leading-[1.75] text-[#64748b]">
            경기 소식부터 직관 기록까지<br />
            K리그 팬들의 모든 순간을 함께합니다
          </p>
          <div className="hero-store-links">
            {stores.map(({ name, href, Icon }) => (
              <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name}에서 킥온 다운로드 (새 탭)`}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={21} aria-hidden="true" />
                <span>{name}</span>
              </motion.a>
            ))}
          </div>
          <HeroStats />
        </motion.div>
      </div>

    </section>
  );
}
