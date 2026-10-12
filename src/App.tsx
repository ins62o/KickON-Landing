import { MotionConfig } from "motion/react";
import { HeroSection } from "./HeroSection";
import { MarqueeScroller } from "./MarqueeScroller";
import { MatchExperience } from "./MatchExperience";
import { MatchdayMemory } from "./MatchdayMemory";
import { FanCommunity } from "./FanCommunity";
import { DownloadSection } from "./DownloadSection";
import "./product-sections.css";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen px-4 pt-4 pb-8 md:px-8 md:pb-12">
        <HeroSection />
        <MarqueeScroller />
        <MatchExperience />
        <MatchdayMemory />
        <FanCommunity />
        <DownloadSection />
      </main>
    </MotionConfig>
  );
}
