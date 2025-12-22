"use client";

import { motion } from "framer-motion";
import * as React from "react";
import type { ReactNode, ElementType } from "react";

declare global {
  interface Window {
    __NEXTREND_PROJECT_SCROLL_RESTORED?: boolean;
  }
}

type Variant = "section" | "copy" | "card" | "slideLeft" | "slideRight";

type Props = {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  className?: string;
};

const VARIANTS: Record<
  Variant,
  { initial: Record<string, any>; whileInView: Record<string, any> }
> = {
  section: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
  },
  copy: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
  },
  card: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -64 },
    whileInView: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 64 },
    whileInView: { opacity: 1, x: 0 },
  },
};

export default function RevealOnScroll({
  children,
  as: Comp = "div",
  variant = "section",
  delay = 0,
  className,
}: Props) {
  const [disableMotion, setDisableMotion] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.__NEXTREND_PROJECT_SCROLL_RESTORED) {
      setDisableMotion(true);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (disableMotion) {
    const StaticComp = Comp as any;
    return <StaticComp className={className}>{children}</StaticComp>;
  }

  // Desktop: keep your current variants
  let v = VARIANTS[variant];

  // Mobile: premium “quiet” motion for ALL variants (including slideLeft/right)
  if (isMobile) {
    v = {
      initial: { opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" },
      whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    };
  }

  const MotionComp = motion.create(Comp as any);

  return (
    <MotionComp
      className={className}
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once: true, amount: 0.28 }}
      transition={{
        duration: isMobile ? 0.9 : 0.8,
        ease: [0.19, 1, 0.22, 1],
        delay,
      }}
    >
      {children}
    </MotionComp>
  );
}
