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

  return {
    slug: raw.slug,
    name: raw.name,
    headline: raw.headline,
    description: raw.description,
    story: raw.story,
    definition: raw.definition,
    series: raw.series,
    category: raw.category,
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
    resources: raw.resources || undefined,
  };
};

export const speakersProducts: KArrayProduct[] = (data as any[]).map(mapProduct);
