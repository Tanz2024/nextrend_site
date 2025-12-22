import Image from "next/image";
import type { Metadata } from "next";
import {
  TOP_SEARCH_TERMS,
  findTopSearchTerm,
  type TopSearchTerm,
} from "./topSearchTerms";
import {
  findCategorySuggestion,
  type CategorySuggestion,
  type SpeakerRef,
} from "./searchCategories";
import { SearchAnalytics, TrackedSearchLink } from "./SearchAnalytics";
import { SuggestionHighlights } from "./SuggestionHighlights";
import {
  PROJECT_BY_SLUG,
  PROJECT_LIST,
  PROJECT_DETAIL_DATA,
  type ProjectDetail,
} from "@/app/projects/project-data";
import { aminaProducts } from "@/app/products/amina/data";
import { kgearProducts } from "@/app/products/k-gear/data";
import { allFrogisProducts as frogisProducts } from "@/app/products/frogis/data/index";
import { trinnovProducts } from "@/app/products/trinnov/data";
import { brionvegaProducts } from "@/app/products/brionvega/data";
import { bearbrickProducts } from "@/app/products/bearbricks/data";
import {
  speakersProducts,
  systemsProducts,
} from "@/app/products/k-array/data";
import { getProjectSiteImage } from "@/app/projects/project-site-image";

const allKeywords = Array.from(
  new Set(TOP_SEARCH_TERMS.flatMap((term) => term.keywords)),
);


type ResolvedProduct = {
  name: string;
  image: string;
  href: string;
  brandLabel: string;
  description?: string;
};

const combineKArrayProducts = [
  ...speakersProducts,
  ...systemsProducts,
] as const;

const PRODUCT_POOLS: Record<
  string,
  {
    label: string;
    href: string;
    products: {
      slug: string;
      name: string;
      headline: string;
      image: string;
    }[];
  }
> = {
  "/products/amina": {
    label: "Amina",
    href: "/products/amina",
    products: aminaProducts,
  },
  "/products/k-gear": {
    label: "K Gear",
    href: "/products/k-gear",
    products: kgearProducts,
  },
  "/products/k-array": {
    label: "K-array",
    href: "/products/k-array",
    products: combineKArrayProducts,
  },
  "/products/frogis": {
    label: "Frog-is",
    href: "/products/frogis",
    products: frogisProducts,
  },
  "/products/trinnov": {
    label: "Trinnov",
    href: "/products/trinnov",
    products: trinnovProducts,
  },
  "/products/brionvega": {
    label: "Brionvega",
    href: "/products/brionvega",
    products: brionvegaProducts,
  },
  "/products/bearbricks": {
    label: "BE@RBRICK",
    href: "/products/bearbricks",
    products: bearbrickProducts,
  },
};

const mapProductToResolved = (
  pool: (typeof PRODUCT_POOLS)[keyof typeof PRODUCT_POOLS],
  product: { slug: string; name: string; headline: string; image: string },
): ResolvedProduct => ({
  name: product.name,
  image: product.image,
  href: `${pool.href}/${product.slug}`,
  brandLabel: pool.label,
  description: product.headline,
});

const getProductSamples = (termHref: string, limit = 3) => {
  const pool = PRODUCT_POOLS[termHref];
  if (!pool) return [];
  return pool.products.slice(0, limit).map((product) =>
    mapProductToResolved(pool, product),
  );
};

const getRandomTermSuggestions = (limit = 3) => {
  const shuffled = [...TOP_SEARCH_TERMS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
};

const resolveSpeaker = (ref: SpeakerRef): ResolvedProduct | null => {
  if (ref.brand === "k-array") {
    const product =
      speakersProducts.find((item) => item.slug === ref.slug) ??
      systemsProducts.find((item) => item.slug === ref.slug);
    if (!product) return null;
    return {
      name: product.name,
      image: product.image,
      href: `/products/k-array/${product.slug}`,
      brandLabel: "K-array",
      description: product.headline,
    };
  }

  if (ref.brand === "k-gear") {
    const product = kgearProducts.find((item) => item.slug === ref.slug);
    if (!product) return null;
    return {
      name: product.name,
      image: product.image,
      href: `/products/k-gear/${product.slug}`,
      brandLabel: "K Gear",
      description: product.headline,
    };
  }

  if (ref.brand === "brionvega") {
    const product = brionvegaProducts.find((item) => item.slug === ref.slug);
    if (!product) return null;
    return {
      name: product.name,
      image: product.image,
      href: `/products/brionvega/${product.slug}`,
      brandLabel: "Brionvega",
      description: product.headline,
    };
  }

  const amina = aminaProducts.find((item) => item.slug === ref.slug);
  if (amina) {
    return {
      name: amina.name,
      image: amina.image,
      href: `/products/amina/${amina.slug}`,
      brandLabel: "Amina",
      description: amina.headline,
    };
  }

  return null;
};
const normalizeSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// somewhere near the top of this file:
const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");


const getProjectHeroImage = (project: ProjectDetail) => {
  // Use centralized image mapping for consistency with ProjectsContent.tsx
  return getProjectSiteImage(project.slug, project.title) ?? "";
};

const getProjectSummary = (project: ProjectDetail) => {
  const detail = PROJECT_DETAIL_DATA[project.slug];
  return detail?.description ?? project.summary ?? "";
};

const HIGHLIGHT_BRAND_GROUPS: Record<string, string[]> = {
  "/products/amina": [
    "Wall / invisible speakers",
    "Home theater & cinema sound",
    "Hospitality, club & event sound",
  ],
  "/products/k-gear": [
    "Shop & café speakers",
    "Hospitality, club & event sound",
    "Home theater & cinema sound",
  ],
  "/products/k-array": [
    "Hospitality, club & event sound",
    "Outdoor & garden speakers",
    "Home theater & cinema sound",
  ],
  "/products/frogis": [
    "Outdoor & garden speakers",
    "Hospitality, club & event sound",
    "Shop & café speakers",
  ],
  "/products/trinnov": [
    "Home theater & cinema sound",
    "Vintage design radios",
    "Wall / invisible speakers",
  ],
  "/products/brionvega": [
    "Vintage design radios",
    "Art & collectible speakers",
    "Wall / invisible speakers",
  ],
  "/products/bearbricks": [
    "Art & collectible speakers",
    "Vintage design radios",
    "Hospitality, club & event sound",
  ],
};

const HIGHLIGHT_CATEGORY_GROUPS: Record<string, string[]> = {
  hotel: ["Hospitality, club & event sound", "Shop & café speakers"],
  club: ["Hospitality, club & event sound", "Outdoor & garden speakers"],
  restaurant: ["Shop & café speakers", "Hospitality, club & event sound"],
  sport: ["Hospitality, club & event sound", "Outdoor & garden speakers"],
  event: ["Hospitality, club & event sound", "Home theater & cinema sound"],
  residence: ["Home theater & cinema sound", "Wall / invisible speakers"],
  retail: [
    "Shop & café speakers",
    "Hospitality, club & event sound",
    "Wall / invisible speakers",
  ],
  cafe: ["Shop & café speakers", "Hospitality, club & event sound"],
  theatre: ["Home theater & cinema sound", "Hospitality, club & event sound"],
  karaoke: ["Hospitality, club & event sound", "Shop & café speakers"],
  hifi: [
    "Home theater & cinema sound",
    "Vintage design radios",
    "Art & collectible speakers",
  ],
};

const FALLBACK_HIGHLIGHT_QUERIES = [
  "Hospitality, club & event sound",
  "Shop & café speakers",
  "Wall / invisible speakers",
  "Outdoor & garden speakers",
  "Home theater & cinema sound",
  "Vintage design radios",
];

const shuffleArray = <T,>(items: T[]) => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
};

const normalizeSearchInput = (value?: string | null) =>
  value?.trim().toLowerCase() || "";

const findTermByQuery = (query: string) =>
  TOP_SEARCH_TERMS.find(
    (term) => term.query.toLowerCase() === query.toLowerCase(),
  );

const computeSuggestionScore = (
  term: TopSearchTerm,
  normalizedQuery: string,
) => {
  if (!normalizedQuery) return 0;
  const lowercaseQuery = term.query.toLowerCase();
  let score = 0;

  if (lowercaseQuery === normalizedQuery) return 100;
  if (lowercaseQuery.includes(normalizedQuery)) score += 30;
  if (normalizedQuery.includes(lowercaseQuery)) score += 15;
  if (
    term.aliases?.some((alias) =>
      alias.toLowerCase().includes(normalizedQuery),
    )
  ) {
    score += 12;
  }
  if (
    term.keywords.some(
      (keyword) => keyword.toLowerCase() === normalizedQuery,
    )
  ) {
    score += 18;
  }
  if (
    term.keywords.some((keyword) =>
      keyword.toLowerCase().includes(normalizedQuery),
    )
  ) {
    score += 9;
  }
  if (
    term.keywords.some((keyword) =>
      normalizedQuery.includes(keyword.toLowerCase()),
    )
  ) {
    score += 4;
  }

  return score;
};

const getSuggestionTerms = (
  query: string,
  matchedTerm?: TopSearchTerm,
  categorySuggestion?: CategorySuggestion,
  limit = 3,
) => {
  const normalized = normalizeSearchInput(query);
  const added = new Map<string, TopSearchTerm>();

  const addTerm = (term?: TopSearchTerm) => {
    if (term && !added.has(term.query)) {
      added.set(term.query, term);
    }
  };

  const addQueries = (queries: string[]) => {
    queries.forEach((label) => addTerm(findTermByQuery(label)));
  };

  addTerm(matchedTerm);
  addQueries(HIGHLIGHT_BRAND_GROUPS[matchedTerm?.href ?? ""] ?? []);

  if (!matchedTerm) {
    addQueries(HIGHLIGHT_CATEGORY_GROUPS[categorySuggestion?.id ?? ""] ?? []);
  }

  if (normalized) {
    const scored = TOP_SEARCH_TERMS.map((term) => ({
      term,
      score: computeSuggestionScore(term, normalized),
    }));

    scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .forEach((item) => addTerm(item.term));
  }

  const suggestions = Array.from(added.values());
  const filtered = suggestions.filter(
    (term) => term.query.toLowerCase() !== normalized,
  );

  const finalList = [...filtered];
  const fallbackPool = FALLBACK_HIGHLIGHT_QUERIES.slice();
  while (finalList.length < limit && fallbackPool.length > 0) {
    const label = fallbackPool.shift()!;
    const term = findTermByQuery(label);
    if (term && !finalList.some((item) => item.query === term.query)) {
      finalList.push(term);
    }
  }

  shuffleArray(finalList);
  return finalList.slice(0, limit);
};

export const metadata: Metadata = {
  title: "Search | Nextrend Systems",
  description:
    "Search Nextrend Systems for hospitality audio, architectural speakers, invisible installs, and curated project inspiration.",
  keywords: allKeywords.join(", "),
};

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const query = params?.q?.trim() ?? "";
  const hasQuery = Boolean(query);
  const normalizedQuery = query.toLowerCase();

  const matchedTerm = hasQuery ? findTopSearchTerm(query) : undefined;

  const categorySuggestion =
    hasQuery && normalizedQuery && !matchedTerm?.onlyProducts
      ? findCategorySuggestion(normalizedQuery)
      : undefined;

  const projectSuggestions = categorySuggestion
    ? (categorySuggestion.projects
        .map(
          (slug) =>
            PROJECT_BY_SLUG[slug] ??
            PROJECT_LIST.find((project) => project.slug === slug),
        )
        .filter(Boolean) as ProjectDetail[])
    : [];

  const speakerSuggestions = categorySuggestion
    ? (categorySuggestion.speakers
        .map(resolveSpeaker)
        .filter(Boolean) as ResolvedProduct[])
    : [];

  const matchedTermProducts = matchedTerm
    ? getProductSamples(matchedTerm.href)
    : [];

  const showProductOnly =
    Boolean(matchedTerm) &&
    (matchedTerm.onlyProducts || !categorySuggestion || projectSuggestions.length === 0);

  const hasCategoryResults =
    Boolean(categorySuggestion) &&
    (projectSuggestions.length > 0 || speakerSuggestions.length > 0);

  const hasProductResults = showProductOnly && matchedTermProducts.length > 0;
  const hasResults = hasCategoryResults || hasProductResults;

  const fallbackTermSuggestions =
    hasQuery && !hasResults ? getRandomTermSuggestions() : [];

  const highlightTerms = matchedTerm?.onlyProducts
    ? [matchedTerm]
    : getSuggestionTerms(
        query,
        matchedTerm,
        categorySuggestion,
      );

  // quick-nav (kept for future use)
  const toSearchHref = (value: string) =>
    `/search?q=${encodeURIComponent(value)}`;
  const keywordLookup = new Map<string, { label: string; href: string }>();
  TOP_SEARCH_TERMS.forEach((term) => {
    term.keywords.forEach((keyword) => {
      const norm = keyword.toLowerCase();
      if (!keywordLookup.has(norm)) {
        keywordLookup.set(norm, {
          label: keyword,
          href: toSearchHref(keyword),
        });
      }
    });
  });
  const keywordLinks = Array.from(keywordLookup.values());
  void keywordLinks;

  return (
    <main className="mx-auto max-w-[1200px] space-y-12 px-4 py-16 text-[var(--foreground)]">
      <SearchAnalytics query={query} hasResults={hasResults} />
      {/* category results: projects + recommended products */}
      {categorySuggestion && (
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-[2rem] font-semibold leading-tight">
              {categorySuggestion.label}
            </h2>
            <p className="text-[0.95rem] text-[var(--secondary)]">
              {categorySuggestion.description}
            </p>
          </div>

          {/* PROJECTS */}
               {/* PROJECTS – hero image + Wedge-style caption */}
          {projectSuggestions.length ? (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--secondary)]">
                Projects that fit this vibe
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {projectSuggestions.map((project, index) => {
                  const hero = getProjectHeroImage(project);
                  const locationLine =
                    project.location ||
                    PROJECT_DETAIL_DATA[project.slug]?.location ||
                    project.context;

                  const completion =
                    project.completion ||
                    PROJECT_DETAIL_DATA[project.slug]?.completion;

                  return (
                    <article
                      key={project.slug}
                      className="group/card relative flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.08)] sm:shadow-[0_20px_60px_rgba(26,26,26,0.10)] lg:shadow-[0_26px_80px_rgba(26,26,26,0.12)] transition-shadow duration-500 hover:shadow-[0_26px_80px_rgba(26,26,26,0.16)]"
                    >
                      {/* Hero image keeps your existing look */}
                      <TrackedSearchLink
                        href={`/projects/${project.slug}`}
                        query={query}
                        label={project.title}
                        kind="project"
                        className="relative block w-full overflow-hidden bg-[#f4f3f0] aspect-[16/9]"
                      >
                        {hero ? (
                          <Image
                            src={hero}
                            alt={project.title}
                            fill
                            sizes="(min-width:1280px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover/card:scale-105 group-active/card:scale-95"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#f6f2e9] to-[#d4c5af]" />
                        )}
                      </TrackedSearchLink>

                      {/* Wedge-style caption with category + location + completed + arrow */}
                      <div className="grid grid-cols-[1fr_auto] items-center gap-5 px-6 py-4 sm:px-7 sm:py-5 bg-[#F6F2E8]">
                        <div className="min-w-0 space-y-1.5">
                          {/* Category / context */}
                          {project.context && (
                            <p className="text-[10px] uppercase tracking-[0.32em] text-[rgba(0,0,0,0.55)]">
                              {project.context}
                            </p>
                          )}

                          {/* Title */}
                          <h3 className="truncate text-[1.15rem] font-semibold leading-snug text-[#151515] sm:text-[1.25rem]">
                            <TrackedSearchLink
                              href={`/projects/${project.slug}`}
                              query={query}
                              label={project.title}
                              kind="project"
                              className="hover:opacity-90"
                            >
                              {project.title}
                            </TrackedSearchLink>
                          </h3>

                          {/* Location */}
                          {locationLine && (
                            <p className="text-[0.85rem] leading-tight text-[rgba(0,0,0,0.7)]">
                              {locationLine}
                            </p>
                          )}

                          {/* Completed line, champagne style */}
                          {completion && (
                            <p className="mt-1 flex items-center gap-2 text-[0.8rem] leading-tight">
                              <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#d9c299]" />
                              <span className="uppercase text-[0.7rem] font-semibold tracking-[0.22em] text-[#C4A777]">
                                Completed
                              </span>
                              <span className="text-[0.8rem] text-[rgba(0,0,0,0.7)]">
                                {completion}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Champagne arrow on the right, like Wedge Range */}
                        <TrackedSearchLink
                          href={`/projects/${project.slug}`}
                          query={query}
                          label={project.title}
                          kind="project"
                          aria-label={`View ${project.title}`}
                          className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C4A777] bg-white shadow-[0_12px_30px_rgba(196,167,119,0.28)] transition-all duration-300 group-hover/card:bg-[#C4A777] group-hover/card:shadow-[0_16px_42px_rgba(196,167,119,0.45)] group-hover/card:translate-x-[2px]"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="none"
                            className="transition-colors duration-300 text-[#C4A777] group-hover/card:text-white"
                          >
                            <path
                              d="M6 12h12"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                            />
                            <path
                              d="M14 8l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </TrackedSearchLink>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}


          {/* PRODUCTS */}
          {speakerSuggestions.length ? (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--secondary)]">
                Recommended products
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                {speakerSuggestions.map((speaker) => (
                  <article
                    key={speaker.href}
                    className="group/card relative flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.08)] sm:shadow-[0_20px_60px_rgba(26,26,26,0.10)] lg:shadow-[0_26px_80px_rgba(26,26,26,0.12)] transition-shadow duration-500"
                  >
                    <TrackedSearchLink
                      href={speaker.href}
                      query={query}
                      label={speaker.name}
                      kind="product"
                      className="group relative block w-full bg-white overflow-hidden aspect-[4/3] active:scale-[0.98] transition-transform"
                    >
                      <Image
                        src={speaker.image}
                        alt={speaker.name}
                        fill
                        sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                        className="object-contain object-top transition-transform duration-700 group-hover:scale-105 group-hover/card:scale-105 group-active/card:scale-95"
                      />
                    </TrackedSearchLink>

                    <div className="flex flex-1 flex-col px-5 sm:px-6 lg:px-7 pt-3 sm:pt-4 lg:pt-5 pb-14 text-left">
                      <div className="max-w-[22rem] space-y-2">
                        <p className="text-[10px] tracking-[0.28em] uppercase text-black/55">
                          {speaker.brandLabel}
                        </p>
                        <h3 className="text-[1.3rem] leading-[1.2] font-semibold text-[#1A1A1A]">
                          <TrackedSearchLink
                            href={speaker.href}
                            query={query}
                            label={speaker.name}
                            kind="product"
                            className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-[#1A1A1A] to-[#1A1A1A]/75 hover:opacity-80 transition"
                          >
                            {speaker.name}
                          </TrackedSearchLink>
                        </h3>
                        {speaker.description && (
                          <p className="text-[0.9rem] leading-[1.8] text-[rgba(26,26,26,0.68)]">
                            {speaker.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex">
                      <TrackedSearchLink
                        href={speaker.href}
                        query={query}
                        label={speaker.name}
                        kind="product"
                        aria-label={`View ${speaker.name}`}
                        className="group/cta relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C4A777] bg-white/95 shadow-[0_12px_30px_rgba(196,167,119,0.25)] transition-all duration-500 hover:bg-[#C4A777] hover:shadow-[0_16px_40px_rgba(196,167,119,0.45)] hover:scale-105 active:scale-95"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          className="text-[#C4A777] group-hover/cta:text-white transition-colors duration-300"
                        >
                          <path
                            d="M6 12h12"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M14 8l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </TrackedSearchLink>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* product-only mode */}
      {showProductOnly && matchedTerm && matchedTermProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-[2rem] font-semibold leading-tight">
            {matchedTerm.query}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {matchedTermProducts.map((product) => (
              <article
                key={product.href}
                className="group/card relative flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.08)] sm:shadow-[0_20px_60px_rgba(26,26,26,0.10)] lg:shadow-[0_26px_80px_rgba(26,26,26,0.12)] transition-shadow duration-500"
              >
                <TrackedSearchLink
                  href={product.href}
                  query={query}
                  label={product.name}
                  kind="product"
                  className="group relative block w-full bg-white overflow-hidden aspect-[4/3] active:scale-[0.98] transition-transform"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-contain object-top transition-transform duration-700 group-hover:scale-105 group-hover/card:scale-105 group-active/card:scale-95"
                  />
                </TrackedSearchLink>

                <div className="flex flex-1 flex-col px-5 sm:px-6 lg:px-7 pt-3 sm:pt-4 lg:pt-5 pb-14 text-left">
                  <div className="max-w-[22rem] space-y-2">
                    <p className="text-[10px] tracking-[0.28em] uppercase text-black/55">
                      {product.brandLabel}
                    </p>
                    <h3 className="text-[1.3rem] leading-[1.2] font-semibold text-[#1A1A1A]">
                      <TrackedSearchLink
                        href={product.href}
                        query={query}
                        label={product.name}
                        kind="product"
                        className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-[#1A1A1A] to-[#1A1A1A]/75 hover:opacity-80 transition"
                      >
                        {product.name}
                      </TrackedSearchLink>
                    </h3>
                    {product.description && (
                      <p className="text-[0.9rem] leading-[1.8] text-[rgba(26,26,26,0.68)]">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex">
                  <TrackedSearchLink
                    href={product.href}
                    query={query}
                    label={product.name}
                    kind="product"
                    aria-label={`View ${product.name}`}
                    className="group/cta relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C4A777] bg-white/95 shadow-[0_12px_30px_rgba(196,167,119,0.25)] transition-all duration-500 hover:bg-[#C4A777] hover:shadow-[0_16px_40px_rgba(196,167,119,0.45)] hover:scale-105 active:scale-95"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      className="text-[#C4A777] group-hover/cta:text-white transition-colors duration-300"
                    >
                      <path
                        d="M6 12h12"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M14 8l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </TrackedSearchLink>
                </div>
              </article>
            ))}
          </div>

          {/* premium CTA pill with arrow animation */}
          <div className="pt-4 text-center">
            <TrackedSearchLink
              href={matchedTerm.href}
              query={query}
              label={matchedTerm.query}
              kind="category"
              className="group inline-flex items-center justify-center"
            >
              <span
                className="
                  inline-flex items-center gap-2
                  rounded-full border border-[rgba(196,167,119,0.55)]
                  bg-white/90 px-6 py-2.5
                  text-[0.95rem] font-medium text-[var(--accent)]
                  shadow-[0_14px_36px_rgba(196,167,119,0.25)]
                  transition-all duration-300
                  hover:bg-[var(--accent)] hover:text-white
                  hover:shadow-[0_18px_48px_rgba(196,167,119,0.45)]
                  active:scale-95
                "
              >
                <span>Explore more {matchedTerm.query}</span>
                <span
                  className="
                    inline-block text-[0.9rem]
                    transition-transform duration-300
                    group-hover:translate-x-1.5
                  "
                >
                  →
                </span>
              </span>
            </TrackedSearchLink>
          </div>
        </section>
      )}

    {/* empty state */}
   {hasQuery && !hasResults && (
  <section className="space-y-5 pt-2">
    <div className="text-center space-y-2">
      <p className="text-[0.75rem] uppercase tracking-[0.6em] text-[var(--secondary)]">
        NO MATCH FOUND
      </p>

      <p className="text-[0.95rem] text-[var(--secondary)]">
        We couldn&apos;t find any results for{" "}
        <span className="font-semibold">&quot;{query}&quot;</span>.
      </p>

<p className="text-[0.9rem] text-[var(--secondary)]">
  We couldn&apos;t find an exact match this time. Try a simple word like{" "}
  <span className="font-semibold">club</span>,{" "}
  <span className="font-semibold">residence</span>, or{" "}
  <span className="font-semibold">home</span>, or use the top menu to browse.{" "}
  While you&apos;re here, we&apos;ve curated a few ideas below you might like
  to explore.
</p>

    </div>
  </section>
)}



      {hasQuery && highlightTerms.length > 0 && (
        <SuggestionHighlights terms={highlightTerms} resetKey={query} />
      )}
    </main>
  );
}
