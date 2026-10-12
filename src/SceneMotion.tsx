import { type ReactNode } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";

export function SceneItem({ progress, start, fromX = 0, className, children }: {
  progress: MotionValue<number>;
  start: number;
  fromX?: number;
  className: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, [start, start + 0.16], [0, 1]);
  const y = useTransform(progress, [start, start + 0.16], [28, 0]);
  const scale = useTransform(progress, [start, start + 0.16], [0.96, 1]);
  const x = useTransform(progress, [start, start + 0.16], [fromX, 0]);
  return <motion.div className={`scene-item ${className}`} style={reduced ? undefined : { opacity, y, scale, x }}>{children}</motion.div>;
}

export function PhoneScreen({ src, alt }: { src: string; alt: string }) {
  return <div className="product-phone"><img src={src} alt={alt} width="604" height="1314" loading="lazy" decoding="async" /></div>;
}
