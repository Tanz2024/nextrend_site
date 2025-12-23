// app/products/amina/data.ts

import { buildAminaUrl } from "@/lib/assets";
import edge from "./content/edge.json";
import mobius from "./content/mobius.json";
import sapphire from "./content/sapphire.json";
import alf from "./content/alf.json";

export type AminaProduct = {
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
  applications?: string[];
  features?: string[];
  resources?: Array<{ label: string; href: string }>;
  lifestyle: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  video?: string;
  craftVideo?: string;
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
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;

      const srcRaw = asString(record.src).trim();
      if (!srcRaw) return null;

      // support flexible keys (src/url/href/image)
      const src =
        srcRaw ||
        asString(record.url).trim() ||
        asString(record.href).trim() ||
        asString(record.image).trim();

      if (!src) return null;

      const caption = asString(record.caption).trim();

      // ✅ never generate “image 1”
      // priority:
      // 1) explicit alt
      // 2) caption (if you didn’t provide alt)
      // 3) fallback product name (ex: “Edge 5i” / “Mobius 3i” / etc.)
      const altRaw = asString(record.alt).trim();
      const alt = altRaw || caption || fallback || "Amina";

      return {
        src: buildAminaUrl(src),
        alt,
        caption: caption || undefined,
      };
    })
    .filter(Boolean) as AminaProduct["lifestyle"];


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
    return buildAminaUrl(raw);
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

const mapProducts = (items: unknown) =>
  asArray(items).map((item) => {
    const record = item && typeof item == "object" ? (item as Record<string, unknown>) : {};
    const name = asString(record.name);
    const slug = asString(record.slug) || (name ? slugify(name) : "");
    const image = asString(record.image);

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
      image: buildAminaUrl(image),
      specs: asStringArray(record.specs),
      specGroups,
      applications: asStringArray(record.applications),
      features: asStringArray(record.features),
      resources: resources.length ? resources : undefined,
      lifestyle: mapLifestyle(record.lifestyle, name || "Amina"),
      video: asString(record.video) ? buildAminaUrl(asString(record.video)) : undefined,
      craftVideo: asString(record.craftVideo) ? buildAminaUrl(asString(record.craftVideo)) : undefined,
    };
  });

export const aminaProducts: AminaProduct[] = [
  ...mapProducts(edge),
  ...mapProducts(mobius),
  ...mapProducts(sapphire),
  ...mapProducts(alf),
];
