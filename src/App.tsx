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
      <main className="min-h-screen px-4 py-8 md:px-8 md:py-12">
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
