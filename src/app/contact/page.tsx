// src/app/contact/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { buildAssetUrl } from "@/lib/assets";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/* ----------------------------- content ----------------------------- */
const serviceTeasers = [
  {
    title: "Consultation",
    summary:
      "Private listening sessions and on-site audits so you experience cinema impact, ambience control, and clarity before you commit.",
    href: "/services/consultation",
  },
  {
    title: "Design",
    summary:
      "European-inspired acoustic studies that conceal equipment in architecture while preserving warmth, detail, and coverage.",
    href: "/services/design",
  },
  {
    title: "Installation",
    summary:
      "Logistics, commissioning, and DSP tuning end-to-end, followed by documentation and concierge-style aftercare.",
    href: "/services/installation",
  },
] as const;

const securityPrompts = ["SOUND", "TRACE", "VELVET", "ARCH", "CINEMA"] as const;
const SUBMISSION_WINDOW_MS = 25000;
const MAX_ATTEMPTS_PER_WINDOW = 4;
const MINIMUM_DELAY_MS = 4000;

const getRandomSecurityPrompt = () =>
  securityPrompts[Math.floor(Math.random() * securityPrompts.length)];

const internationalPhones = [
  {
    label: "Kuala Lumpur HQ",
    number: "+60 3 2713 6553",
    href: "tel:+60327136553",
  },
  {
    label: "Singapore Atelier",
    number: "+65 6659 4900",
    href: "tel:+6566594900",
  },
  {
    label: "Regional WhatsApp",
    number: "+60 10 954 0995",
    href: "tel:+60109540995",
  },
];

/* ---------------------- WhatsApp chat link ------------------------ */
const regionalWhatsApp = internationalPhones.find(
  (p) => p.label === "Regional WhatsApp"
);

const WHATSAPP_NUMBER = regionalWhatsApp
  ? regionalWhatsApp.number.replace(/[^\d]/g, "")
  : "60109540995";

const WHATSAPP_GREETING =
  "Hello Nextrend, I’d like to explore a tailored audio solution for my space. Could a client advisor assist me?";

const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_GREETING
)}`;

/* ----------------------------- tokens ------------------------------ */
const fieldClasses =
  "mt-2 w-full rounded-2xl border border-[rgba(212,175,55,0.35)] bg-transparent px-4 py-3 text-[0.95rem] text-[var(--ink,#1a1a1a)] placeholder:text-[var(--muted,#6f6f6f)] outline-none transition hover:border-[rgba(212,175,55,0.6)] focus:border-[rgba(212,175,55,0.9)] focus:ring-4 focus:ring-[rgba(212,175,55,0.18)]";

/* -------------------- hero image from R2 via helper ---------------- */

// object key in the bucket is `Contact_image.jpg` at the root
const CONTACT_IMAGE = buildAssetUrl("", "Contact_image.jpg");

/* ------------------------- luxe motion styles ---------------------- */
function LuxeMotionStyles() {
  useEffect(() => {
    const id = "nt-luxe-motion";
    if (document.getElementById(id)) return;

    const css = `
      :root { --gold:#d4af37; --ink:#1a1a1a; --muted:rgba(26,26,26,.58); --paper:#faf7f2; }
      .nt-serif { font-family: "Playfair Display", Times New Roman, ui-serif, Georgia, serif; }
      .nt-kicker { letter-spacing: .32em; text-transform: uppercase; font-weight: 600; font-size: 10px; }
      @keyframes ntGoldSheen {
        0% { background-position: -120% 0; }
        100% { background-position: 220% 0; }
      }
      .nt-sheen {
        background-image: linear-gradient(90deg, transparent 0%, rgba(212,175,55,.0) 20%, rgba(212,175,55,.65) 52%, rgba(212,175,55,.0) 80%, transparent 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: ntGoldSheen 1600ms ease-out forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nt-sheen { animation: none !important; background-position: 220% 0; }
      }
    `;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
  return null;
}

/* --------------------------- motion pieces ------------------------- */
const easeLux = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = (delay = 0, duration = 0.6) => ({
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" as const },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration, ease: easeLux, delay },
  },
});

/* Arrow icon – visible on mobile as well */
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`inline-block ${className}`}
      width={16}
      height={16}
      aria-hidden="true"
    >
      <path
        d="M5 12h12m0 0-4-4m4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ----------------------------- page ------------------------------- */
export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [securityCheck, setSecurityCheck] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    tone: "neutral" | "error";
    text: string;
  } | null>(null);

  const [honeypot, setHoneypot] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const maxChars = 250;
  const startTime = useRef(Date.now());
  const attemptHistory = useRef<number[]>([]);

  const refreshSecurityChallenge = () => {
    setSecurityKey(getRandomSecurityPrompt());
    setSecurityCheck("");
    startTime.current = Date.now();
  };

  useEffect(() => {
    refreshSecurityChallenge();
  }, []);

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!securityKey) {
      setStatusMessage({
        tone: "error",
        text: "Security challenge is still loading. Please wait a moment before sending.",
      });
      return;
    }

    const now = Date.now();

    const recentAttempts = attemptHistory.current.filter(
      (ts) => now - ts < SUBMISSION_WINDOW_MS
    );
    if (recentAttempts.length >= MAX_ATTEMPTS_PER_WINDOW) {
      attemptHistory.current = recentAttempts;
      setStatusMessage({
        tone: "error",
        text: "Too many submissions in a short span. Please wait a moment before trying again.",
      });
      refreshSecurityChallenge();
      return;
    }
    attemptHistory.current = [...recentAttempts, now];

    if (honeypot.trim().length > 0) {
      setStatusMessage({
        tone: "error",
        text: "Security check failed. Please interact with the form manually.",
      });
      refreshSecurityChallenge();
      return;
    }

    if (securityCheck.trim().toUpperCase() !== securityKey) {
      setStatusMessage({
        tone: "error",
        text: `Security check failed. Please type ${securityKey} to confirm.`,
      });
      refreshSecurityChallenge();
      return;
    }

    if (now - startTime.current < MINIMUM_DELAY_MS) {
      setStatusMessage({
        tone: "error",
        text: "Slow down – this form requires a moment of time to keep things boutique.",
      });
      refreshSecurityChallenge();
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      phone: formData.get("phone")?.toString().trim() ?? phoneValue,
      location: formData.get("location")?.toString().trim() ?? "",
      vision: formData.get("vision")?.toString().trim() ?? "",
      honeypot: formData.get("company")?.toString() ?? "",
      securityCheck: formData.get("securityCheck")?.toString() ?? "",
      securityKey,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      referrer:
        typeof document !== "undefined" ? document.referrer : "unknown",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setStatusMessage({
          tone: "error",
          text:
            (data as any)?.error ||
            "Something went wrong while sending your message. Please try again.",
        });
        return;
      }

      setStatusMessage({
        tone: "neutral",
        text: "Merci. We have received your message and will reply with a tailored appointment shortly.",
      });

      setMessage("");
      setPhoneValue("");
      setHoneypot("");
      form.reset();
      refreshSecurityChallenge();
    } catch {
      setStatusMessage({
        tone: "error",
        text: "Network error while sending your message. Please check your connection and try again.",
      });
    }
  };

  const reduce = useReducedMotion();
  const [rows, setRows] = useState<number>(5);
  useEffect(() => {
    if (reduce) setRows(4);
  }, [reduce]);

  return (
    <main
      className="relative mx-auto max-w-[90rem] px-4 pb-20 text-[var(--ink,#1a1a1a)] sm:px-6 md:pb-28"
      style={
        {
          ["--accent" as any]: "#d4af37",
          ["--paper" as any]: "#faf7f2",
          ["--ink" as any]: "#1a1a1a",
          ["--muted" as any]: "rgba(26,26,26,0.58)",
        } as CSSProperties
      }
    >
      <LuxeMotionStyles />

      {/* Hero – full bleed, mobile-first */}
      <motion.section
        variants={fadeUp(0, 0.6)}
        initial="hidden"
        animate="show"
        className="relative left-1/2 w-screen -mx-[50vw]"
      >
        <div className="relative h-[48vh] min-h-[380px] md:h-[64vh] lg:h-[78vh]">
          <Image
            src={CONTACT_IMAGE}
            alt="Architectural listening suite lighting study"
            fill
            priority
            className="object-cover object-center md:object-top brightness-90"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50 opacity-90"
            aria-hidden
          />

          {/* copy block */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:left-[6%] sm:max-w-[36rem] sm:px-0 sm:pb-[6%]">
            <motion.div
              variants={fadeUp(0.1)}
              className="max-w-[36rem] text-white drop-shadow-[0_8px_35px_rgba(10,7,3,0.45)]"
            >
              <h1 className="nt-serif text-[2rem] leading-[1.12] sm:text-[2.4rem] lg:text-[3.2rem]">
                <span className="block text-white">Architectural sound,</span>
                <span className="block text-white/90">
                  by private appointment.
                </span>
              </h1>

              <p className="mt-3 text-[0.98rem] leading-relaxed text-white/85">
                Reserve a discreet listening session in Kuala Lumpur or request
                an on-site audit anywhere in Malaysia.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services */}
      <section className="mt-12 space-y-6 sm:mt-14">
        <motion.div
          variants={fadeUp(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-2"
        >
          <p className="nt-kicker text-[var(--muted)]">Our services</p>
        </motion.div>

        <div className="grid gap-6 sm:gap-7 md:grid-cols-3">
          {serviceTeasers.map((s, i) => (
            <motion.article
              key={s.title}
              variants={fadeUp(0.06 * i)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="group pb-3 pt-1 sm:pb-4"
            >
              <h3 className="nt-serif text-[1.15rem] sm:text-[1.2rem] font-semibold text-[var(--ink)]">
                {s.title}
              </h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--muted)]">
                {s.summary}
              </p>

              <Link
                href={s.href}
                className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] !text-[var(--accent,#d4af37)] group transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
              >
                <span className="relative">
                  Read more
                  <span className="pointer-events-none absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[var(--accent,#d4af37)] transition-transform duration-300 group-hover:scale-x-100 group-active:scale-x-100" />
                </span>
                <Arrow className="text-current transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Form + addresses */}
      <section
        id="contact-form"
        className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[1.08fr,0.92fr]"
        style={{ scrollMarginTop: "5.5rem" }}
      >
        {/* form */}
        <motion.form
          variants={fadeUp(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-8"
          onSubmit={handleFormSubmit}
        >
          {/* honeypot field */}
          <div
            style={{
              position: "absolute",
              left: "-9999px",
              opacity: 0,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <Field
              id="name"
              name="name"
              label="Name"
              placeholder="Tanzim Bin Zahir"
              autoComplete="name"
              required
            />
            <Field
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="tanzim@gmail.com"
              autoComplete="email"
              required
            />

            {/* global phone input using react-phone-input-2 */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>

              <div className="mt-2 w-full rounded-2xl border border-[rgba(212,175,55,0.35)] bg-transparent px-3 py-[0.15rem] text-[0.95rem] text-[var(--ink,#1a1a1a)] outline-none transition focus-within:border-[rgba(212,175,55,0.9)] focus-within:ring-4 focus-within:ring-[rgba(212,175,55,0.18)]">
                <PhoneInput
                  country={"my"}
                  value={phoneValue}
                  onChange={(value) => setPhoneValue(value || "")}
                  inputProps={{
                    name: "phone-visible",
                    required: true,
                  }}
                  containerClass="w-full !flex !items-stretch"
                  buttonClass="!border-0 !bg-transparent !px-0 !pr-2 !text-[0.9rem]"
                  inputClass="!border-0 !bg-transparent !shadow-none !w-full !text-[0.95rem] !text-[var(--ink,#1a1a1a)] !focus:ring-0 !focus:outline-none"
                  dropdownClass="z-50 !bg-[var(--paper,#faf7f2)] !text-[var(--ink,#1a1a1a)]"
                  enableSearch
                  disableSearchIcon
                />
              </div>

              {/* hidden field that actually gets submitted */}
              <input type="hidden" name="phone" value={phoneValue} />

              <p className="mt-1 text-[0.72rem] text-[var(--muted)]">
                Worldwide format with full international dialing code.
              </p>
            </div>

            <Field
              id="location"
              name="location"
              label="Project Location"
              placeholder="Kuala Lumpur / Penang / Singapore"
            />
          </div>

          <div>
            <Label htmlFor="vision">
              Vision Overview{" "}
              <span className="normal-case tracking-normal text-[0.78rem]">
                (max {maxChars} characters)
              </span>
            </Label>
            <textarea
              id="vision"
              name="vision"
              rows={rows}
              maxLength={maxChars}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
              placeholder="Describe the space, mood, and usage (residential cinema, lounge ambience, flagship retail, etc.)."
              className={`${fieldClasses} resize-none`}
            />
            <div className="mt-1 text-[0.72rem] text-[var(--muted)]">
              {message.length}/{maxChars}
            </div>
          </div>

          <input type="hidden" name="securityKey" value={securityKey} />

          <div>
            <Label htmlFor="security">Security check</Label>
            <div className="mt-2 flex flex-col gap-1">
              <div className="text-[0.75rem] text-[var(--muted)]">
                Type{" "}
                <span className="font-semibold tracking-[0.3em]">
                  {securityKey}
                </span>{" "}
                to confirm you are human.
              </div>
              <input
                id="security"
                name="securityCheck"
                className={fieldClasses}
                value={securityCheck}
                onChange={(event) => setSecurityCheck(event.target.value)}
                placeholder="Security check"
                aria-describedby="security-helper"
              />
            </div>
            <p
              id="security-helper"
              className="mt-1 text-[0.65rem] text-[var(--muted)]"
            >
              This challenge rotates after every submission attempt to keep
              automated requests at bay.
            </p>
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent,#d4af37)] px-7 py-3 text-[11px] uppercase tracking-[0.3em] text-white"
          >
            Send request
          </motion.button>

          {statusMessage && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[0.85rem] ${
                statusMessage.tone === "error"
                  ? "text-red-500"
                  : "text-emerald-600"
              }`}
              aria-live="polite"
            >
              {statusMessage.text}
            </motion.p>
          )}
        </motion.form>

        {/* addresses – now side by side on desktop */}
        <motion.aside
          variants={fadeUp(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-[0.95rem] text-[var(--muted)]"
        >
          <div className="grid gap-10 md:grid-cols-2">
            {/* Ampang */}
            <div className="space-y-2">
              <p className="nt-kicker text-[var(--muted)]">
                Kuala Lumpur private suite
              </p>
              <div className="leading-relaxed">
                <p>R-13A-2A, M-City Ampang</p>
                <p>No 326, Jalan Ampang</p>
                <p>50450 Kuala Lumpur, Malaysia</p>
              </div>
              <ul className="space-y-1 text-[0.9rem]">
                <li>— Discreet Atmos cinema & 2-channel reference room</li>
                <li>— Invisible architectural speaker showcase</li>
                <li>— By appointment only</li>
              </ul>

              <Link
                href="https://maps.google.com/?q=R-13A-2A,+M-City+Ampang,+No+326,+Jalan+Ampang,+50450+Kuala+Lumpur,+Malaysia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[var(--accent,#d4af37)] mt-2"
              >
                <span>View  Direction</span>
                <Arrow className="text-[var(--accent,#d4af37)] transition-transform duration-300 hover:translate-x-1 active:translate-x-1" />
              </Link>
            </div>

            {/* Bangsar */}
            <div className="space-y-2">
              <p className="nt-kicker text-[var(--muted)]">
                Bangsar listening lounge
              </p>
              <div className="leading-relaxed">
                <p>162, Jalan Maarof</p>
                <p>Bangsar, Taman Bandaraya</p>
                <p>59100 Kuala Lumpur, Malaysia</p>
              </div>
              <ul className="space-y-1 text-[0.9rem]">
                <li>— City lounge demonstrations & focused stereo listening</li>
                <li>— Curated systems for modern apartments and townhouses</li>
                <li>— Visits by prior reservation</li>
              </ul>

              <Link
                href="https://maps.google.com/?q=162,+Jalan+Maarof,+Bangsar,+Taman+Bandaraya,+59100+Kuala+Lumpur,+Malaysia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[var(--accent,#d4af37)] mt-2"
              >
                <span>View Direction</span>
                <Arrow className="text-[var(--accent,#d4af37)] transition-transform duration-300 hover:translate-x-1 active:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.aside>
      </section>

      {/* WhatsApp Chat – LV-style block */}
      <motion.section
        variants={fadeUp(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-16 mb-4 flex justify-center"
      >
        <div className="max-w-xl w-full text-center">
          <p className="nt-kicker text-[var(--muted)] mb-2">
            Client services
          </p>

     <h2 className="nt-serif text-[1.5rem] tracking-[0.04em] text-[var(--ink,#1a1a1a)]">
  WhatsApp Chat
</h2>


          <div className="mt-3 space-y-2">
            <p className="text-[0.95rem] leading-relaxed text-[rgba(26,26,26,0.7)]">
              Chat directly with a Nextrend client advisor via WhatsApp.
            </p>

       <div className="text-[0.9rem] leading-relaxed text-[var(--muted)] space-y-1">
  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
    Opening hours
  </p>
  <p className="text-[0.9rem] text-[var(--ink,#1a1a1a)]">
    Monday – Saturday: 10:00am – 5:45pm
  </p>
  <p>Sunday: Closed</p>
</div>

          </div>

     <div className="pt-5">
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 rounded-[2px] border border-[rgba(212,175,55,0.7)] px-9 py-3 text-[0.86rem] tracking-[0.14em] uppercase text-[var(--ink,#1a1a1a)] hover:bg-[rgba(212,175,55,0.03)] transition-colors duration-150"
  >
    <span>Chat on WhatsApp</span>
    <Arrow className="h-[0.8rem] w-[0.8rem]" />
  </a>
  <p className="mt-2 text-[0.72rem] text-[var(--muted)]">
    Replies from a client advisor within one business day.
  </p>
</div>

        </div>
      </motion.section>
    </main>
  );
}

/* --------------------------- tiny helpers -------------------------- */
function Label(props: React.ComponentPropsWithoutRef<"label">) {
  return (
    <label
      {...props}
      className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]"
    />
  );
}

function Field({
  id,
  label,
  ...rest
}: {
  id: string;
  label: string;
} & Omit<React.ComponentPropsWithoutRef<"input">, "id">) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} className={fieldClasses} {...rest} />
    </div>
  );
}
