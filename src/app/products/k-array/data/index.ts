// app/products/k-array/data/index.ts

import {
  buildKArraySpeakerUrl,
  buildKArraySubwooferUrl,
  buildKArrayMonitorUrl,
  buildKArraySystemUrl,
  buildKArrayUrl,
} from "@/lib/assets";
import speakers from "../content/speakers.json";
import subwoofers from "../content/subwoofers.json";
import monitors from "../content/monitors.json";
import systems from "../content/systems.json";
import audioLight from "../content/audio_light.json";
import light from "../content/light.json";
import type { KArrayProduct } from "./types";

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

const resolveAsset = (value: unknown, category: string) => {
  const file = asString(value);
  if (!file) return "";
  if (file.startsWith("http://") || file.startsWith("https://")) {
    return buildKArrayUrl(file);
  }
  if (file.includes("/")) {
    return buildKArrayUrl(file);
  }

  switch (category) {
    case "Speakers":
      return buildKArraySpeakerUrl(file);
    case "Subwoofers":
      return buildKArraySubwooferUrl(file);
    case "Monitors":
      return buildKArrayMonitorUrl(file);
    case "Systems":
      return buildKArraySystemUrl(file);
    case "Audio & Light":
      return buildKArrayUrl(`K_array_images/audio_light_images/${file}`);
    case "Light":
      return buildKArrayUrl(`K_array_images/light_images/${file}`);
    default:
      return buildKArrayUrl(file);
  }
};

const mapLifestyle = (items: unknown, fallback: string, category: string) =>
  asArray(items)
    .map((item, index) => {
      if (!item || typeof item != "object") return null;
      const record = item as Record<string, unknown>;
      const src = resolveAsset(record.src, category);
      if (!src) return null;
      return {
        src,
        alt: asString(record.alt, `${fallback} image ${index + 1}`),
        caption: asString(record.caption) || undefined,
      };
    })
    .filter(Boolean) as KArrayProduct["lifestyle"];

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
    return buildKArrayUrl(raw);
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

const mapProducts = (items: unknown, defaultCategory: string) =>
  asArray(items).map((item) => {
    const record = (item && typeof item == "object")
      ? (item as Record<string, unknown>)
      : {};
    const name = asString(record.name);
    const category = asString(record.category, defaultCategory);
    const slug = asString(record.slug) || (name ? slugify(name) : "");

    const resources = normalizeResources(record.resources);

    return {
      slug,
      name,
      headline: asString(record.headline),
      description: asString(record.description),
      story: asString(record.story),
      definition: asString(record.definition),
      series: asString(record.series),
      category,
      finish: asString(record.finish),
      collaboration: asString(record.collaboration),
      power: asString(record.power),
      image: resolveAsset(record.image, category),
      lifestyle: mapLifestyle(record.lifestyle, name || "K-array", category),
      specs: asStringArray(record.specs),
      resources: resources.length ? resources : undefined,
      type: asString(record.type) || undefined,
      drivers: asString(record.drivers) || undefined,
      keyStats: asStringArray(record.keyStats),
      frequency: asNumberTuple(record.frequency),
      coverage: asString(record.coverage) || undefined,
      weightKg: typeof record.weightKg == "number" ? record.weightKg : undefined,
      ipRating: asString(record.ipRating) || undefined,
      applications: asStringArray(record.applications),
    } as KArrayProduct;
  });

export const speakersProducts = mapProducts(speakers, "Speakers");
export const subwoofersProducts = mapProducts(subwoofers, "Subwoofers");
export const monitorsProducts = mapProducts(monitors, "Monitors");
export const systemsProducts = mapProducts(systems, "Systems");
export const audioLightProducts = mapProducts(audioLight, "Audio & Light");
export const lightProducts = mapProducts(light, "Light");

export const allKArrayProducts = [
  ...speakersProducts,
  ...subwoofersProducts,
  ...monitorsProducts,
  ...systemsProducts,
  ...audioLightProducts,
  ...lightProducts,
];

export const productsByCategory = {
  Speakers: speakersProducts,
  Subwoofers: subwoofersProducts,
  Monitors: monitorsProducts,
  Systems: systemsProducts,
  "Audio & Light": audioLightProducts,
  Light: lightProducts,
};

export type { KArrayProduct } from "./types";
