// app/products/bearbricks/data.ts

import {
  buildBearbricksLifestyleUrl,
  buildBearbricksProductUrl,
} from "@/lib/assets";
import content from "./content.json";

/* ---------------- types ---------------- */
export type BearbrickMedia = { src: string; alt: string; caption?: string };

export type BearbrickFinish = {
  key: string;
  name: string;
  hex: string;
  order: number;

  /** main hero still (per finish) */
  image: string;

  /** optional extra views for THIS finish */
  gallery?: BearbrickMedia[];

  /** optional lifestyle for THIS finish */
  lifestyle?: BearbrickMedia[];

  /** optional video per finish */
  video?: string;

  /**
   * ✅ OPTIONAL: if you ever need a finish to display a different collection name.
   * Usually you won't set this — product.collection is the stable one.
   */
  collection?: string;
};

export type BearbrickProduct = {
  slug: string;
  name: string;

  /**
   * ✅ NEW: stable label that does NOT change with color (Obsidian/Smoke/Clear etc.)
   * Example: "Clear Collection" or "Studio Editions"
   */
  collection?: string;

  headline: string;
  description: string;
  story: string;
  series?: string;
  finish: string;
  collaboration: string;
  image: string;
  specs: string[];
  specGroups?: Array<{
    title: string;
    items: Array<{ label: string; value: string }>;
  }>;
  resources?: Array<{ label: string; href: string }>;
  video?: string;
  lifestyle: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  definition?: string;

  /** ✅ multi-variant palette */
  finishes?: BearbrickFinish[];
};

/* ---------------- helpers ---------------- */
const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown) =>
  asArray(value).filter((item) => typeof item === "string") as string[];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * ✅ FIX: lifestyle/gallery assets were always routed to Lifestyle bucket.
 * Some of your files (e.g. Abstract_Ripple, Front/Rear/Left/Right) live in Product bucket,
 * so they 404 and "don't render".
 *
 * This resolver picks Product vs Lifestyle automatically.
 */
const resolveMediaSrc = (src: string) => {
  const s = (src || "").trim();
  if (!s) return "";

  // already absolute
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  const lower = s.toLowerCase();

  // treat "packshot / product" style files as product assets
  const looksLikeProduct =
    lower.endsWith(".pdf") ||
    lower.includes("abstract") ||
    lower.includes("ripple") ||
    lower.includes("_front") ||
    lower.includes("_rear") ||
    lower.includes("_left") ||
    lower.includes("_right") ||
    lower.includes("-front") ||
    lower.includes("-rear") ||
    lower.includes("-left") ||
    lower.includes("-right");

  return looksLikeProduct
    ? buildBearbricksProductUrl(s)
    : buildBearbricksLifestyleUrl(s);
};

/* ---------------- media mappers ---------------- */
const mapLifestyle = (items: unknown, fallback: string) =>
  asArray(items)
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const raw = asString(record.src).trim();
      if (!raw) return null;

      return {
        src: resolveMediaSrc(raw),
        alt: asString(record.alt, `${fallback} image ${index + 1}`),
        caption: asString(record.caption).trim() || undefined,
      };
    })
    .filter(Boolean) as BearbrickProduct["lifestyle"];

const mapMediaArray = (items: unknown, fallbackAlt: string): BearbrickMedia[] =>
  asArray(items)
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const raw = asString(record.src).trim();
      if (!raw) return null;

      return {
        src: resolveMediaSrc(raw),
        alt: asString(record.alt, `${fallbackAlt} image ${index + 1}`),
        caption: asString(record.caption).trim() || undefined,
      };
    })
    .filter(Boolean) as BearbrickMedia[];

const mapFinishes = (value: unknown, productName: string): BearbrickFinish[] => {
  const arr = asArray(value);

  return arr
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const r = item as Record<string, unknown>;

      const key = asString(r.key).trim();
      const name = asString(r.name).trim();
      const rawImage = asString(r.image).trim();

      // require key + image so palette & hero work reliably
      if (!key || !rawImage) return null;

      const finish: BearbrickFinish = {
        key,
        name: name || key,
        hex: asString(r.hex).trim() || "#ddd",
        order: Number(r.order ?? 999),
        image: buildBearbricksProductUrl(rawImage),
        gallery: r.gallery
          ? mapMediaArray(r.gallery, `${productName} — ${name || key}`)
          : undefined,
        lifestyle: r.lifestyle
          ? mapMediaArray(r.lifestyle, `${productName} — ${name || key}`)
          : undefined,

        // ✅ FIX: route finish video through resolver too
        video: asString(r.video).trim()
          ? resolveMediaSrc(asString(r.video).trim())
          : undefined,

        // ✅ OPTIONAL: finish-level override (usually blank)
        collection: asString(r.collection).trim() || undefined,
      };

      return finish;
    })
    .filter(Boolean)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
};

/* ---------------- resources ---------------- */
const normalizeResources = (value: unknown) => {
  const items = asArray(value);

  const labelFromHref = (href: string, fallback: string) => {
    const raw = (href || "").trim();
    if (!raw) return fallback;
    const last = raw.split("/").pop() || "";
    const base = last.split("?")[0].split("#")[0];
    if (!base) return fallback;
    const stripped = base.replace(/\.[^/.]+$/, "");
    const spaced = stripped.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    return spaced || fallback;
  };

  const resolveHref = (href: string) => {
    const raw = (href || "").trim();
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return buildBearbricksProductUrl(raw);
  };

  return items
    .map((item, idx) => {
      if (typeof item === "string") {
        const rawHref = item.trim();
        const href = resolveHref(rawHref);
        if (!href) return null;
        return { href, label: labelFromHref(rawHref, `Resource ${idx + 1}`) };
      }

      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const rawHref =
        (typeof record.href === "string" && record.href.trim()) ||
        (typeof record.url === "string" && record.url.trim()) ||
        (typeof record.src === "string" && record.src.trim()) ||
        "";
      const href = resolveHref(rawHref);
      if (!href) return null;

      const label =
        (typeof record.label === "string" && record.label.trim()) ||
        (typeof record.title === "string" && record.title.trim()) ||
        (typeof record.name === "string" && record.name.trim()) ||
        labelFromHref(rawHref, `Resource ${idx + 1}`);

      return { href, label };
    })
    .filter(Boolean) as Array<{ label: string; href: string }>;
};

const normalizeSpecGroups = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((group) => {
      if (!group || typeof group !== "object") return null;
      const record = group as Record<string, unknown>;
      const title = asString(record.title).trim();
      const items = Array.isArray(record.items)
        ? record.items
            .map((item: unknown) => {
              if (!item || typeof item !== "object") return null;
              const entry = item as Record<string, unknown>;
              const label = asString(entry.label).trim();
              const value = asString(entry.value).trim();
              if (!label && !value) return null;
              return { label, value };
            })
            .filter(Boolean)
        : [];

      if (!title && items.length === 0) return null;
      return { title, items };
    })
    .filter(Boolean) as Array<{
    title: string;
    items: Array<{ label: string; value: string }>;
  }>;
};

/* ---------------- normalize products ---------------- */
const rawProducts = asArray(
  (content as any).bearbrickProducts ?? (content as any).products
);

export const bearbrickProducts: BearbrickProduct[] = rawProducts.map((item) => {
  const record =
    item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  const name = asString(record.name).trim();
  const slug = asString(record.slug).trim() || (name ? slugify(name) : "");

  const resources = normalizeResources(record.resources);
  const finishes = mapFinishes(record.finishes, name || "BE@RBRICK");
  const specGroups = normalizeSpecGroups(record.specGroups);

  return {
    slug,
    name,

    // ✅ NEW: stable collection name (same for Obsidian/Smoke/Clear finishes)
    collection: asString(record.collection).trim() || undefined,

    headline: asString(record.headline),
    description: asString(record.description),
    story: asString(record.story),
    series: asString(record.series).trim() || undefined,
    finish: asString(record.finish),
    collaboration: asString(record.collaboration),
    image: buildBearbricksProductUrl(asString(record.image)),
    specs: asStringArray(record.specs),
    specGroups,
    resources: resources.length ? resources : undefined,

    // ✅ FIX: route product video through resolver too
    video: asString(record.video).trim()
      ? resolveMediaSrc(asString(record.video).trim())
      : undefined,

    lifestyle: mapLifestyle(record.lifestyle, name || "BE@RBRICK"),
    definition: asString(record.definition).trim() || undefined,

    // ✅ enable palette + per-finish hero/gallery/lifestyle
    finishes: finishes.length ? finishes : undefined,
  };
});
