// @ts-nocheck
import fs from "fs";
import path from "path";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildProjectSiteUrl, buildProjectImageUrl } from "@/lib/assets";
import RevealOnScroll from "./ui/RevealOnScroll";
import {
  PROJECT_BY_SLUG,
  PROJECT_DETAIL_DATA,
  PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS,
  PROJECT_DETAIL_DEFAULT_ROLE,
  PROJECT_LIST,
} from "../project-data";
import { getProjectSiteImage } from "../project-site-image";

// client lightbox (already a Client Component)
import GalleryLightbox from "./ui/GalleryLightbox";
import NarrativeGalleryItem from "./ui/NarrativeGalleryItem";

/* ------------------------------------------
   Server-only utils
------------------------------------------ */
import { Poppins, Cormorant_Garamond } from "next/font/google";
const narrativeSans = Poppins({
  subsets: ["latin"],
  weight: ["400"], 
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type ProjectPageParams = Promise<{ slug: string }>;
const splitParagraphs = (text: string) => {
  const t = (text ?? "").toString().replace(/\r\n/g, "\n").trim();
  if (!t) return [];
  // If user wrote real paragraphs, keep them; otherwise treat single newlines as paragraphs
  return (t.includes("\n\n") ? t.split(/\n{2,}/) : t.split(/\n+/))
    .map((p) => p.trim())
    .filter(Boolean);
};

const PROJECT_SITE_DIR = path.join(process.cwd(), "public", "project_site");
const PROJECT_SITE_IMAGE_DIR = path.join(process.cwd(), "public", "images", "project_sites");
// some projects use a different folder name for images in `public/images`
const PROJECT_SITE_IMAGE_DIR_ALT = path.join(process.cwd(), "public", "images", "project_images");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

const PROJECT_SCROLL_STATE_PREFIX = "nextrend-project-scroll";

let cachedMediaIndex: Array<{ slug: string; path: string; raw: string }> | null = null;

const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function buildProjectMediaIndex() {
  if (cachedMediaIndex) return cachedMediaIndex;
  const entries: Array<{ slug: string; path: string; raw: string }> = [];
  const seen = new Set<string>();

  const add = (slug: string, filePath: string, raw: string) => {
    if (!slug) return;
    const key = `${slug}|${filePath}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ slug, path: filePath, raw });
  };

  try {
    const dir = fs.readdirSync(PROJECT_SITE_DIR, { withFileTypes: true });
    for (const e of dir) {
      if (e.isFile() && IMAGE_EXTENSIONS.some((ext) => e.name.toLowerCase().endsWith(ext))) {
        const base = e.name.replace(/\.[^.]+$/, "");
        add(slugify(base), `/project_site/${e.name}`, base);
      } else if (e.isDirectory()) {
        const nested = path.join(PROJECT_SITE_DIR, e.name);
        try {
          const files = fs.readdirSync(nested, { withFileTypes: true });
          for (const f of files) {
            if (!f.isFile()) continue;
            if (!IMAGE_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext))) continue;
            const base = f.name.replace(/\.[^.]+$/, "");
            add(slugify(`${e.name} ${base}`), `/project_site/${e.name}/${f.name}`, `${e.name}/${base}`);
          }
        } catch {}
      }
    }
  } catch {}

  try {
    const pics = fs.readdirSync(PROJECT_SITE_IMAGE_DIR, { withFileTypes: true });
    for (const e of pics) {
      if (!e.isFile()) continue;
      if (!IMAGE_EXTENSIONS.some((ext) => e.name.toLowerCase().endsWith(ext))) continue;
      const base = e.name.replace(/\.[^.]+$/, "");
      const cleaned = base
        .replace(/[_-](projects?)$/i, "")
        .replace(/\b(projects?)\b/gi, "")
        .replace(/\(.*?\)/g, " ")
        .replace(/[_]+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
      add(slugify(cleaned || base), buildProjectSiteUrl(e.name), base);
    }
  } catch {}

  // Also check alternate folder 'project_images' (some assets live here)
  try {
    const pics2 = fs.readdirSync(PROJECT_SITE_IMAGE_DIR_ALT, { withFileTypes: true });
    for (const e of pics2) {
      if (!e.isFile()) continue;
      if (!IMAGE_EXTENSIONS.some((ext) => e.name.toLowerCase().endsWith(ext))) continue;
      const base = e.name.replace(/\.[^.]+$/, "");
      const cleaned = base
        .replace(/[_-](projects?)$/i, "")
        .replace(/\b(projects?)\b/gi, "")
        .replace(/\(.*?\)/g, " ")
        .replace(/[_]+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
      add(slugify(cleaned || base), buildProjectImageUrl(e.name), base);
    }
  } catch {}

  cachedMediaIndex = entries;
  return cachedMediaIndex;
}

function resolveHeroImage(slug: string, title: string, preferred?: string | null) {
  if (preferred && preferred.trim()) return preferred;
  const index = buildProjectMediaIndex();
  if (!index.length) return null;

  const canonical = slugify(title);
  const s = slug,
    sBare = s.replace(/-/g, ""),
    cBare = canonical.replace(/-/g, "");

  const direct = index.find((x) => x.slug === s) ?? index.find((x) => x.slug === canonical);
  if (direct) return direct.path;

  const cands = index.filter((x) => {
    const eBare = x.slug.replace(/-/g, "");
    return (
      x.slug.includes(s) ||
      s.includes(x.slug) ||
      x.slug.includes(canonical) ||
      canonical.includes(x.slug) ||
      eBare.includes(sBare) ||
      sBare.includes(eBare) ||
      eBare.includes(cBare)
    );
  });

  if (!cands.length) return null;
  cands.sort((a, b) => {
    const da = Math.abs(a.slug.length - s.length);
    const db = Math.abs(b.slug.length - s.length);
    return da !== db ? da - db : a.slug.length - b.slug.length;
  });
  return cands[0]?.path ?? null;
}

function ProjectScrollRestoration({ slug }: { slug: string }) {
  const key = `${PROJECT_SCROLL_STATE_PREFIX}:${slug}`;
  const script = `(function(){var key=${JSON.stringify(key)};function restore(){try{var stored=sessionStorage.getItem(key);if(!stored)return;var value=parseInt(stored,10);if(!isNaN(value)){window.scrollTo(0,value);}sessionStorage.removeItem(key);}catch(e){}}restore();window.addEventListener("beforeunload",function(){try{sessionStorage.setItem(key,String(Math.round(window.scrollY||0)));}catch(e){}});})();`;
  return (
    <Script
      id={`project-scroll-restoration-${slug}`}
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}

/* helpers */
function deriveLocation(meta: any, project?: any): string {
  if (project?.location?.trim()) return project.location.trim();
  const loc = meta?.location?.trim?.() ?? "";
  if (loc) return loc;
  const ctx = (project?.context ?? meta?.context ?? "").toString();
  const parts = ctx.split("·");
  return parts.length > 1 ? parts[parts.length - 1].trim() : "";
}

/* ------------------------------------------
   Static params + metadata
------------------------------------------ */
export function generateStaticParams() {
  return PROJECT_LIST.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: ProjectPageParams }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECT_BY_SLUG[slug];
  if (!project) {
    return {
      title: "Project Not Found | Nextrend Systems",
      description: "The requested installation profile is not available.",
    };
  }
  const detail = PROJECT_DETAIL_DATA[slug];
  const narrative =
    (detail?.description && detail.description.trim()) ? detail.description.trim() : (project.summary || "");
  const loc = deriveLocation(detail, project);
  const alternativeTitle = `${project.title} AV install | Nextrend Systems`;
  const heroImageMeta = resolveHeroImage(slug, project.title, detail.heroImage) ?? null;
  const keyProductList =
    Array.isArray(detail.keyProducts) && detail.keyProducts.length
      ? detail.keyProducts.map((p) => p.toString().trim()).filter(Boolean)
      : [];

  const normalizedLocation = (loc || project.location || "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const featuredKeywordPhrases = [
    "wall speakers",
    "invisible speakers",
    "shop speakers",
    "cafe sound system",
    "display audio",
    "hospital dining audio",
    "outdoor speakers",
    "garden speakers",
    "home theater sound",
    "cinema sound",
  ];

  const keywordPool = [
    "AV installation",
    "luxury restaurant audio",
    "premium cafe sound system",
    "Southeast Asia AV",
    "hospitality audio design",
    ...featuredKeywordPhrases,
    project.vertical,
    detail.application,
    ...normalizedLocation,
    ...keyProductList,
  ]
    .filter(Boolean)
    .map((keyword) => keyword.replace(/\s+/g, " ").trim());

  const keywords = Array.from(new Set(keywordPool)).slice(0, 30);
  return {
    title: `${project.title} | Nextrend Systems`,
    description: loc ? `${narrative} (${loc})` : narrative,
    keywords,
    openGraph: {
      title: alternativeTitle,
      description: loc ? `${narrative} (${loc})` : narrative,
      type: "article",
      images: heroImageMeta
        ? [
            {
              url: heroImageMeta,
              alt: `${project.title} hero preview`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: alternativeTitle,
      description: loc ? `${narrative} (${loc})` : narrative,
      images: heroImageMeta ? [heroImageMeta] : undefined,
    },
  };
}

/* ------------------------------------------
   Page
------------------------------------------ */
export default async function ProjectDetailPage({ params }: { params: ProjectPageParams }) {
  const { slug } = await params;
  const project = PROJECT_BY_SLUG[slug];
  if (!project) notFound();

  const { title, vertical } = project;

  const detail =
    PROJECT_DETAIL_DATA[slug] ?? {
      description: project.summary,
      context: project.context ?? "",
      location: "",
      application: vertical ?? "",
      role: PROJECT_DETAIL_DEFAULT_ROLE,
      keyProducts: [...PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS],
    };

  // HERO
  const contextStr = (detail.context ?? project.context ?? "").toString().trim();
  const explicitLocation = (detail.location ?? "").toString().replace(/^\s*Project Location:\s*/i, "").trim();
  const location = explicitLocation || deriveLocation(detail, project);
const locParts = (location || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const locationShort = locParts.slice(-2).join(", ");

  // BODY
  const profile = (detail.profile ?? "").toString().trim();
  const description = (detail.description ?? "").toString().trim();
  const summary = (project.summary ?? "").toString().trim();
  const descNarrative = profile || description || summary;
  const useProfileInDescription = Boolean(profile);

  const application = (detail.application ?? vertical ?? "").toString().trim();

  const roleLabel =
    typeof detail.role === "string" && detail.role.trim()
      ? detail.role
      : Array.isArray(detail.role) && detail.role.length
      ? "Consultation & delivery"
      : PROJECT_DETAIL_DEFAULT_ROLE;

  const scope = Array.isArray(detail.scope) ? detail.scope.filter(Boolean) : [];
  const focus = Array.isArray(detail.focus) ? detail.focus.filter(Boolean) : [];

  const completion = (detail.completion ?? detail.completionTime ?? "").toString().trim();
  const completionLabel = completion || "Timelines available on request";

  const products =
    Array.isArray(detail.keyProducts) && detail.keyProducts.length
      ? detail.keyProducts
      : [...PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS];

  const systemEntries = detail.system
    ? Object.entries(detail.system).filter(
        ([, items]) => Array.isArray(items) && items.some((i) => typeof i === "string" && i.trim())
      )
    : [];

  const heroImage =
    resolveHeroImage(slug, title, detail.heroImage) ??
    getProjectSiteImage(slug, title);
  const galleryContext = (detail.context ?? project.context ?? vertical ?? "")
    .toString()
    .trim();
const baseGalleryLabel =
  galleryContext || detail.application || vertical || "Installation Highlight";


  // Auto-discover gallery images if not manually defined
  function discoverGalleryImages(projectSlug: string, projectTitle: string): Array<{src: string, description: string}> {
    const index = buildProjectMediaIndex();
    const canonical = slugify(projectTitle);
    const searchTerms = [projectSlug, canonical];
    
    // Find all images that match this project
    const matches = index.filter((entry) => {
      const entrySlugBare = entry.slug.replace(/-/g, "");
      const projectSlugBare = projectSlug.replace(/-/g, "");
      const canonicalBare = canonical.replace(/-/g, "");
      
      return searchTerms.some(term => 
        entry.slug === term ||
        entry.slug.startsWith(term + "-") ||
        entry.slug.includes(term) ||
        entrySlugBare.includes(projectSlugBare) ||
        entrySlugBare.includes(canonicalBare)
      );
    });
    
    // Filter out the hero image and return unique gallery images
    const heroImagePath = heroImage;
    return matches.map((entry, index) => ({
      src: entry.path,
      description: `${projectTitle} - Gallery Image ${index + 1}`
    }));
  }

   const rawGallery = Array.isArray(detail.gallery) ? detail.gallery : [];
  const autoDiscoveredGallery = rawGallery.length === 0 ? discoverGalleryImages(slug, title) : [];

  const highlightFallbackSources = [
    detail.galleryHighlightImage,
    detail.galleryHighlightSecondaryImage,
  ].filter(Boolean) as string[];


const heroGalleryEntry = heroImage
    ? [
        {
          src: heroImage,
          description: "",
        },
      ]
    : [];

  const galleryCandidates =
    heroGalleryEntry.length > 0 ||
    highlightFallbackSources.length > 0 ||
    autoDiscoveredGallery.length > 0 ||
    rawGallery.length > 0
      ? [
          ...heroGalleryEntry,
          ...highlightFallbackSources.map((src) => ({ src })),
          ...autoDiscoveredGallery,
          ...rawGallery,
        ]
      : [];

  const gallery =
    galleryCandidates.length > 0
      ? Array.from(
          new Map(
            galleryCandidates.map((item: any) => {
              const src = typeof item === "string" ? item : item.src;
              const description =
                typeof item === "string" ? "" : item.description ?? "";
              return [src, { src, description }];
            })
          ).values()
        )
      : [];


// use first gallery image as default highlight if none is set
const primaryGallerySrc = gallery[0]?.src ?? null;

const heroGallerySrc = heroImage ?? null;

const highlightCandidateGallery =
  heroGallerySrc && heroGallerySrc.length
    ? gallery.filter((item) => item.src !== heroGallerySrc)
    : gallery;
const highlightSourceList =
  highlightCandidateGallery.length > 0 ? highlightCandidateGallery : gallery;

const highlightPrimarySrc = highlightSourceList[0]?.src ?? gallery[0]?.src ?? null;

const galleryHighlightImage =
  detail.galleryHighlightImage ?? highlightPrimarySrc;

// find the actual gallery item we are highlighting
const primaryGalleryItem =
  gallery.find((item) => item.src === galleryHighlightImage) ??
  highlightSourceList[0] ??
  gallery[0] ??
  null;

// auto style based on orientation when style is "auto" or not set
const inferredStyle =
  primaryGalleryItem && (primaryGalleryItem as any).orientation === "portrait"
    ? "plain"
    : "atelier";

const galleryHighlightStyle =
  !detail.galleryHighlightStyle || detail.galleryHighlightStyle === "auto"
    ? inferredStyle
    : detail.galleryHighlightStyle;

const galleryHighlightIsPlain = galleryHighlightStyle === "plain";

const galleryHasMultipleImages = gallery.length > 1;



const narrativeExcerpt =
  descNarrative
    .split(/\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? "";

const computedGalleryHighlightDescription =
  detail.galleryHighlightDescription ||
  [galleryContext, narrativeExcerpt]
    .filter(Boolean)
    .join(" — ") ||
  focus[0] ||
  summary ||
  "";

const galleryHighlightDescription =
  galleryHasMultipleImages ? computedGalleryHighlightDescription : "";

const galleryHighlightCaption =
  detail.galleryHighlightCaption ??
  (detail.location
    ? `Photo: ${detail.location}`
    : detail.application
    ? `Photo: ${detail.application}`
    : `Photo: ${project.title}`);

const highlightBlocksPlain =
  galleryHighlightIsPlain
    ? (highlightSourceList
        .map((item: any) => {
          const isPrimary = item.src === galleryHighlightImage;
          const description =
            (isPrimary && galleryHighlightDescription) ||
            item.description ||
            "";

          if (!description) return null;

          return {
            src: item.src,
            description,
            label: item.label || undefined, // per-image label if present
          };
        })
        .filter(Boolean) as { src: string; description: string; label?: string }[])
    : [];

  const website = detail.website?.trim() ? detail.website.trim() : null;
  const notes = detail.notes?.trim() ? detail.notes.trim() : null;

  const detailItems = [
    { label: "Project Location", value: location || "Details available on request" },
    { label: "Application", value: application || vertical || "—" },
    { label: "Role", value: roleLabel },
    { label: "Completion", value: completionLabel },
  ];

  const heroTags = [vertical].filter(Boolean);

  const relatedShowcase = PROJECT_LIST
    .filter((p) => p.slug !== slug && p.vertical === vertical)
    .slice(0, 3)
    .map((item) => {
const meta = PROJECT_DETAIL_DATA[item.slug];

// Force "project_sites" thumbnails (same style as buildProjectSiteUrl via getProjectSiteImage)
const image = getProjectSiteImage(item.slug, item.title);

return {
  ...item,
  image,
  summary: meta?.description ?? item.summary,
  tag: item.vertical,
};
    });

  // Panels
  const detailPanels = [
    notes && {
      label: "Commission Insight",
     content: (
<div className={`${narrativeSans.className} space-y-7 sm:space-y-8 text-[1rem] leading-[1.85] text-[#3f382f]`}>
  {splitParagraphs(notes).map((p, i) => (
    <p key={i}>{p}</p>
  ))}
</div>

),

    },
    !useProfileInDescription && profile && {
      label: "Profile",
 content: (
  <div
    className={`${narrativeSans.className} space-y-4 text-[1rem] leading-[1.8] text-[#3f382f]`}
  >
{splitParagraphs(profile).map((p, i) => (
  <p key={i}>{p}</p>
))}

  </div>
),

    },

  ].filter(Boolean) as Array<{ label: string; content: JSX.Element }>;

  return (
    <>
      <ProjectScrollRestoration slug={slug} />
      <main className="relative bg-[var(--surface,#f6f1e8)] text-[#1c1914] antialiased">

      {/* ============== HERO ============== */}
<section className="relative isolate overflow-hidden text-white">
  {heroImage ? (
    <Image
      src={heroImage}
      alt={`${title} hero imagery`}
      fill
      priority
      sizes="100vw"
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#2a2118,#5b4734)]" />
  )}

  {/* Premium scrim system: guarantees contrast on any image */}
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.62)_100%)]" />
 <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_65%_at_18%_72%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_70%)]" />

  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.12)_55%,rgba(0,0,0,0)_100%)]" />

  {/* bottom-right category chip */}
  {heroTags.length > 0 && (
    <div className="pointer-events-auto absolute bottom-6 right-6 z-[2] flex flex-wrap gap-3">
      {heroTags.map((tag) => (
        <Link
          key={tag}
          href={`/projects?section=${encodeURIComponent(tag)}`}
       className="
  group relative inline-flex items-center gap-2 rounded-full
  bg-white/82 backdrop-blur-md
  px-5 py-2
  ring-1 ring-black/10
  shadow-[0_14px_34px_rgba(0,0,0,0.18)]
  transition focus:outline-none
  after:pointer-events-none after:absolute after:left-4 after:right-4 after:-bottom-1.5
  after:h-[2px] after:rounded-full after:bg-[#d5a853]
  after:opacity-0 after:scale-x-0 after:transition-transform after:duration-200 after:origin-center
  group-hover:after:opacity-100 group-hover:after:scale-x-100
  focus-visible:after:opacity-100 focus-visible:after:scale-x-100
"

          aria-label={`Browse ${tag}`}
        >
<span className="text-[11px] uppercase tracking-[0.26em] font-semibold text-[#12100b]/80
 transition-colors group-hover:text-[#d5a853]">
  {tag}
</span>

<svg
  aria-hidden
  viewBox="0 0 20 20"
  width="18"
  height="18"
  className="
    shrink-0
    text-[#12100b]            /* black arrow always */
    opacity-80
    transition-all duration-320 ease-[cubic-bezier(.19,1,.22,1)]
    group-hover:text-[#d5a853] group-hover:opacity-100 group-hover:translate-x-0.5
    active:text-[#d5a853] active:translate-x-1
    focus-visible:text-[#d5a853] focus-visible:translate-x-0.5
  "
>

  <path
    d="M7 4l6 6-6 6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>

        </Link>
      ))}
    </div>
  )}


<div className="relative mx-auto flex max-w-6xl flex-col gap-3 px-5 py-24 sm:px-8 lg:px-10 lg:py-32 premium-hero-copy">
  <RevealOnScroll variant="section" delay={0}>
    <div className="space-y-2">
<h1
  className="
    hero-premium-text
    max-w-3xl
text-[clamp(2.0rem,5vw,3.8rem)]
    font-light
    leading-[1.05]
    tracking-[-0.025em]
    text-[#fff9ed]
drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]
[text-shadow:0_1px_16px_rgba(0,0,0,0.55)]

  "
  style={{ fontFamily: '"Playfair Display","Times New Roman",ui-serif,Georgia,serif' }}
>
  {title}
</h1>

      {(contextStr || location) && (
        <p
          className="
            hero-premium-subtext
            max-w-[34rem]
            text-[0.72rem] sm:text-[0.82rem]
            uppercase
      tracking-[0.12em] sm:tracking-[0.22em]

            font-medium
            text-white/92
            drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]
            [text-shadow:0_1px_18px_rgba(0,0,0,0.55)]
          "
        >
          {/* Mobile + Desktop: shorter location (keeps line compact) */}
          <span className="block sm:inline">{contextStr}</span>
          {contextStr && (locationShort || location) ? (
            <span className="hidden sm:inline"> · </span>
          ) : null}
          <span className="block sm:inline">{locationShort || location}</span>
        </p>
      )}
    </div>
  </RevealOnScroll>
</div>
</section>
<section className="relative z-[1] pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16">
  {/* ONE MASTER CONTAINER: everything must obey this width/padding */}
  <div className="mx-auto w-full max-w-[1180px] px-3 sm:px-4 md:px-10 lg:px-12">
    <div className="space-y-12 sm:space-y-16 md:space-y-20">
      {/* 1) TOP GRID: Narrative (left) + Details (right) share same edges */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.65fr),minmax(0,1fr)]">
        {/* LEFT: narrative blocks (REMOVE mx-auto/max-w so it aligns with grid edge) */}
        <section className="w-full space-y-10 sm:space-y-12 md:space-y-14">
          {/* Overview */}
          {descNarrative ? (
  <RevealOnScroll variant="copy" delay={0.04}>
  <div className="space-y-4 sm:space-y-5">
  <h3
    className={`${cormorant.className} text-[0.95rem] sm:text-[1.02rem] md:text-[1.08rem] lg:text-[1.12rem]
  font-semibold uppercase tracking-[0.10em] sm:tracking-[0.12em] text-[#C6AA76]`
}
  >
    Overview
  </h3>

  <article
    className={[
      "prose prose-neutral max-w-none",
      "prose-p:leading-[1.9] sm:prose-p:leading-[2.05] md:prose-p:leading-[2.15]",
      "prose-p:text-[0.98rem] sm:prose-p:text-[1.05rem] md:prose-p:text-[1.08rem]",
      "prose-p:text-[#2A2A2A]",
   "prose-p:my-0 prose-p:mb-9 sm:prose-p:mb-10 md:prose-p:mb-12 last:prose-p:mb-0",
      "prose-p:tracking-[0.006em] sm:prose-p:tracking-[0.01em]",
      "prose-a:text-[#2A2A2A] prose-a:underline prose-a:decoration-[#C6AA76]/45 prose-a:underline-offset-4 hover:prose-a:decoration-[#C6AA76]",
      "prose-strong:font-[500] prose-strong:text-[#1f1f1f]",
    ].join(" ")}
  >
{splitParagraphs(descNarrative).map((p, i) => (
  <p key={i} className="font-[300]">{p}</p>
))}

  </article>
</div>
</RevealOnScroll>   
) : null}

          {/* Design Intent */}
{focus?.length ? (
  <RevealOnScroll variant="copy" delay={0.12}>
    <div className="space-y-4 sm:space-y-5">
      <h3
        className={`${cormorant.className} text-[0.95rem] sm:text-[1.02rem] md:text-[1.08rem] lg:text-[1.12rem] font-semibold uppercase tracking-[0.10em] sm:tracking-[0.12em] text-[#C6AA76]`}
      >
        Design Intent
      </h3>

      <article
        className="
          prose prose-neutral max-w-none
          prose-p:leading-[1.85] sm:prose-p:leading-[2] md:prose-p:leading-[2.15]
          prose-p:text-[0.95rem] sm:prose-p:text-[1.05rem] md:prose-p:text-[1.08rem]
          prose-p:text-[#2A2A2A]
        "
      >
        {focus.map((item: string, i: number) => (
          <p key={`${item}-${i}`} className="font-[300]">
            {item}
          </p>
        ))}
      </article>
    </div>
  </RevealOnScroll>
) : null}


        </section>
      {/* 2) GALLERY: keep within SAME container width (NO mx-auto/max-w-6xl here) */}
 {galleryHighlightImage && galleryHasMultipleImages && (
  <section className="w-full pt-16 pb-10">
    {galleryHighlightIsPlain && highlightBlocksPlain.length > 0 ? (
      <div className="space-y-16 sm:space-y-20 lg:space-y-24">
        {highlightBlocksPlain.map((block, index) => {
          const isEven = index % 2 === 0;

          const creditLabel =
            galleryHighlightCaption?.replace(/^Photo:\s*/i, "").trim() ||
            project.title;

          return (
            <NarrativeGalleryItem
              key={block.src}
              image={block.src}
              projectTitle={title}
              index={index}
              blockText={block.description}
              photoAddress={creditLabel}
              isEven={isEven}
            />
          );
        })}
      </div>
    ) : (
      <div>
        <RevealOnScroll as="div" variant="slideLeft" className="space-y-4">
          <div className="relative w-full aspect-[4/3] md:aspect-square">
            <Image
              src={galleryHighlightImage}
              alt={`${title} gallery showcase`}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <p className="mt-5 px-1 text-center sm:px-0 sm:text-left">
            <span className="uppercase text-[#6F6F6F] text-[0.64rem] sm:text-[0.72rem] tracking-[0.18em] sm:tracking-[0.24em]">
              {galleryHighlightCaption?.replace(/^Photo:\s*/i, "").trim() || project.title}
            </span>
          </p>

{galleryHighlightDescription ? (
  <article className="prose prose-neutral max-w-none prose-p:leading-[1.85] sm:prose-p:leading-[2] md:prose-p:leading-[2.15] prose-p:text-[0.95rem] sm:prose-p:text-[1.05rem] md:prose-p:text-[1.08rem] prose-p:text-[#2A2A2A]">
{splitParagraphs(galleryHighlightDescription).map((p, i) => (
  <p key={i} className="font-[300]">{p}</p>
))}

  </article>
) : null}

        </RevealOnScroll>
      </div>
    )}
  </section>
)}

        {/* RIGHT: facts + system (REMOVE inner max-w wrapper for perfect alignment) */}
        <aside className="w-full space-y-8">
          {/* Project Details */}
          <RevealOnScroll as="div" variant="card" delay={0.18}>
            <details className="group" open>
              <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-6 pt-2">
                <h2
                  
                   className={`${cormorant.className} text-[0.95rem] sm:text-[1.02rem] md:text-[1.08rem] lg:text-[1.12rem] font-semibold uppercase tracking-[0.10em] sm:tracking-[0.12em] text-[#C6AA76]`}
                >
                  Project Details
                </h2>

                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  className="text-[#C6AA76] transition-transform duration-320 ease-[cubic-bezier(.19,1,.22,1)] group-open:rotate-180"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>

              <div className="mt-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                  {detailItems.map(({ label, value }, i) => {
                    const isRightCol = i % 2 === 1;
                    return (
                      <div
                        key={label}
                        className={["py-4 sm:py-5", isRightCol && "sm:pl-8"]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <dt className="uppercase text-[0.64rem] sm:text-[0.72rem] tracking-[0.18em] sm:tracking-[0.24em] text-[#9a8463]">
                          {label}
                        </dt>
                        <dd className="mt-2 text-[0.95rem] sm:text-[1.05rem] leading-[1.9] sm:leading-[2.1] text-[#2A2A2A] font-[300]">
                          {value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </details>
          </RevealOnScroll>

{/* Sound System */}
{/* Sound System */}
<RevealOnScroll as="div" variant="card" delay={0.22}>
  <details className="group" open>
    <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-6 pt-2">
      <h3
        className={`${cormorant.className} text-[0.95rem] sm:text-[1.02rem] md:text-[1.08rem] lg:text-[1.12rem] font-semibold uppercase tracking-[0.10em] sm:tracking-[0.12em] text-[#C6AA76]`}
      >
        {systemEntries.length
          ? "Sound System"
          : products.length === 1
          ? "Key Product"
          : "Key Products"}
      </h3>

      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width="18"
        height="18"
        className="text-[#C6AA76] transition-transform duration-320 ease-[cubic-bezier(.19,1,.22,1)] group-open:rotate-180"
      >
        <path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </summary>

    <div className="mt-4">
      {systemEntries.length ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
          {systemEntries.map(([zone, items], i) => {
            const zoneText = String(zone || "").trim();
            const hideZoneLabel = zoneText.toLowerCase() === "sound system"; // ✅ stop duplicate title

            const isRightCol = i % 2 === 1;
            const _items = (items as string[]).filter(
              (t) => typeof t === "string" && t.trim(),
            );

            return (
              <div
                key={`${zoneText || "zone"}-${i}`}
                className={["py-4 sm:py-5", isRightCol && "sm:pl-8"]
                  .filter(Boolean)
                  .join(" ")}
              >
                {!hideZoneLabel && (
                  <dt className="uppercase text-[0.64rem] sm:text-[0.72rem] tracking-[0.18em] sm:tracking-[0.24em] text-[#9a8463]">
                    {zoneText}
                  </dt>
                )}

                <dd className={hideZoneLabel ? "" : "mt-2"}>
                  {/* ✅ bullet dot vertically centered to first line */}
                  <ul className="space-y-2.5 text-[0.95rem] sm:text-[1.05rem] leading-[1.9] sm:leading-[2.1] text-[#2A2A2A]">
                    {_items.map((t) => (
                      <li key={t} className="relative pl-5 font-[300]">
                        <span className="absolute left-0 top-[0.92em] -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-[#C6AA76]/70" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            );
          })}
        </dl>
      ) : (

        <ul className="space-y-2.5 sm:space-y-3 text-[0.95rem] sm:text-[1.05rem] leading-[1.9] sm:leading-[2.1] text-[#2A2A2A]">
          {products.map((p) => (
            <li key={p} className="relative pl-5 font-[300]">
              <span className="absolute left-0 top-[0.98em] -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-[#C6AA76]/70" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  </details>
</RevealOnScroll>
      </aside>  
      </div>  
      {/* 3) Extra panels (already aligned because they sit in same container) */}
      {detailPanels.length ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {detailPanels.map((p) => (
            <section key={p.label} className="px-1 sm:px-2 md:px-0">
              <h3 className="uppercase text-[#6F6F6F] text-[0.64rem] sm:text-[0.72rem] tracking-[0.18em] sm:tracking-[0.24em]">
                {p.label}
              </h3>
              <div className="mt-4">{p.content}</div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  </div>
</section>


   
      {gallery.length ? (
        <section id="project-gallery" className="pb-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
            <GalleryLightbox images={gallery} title={title} contextLabel={galleryContext || undefined} />
          </div>
        </section>
      ) : null}


<section className="mt-4 mb-16 flex flex-col items-center text-center space-y-10 py-16">
  <div className="space-y-4">
<h3
  className="text-[clamp(1.8rem,3vw,2.3rem)] font-light text-[#141414] tracking-tight"
  style={{
    fontFamily:
      '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
  }}
>
  Discover This Project in Detail
</h3>

<p className="text-[0.85rem] uppercase tracking-[0.35em] text-[#C6AA76] font-medium">
  Request full specifications & narrative
</p>


    <div className="mx-auto h-[2px] w-28 bg-gradient-to-r from-transparent via-[#C6AA76] to-transparent" />
  </div>

  <div className="flex justify-center pt-2">
    <Link
      href="/contact"
      className="group relative rounded-full bg-white border-2 border-[#C6AA76] px-10 py-4 text-[10px] uppercase tracking-[0.4em] font-semibold text-[#141414] shadow-[0_8px_32px_rgba(198,170,118,0.25)] hover:shadow-[0_12px_48px_rgba(198,170,118,0.35)] hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6AA76]/60"
    >
      <span className="relative">
        <span className="transition-colors duration-300 group-hover:text-[#C6AA76]">
          Enquire About This Project
        </span>
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#C6AA76] transition-all duration-500 ease-out group-hover:w-full"
        />
      </span>
    </Link>
  </div>
</section>

{/* ============== MORE PROJECTS ============== */}
{relatedShowcase.length ? (
  <RevealOnScroll
    as="section"
    variant="section"
    className="pb-28 project-premium-section"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
      <RevealOnScroll variant="copy">
        <div className="mb-6 border-b border-[#e6ddcf] pb-3">
          <h2 className="text-[1.35rem] font-light tracking-[0.005em] text-[#2f2921]">
            More Projects
          </h2>
        </div>
      </RevealOnScroll>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedShowcase.map((item, index) => {
          const tagHref = `/projects?section=${encodeURIComponent(
            item.vertical
          )}`;

          return (
            <RevealOnScroll
              key={item.slug}
              as="article"
              variant="card"
              delay={0.07 * index}
              className="group relative overflow-hidden rounded-[1.2rem] bg-[var(--card,#fff7ee)]/60 shadow-[0_18px_48px_rgba(134,110,75,0.18)] ring-[0.5px] ring-[#e2d5c0]"
            >
              <Link href={`/projects/${item.slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${item.title} preview`}
                      fill
                      sizes="(min-width:1024px) 420px, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-[1.02] group-hover:brightness-[1.02]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#e4d5b5,#c9b08a)]" />
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-2 px-5 pt-4">
                <Link
                  href={tagHref}
                  className="
                    rounded-full border border-[rgba(213,168,83,0.35)] bg-[#fff8ee] px-3 py-1
                    text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a5c2a]
                    transition !no-underline hover:underline hover:decoration-[#d5a853] hover:underline-offset-4
                    focus-visible:underline focus-visible:decoration-[#d5a853] focus-visible:underline-offset-4
                    active:underline active:decoration-[#d5a853] active:underline-offset-4
                  "
                  aria-label={`Browse ${item.vertical}`}
                >
                  {item.tag}
                </Link>
              </div>

              <div className="px-5 pb-5 pt-2">
                <h3
                  className="text-[1.12rem] leading-snug tracking-[-0.01em] text-[#2f2921]"
                  style={{
                    fontFamily:
                      '"Playfair Display","Times New Roman",ui-serif,Georgia,serif',
                  }}
                >
                  <Link
                    href={`/projects/${item.slug}`}
                    className="hover:underline decoration-[#d5a853]/50"
                  >
                    {item.title}
                  </Link>
                </h3>

                <p className="mt-2 line-clamp-3 text-[0.95rem] leading-[1.6] text-[#4b4338]">
                  {item.summary}
                </p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  </RevealOnScroll>
) : null}


    </main>
    </>
  );
}
