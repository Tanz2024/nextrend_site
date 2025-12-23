// Master index file that imports and combines all Frogis product categories
import { buildFrogisUrl } from "@/lib/assets";
import type { FrogisCategory, FrogisProduct } from "./types";

import pointSource from "../content/point_source.json";
import ceilingSpeakers from "../content/ceiling_speakers.json";
import subwoofers from "../content/subwoofers.json";
import microphonesHeadphones from "../content/microphones_headphones.json";
import slimlineArrays from "../content/slimline_arrays.json";
import highPerformanceArrays from "../content/high_performance_arrays.json";

const asString = (value: unknown, fallback = "") =>
  typeof value == "string" ? value : fallback;

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown) =>
  asArray(value).filter((item) => typeof item == "string") as string[];

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

const resolveAsset = (filename: unknown, category: FrogisCategory) => {
  const value = asString(filename);
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return buildFrogisUrl(value);
  }
  if (value.includes("/")) {
    return buildFrogisUrl(value);
  }
  return buildFrogisUrl(`${category}/${value}`);
};

const mapLifestyle = (items: unknown, name: string, category: FrogisCategory) =>
  asArray(items)
    .map((item, index) => {
      if (!item || typeof item != "object") return null;
      const record = item as Record<string, unknown>;
      const src = resolveAsset(record.src, category);
      if (!src) return null;
      return {
        src,
        alt: asString(record.alt, `${name} image ${index + 1}`),
        caption: asString(record.caption) || undefined,
      };
    })
    .filter(Boolean) as FrogisProduct["lifestyle"];

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
    return buildFrogisUrl(raw);
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

const formatFrequency = (value?: [number, number]) => {
  if (!value) return "";
  return `${value[0]} Hz - ${value[1]} Hz`;
};

const mapProducts = (items: unknown, category: FrogisCategory) =>
  asArray(items)
    .map((item) => {
      if (!item || typeof item != "object") return null;
      const record = item as Record<string, unknown>;
      const name = asString(record.name);
      const slug = asString(record.slug) || (name ? slugify(name) : "");
      const seriesValue = asString(record.series).trim();
      const categoryValue = asString(record.category).trim();
      const assetCategory = categoryValue || category;

      const resources = normalizeResources(record.resources);
      const specGroups = normalizeSpecGroups(record.specGroups);

      const power = asString(record.power) || undefined;
      const type = asString(record.type) || undefined;
      const drivers = asString(record.drivers) || undefined;
      const frequency = asNumberTuple(record.frequency);
      const coverage = asString(record.coverage) || undefined;
      const weightKg =
        typeof record.weightKg == "number" ? record.weightKg : undefined;
      const ipRating = asString(record.ipRating) || undefined;
      const finish = asString(record.finish);

      const fallbackSpecGroups = () => {
        const generalItems: Array<{ label: string; value: string }> = [];
        const performanceItems: Array<{ label: string; value: string }> = [];

        if (type) generalItems.push({ label: "Type", value: type });
        if (power) generalItems.push({ label: "Power", value: power });
        if (drivers) generalItems.push({ label: "Drivers", value: drivers });
        if (finish) generalItems.push({ label: "Finish", value: finish });
        if (seriesValue) {
          generalItems.push({ label: "Series", value: seriesValue });
        }
        if (categoryValue) {
          generalItems.push({ label: "Category", value: categoryValue });
        }

        if (frequency) {
          performanceItems.push({
            label: "Frequency response",
            value: formatFrequency(frequency),
          });
        }
        if (coverage) {
          performanceItems.push({ label: "Coverage", value: coverage });
        }
        if (typeof weightKg == "number") {
          performanceItems.push({ label: "Weight", value: `${weightKg} kg` });
        }
        if (ipRating) {
          performanceItems.push({ label: "IP rating", value: ipRating });
        }

        const groups: Array<{
          title: string;
          items: Array<{ label: string; value: string }>;
        }> = [];
        if (generalItems.length) {
          groups.push({ title: "General", items: generalItems });
        }
        if (performanceItems.length) {
          groups.push({ title: "Performance", items: performanceItems });
        }
        return groups;
      };

      const resolvedSpecGroups =
        specGroups.length > 0 ? specGroups : fallbackSpecGroups();

      return {
        slug,
        name,
        headline: asString(record.headline),
        description: asString(record.description),
        story: asString(record.story),
        series: (seriesValue || undefined) as FrogisCategory | undefined,
        category: (categoryValue || undefined) as FrogisCategory | undefined,
        finish,
        collaboration: asString(record.collaboration),
        power,
        type,
        drivers,
        applications: asStringArray(record.applications),
        image: resolveAsset(record.image, assetCategory),
        lifestyle: mapLifestyle(record.lifestyle, name || "Frog-is", assetCategory),
        specs: asStringArray(record.specs),
        specGroups: resolvedSpecGroups.length ? resolvedSpecGroups : undefined,
        resources: resources.length ? resources : undefined,
        definition: asString(record.definition) || undefined,
        features: asStringArray(record.features),
        keyStats: asStringArray(record.keyStats),
        frequency,
        coverage,
        weightKg,
        ipRating,
      } as FrogisProduct;
    })
    .filter(Boolean) as FrogisProduct[];

export const pointSourceSpeakersProducts = mapProducts(
  pointSource,
  "Point source speakers",
);
export const ceilingSpeakersProducts = mapProducts(
  ceilingSpeakers,
  "Ceiling speakers",
);
export const subwoofersProducts = mapProducts(subwoofers, "Subwoofers");
export const microphonesHeadphonesProducts = mapProducts(
  microphonesHeadphones,
  "Microphones and headphones",
);
export const slimlineArraysProducts = mapProducts(
  slimlineArrays,
  "Slimline array speaker systems",
);
export const highPerformanceArraysProducts = mapProducts(
  highPerformanceArrays,
  "High Performance array speaker systems",
);

export const allFrogisProducts = [
  ...pointSourceSpeakersProducts,
  ...ceilingSpeakersProducts,
  ...subwoofersProducts,
  ...microphonesHeadphonesProducts,
  ...slimlineArraysProducts,
  ...highPerformanceArraysProducts,
];

export const frogisProductsByCategory = {
  "Point source speakers": pointSourceSpeakersProducts,
  "Ceiling speakers": ceilingSpeakersProducts,
  Subwoofers: subwoofersProducts,
  "Microphones and headphones": microphonesHeadphonesProducts,
  "Slimline array speaker systems": slimlineArraysProducts,
  "High Performance array speaker systems": highPerformanceArraysProducts,
};

export const highPerformanceArrayProducts = highPerformanceArraysProducts;
export const slimlineArrayProducts = slimlineArraysProducts;
export const pointSourceProducts = pointSourceSpeakersProducts;

export type { FrogisProduct } from "./types";
