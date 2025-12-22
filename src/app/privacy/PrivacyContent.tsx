"use client";

// @ts-nocheck
import { useEffect } from "react";

const sections = [
  {
    title: "Who we are",
    body: `Nextrend Systems Sdn. Bhd. (“Nextrend”, “we”, “us”) designs and maintains
    high-performance audio dashboards for residences, hospitality and retail projects across
    Malaysia. This privacy statement follows the structure of the Malaysian Personal Data
    Protection Act 2010 (PDPA) and the guidance provided by Jabatan Imigresen Malaysia’s
    own public statement.`,
  },
  {
    title: "Information we collect",
    list: [
      "Contact details, billing references, and project correspondences supplied via forms, email, or concierge appointments.",
      "Technical telemetry from installed dashboards (device IDs, firmware state, diagnostic logs) whenever remote support is enabled.",
      "Visit logs for our studios, demo lounges, and digital channels (cookies, analytics tags, session recordings).",
      "Government ID or professional licence numbers only where required for site access approvals or procurement rules.",
    ],
  },
  {
    title: "How we use data",
    list: [
      "To schedule consultations, manage installations, and maintain warranty/support programmes.",
      "To configure audio dashboards, push OTA updates, and troubleshoot issues.",
      "To verify identity before granting access to secure dashboards or sensitive project files.",
      "To meet contractual, taxation, and regulatory obligations within Malaysia.",
    ],
  },
  {
    title: "Sharing & disclosure",
    body: `Personal data stays within Nextrend and a short list of Malaysian service providers
    (cloud hosting, payment processors, logistics). We only disclose information to authorities
    when compelled under Malaysian law. Data is never sold to advertisers or unrelated third parties.`,
  },
  {
    title: "Retention & security",
    body: `Project files and telemetry are retained for as long as a dashboard or maintenance agreement
    remains active, then archived for up to seven years to satisfy audit and warranty needs. We use
    encrypted storage, role-based access, and continuous monitoring aligned with PDPA Security Principle
    requirements.`,
  },
  {
    title: "Your choices under PDPA",
    body: `You may request access, correction, or deletion of personal data, or withdraw consent for
    non-essential processing (such as marketing dispatches). Submit requests to privacy@nextrendy.com.
    We reply within 21 calendar days as recommended by the Personal Data Protection Department (JPDP).`,
  },
  {
    title: "Cookies & analytics",
    body: `Dashboard portals and this site use cookies to remember sign-ins, store calibration preferences,
    and analyse anonymised usage. You can adjust browser settings to block cookies; however some functions
    such as remote tuning and playlist syncing may not work.`,
  },
  {
    title: "Contact & complaints",
    body: `Email: privacy@nextrendy.com. Postal: Privacy Office, Nextrend Systems Sdn. Bhd., R-13A-2A,
    M-City Ampang, No. 326 Jalan Ampang, 50450 Kuala Lumpur. If you believe we have not resolved a concern,
    you may contact the Personal Data Protection Department (JPDP) at www.pdp.gov.my.`,
  },
];

// champagne tone, no underline, soft hover
const linkClass =
  "relative inline-flex items-center gap-1 text-[#d4a871] font-medium no-underline transition-colors duration-300 hover:text-[#e3bc7d]";

export function PrivacyContent() {
  useEffect(() => {
    const animatedNodes = document.querySelectorAll<HTMLElement>(
      "[data-section-animate]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="privacy-main mx-auto max-w-4xl space-y-10 px-4 py-16 sm:px-6 sm:py-20">
      <header className="space-y-4" data-section-animate>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--secondary,#9c9388)]">
          Updated 1 October 2025
        </p>
        <h1 className="text-[2.2rem] font-semibold tracking-tight text-[var(--foreground,#f7f2ea)] sm:text-[2.8rem]">
          Privacy statement
        </h1>
        <p className="text-sm leading-relaxed text-[var(--secondary,#bcb2a7)]">
          Crafted to mirror the clarity of national public statements, this page explains how Nextrend
          handles personal data when you visit our site, schedule a consultation, or operate a Nextrend
          audio dashboard.
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="space-y-3" data-section-animate>
          <h2 className="text-lg font-semibold text-[var(--foreground,#f7f2ea)]">
            {section.title}
          </h2>
          {"body" in section ? (
            <p className="text-sm leading-relaxed text-[var(--secondary,#c8c0b5)]">
              {section.body.includes("privacy@nextrendy.com") ? (
                <>
                  You may request access, correction, or deletion of personal data,
                  or withdraw consent for non-essential processing. Submit requests
                  to{" "}
                  <a
                    data-link-animate
                    className={linkClass}
                    href="mailto:privacy@nextrendy.com"
                  >
                    privacy@nextrendy.com
                  </a>
                  . We reply within 21 calendar days.
                </>
              ) : section.body.includes("www.pdp.gov.my") ? (
                <>
                  Email:{" "}
                  <a
                    data-link-animate
                    className={linkClass}
                    href="mailto:privacy@nextrendy.com"
                  >
                    privacy@nextrendy.com
                  </a>
                  . Postal: Privacy Office, Nextrend Systems Sdn. Bhd., R-13A-2A,
                  M-City Ampang, No. 326 Jalan Ampang, 50450 Kuala Lumpur. If you
                  believe we have not resolved a concern, you may contact the{" "}
                  <a
                    data-link-animate
                    className={linkClass}
                    href="https://www.pdp.gov.my"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Personal Data Protection Department (JPDP)
                  </a>
                  .
                </>
              ) : (
                section.body
              )}
            </p>
          ) : (
            <ul className="space-y-2 text-sm leading-relaxed text-[var(--secondary,#c8c0b5)]">
              {section.list?.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <style jsx>{`
        /* SF Pro / Apple system stack everywhere */
        .privacy-main {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", "Segoe UI", system-ui, -system-ui, sans-serif;
          letter-spacing: 0.01em;
        }

        .privacy-main h1,
        .privacy-main h2 {
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .privacy-main p,
        .privacy-main li {
          font-size: 0.9rem;
          line-height: 1.7;
        }

        [data-section-animate] {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
