// app/products/trinnov/data.ts

import { buildTrinnovUrl } from "@/lib/assets";
import content from "./content.json";

export type TrinnovProduct = {
  slug: string;
  name: string;
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
  features?: string[];
  applications?: string[];
  resources?: Array<{ label: string; href: string }>;
  lifestyle: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  video?: string;
  craftVideo?: string;
};
const normalizeSpecs = (value: unknown): string[] => {
  // already array
  if (Array.isArray(value)) {
    return value
      .filter((v) => typeof v === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // single string (maybe pasted paragraphs / lines)
  if (typeof value === "string") {
    return value
      .split(/\r?\n|•|·|–|-\s+/g) // split on newlines / bullets / dashes
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
};

const asString = (value: unknown, fallback = "") =>
  typeof value == "string" ? value : fallback;

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown) =>
  asArray(value).filter((item) => typeof item == "string") as string[];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const mapLifestyle = (items: unknown, fallback: string) =>
  asArray(items)
    .map((item, index) => {
      if (!item || typeof item != "object") return null;
      const record = item as Record<string, unknown>;
      const src = asString(record.src);
      if (!src) return null;
      return {
        src: buildTrinnovUrl(src),
        alt: asString(record.alt, `${fallback} image ${index + 1}`),
        caption: asString(record.caption) || undefined,
      };
    })
    .filter(Boolean) as TrinnovProduct["lifestyle"];

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
    return buildTrinnovUrl(raw);
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

const rawProducts = asArray((content as any).trinnovProducts ?? (content as any).products);

export const trinnovProducts: TrinnovProduct[] = rawProducts.map((item) => {
  const record = (item && typeof item == "object") ? (item as Record<string, unknown>) : {};
  const name = asString(record.name);
  const slug = asString(record.slug) || (name ? slugify(name) : "");

  const resources = normalizeResources(record.resources);
  const specGroups = normalizeSpecGroups(record.specGroups);

  return {
    slug,
    name,
    headline: asString(record.headline),
    description: asString(record.description),
    story: asString(record.story),
    series: asString(record.series).trim() || undefined,
    finish: asString(record.finish),
    collaboration: asString(record.collaboration),
    image: buildTrinnovUrl(asString(record.image)),
specs: normalizeSpecs(record.specs),

    specGroups,
    features: asStringArray(record.features),
    applications: asStringArray(record.applications),
    resources: resources.length ? resources : undefined,
    lifestyle: mapLifestyle(record.lifestyle, name || "Trinnov"),
    video: asString(record.video) ? buildTrinnovUrl(asString(record.video)) : undefined,
    craftVideo: asString(record.craftVideo)
      ? buildTrinnovUrl(asString(record.craftVideo))
      : undefined,
  };
});
