// app/products/k-gear/data.ts

import { buildKGearUrl } from "@/lib/assets";
import systems from "./content/systems.json";
import speakers from "./content/speakers.json";
import subwoofers from "./content/subwoofers.json";

export type KGearProduct = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  story: string;
  definition: string;
  series?: string;
  category?: "Systems" | "Speakers" | "Subwoofers" | string;
  finish: string;
  collaboration: "Active" | "Passive" | "Transformer" | string;
  power: "Active" | "Passive" | string;
  image: string;
  video?: string;
  lifestyle: Array<{ src: string; alt: string; caption?: string }>;
  specs: string[];
  specGroups?: Array<{
    title: string;
    items: Array<{ label: string; value: string }>;
  }>;
  resources?: Array<{ label: string; href: string }>;
  applications?: string[];
  type?: string;
  drivers?: string;
  keyStats?: string[];
  frequency?: [number, number];
  coverage?: string;
  weightKg?: number;
  ipRating?: string;
};

const asString = (value: unknown, fallback = "") =>
  typeof value == "string" ? value : fallback;

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown) =>
  asArray(value).filter((item) => typeof item == "string") as string[];

const asNumber = (value: unknown) => {
  if (typeof value == "number" && !Number.isNaN(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const asNumberTuple = (value: unknown) => {
  if (!Array.isArray(value) || value.length != 2) return undefined;
  const first = Number(value[0]);
  const second = Number(value[1]);
  if (Number.isNaN(first) || Number.isNaN(second)) return undefined;
  return [first, second] as [number, number];
};

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
        src: buildKGearUrl(src),
        alt: asString(record.alt, `${fallback} image ${index + 1}`),
        caption: asString(record.caption) || undefined,
      };
    })
    .filter(Boolean) as KGearProduct["lifestyle"];

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
    return buildKGearUrl(raw);
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
            .map((item) => {
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

const mapProducts = (items: unknown) =>
  asArray(items).map((item) => {
    const record = (item && typeof item == "object") ? (item as Record<string, unknown>) : {};
    const name = asString(record.name);
    const slug = asString(record.slug) || (name ? slugify(name) : "");

    const resources = normalizeResources(record.resources);

    return {
      slug,
      name,
      headline: asString(record.headline),
      description: asString(record.description),
      story: asString(record.story),
      definition: asString(record.definition),
      series: asString(record.series).trim() || undefined,
      category: asString(record.category).trim() || undefined,
      finish: asString(record.finish),
      collaboration: asString(record.collaboration),
      power: asString(record.power),
      image: buildKGearUrl(asString(record.image)),
      video: asString(record.video) ? buildKGearUrl(asString(record.video)) : undefined,
      lifestyle: mapLifestyle(record.lifestyle, name || "KGEAR"),
      specs: asStringArray(record.specs),
      specGroups: normalizeSpecGroups(record.specGroups),
      resources: resources.length ? resources : undefined,
      applications: asStringArray(record.applications),
      type: asString(record.type) || undefined,
      drivers: asString(record.drivers) || undefined,
      keyStats: asStringArray(record.keyStats),
      frequency: asNumberTuple(record.frequency),
      coverage: asString(record.coverage) || undefined,
      weightKg: asNumber(record.weightKg),
      ipRating: asString(record.ipRating) || undefined,
    };
  });

export const kgearProducts: KGearProduct[] = [
  ...mapProducts(systems),
  ...mapProducts(speakers),
  ...mapProducts(subwoofers),
];
