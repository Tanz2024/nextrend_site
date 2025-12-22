'use client';

import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

type Totals = {
  totalProjects: number;
  hospitality: number;
  hotels: number;
  residential: number;
  retailAuto: number;
  corporate: number;
  developers: number;
};

type ProjectHeroMetricsAnimatedProps = {
  totals: Totals;
  experience: string;
};

const curve = [0.22, 0.61, 0.36, 1] as const;

export default function ProjectHeroMetricsAnimated({
  totals,
  experience,
}: ProjectHeroMetricsAnimatedProps) {
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: '-10% 0px' });
  const experienceInView = useInView(experienceRef, { once: true, margin: '-10% 0px' });

  const [projectsDelivered, setProjectsDelivered] = useState(0);
  const [yearsExperience, setYearsExperience] = useState(0);

  const { numeric: experienceNumeric, suffix: experienceSuffix } = useMemo(() => {
    const match = experience.match(/(\d+)(.*)/);
    if (!match) return { numeric: 0, suffix: experience };
    const numericValue = Number.parseInt(match[1], 10);
    return { numeric: Number.isFinite(numericValue) ? numericValue : 0, suffix: match[2].trim() };
  }, [experience]);

  useEffect(() => {
    if (!projectsInView) return;
    const controls = animate(0, totals.totalProjects, {
      duration: 1.6,
      ease: curve,
      onUpdate: latest => setProjectsDelivered(Math.round(latest)),
    });
    return () => controls.stop();
  }, [projectsInView, totals.totalProjects]);

  useEffect(() => {
    if (!experienceInView || experienceNumeric === 0) return;
    const controls = animate(0, experienceNumeric, {
      duration: 1.4,
      ease: curve,
      onUpdate: latest => setYearsExperience(Math.round(latest)),
    });
    return () => controls.stop();
  }, [experienceInView, experienceNumeric]);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <motion.div
        ref={projectsRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: curve }}
        viewport={{ once: true, amount: 0.6 }}
        className="relative"
      >
        <div className="absolute inset-x-0 -bottom-5 top-1/2 -z-10 rounded-[32px] bg-gradient-to-b from-[#d5a853]/12 via-transparent to-transparent opacity-0 blur-lg transition-opacity duration-700 md:-bottom-6" />
        <div className="flex items-baseline gap-3">
          <motion.span
            className="tabular-nums font-light tracking-[-0.01em] text-[2.45rem] md:text-[3.05rem] leading-none text-[#d5a853]"
            style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: projectsInView ? 1 : 0, y: projectsInView ? 0 : 16 }}
            transition={{ duration: 0.8, ease: curve, delay: 0.1 }}
          >
            {projectsDelivered.toLocaleString('en-US')}
          </motion.span>
          <motion.span
            className="text-[#0d0d0c] text-[1rem] md:text-[1.05rem] tracking-[0.002em]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: projectsInView ? 1 : 0, y: projectsInView ? 0 : 12 }}
            transition={{ duration: 0.8, ease: curve, delay: 0.24 }}
          >
            projects delivered
          </motion.span>
        </div>
      </motion.div>

      <motion.div
        ref={experienceRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: curve, delay: 0.12 }}
        viewport={{ once: true, amount: 0.6 }}
        className="relative"
      >
        <div className="flex flex-wrap items-center gap-2 text-[#0d0d0c]">
          <motion.span
            className="uppercase text-[11px] tracking-[0.22em]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: curve, delay: 0.08 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            tenure
          </motion.span>

          {/* Clean divider with width animation (no arrow head) */}
          <motion.div
            className="h-[1px] grow bg-[#d5a853]/40"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 0.8, ease: curve, delay: 0.24 }}
            viewport={{ once: true, amount: 0.6 }}
          />
        </div>

        <div className="mt-4 flex items-baseline gap-2 text-[#0d0d0c]">
          <motion.span
            className="tabular-nums font-light tracking-[-0.01em] text-[1.35rem] md:text-[1.45rem] leading-none text-[#d5a853]"
            style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: experienceInView ? 1 : 0, y: experienceInView ? 0 : 14 }}
            transition={{ duration: 0.85, ease: curve, delay: 0.24 }}
          >
            {yearsExperience.toLocaleString('en-US')}
          </motion.span>
          <motion.span
            className="text-[1rem] md:text-[1.05rem] tracking-[0.002em]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: experienceInView ? 1 : 0, y: experienceInView ? 0 : 14 }}
            transition={{ duration: 0.85, ease: curve, delay: 0.32 }}
          >
            {experienceSuffix || 'years in acoustic systems'}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
