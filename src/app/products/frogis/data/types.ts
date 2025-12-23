export type FrogisCategory =
  | "Point source speakers"
  | "Slimline array speaker systems"
  | "High Performance array speaker systems"
  | "Ceiling speakers"
  | "Subwoofers"
  | "Microphones and headphones";

import { buildFrogisUrl } from "@/lib/assets";

export type FrogisProduct = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  story: string;
  series?: FrogisCategory; // used as filter
  category?: FrogisCategory; // product category
  finish: string;
  collaboration: string;
  power?: string;
  type?: string;
  drivers?: string;
  applications?: string[];
  image: string;
  lifestyle: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  specs: string[]; // features + applications + notes
  specGroups?: Array<{
    title: string;
    items: Array<{ label: string; value: string }>;
  }>;
  resources?: Array<{ label: string; href: string }>;
  definition?: string;
  features?: string[];
  keyStats?: string[];
  frequency?: [number, number];
  coverage?: string;
  weightKg?: number;
  ipRating?: string;
};

// Image base paths for each category using R2 CDN
export const IMG_BASE_POINT_SOURCE = (filename: string) => buildFrogisUrl(`Point source speakers/${filename}`);
export const IMG_BASE_CEILING = (filename: string) => buildFrogisUrl(`Ceiling speakers/${filename}`);
export const IMG_BASE_SUBWOOFERS = (filename: string) => buildFrogisUrl(`Subwoofers/${filename}`);
export const IMG_BASE_MICROPHONES = (filename: string) => buildFrogisUrl(`Microphones and headphones/${filename}`);
export const IMG_BASE_SLIMLINE_ARRAYS = (filename: string) => buildFrogisUrl(`Slimline array speaker systems/${filename}`);
export const IMG_BASE_HIGH_PERFORMANCE = (filename: string) => buildFrogisUrl(`High Performance array speaker systems/${filename}`);

// General image base path for backward compatibility
export const IMG_BASE = (filename: string) => buildFrogisUrl(filename);

// Category feature descriptions
export const CATEGORY_FEATURES: Record<FrogisCategory, string[]> = {
  "High Performance array speaker systems": [
    "High-output line-array modules engineered for cathedral-level SPL with surgical vertical control.",
    "Integrated rigging frames and thermal relief built to handle touring loads and demanding installations.",
    "DSP-curated voicing keeps long-throw coverage coherent while remaining articulate onstage and in VIP rooms.",
  ],
  "Slimline array speaker systems": [
    "Ultra-slim column loudspeakers that disappear into architectural shells without compromising presence.",
    "Pure Array Technology delivers forward-dialogue clarity while spreading coverage evenly across lounges.",
    "Modular rigging and bracket options let the arrays adapt to temporary shows or fixed hospitality installs.",
  ],
  "Ceiling speakers": [
    "Architectural ceiling solutions with shallow backcans and paint-ready grilles that vanish into plaster or tiles.",
    "Voiced for elegant background music, paging, and high-visibility retail atmospheres.",
    "Switchable low-Z and multi-tap operation keeps them ready for distributed 70/100 V systems.",
  ],
  "Point source speakers": [
    "Compact Italian cabinets that shine both on the road and in discreet resident installations.",
    "Weather-sealed finishes, rugged brackets and sculpted grilles survive bars, terraces and outdoor lounges.",
    "Balanced voicing ensures they integrate effortlessly with Frog-is arrays and matching subs.",
  ],
  Subwoofers: [
    "Subwoofer modules tuned to partner every Frog-is top system while keeping the bass tight.",
    "Available in active and passive variants with DSP preset banks for musical impact.",
    "Controlled radiation keeps LF energy focused on the room without muddying the midrange.",
  ],
  "Microphones and headphones": [
    "Capture and monitor tools designed to match the same craftsmanship as Frog-is loudspeakers.",
    "Reliable RF, pre-emphed capsules and low-latency monitoring for broadcast, corporate and house-of-worship stages.",
    "Comfortable headphones keep crews focused across long rehearsals while remaining studio-calibre.",
  ],
};

// Category applications
export const CATEGORY_APPLICATIONS: Record<FrogisCategory, string[]> = {
  "High Performance array speaker systems": [
    "Cathedral worship, flagship clubs, outdoor stages and high-energy theatres.",
  ],
  "Slimline array speaker systems": [
    "Luxury hotels, lounges, boutique retail and multi-purpose ballrooms where discretion matters.",
  ],
  "Ceiling speakers": [
    "Retail flagships, Michelin-starred restaurants, executive offices and gallery ceilings.",
  ],
  "Point source speakers": [
    "Portable PA, DJ booths, intimate concert clubs, touring rigs and bespoke hospitality suites.",
  ],
  Subwoofers: [
    "Music bars, lounges, theatres and retail arenas that demand focused low-frequency impact without sightlines.",
  ],
  "Microphones and headphones": [
    "Spoken-word reinforcement, broadcast studios, corporate presentations and monitoring suites.",
  ],
};
