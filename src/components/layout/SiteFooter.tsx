"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { useToast } from "@/components/ui/ToastProvider";

const quickLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Journal" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const quickLinkColumns = Array.from(
  { length: Math.ceil(quickLinks.length / 2) },
  (_, index) => quickLinks.slice(index * 2, index * 2 + 2)
);

const socials = [
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://youtube.com", label: "YouTube", icon: FaYoutube },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedinIn },
];

// Authorised partner links
const partners = [
  { 
    href: "https://www.k-array.com/", 
    label: "K-array",
    logo: "/images/logos/k-array-logo.png",
    alt: "K-array logo"
  },
  { 
    href: "https://www.trinnov.com/", 
    label: "Trinnov",
    logo: "/images/logos/trinnov-logo.png",
    alt: "Trinnov logo"
  },
  { 
    href: "https://bearbrick.audio/", 
    label: "BE&#64;RBRICK",
    logo: "/images/logos/bearbrick-logo.jpg",
    alt: "BE@RBRICK Audio logo"
  },
  {
    href: "https://www.amina.co.uk/",
    label: "Amina",
    logo: "/images/logos/amina-logo.jpg",
    alt: "Amina logo"
  },
  {
    href: "https://brionvega.it/",
    label: "Brionvega", 
    logo: "/images/logos/brionvega-logo.png",
    alt: "Brionvega logo"
  },
  {
    href: "https://frog-is.com/",
    label: "Frog-is",
    logo: "/images/logos/frogis-logo.png",
    alt: "Frog-is logo"
  },
  {
    href: "https://k-gear.com/",
    label: "K-gear",
    logo: "/images/logos/K-gear_LOGO.png",
    alt: "K-gear logo"
  }
];


// Helper: whisper-luxury external map link
function MapLink({ href, aria }: { href: string; aria: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${aria} (opens in new tab)`}
      className="
        group mt-2 inline-flex items-center gap-2
        text-[0.75rem] uppercase tracking-[0.22em]
        text-[var(--secondary)]/70 transition
        ease-[cubic-bezier(.22,.61,.36,1)]
        hover:text-[var(--accent)]
        focus:outline-none focus-visible:text-[var(--accent)]
      "
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" stroke="currentColor" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" />
      </svg>

      <span className="relative">
        View Location
        <span className="absolute left-0 -bottom-[0.2rem] h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
      </span>

      <span className="opacity-0 translate-x-[-2px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--accent)]">
        {'->'}
      </span>
    </Link>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const dealerHref = "/dealers";

  const malaysiaMapHref =
    "https://maps.google.com/?q=R-13A-2A,+M-City+Ampang,+No+326,+Jalan+Ampang,+50450+Kuala+Lumpur,+Malaysia";
  const bangsarMapHref =
    "https://maps.google.com/?q=162,+Jalan+Maarof,+Bangsar,+Taman+Bandaraya,+59100+Kuala+Lumpur,+Malaysia";
  const singaporeMapHref =
    "https://maps.google.com/?q=18+Sin+Ming+Lane,+%2308-06+Midview+City,+573960+Singapore";

  const regReportHref =
    "https://businessreport.ctoscredit.com.my/oneoffreport_api/single-report/malaysia-company/0832494U/NEXTREND-SYSTEMS-SDN-BHD-";

  const { showToast } = useToast();

  const handleNewsletterSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    form.reset();
    showToast("Thank you. You're on the list for Nextrend dispatches.");
  };

  return (
<footer
  className={[
     "relative mt-32 border-t border-[var(--border-color)] overflow-x-hidden",
    "bg-[var(--surface)] text-[var(--foreground)]"
  ].join(" ")}
>

      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background:radial-gradient(circle_at_50%_0%,rgba(182,138,74,0.18)_0%,rgba(255,255,255,0)_72%)]" />

     <div className="relative mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        {/* Main Content Grid - Premium Layout */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Brand Section - Left */}
          <section className="lg:col-span-5">
            <div className="space-y-8">
              {/* Brand Header */}
                 {/* Brand Header */}
              <div className="space-y-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--secondary)]/70">
                  Nextrend Systems
                </p>
                <h2 className="font-[var(--font-serif)] text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] leading-tight text-[var(--foreground)]">
                  Premium Audio Solutions for Every Space
                </h2>
              </div>

              {/* Description Section */}
              <div>
                <p className="text-base leading-relaxed text-[var(--secondary)] max-w-lg">
                  Premium audio solutions for residential, commercial, and hospitality spaces, delivering immersive, crystal-clear sound that blends seamlessly with your interior. Expertly installed and supported for long-term performance.
                </p>
              </div>

              {/* Find Dealer Button - Standalone */}
              <div className="pt-4">
                <Link
                  href={dealerHref}
                  className="group relative inline-flex h-12 items-center gap-3 rounded-full border border-[var(--accent)]/60 bg-[var(--accent)]/10 px-6 text-sm font-semibold uppercase tracking-wide text-[var(--foreground)] backdrop-blur-sm transition-all duration-300 hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/80 hover:shadow-lg hover:shadow-[var(--accent)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 w-fit"
                  aria-label="Find a dealer"
                >
                  <span>Find a dealer</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--accent)]/60 text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Navigation */}
          <section className="lg:col-span-7">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]">
                    Quick Navigation
                  </h3>
                  
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
                  {quickLinkColumns.map((column, columnIndex) => (
                    <ul key={`quick-links-${columnIndex}`} className="space-y-3">
                      {column.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="group relative inline-flex text-sm uppercase tracking-wide text-[var(--foreground)]/90 transition-colors duration-200 hover:text-[var(--accent)]"
                          >
                            <span className="relative">
                              {link.label}
                              <span className="absolute left-0 -bottom-1 h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>

              {/* Follow Section - Below Quick Navigation */}
              <div className="space-y-4 border-t border-[var(--border-color)]/70 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]">
                  Follow
                </h3>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
                  {socials.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      aria-label={label}
                      className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[var(--foreground)]/80 transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 hover:shadow-lg hover:shadow-[var(--accent)]/20"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={18} />
                    </Link>
                  ))}
                </div>
               
                {/* Newsletter */}
                <form className="space-y-3 pt-6" onSubmit={handleNewsletterSubmit}>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--secondary)]">
                    Subscribe to our newsletter
                  </h4>
                  <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-2">
                    <input
                      type="email"
                      required
                      placeholder="Insert your email address *"
                      className="flex-1 bg-transparent text-sm uppercase tracking-[0.2em] text-[var(--foreground)] placeholder:text-[var(--secondary)]/70 focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="text-[var(--accent)] transition-transform duration-200 hover:translate-x-1"
                    >
                      <svg width="18" height="12" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12h14M13 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[var(--secondary)]/80">
                    By clicking on "Subscribe", you confirm you have read our{" "}
                    <Link
                      href="/privacy"
                      className="text-[var(--foreground)] underline decoration-dotted underline-offset-2 hover:text-[var(--accent)]"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and agree to receive Nextrend updates.
                  </p>
                </form>
              </div>
            </div>
          </section>
        </div>

        {/* Studios & Support Section */}
<section className="mt-20 lg:mt-24">
  <div className="space-y-8">
    <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]">
      Studios &amp; Concierge
    </h3>

    <div className="grid gap-12 md:grid-cols-3 lg:gap-20">
      {/* Kuala Lumpur (M-City) */}
      <address className="not-italic space-y-3 text-[var(--foreground)]">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--secondary)]/80 mb-4">
          Kuala Lumpur
        </p>
        <div className="space-y-1 text-base leading-relaxed">
          <p>R-13A-2A, M-City Ampang</p>
          <p>No 326, Jalan Ampang</p>
          <p>50450 Kuala Lumpur, Malaysia</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 text-sm">
          <a
            href="tel:+60327136553"
            className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-200 sm:whitespace-nowrap"
          >
            +60 3 2713 6553
          </a>
          <a
            href="mailto:sales@nextrendy.com"
            className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-200 sm:whitespace-nowrap"
          >
            sales@nextrendy.com
          </a>
        </div>

        <MapLink
          href={malaysiaMapHref}
          aria="View Kuala Lumpur studio location"
        />
      </address>

      {/* Kuala Lumpur (Bangsar) */}
      <address className="not-italic space-y-3 text-[var(--foreground)] border-t border-[var(--border-color)] pt-12 md:border-t-0 md:pt-0 md:pl-12 lg:pl-20">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--secondary)]/80 mb-4">
          Kuala Lumpur — Bangsar
        </p>
        <div className="space-y-1 text-base leading-relaxed">
          <p>162, Jalan Maarof</p>
          <p>Bangsar, Taman Bandaraya</p>
          <p>59100 Kuala Lumpur, Malaysia</p>
        </div>

        {/* If you don’t have phone/email/map yet, remove this block.
            Or wire it to your existing contact details. */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 text-sm">
          <a
            href="tel:+60327136553"
            className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-200 sm:whitespace-nowrap"
          >
            +60 3 2713 6553
          </a>
          <a
            href="mailto:sales@nextrendy.com"
            className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-200 sm:whitespace-nowrap"
          >
            sales@nextrendy.com
          </a>
        </div>

        <MapLink
          href={bangsarMapHref}
          aria="View Bangsar studio location"
        />
      </address>

      {/* Singapore */}
      <address className="not-italic space-y-3 text-[var(--foreground)] border-t border-[var(--border-color)] pt-12 md:border-t-0 md:pt-0 md:pl-12 lg:pl-20">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--secondary)]/80 mb-4">
          Singapore
        </p>
        <div className="space-y-1 text-base leading-relaxed">
          <p>18 Sin Ming Lane</p>
          <p>#08-06 Midview City</p>
          <p>573960 Singapore</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 text-sm">
          <a
            href="tel:+6566594900"
            className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-200 sm:whitespace-nowrap"
          >
            +65 6659 4900
          </a>
          <a
            href="mailto:shawn@nextrendy.com"
            className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-200 sm:whitespace-nowrap"
          >
            shawn@nextrendy.com
          </a>
        </div>

        <MapLink
          href={singaporeMapHref}
          aria="View Singapore studio location"
        />
      </address>
    </div>
  </div>
</section>


        {/* ROW 3: Authorised Partners - Full Width */}
        <section className="mt-16 lg:mt-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10.5px] uppercase tracking-[0.24em] text-[var(--secondary)]/95 font-medium">
                Authorised partners
              </span>
            </div>
            
            {/* Premium horizontal logo row on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:flex lg:flex-nowrap lg:items-center lg:gap-8 xl:gap-10 max-w-7xl mx-auto">
              {partners.map((partner) => (
                <Link
                  key={partner.href}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.label.replace(/&#64;/g, '@')} (opens in new tab)`}
              className="group relative flex items-center justify-center flex-1 min-w-0 p-3 sm:p-4 lg:p-5 h-16 sm:h-20 lg:h-24 xl:h-28 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:scale-[1.03] hover:bg-white/8 hover:border-[var(--accent)]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50" 
                >
                  {/* Logo container */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      width={200}
                      height={100}
                      className="w-full h-full max-w-[100px] max-h-[40px] sm:max-w-[120px] sm:max-h-[50px] lg:max-w-[140px] lg:max-h-[60px] xl:max-w-[160px] xl:max-h-[70px] object-contain transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                      priority={false}
                      loading="lazy"
                      unoptimized={false}
                    />
                    
        
                  </div>

                  {/* Premium tooltip with brand highlight */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 bg-[var(--surface)]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-[var(--accent)]/30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 whitespace-nowrap">
                    <div className="text-center space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]" dangerouslySetInnerHTML={{ __html: partner.label }} />
                      <div className="text-[8px] uppercase tracking-[0.2em] text-[var(--secondary)]/70 font-medium">
                        Authorized Partner
                      </div>
                    </div>
                    {/* Enhanced tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[var(--surface)]/95"></div>
                  </div>

                  {/* Active state overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-[var(--accent)]/0 group-active:bg-[var(--accent)]/10 transition-all duration-200"></div>
                </Link>
              ))}
            </div>
            
      
          </div>
        </section>

        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

        <div className="mt-8 flex flex-col gap-3 text-[11px] uppercase tracking-[0.16em] text-[var(--secondary)] md:flex-row md:flex-wrap md:items-center md:justify-between md:tracking-[0.2em]">
          <span className="text-[var(--foreground)]/85">
            &copy; {year} Nextrend Systems
          </span>
          <span>Architectural Sound &amp; Integrated Living Solutions</span>

          {/* Official Company Registration link with luxe hover */}
          <Link
            href={regReportHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official company registration (opens in new tab)"
            className="
              group inline-flex items-center gap-2 text-[var(--secondary)]
              transition ease-[cubic-bezier(.22,.61,.36,1)]
              hover:text-[var(--accent)]
              focus:outline-none focus-visible:text-[var(--accent)]
              focus-visible:ring-2 focus-visible:ring-[rgba(182,138,74,0.45)]
              focus-visible:rounded
            "
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]/70" />
            <span className="relative uppercase tracking-[0.22em] text-[10px]">
              Official Company Registration
              <span className="absolute left-0 -bottom-[0.2rem] h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
            </span>
            <span className="opacity-0 translate-x-[-2px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--accent)]">
              {'->'}
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
