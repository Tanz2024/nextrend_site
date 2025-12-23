import { KArrayProduct } from "./types";
import data from "../content/speakers.json";
import { buildKArraySpeakerUrl } from "@/lib/assets";

const mapProduct = (raw: any): KArrayProduct => {
  const mapLifestyle = (items: any[]) =>
    (items || []).map((item) => ({
      src: buildKArraySpeakerUrl(item.src),
      alt: item.alt || "",
      caption: item.caption,
    }));

  const mapResources = (items: any[]) =>
    (items || [])
      .map((r) => {
        if (!r) return null;
        const label = (r.label || r.title || r.name || "Download PDF")
          .toString()
          .trim();
        const href = (r.href || r.url || r.src || "").toString().trim();
        if (!href) return null;
        return { label, href: buildKArraySpeakerUrl(href) };
      })
      .filter(Boolean);

  const series =
    typeof raw.series == "string" && raw.series.trim() ? raw.series.trim() : undefined;
  const category =
    typeof raw.category == "string" && raw.category.trim() ? raw.category.trim() : undefined;

  return {
    slug: raw.slug,
    name: raw.name,
    headline: raw.headline,
    description: raw.description,
    story: raw.story,
    definition: raw.definition,
    series,
    category,
    finish: raw.finish,
    collaboration: raw.collaboration,
    power: raw.power,
    type: raw.type,
    drivers: raw.drivers,
    applications: raw.applications || [],
    specs: raw.specs || [],
    keyStats: raw.keyStats || [],
    frequency: raw.frequency as [number, number] | undefined,
    coverage: raw.coverage,
    weightKg: raw.weightKg,
    ipRating: raw.ipRating,
    image: buildKArraySpeakerUrl(raw.image),
    lifestyle: mapLifestyle(raw.lifestyle || []),
    resources: raw.resources ? mapResources(raw.resources) : undefined,
    specGroups: raw.specGroups || [],
  };
};

export const speakersProducts: KArrayProduct[] = (data as any[]).map(mapProduct);
