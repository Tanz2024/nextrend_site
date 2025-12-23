// app/products/brionvega/data.ts

import { buildBrionvegaUrl } from "@/lib/assets";
import content from "./content.json";

/* ---------------- types ---------------- */
export type BrionvegaMedia = { src: string; alt: string; caption?: string };

export type BrionvegaResource = { label: string; href: string };

export type BrionvegaFinish = {
  key: string;
  name: string;
  hex: string;
  order: number;

  /** main hero still (per finish) */
  image: string;

  /** optional extra views for THIS finish */
  gallery?: BrionvegaMedia[];

  /** optional lifestyle for THIS finish */
  lifestyle?: BrionvegaMedia[];
};

export type BrionvegaProduct = {
  family: string;
  finishes?: BrionvegaFinish[];

  slug: string;
  name: string;
  headline: string;

  /** short overlay copy (used in hero/video overlays). Optional. */
  heroCopy?: string;

  /** listing / card summary */
  description: string;

  /** long form section copy */
  story: string;

  series?: string;
  collaboration: string;

  /** default hero image (built URL) */
  image: string;

  /** ✅ ALWAYS array in code (even if JSON uses { specs: [...] }) */
  specs: string[];
  specGroups?: Array<{
    title: string;
    items: Array<{ label: string; value: string }>;
  }>;

  features: string[];
  applications: string[];

  /** global gallery (non-finish-specific) */
  gallery?: BrionvegaMedia[];

  heroVideo?: { src: string; poster?: string; alt?: string };

  /** global lifestyle (non-finish-specific) */
  lifestyle: BrionvegaMedia[];

  /** ✅ resources for Resources tab */
  resources?: BrionvegaResource[];
};

/* ---------------- helpers ---------------- */
const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown): string[] =>
  asArray(value)
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.trim())
    .filter(Boolean);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/** accepts "a/b.jpg" and already-built URLs; always returns a usable string (or "") */
const buildUrlMaybe = (src: string) => {
  const s = (src || "").trim();
  if (!s) return "";
  return buildBrionvegaUrl(s);
};

/* ---------------- mappers ---------------- */
const mapMediaArray = (items: unknown, fallbackAlt: string): BrionvegaMedia[] => {
  return asArray(items)
    .map((item, index) => {
      if (!isRecord(item)) return null;

      const rawSrc = asString(item.src).trim();
      if (!rawSrc) return null;

      const alt =
        asString(item.alt, `${fallbackAlt} image ${index + 1}`).trim() || fallbackAlt;

      const captionRaw = asString(item.caption).trim();
      const caption = captionRaw ? captionRaw : undefined;

      const src = buildUrlMaybe(rawSrc);
      if (!src) return null;

      return { src, alt, caption };
    })
    .filter((x): x is BrionvegaMedia => x !== null);
};

const mapFinish = (finish: unknown, fallbackName: string): BrionvegaFinish | null => {
  if (!isRecord(finish)) return null;

  const name = asString(finish.name, fallbackName).trim() || fallbackName;

  const rawImage = asString(finish.image).trim();
  if (!rawImage) return null;

  const keyRaw = asString(finish.key).trim();
  const key = keyRaw ? keyRaw : slugify(name) || "default";

  const hex = asString(finish.hex).trim();
  const orderNum = Number(finish.order);
  const order = Number.isFinite(orderNum) ? orderNum : 0;

  const image = buildUrlMaybe(rawImage);
  if (!image) return null;

  const gallery = mapMediaArray((finish as any).gallery, name);
  const lifestyle = mapMediaArray((finish as any).lifestyle, name);

  return {
    key,
    name,
    hex,
    order,
    image,
    gallery: gallery.length ? gallery : undefined,
    lifestyle: lifestyle.length ? lifestyle : undefined,
  };
};

/* ---------------- normalize fields ----------------
   Supports:
   - "specs": ["..."]
   - "specs": { "specs": ["..."] }
*/
const normalizeSpecs = (value: unknown): string[] => {
  if (Array.isArray(value)) return asStringArray(value);
  if (isRecord(value) && Array.isArray((value as any).specs)) return asStringArray((value as any).specs);
  return [];
};

const normalizeSpecGroups = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((group) => {
      if (!isRecord(group)) return null;
      const title = asString((group as any).title).trim();
      const items = Array.isArray((group as any).items)
        ? (group as any).items
            .map((item: unknown) => {
              if (!isRecord(item)) return null;
              const label = asString((item as any).label).trim();
              const value = asString((item as any).value).trim();
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

const normalizeHeroVideo = (value: unknown) => {
  if (!isRecord(value)) return undefined;

  const src = buildUrlMaybe(asString((value as any).src));
  if (!src) return undefined;

  const posterRaw = asString((value as any).poster).trim();
  const poster = posterRaw ? buildUrlMaybe(posterRaw) : undefined;

  const altRaw = asString((value as any).alt).trim();
  const alt = altRaw ? altRaw : undefined;

  return { src, poster, alt };
};

const normalizeResources = (value: unknown): BrionvegaResource[] => {
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
    return buildUrlMaybe(raw);
  };

  return items
    .map((item, idx) => {
      // allow: "path/to.pdf"
      if (typeof item === "string") {
        const rawHref = item.trim();
        const href = resolveHref(rawHref);
        if (!href) return null;
        return {
          href,
          label: labelFromHref(rawHref, `Resource ${idx + 1}`),
        };
      }

      // allow: { label, href } or { title, url } etc.
      if (!isRecord(item)) return null;

      const rawHref =
        (typeof (item as any).href === "string" && (item as any).href.trim()) ||
        (typeof (item as any).url === "string" && (item as any).url.trim()) ||
        (typeof (item as any).src === "string" && (item as any).src.trim()) ||
        "";

      const href = resolveHref(rawHref);
      if (!href) return null;

      const label =
        (typeof (item as any).label === "string" && (item as any).label.trim()) ||
        (typeof (item as any).title === "string" && (item as any).title.trim()) ||
        (typeof (item as any).name === "string" && (item as any).name.trim()) ||
        labelFromHref(rawHref, `Resource ${idx + 1}`);

      return { href, label };
    })
    .filter((x): x is BrionvegaResource => Boolean(x));
};

/* ---------------- data ---------------- */
const rawProducts = asArray((content as any).brionvegaProducts ?? (content as any).products);

export const brionvegaProducts: BrionvegaProduct[] = rawProducts
  .map((item) => {
    const record = isRecord(item) ? item : {};

    const name = asString((record as any).name).trim();
    const headline = asString((record as any).headline).trim();

    const slugRaw = asString((record as any).slug).trim();
    const slug = slugRaw ? slugRaw : name ? slugify(name) : "";

    const finishes = asArray((record as any).finishes)
      .map((f) => mapFinish(f, name || "Finish"))
      .filter((x): x is BrionvegaFinish => Boolean(x));

    // - if product.image exists → build URL
    // - else use first finish image (already built)
    const productImageRaw = asString((record as any).image).trim();
    const image = productImageRaw ? buildUrlMaybe(productImageRaw) : finishes[0]?.image || "";

    const heroCopyRaw = asString((record as any).heroCopy).trim();
    const heroCopy = heroCopyRaw ? heroCopyRaw : undefined;

    const description = asString((record as any).description).trim();
    const story = asString((record as any).story).trim();

    const series = asString((record as any).series).trim() || undefined;
    const collaboration = asString((record as any).collaboration).trim();

    const specs = normalizeSpecs((record as any).specs);
    const specGroups = normalizeSpecGroups((record as any).specGroups);
    const features = asStringArray((record as any).features);
    const applications = asStringArray((record as any).applications);

    const gallery = mapMediaArray((record as any).gallery, name || "Gallery");
    const lifestyle = mapMediaArray((record as any).lifestyle, name || "Lifestyle");

    const heroVideo = normalizeHeroVideo((record as any).heroVideo);

    // ✅ NEW: resources -> so your Resources tab appears
    const resources = normalizeResources((record as any).resources);

    return {
      family: asString((record as any).family).trim(),
      finishes: finishes.length ? finishes : undefined,

      slug,
      name,
      headline,

      heroCopy,

      description,
      story,

      series,
      collaboration,

      image,

      specs,
      specGroups,
      features,
      applications,

      gallery: gallery.length ? gallery : undefined,
      heroVideo,
      lifestyle,

      resources: resources.length ? resources : undefined,
    } satisfies BrionvegaProduct;
  })
  // ✅ don't accidentally drop products that rely on finishes for image
  .filter((p) => Boolean(p.slug && p.name && p.image));
