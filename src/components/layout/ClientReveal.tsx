"use client";

import { motion } from "framer-motion";
import React from "react";

type ClientRevealProps = {
  as?: "section" | "div" | "article";
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export function ClientReveal({
  as = "section",
  className,
  children,
  delay = 0,
}: ClientRevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
    >
      {children}
    </Component>
  );
}
