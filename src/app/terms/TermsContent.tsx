"use client";

import Link from "next/link";
import { useEffect } from "react";

type Section =
  | { title: string; body: React.ReactNode }
  | { title: string; list: string[] };

// champagne tone, no underline, soft hover
const linkClass =
  "relative inline-flex items-center gap-1 text-[#d4a871] font-medium no-underline transition-colors duration-300 hover:text-[#e3bc7d]";

const sections: Section[] = [
  {
    title: "Purpose & Scope",
    body: (
      <>
        These Terms of Engagement (“Terms”) set the standard for working with Nextrend Systems Sdn. Bhd. across
        our audio dashboards, portals, and concierge services in Malaysia. By commissioning our work, accessing a
        dashboard, or engaging with our digital channels, you acknowledge and accept these Terms.
      </>
    ),
  },
  {
    title: "Malaysian Law & Jurisdiction",
    body: (
      <>
        These Terms are governed by the laws of Malaysia. Any claim or dispute shall fall under the exclusive
        jurisdiction of the Malaysian courts. Your statutory rights, including those under the Consumer Protection
        Act 1999 and related legislation, remain fully preserved.
      </>
    ),
  },
  {
    title: "Use of Dashboards",
    list: [
      "Adhere to installation, tuning, and safety instructions issued by Nextrend engineers.",
      "Do not use remote access or tuning features to monitor or record individuals without lawful consent.",
      "Third-party integrations (e.g., voice assistants, streaming services) are subject to their own terms.",
      "Accounts are provisioned for your project team only; do not share access beyond authorised users.",
    ],
  },
  {
    title: "Intellectual Property",
    body: (
      <>
        All schematics, DSP profiles, presets, commissioning notes, and interface designs remain the intellectual
        property of Nextrend. We grant a non-exclusive licence for use solely at the site identified in your
        Statement of Work. Reverse engineering, copying, or redistribution is prohibited without written consent.
      </>
    ),
  },
  {
    title: "Fees & Payment",
    list: [
      "Invoices are issued in Ringgit Malaysia (MYR) and are payable within 30 days unless otherwise agreed.",
      "Overdue balances may attract financing charges of 1.5% per month and temporary suspension of support.",
      "SST, customs duties, and any applicable government charges are borne by the client unless stated otherwise.",
    ],
  },
  {
    title: "Limited Warranty",
    body: (
      <>
        Hardware is covered by the respective manufacturer’s warranty. Nextrend warrants workmanship for twelve (12)
        months from handover. This warranty excludes damage arising from unauthorised alterations, misuse, power
        irregularities, environmental events, or force majeure.
      </>
    ),
  },
  {
    title: "Limitation of Liability",
    body: (
      <>
        To the fullest extent permitted by Malaysian law, Nextrend shall not be liable for indirect or consequential
        losses, including loss of profit, data, or business opportunity. Our total aggregate liability is capped at
        the fees paid to Nextrend in the twelve (12) months preceding the claim.
      </>
    ),
  },
  {
    title: "Data & Privacy",
    body: (
      <>
        Our approach to personal data is described in the{" "}
        <Link data-link-animate href="/privacy" className={linkClass}>
          Privacy Statement
        </Link>
        . Where dashboards capture diagnostic or usage data to facilitate support, you are responsible for informing
        guests, residents, or occupants and obtaining any required consents.
      </>
    ),
  },
  {
    title: "Changes to Terms",
    body: (
      <>
        We may revise these Terms to reflect operational, technical, or legal developments. The latest version will
        be published at <span className="underline decoration-dotted">nextrendy.com/terms</span> with its effective
        date. Continued use of our dashboards and services constitutes acceptance of the updated Terms.
      </>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <>
        For legal correspondence, email{" "}
        <a data-link-animate href="mailto:legal@nextrendy.com" className={linkClass}>
          legal@nextrendy.com
        </a>
        . For project support or general enquiries, use our{" "}
        <Link data-link-animate href="/contact" className={linkClass}>
          contact form
        </Link>
        . Registered office details are available upon written request.
      </>
    ),
  },
];

export function TermsContent() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-terms-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("terms-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="terms-main mx-auto max-w-4xl space-y-10 px-4 py-16 sm:px-6 sm:py-20">
      <header className="space-y-4" data-terms-animate>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--secondary,#9c9388)]">
          Updated 1 October 2025
        </p>
        <h1 className="text-[2.2rem] font-semibold tracking-tight text-[var(--foreground,#f7f2ea)] sm:text-[3rem]">
          Terms of Engagement
        </h1>
        <p className="text-sm leading-relaxed text-[var(--secondary,#bcb2a7)]">
          These Terms reflect the standards of care and compliance behind every Nextrend audio dashboard, service
          visit, and digital touchpoint.
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="space-y-3" data-terms-animate>
          <h2 className="text-lg font-semibold text-[var(--foreground,#f7f2ea)]">
            {section.title}
          </h2>

          {"list" in section ? (
            <ul className="space-y-2 text-sm leading-relaxed text-[var(--secondary,#c8c0b5)]">
              {section.list.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-[var(--secondary,#c8c0b5)]">
              {section.body}
            </p>
          )}
        </section>
      ))}

      <style jsx>{`
        /* SF Pro / Apple system stack for this page */
        .terms-main {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", "Segoe UI", system-ui, -system-ui, sans-serif;
          letter-spacing: 0.01em;
        }

        .terms-main h1,
        .terms-main h2 {
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .terms-main p,
        .terms-main li {
          font-size: 0.9rem;
          line-height: 1.7;
        }

        [data-terms-animate] {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .terms-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
