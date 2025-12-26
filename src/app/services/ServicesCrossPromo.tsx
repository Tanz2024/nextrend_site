"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ServiceId = "Consultation" | "Design" | "Installation";

type ServiceMeta = {
  accent: string;
  description: string;
  cta: string;
  href: string;
};

const SERVICE_META: Record<ServiceId, ServiceMeta> = {
  Consultation: {
    accent: "Your Space, Your Sound",
    description:
      "We explore your space, lifestyle, and performance goals to design high-end audio-visual solutions tailored to you.",
    cta: "Schedule a session",
    href: "/services/consultation",
  },
  Design: {
    accent: "Where Sound Meets Space",
    description:
      "From speaker placement to material selection, every detail is crafted for immersive sound and seamless integration with your interior.",
    cta: "Explore the design work",
    href: "/services/design",
  },
  Installation: {
    accent: "Seamless Setup & Smart Automation",
    description:
      "Our experts handle professional speaker installation, DSP tuning, and app-controlled automation for effortless, high-end performance.",
    cta: "Book the technical team",
    href: "/services/installation",
  },
};

const SERVICE_ORDER: ServiceId[] = ["Consultation", "Design", "Installation"];

const LEAD_COPY: Record<ServiceId, string> = {
  Consultation:
    "From vision to reality, we guide you through every stage—consultation, design, and installation—so your audio-visual experience is seamless, elegant, and immersive.",
  Design:
    "Pair your design collaboration with consultation and installation to keep every decision aligned all the way through.",
  Installation:
    "Reconnect with consultation and design before handover so the build mirrors every intent.",
};

type ServicesCrossPromoProps = {
  current: ServiceId;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.3, 0.4, 0.4, 1] },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ServicesCrossPromo({ current }: ServicesCrossPromoProps) {
  const items = SERVICE_ORDER.filter((id) => id !== current).map((id) => ({
    id,
    ...SERVICE_META[id],
  }));

  return (
    <motion.section
      // full-bleed cream band
      className="w-full bg-[#f7efe4]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={sectionVariants}
    >
      {/* constrained content inside */}
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:px-8 lg:px-16">
        {/* header strip */}
        <div className="space-y-4">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[rgba(133,116,99,0.85)]">
            Continue exploring
          </p>
          <h3 className="text-[1.8rem] font-semibold tracking-tight text-neutral-900 sm:text-[2.1rem]">
            Your High-End AV Solution
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-[rgba(68,60,54,0.95)]">
            {LEAD_COPY[current]}
          </p>

          <div className="mt-4 h-px w-24 bg-[rgba(196,156,74,0.7)]" />
        </div>

        {/* rows */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              custom={index * 0.08}
              variants={rowVariants}
              className="relative group"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at top left, rgba(249,241,227,0.85), transparent 55%)",
                }}
              />

              <Link
                href={item.href}
                className="relative flex h-full flex-col justify-between gap-4"
                aria-label={`Discover ${item.id}`}
              >
                <div className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.36em] text-[rgba(161,140,99,0.9)]">
                    {item.accent}
                  </p>
                  <h4 className="text-[1.35rem] font-semibold text-neutral-900">
                    {item.id}
                  </h4>
                  <p className="text-sm leading-relaxed text-[rgba(74,67,63,0.9)]">
                    {item.description}
                  </p>
                </div>

                <span className="mt-3 inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.32em] text-[rgba(120,104,86,0.98)]">
                  <span className="relative">
                    {item.cta}
                    <span className="pointer-events-none absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[rgba(196,156,74,0.9)] transition-transform duration-400 group-hover:scale-x-100" />
                  </span>
                  <span
                    aria-hidden
                    className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
