import { CalendarDays, Radio, Smartphone, Users } from "lucide-react";
import { PhoneScreen, SceneItem } from "./SceneMotion";
import { useSceneMotion } from "./useSceneMotion";

function AppCardImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const radius = 40;
  return (
    <div className="app-card-image" style={{ borderRadius: `${100 * radius / width}% / ${100 * radius / height}%` }}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </div>
  );
}

export function MatchExperience() {
  const { ref, progress, active } = useSceneMotion();
  return (
    <section id="match-experience" className="product-section match-section" aria-labelledby="match-heading">
      <header className="product-heading">
        <h2 id="match-heading">킥오프부터 종료 휘슬까지</h2>
        <p>경기의 모든 순간을, 킥온에서</p>
      </header>
      <div ref={ref} className="match-scene product-scene" data-active={active}>
        <SceneItem progress={progress} start={0.04} className="match-card schedule-card">
          <div className="card-label"><CalendarDays size={17} aria-hidden="true" /> 경기 일정</div>
          <AppCardImage src="/product/match-schedule-card.webp" alt="실제 킥온 경기 일정 앱 캡처의 서울 대 전북 경기 카드" width={724} height={378} />
        </SceneItem>
        <SceneItem progress={progress} start={0.10} className="match-card score-card">
          <div className="card-label"><Radio size={17} aria-hidden="true" /> 실시간 경기 정보</div>
          <AppCardImage src="/product/match-score-card.webp" alt="실제 킥온 경기 상세 앱 캡처의 전북 대 포항 스코어와 경기 정보" width={724} height={474} />
        </SceneItem>
        <SceneItem progress={progress} start={0.16} className="match-card lineup-card">
          <div className="card-label"><Users size={17} aria-hidden="true" /> 선수 라인업</div>
          <AppCardImage src="/product/match-lineup-card.webp" alt="킥온 앱에서 캡처한 전북과 포항의 포메이션 및 선발 선수 22명 전체 명단" width={724} height={936} />
        </SceneItem>
        <SceneItem progress={progress} start={0.22} className="match-card match-app">
          <div className="card-label"><Smartphone size={17} aria-hidden="true" /> 상세 화면</div>
          <PhoneScreen src="/product/match-detail.webp" alt="실제 킥온 경기 상세 화면, 스코어와 득점 기록 및 라인업" />
        </SceneItem>
      </div>
    </section>
  );
}
