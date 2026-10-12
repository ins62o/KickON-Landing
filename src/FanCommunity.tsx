import { useState, type CSSProperties } from "react";
import { MessageCircle, Heart } from "lucide-react";
import { motion } from "motion/react";
import { teams } from "./teams";
import { PhoneScreen, SceneItem } from "./SceneMotion";
import { useSceneMotion } from "./useSceneMotion";

const communityTeams = teams.filter(({ slug }) => ["incheon", "ulsan", "busan-ipark"].includes(slug));
const messages = ["오늘도 함께 응원해요!", "다음 홈경기, 경기장에서 만나요", "이 순간을 함께해서 더 좋았어요"];

export function FanCommunity() {
  const [selectedSlug, setSelectedSlug] = useState("incheon");
  const selectedTeam = communityTeams.find(({ slug }) => slug === selectedSlug) ?? communityTeams[0];
  const { ref, progress, active, reduced } = useSceneMotion();
  return (
    <section id="fan-community" className="product-section community-section" aria-labelledby="community-heading" style={{ "--team-accent": selectedTeam.color } as CSSProperties}>
      <header className="product-heading">
        <h2 id="community-heading">같은 팀을 응원한다는 것</h2>
        <p>29개 팀의 팬들이 각자의 공간에서<br className="mobile-break" /> 함께 이야기하고 응원합니다</p>
      </header>
      <div className="team-selector" role="group" aria-label="팀 커뮤니티 미리보기 선택">
        {communityTeams.map(({ slug, name }) => <button type="button" key={slug} aria-pressed={selectedSlug === slug} onClick={() => setSelectedSlug(slug)}><img src={`/teams/hero/${slug}.webp`} alt="" width="28" height="28" loading="lazy" /><span>{name}</span></button>)}
      </div>
      <div ref={ref} className="community-scene product-scene" data-active={active}>
        <div className="community-orbit" aria-hidden="true" />
        {messages.map((message, index) => <SceneItem progress={progress} start={0.07 + index * 0.13} fromX={index === 1 ? 42 : -42} className={`community-message community-message-${index}`} key={message}>
          <div className="message-card"><span className="message-label"><MessageCircle size={16} aria-hidden="true" />응원 메시지 예시</span><p>{message}</p><Heart size={17} aria-hidden="true" /></div>
        </SceneItem>)}
        <SceneItem progress={progress} start={0.4} className="community-phone">
          <motion.div key={selectedSlug} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <PhoneScreen src={`/product/community-${selectedSlug}.webp`} alt={`실제 킥온 ${selectedTeam.name} 커뮤니티 화면`} />
          </motion.div>
        </SceneItem>
      </div>
      <p className="screen-caption" aria-live="polite">{selectedTeam.name} 커뮤니티 앱 화면 · 주변 메시지는 예시입니다</p>
    </section>
  );
}
