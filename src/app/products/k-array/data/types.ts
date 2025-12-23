import {
  buildKArraySpeakerUrl,
  buildKArraySubwooferUrl,
  buildKArrayMonitorUrl,
  buildKArraySystemUrl,
  buildKArrayUrl,
} from "@/lib/assets";

export type KArrayProduct = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  story: string;
  definition: string;
  series?: string;
  category?: string;
  finish: string;
  collaboration: string;
  power: string;
  image: string;
  lifestyle: Array<{ src: string; alt: string; caption?: string }>;
  specs: string[];
  specGroups?: Array<{
    title: string;
    items: Array<{ label: string; value: string }>;
  }>;
  resources?: Array<{ label: string; href: string }>;
  type?: string;
  drivers?: string;
  keyStats?: string[];
  frequency?: [number, number];
  coverage?: string;
  weightKg?: number;
  ipRating?: string;
  applications?: string[];
};

// Image base paths for each category using R2 CDN
export const IMG_BASE_SPEAKERS = (filename: string): string =>
  buildKArraySpeakerUrl(filename);

export const IMG_BASE_SUBWOOFERS = (filename: string): string =>
  buildKArraySubwooferUrl(filename);

export const IMG_BASE_MONITORS = (filename: string): string =>
  buildKArrayMonitorUrl(filename);

export const IMG_BASE_SYSTEMS = (filename: string): string =>
  buildKArraySystemUrl(filename);

// Audio + light and light are stored under K_array_images/* in the bucket
export const IMG_BASE_AUDIO_LIGHT = (filename: string): string =>
  buildKArrayUrl(`K_array_images/audio_light_images/${filename}`);

export const IMG_BASE_LIGHT = (filename: string): string =>
  buildKArrayUrl(`K_array_images/light_images/${filename}`);
