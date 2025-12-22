import Link from "next/link";
import { m } from "framer-motion";

type ProductLink = {
  slug: string;
  name: string;
  displayName?: string;

  // only Bearbricks will pass this (collection name)
  subtitle?: string;
};

type ProductNavButtonsProps = {
  prev?: ProductLink;
  next?: ProductLink;
  resolveHref: (link: ProductLink) => string;
};

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.15,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProductNavButtons({
  prev,
  next,
  resolveHref,
}: ProductNavButtonsProps) {
  // product names (fallback for non-bearbricks)
  const prevName = (prev?.displayName || prev?.name || "").trim();
  const nextName = (next?.displayName || next?.name || "").trim();

  // collection (bearbricks only)
  const prevCollection = (prev?.subtitle || "").trim();
  const nextCollection = (next?.subtitle || "").trim();

  // ✅ BIG LINE should be collection if available, else product name
  const prevTitle = prevCollection || prevName;
  const nextTitle = nextCollection || nextName;

  // ✅ SMALL LINE should be product name only when collection exists
  const prevSmall = prevCollection ? prevName : "";
  const nextSmall = nextCollection ? nextName : "";

  return (
    <m.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="relative mt-16 sm:mt-20 lg:mt-24"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      <div className="pt-12 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Previous */}
          <m.div variants={buttonVariants} className="relative group">
            {prev ? (
              <Link
                href={resolveHref(prev)}
                className="block"
                aria-label={`Previous: ${prevTitle}`}
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C4A777]/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative px-0 py-8 lg:py-10 pl-6 lg:pl-8">
                    <div className="mb-4 flex items-center gap-3">
                      <m.div
                        className="w-8 h-px bg-[#C4A777]/40 origin-left"
                        whileHover={{ scaleX: 1.5, backgroundColor: "#C4A777" }}
                        transition={{
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                      <m.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#C4A777]/60 group-hover:text-[#C4A777] transition-colors duration-500"
                        whileHover={{ x: -3 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </m.svg>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#C4A777]/70 leading-tight">
                        Previous
                      </p>

                      <div className="space-y-1">
                        {/* ✅ BIG: collection (or name fallback) */}
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-light leading-[1.2] text-black/90 group-hover:text-[#C4A777] transition-colors duration-500">
                          {prevTitle}
                        </h3>

                        {/* ✅ SMALL: product name */}
                        {prevSmall ? (
                          <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-black/45">
                            {prevSmall}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-6 lg:left-8 right-0 h-px bg-gradient-to-r from-[#C4A777]/30 via-transparent to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="h-32 opacity-20" />
            )}
          </m.div>

          {/* Next */}
          <m.div variants={buttonVariants} className="relative group">
            {next ? (
              <Link
                href={resolveHref(next)}
                className="block"
                aria-label={`Next: ${nextTitle}`}
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-l from-[#C4A777]/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative px-0 py-8 lg:py-10 pr-6 lg:pr-8 text-right">
                    <div className="mb-4 flex items-center justify-end gap-3">
                      <m.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#C4A777]/60 group-hover:text-[#C4A777] transition-colors duration-500"
                        whileHover={{ x: 3 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </m.svg>
                      <m.div
                        className="w-8 h-px bg-[#C4A777]/40 origin-right"
                        whileHover={{ scaleX: 1.5, backgroundColor: "#C4A777" }}
                        transition={{
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#C4A777]/70 leading-tight">
                        Next
                      </p>

                      <div className="space-y-1">
                        {/* ✅ BIG: collection (or name fallback) */}
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-light leading-[1.2] text-black/90 group-hover:text-[#C4A777] transition-colors duration-500">
                          {nextTitle}
                        </h3>

                        {/* ✅ SMALL: product name */}
                        {nextSmall ? (
                          <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-black/45">
                            {nextSmall}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-6 lg:right-8 h-px bg-gradient-to-l from-[#C4A777]/30 via-transparent to-transparent scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-700" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="h-32 opacity-20" />
            )}
          </m.div>
        </div>
      </div>
    </m.section>
  );
}
