import { useRef } from "react";
import { useInView, useReducedMotion, useScroll } from "motion/react";

export function useSceneMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 65%"] });
  return { ref, progress: scrollYProgress, active: inView && !reduced, reduced };
}
