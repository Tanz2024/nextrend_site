import { FrogisProduct } from "./types";
import data from "../content/high_performance_arrays.json";
import { buildFrogisUrl } from "@/lib/assets";

const mapProduct = (raw: any): FrogisProduct => {
  const mapLifestyle = (items: any[]) =>
    (items || []).map((item) => ({
      src: buildFrogisUrl(`High Performance array speaker systems/${item.src}`),
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
    image: buildFrogisUrl(`High Performance array speaker systems/${raw.image}`),
    lifestyle: mapLifestyle(raw.lifestyle || []),
  };
};

export const highPerformanceArraysProducts: FrogisProduct[] = (data as any[]).map(mapProduct);
