import { Barcode, Check, MapPin, Camera, Ticket } from "lucide-react";
import { motion, useTransform } from "motion/react";
import { PhoneScreen, SceneItem } from "./SceneMotion";
import { useSceneMotion } from "./useSceneMotion";

export function MatchdayMemory() {
  const { ref, progress, active, reduced } = useSceneMotion();
  const scale = useTransform(progress, [0, 0.45, 1], [0.94, 1.04, 1]);
  const rotateX = useTransform(progress, [0, 0.5, 1], [12, 0, -4]);
  const rotateY = useTransform(progress, [0, 1], [-12, 6]);
  return (
    <section id="matchday-memory" className="product-section memory-section" aria-labelledby="memory-heading">
      <header className="product-heading memory-heading">
        <h2 id="memory-heading">경기는 끝나도,<br /><span>추억은 남으니까</span></h2>
        <p>경기장에서의 순간을 인증하고,<br className="mobile-break" /> 사진과 함께 나만의 직관 기록을 남겨보세요</p>
      </header>
      <div ref={ref} className="memory-scene product-scene" data-active={active}>
        <div className="ticket-perspective">
          <motion.div className="ticket-transform" style={reduced ? undefined : { scale, rotateX, rotateY }}>
            <div className="memory-ticket ambient-motion">
              <div className="ticket-main">
                <div className="ticket-top"><img src="/branding/kickon-on-hires.webp" alt="" width="40" height="40" loading="lazy" /><span>MY MATCHDAY</span><Ticket size={23} aria-hidden="true" /></div>
                <p className="ticket-title">그날의 함성,<br />나의 기록으로</p>
                <div className="ticket-bottom"><span><MapPin size={14} aria-hidden="true" /> 경기장에서 만나요</span><span>직관 기록 시연</span></div>
              </div>
              <div className="ticket-stub"><Barcode size={58} strokeWidth={1} aria-hidden="true" /><span>KICKON</span></div>
            </div>
          </motion.div>
          <div className="ticket-shadow ambient-motion" aria-hidden="true" />
        </div>
        <SceneItem progress={progress} start={0.18} className="memory-check"><Check size={17} aria-hidden="true" /><span>직관 인증</span></SceneItem>
        <SceneItem progress={progress} start={0.32} className="memory-photo memory-photo-stadium">
          <figure><img src="/product/memory-stadium.webp" width="960" height="640" alt="노을 아래 축구장을 바라본 경기장 연출 이미지" loading="lazy" decoding="async" /><figcaption>킥오프를 기다리던 순간</figcaption></figure>
        </SceneItem>
        <SceneItem progress={progress} start={0.46} className="memory-photo memory-photo-supporter">
          <figure><img src="/product/memory-supporter.webp" width="800" height="534" alt="파란 응원 머플러를 든 팬의 경기장 연출 이미지" loading="lazy" decoding="async" /><figcaption>함께 외쳤던 그날의 함성</figcaption></figure>
        </SceneItem>
      </div>
      <p className="memory-image-note">티켓은 기능 시연, 사진은 AI로 제작한 연출 이미지입니다</p>
      <div className="memory-record">
        <div className="memory-record-copy">
          <span className="product-label"><Camera size={18} aria-hidden="true" /> 나만의 직관 기록</span>
          <h3>한 번의 경기<br />오래 남을 이야기</h3>
          <p>직관한 경기와 결과가 차곡차곡<br />나의 응원 여정을 한눈에 돌아보세요</p>
          <ol className="memory-steps"><li>경기장에서 인증하고</li><li>사진으로 순간을 남기고</li><li>나의 직관 기록으로 모아보기</li></ol>
        </div>
        <motion.figure className="memory-record-screen" initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }}>
          <PhoneScreen src="/product/attendance-history.webp" alt="실제 킥온 직관 상세 기록 화면, 시즌별 직관 경기와 승무패 및 승률" />
          <figcaption className="screen-caption">KICKON 직관 기록 화면</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
