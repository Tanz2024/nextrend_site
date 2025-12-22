"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type ServiceSection = {
  title: string;
  body?: string;
  list?: string[];
  image?: string;
};

type ServicePageTemplateProps = {
  heroTitle: string;
  heroIntro: string;
  heroSubtitle: string;
  heroImage?: string;
  ctaLabel: string;
  ctaHref: string;
  highlights: string[];
  sections: ServiceSection[];
};

export function ServicePageTemplate({
  heroTitle,
  heroIntro,
  heroSubtitle,
  heroImage,
  ctaHref,
  ctaLabel,
  highlights,
  sections,
}: ServicePageTemplateProps) {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>("[data-service-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("service-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="mx-auto max-w-[1200px] space-y-16 px-4 py-16 sm:px-6 sm:py-20 text-[var(--foreground,#1a1816)]">
      <section
        className={`grid gap-10 ${
          heroImage ? "lg:grid-cols-[0.95fr,1.05fr]" : "lg:grid-cols-1"
        }`}
        data-service-animate
      >
        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--secondary,#8a8379)]">
            {heroIntro}
          </p>
          <h1 className="font-[var(--font-serif)] text-[2.75rem] leading-tight text-[var(--foreground,#1a1816)]">
            {heroTitle}
          </h1>
          <p className="text-sm leading-relaxed text-[var(--secondary,#645f57)]">{heroSubtitle}</p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.32em] text-[var(--secondary,#8a8379)]">
            {highlights.map((item) => (
              <span key={item} className="rounded-full bg-white/70 px-4 py-2 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                {item}
              </span>
            ))}
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-[var(--accent,#c9a36c)]"
          >
            {ctaLabel}
            <span aria-hidden>↗</span>
          </Link>
        </div>

        {heroImage ? (
          <div className="relative h-[420px] overflow-hidden rounded-[36px] shadow-[0_60px_160px_rgba(8,5,3,0.25)]">
            <Image src={heroImage} alt={heroTitle} fill className="object-cover" priority />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_100%)]" />
          </div>
        ) : null}
      </section>

      {sections.map((section, index) => (
        <section
          key={section.title}
          className={`grid gap-8 lg:grid-cols-[${index % 2 === 0 ? "1.1fr,0.9fr" : "0.9fr,1.1fr"}]`}
          data-service-animate
        >
          <div className="space-y-4">
            <h2 className="text-[1.7rem] font-semibold">{section.title}</h2>
            {section.body ? (
              <p className="text-sm leading-relaxed text-[var(--secondary,#655f56)]">{section.body}</p>
            ) : null}
            {section.list ? (
              <ul className="space-y-2 text-sm text-[var(--secondary,#655f56)]">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {section.image ? (
            <div className="relative h-[320px] overflow-hidden rounded-[32px] bg-black/5">
              <Image src={section.image} alt={section.title} fill className="object-cover" />
            </div>
          ) : null}
        </section>
      ))}

      <style jsx>{`
        [data-service-animate] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .service-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
