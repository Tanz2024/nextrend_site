// lib/searchCategories.ts

export type SpeakerRef = {
  brand: "amina" | "k-array" | "k-gear" | "brionvega" | "frogis";
  slug: string;
};

export type CategorySuggestion = {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  projects: string[];
  speakers: SpeakerRef[];
};

const CATEGORY_SUGGESTIONS: CategorySuggestion[] = [
  /* ------------------------------------------------
   * 1. Retail & boutique experiences
   * ------------------------------------------------ */
  {
    id: "retail",
    label: "Retail & boutique experiences",
    description:
      "Hand-picked projects that keep ambience elegant without overpowering conversations or fixtures.",
    keywords: [
      "retail",
      "retail experience",
      "shop",
      "store",
      "boutique",
      "boutique experiences",
      "flagship",
      "luxury retail",
      "luxury retail experience",
      "shopping",
      "shopping mall",
      "concept store",
      "lifestyle store",
      "showroom",
      "showroom sound system",
      "sound system for showroom",
      "multi zone audio system",
      "multi zone audio system for showroom",
      "BMW M showroom",
      "luxury boutique audio",
      "architectural speakers for retail",
      "architectural speakers for boutique",
      "retail sound system installation",
      "shop sound system malaysia",
    ],
    projects: [
      "van-cleef-arpels-boutique",
      "fendi-boutique",
      "bmw-m",
    ],
    speakers: [
      { brand: "amina", slug: "edge-5i" },
      { brand: "k-array", slug: "lyzard-kz14-i" },
      { brand: "k-gear", slug: "gf82i" },
    ],
  },

  /* ------------------------------------------------
   * 2. Hotel lobbies & hospitality
   * ------------------------------------------------ */
  {
    id: "hotel",
    label: "Hotel lobbies & hospitality",
    description:
      "Projects curated for grand public zones, suites and lounges where warmth and control matter.",
    keywords: [
      "hotel",
      "resort",
      "resorts",
      "resort hospitality",
      "resort experience",
      "resort lobby",
      "resort suites",
      "resort lounge",
      "lobby",
      "suite",
      "hospitality",
      "lodging",
      "guesthouse",
      "guest experience",
      "accommodation",
      "concierge",
      "hotel lobby",
      "sound system for hotel lobby",
      "hotel sound system",
      "hotel sound system installation",
      "architectural speakers for hotel",
      "discreet speakers for hotel lobby",
      "discreet speakers for hotel reception",
      "luxury hotel sound system",
      "hotel background music",
    ],
    projects: [
      "parkroyal-collection",
      "mandarin-oriental-hotel",
      "hilton-hotel",
    ],
    speakers: [
      { brand: "k-array", slug: "python-kp102-i" },
      { brand: "k-gear", slug: "gh4" },
      { brand: "amina", slug: "mobius-5i" },
    ],
  },

  /* ------------------------------------------------
   * 3. Club & nightlife sound
   * ------------------------------------------------ */
  {
    id: "club",
    label: "Club & nightlife sound",
    description:
      "Signature projects that need energy for DJs, dancing and late-night programmes.",
    keywords: [
      "club",
      "nightclub",
      "night club",
      "nightlife",
      "night life",
      "dance",
      "dance floor",
      "dj",
      "dj set",
      "dj sets",
      "party",
      "party sound",
      "after hours",
      "after-hours",
      "late night",
      "night scene",
      "night program",
      "club scene",
      "after-party",
      "late-night club",
      "karaoke club",
      "KTV",
      "karaoke lounge",
      "rooftop bar",
      "rooftop nightlife",
      "sound system for club",
      "bar & lounge sound system",
      "nightclub sound system",
      "bar & club sound system",
      "dj sound system installation",
      "club sound system installation malaysia",
    ],
    projects: [
      "the-kitch-n-club",
      "wedge-range",
      "the-iron-fairies",
    ],
    speakers: [
      { brand: "k-array", slug: "dragon-kx12-i" },
      { brand: "k-array", slug: "mugello-kh2p-i" },
      { brand: "k-gear", slug: "gh12" },
    ],
  },

  /* ------------------------------------------------
   * 4. Restaurants & dining
   * ------------------------------------------------ */
  {
    id: "restaurant",
    label: "Restaurants & dining",
    description:
      "Intimate dining rooms that still need an audible soundtrack without visual distraction.",
    keywords: [
      "restaurant",
      "restuarant",
      "restaurant audio",
      "restaurant sound system",
      "dining",
      "dine",
      "fine dining",
      "bistro",
      "cafe",
      "café",
      "bar",
      "gastro pub",
      "gastro",
      "dining room",
      "dining experience",
      "wine bar",
      "food hall",
      "chef's table",
      "bar & grill",
      "cafe dining",
      "cafe background music",
      "restaurant lounge",
      "sound system for restaurant",
      "professional sound system installer",
      "sound system installation malaysia",
      "sound system contractor malaysia",
      "restaurant sound system installation",
      "café sound system installation",
      "bar sound system installation",
    ],
    projects: [
      "gordon-ramsay-bar-grill",
      "pop-pizza",
      "berjaya-cafe",
    ],
    speakers: [
      { brand: "k-array", slug: "vyper-kv52-ii" },
      { brand: "k-gear", slug: "gh4" },
      { brand: "k-gear", slug: "gf82i" },
    ],
  },

  /* ------------------------------------------------
   * 5. Sport & performance venues
   * ------------------------------------------------ */
  {
    id: "sport",
    label: "Sport & performance venues",
    description:
      "Large, reverberant arenas that demand speech clarity, crowd control and boomy energy.",
    keywords: [
      "sport",
      "sports",
      "arena",
      "stadium",
      "gym",
      "fitness",
      "court",
      "pickleball",
      "golf",
      "clubhouse",
      "training facility",
      "performance hall",
      "athletic club",
      "sports bar",
      "sports complex",
      "sports venue",
      "sports arena audio",
      "sports club",
      "indoor stadium sound system",
      "sports hall sound system",
      "sports facility speakers",
    ],
    projects: [
      "national-aquatic-centre",
      "sunway-carnival-mall",
      "eco-grandeur",
    ],
    speakers: [
      { brand: "k-gear", slug: "gh4" },
      { brand: "k-gear", slug: "gf82i" },
      { brand: "k-array", slug: "kobra-kk102-i" },
    ],
  },

  /* ------------------------------------------------
   * 6. Events & production
   * ------------------------------------------------ */
  {
    id: "event",
    label: "Events & production",
    description:
      "High-output event systems for weddings, expos and corporate functions that still feel polished.",
    keywords: [
      "event",
      "events",
      "wedding",
      "conference",
      "expo",
      "ballroom",
      "summit",
      "gala",
      "production",
      "festival",
      "corporate event",
      "launch event",
      "event production",
      "event entertainment",
      "event experiences",
      "sound system for function hall",
      "sound system for ballroom",
      "ballroom sound system",
      "function hall sound system",
      "auditorium sound system",
      "multipurpose hall sound system",
      "auditorium audio",
      "mobile pa system",
    ],
    projects: [
      "rosewood",
      "gsc-aurum-the-gardens-mall",
      "hotel-perdana",
    ],
    speakers: [
      { brand: "k-array", slug: "pinnacle-kr402-ii" },
      { brand: "k-gear", slug: "gp12a" },
      { brand: "k-gear", slug: "gp1812a" },
    ],
  },

  /* ------------------------------------------------
   * 7. Mosque & prayer halls
   * ------------------------------------------------ */
  {
    id: "mosque",
    label: "Mosque & prayer halls",
    description:
      "Long-throw, highly intelligible systems for mosques, surau and worship halls across Malaysia.",
    keywords: [
      "mosque sound system",
      "masjid sound system",
      "surau sound system",
      "prayer hall speakers",
      "prayer hall sound system",
      "azan speakers",
      "azan sound system",
      "khutbah speakers",
      "speech clarity mosque",
      "worship hall sound system",
      "religious hall pa system",
    ],
    projects: [
      "islamic-arts-museum",
      "sjkc-soo",
      "tzu-chi-international-school",
    ],
    speakers: [
      { brand: "k-array", slug: "kobra-kk102-i" },
      { brand: "k-array", slug: "vyper-kv52-ii" },
      { brand: "k-gear", slug: "gf82i" },
    ],
  },

  /* ------------------------------------------------
   * 8. Corporate offices & meeting rooms
   * ------------------------------------------------ */
  {
    id: "corporate",
    label: "Corporate offices & meeting rooms",
    description:
      "Discreet speakers for boardrooms, conferencing suites and corporate experience centres.",
    keywords: [
      "office sound system",
      "office speakers",
      "meeting room speakers",
      "meeting room sound system",
      "boardroom sound system",
      "conference room audio",
      "video conferencing speakers malaysia",
      "training room sound system",
      "corporate audio installation",
      "office pa system",
      "office background music",
    ],
    projects: [
      "etiqa-insurance",
      "great-eastern",
      "maxis-communications",
    ],
    speakers: [
      { brand: "k-array", slug: "lyzard-kz14-i" },
      { brand: "amina", slug: "edge-5i" },
      { brand: "k-gear", slug: "gh4" },
    ],
  },

  /* ------------------------------------------------
   * 9. Education & campus spaces
   * ------------------------------------------------ */
  {
    id: "education",
    label: "Education & campus spaces",
    description:
      "Lecture halls, multi-purpose halls and classrooms that need even coverage and clear speech.",
    keywords: [
      "school hall sound system",
      "classroom speakers malaysia",
      "classroom sound system",
      "lecture hall audio",
      "lecture hall sound system",
      "university sound system",
      "campus speakers",
      "multipurpose hall speakers",
      "school pa system",
      "assembly hall sound system",
    ],
    projects: [
      "tzu-chi-international-school",
      "sjkc-soo",
      "esyariah-hq",
    ],
    speakers: [
      { brand: "k-array", slug: "kobra-kk102-i" },
      { brand: "k-gear", slug: "gf82i" },
      { brand: "k-gear", slug: "gp12a" },
    ],
  },

  /* ------------------------------------------------
   * 10. Residences & private cinema
   * ------------------------------------------------ */
  {
    id: "residence",
    label: "Residences & private cinema",
    description:
      "Quiet sanctuaries where invisibility and ambience go hand in hand.",
    keywords: [
      "residence",
      "residential",
      "home",
      "villa",
      "apartment",
      "penthouse",
      "private residence",
      "premium residential sound",
      "luxury sound system for home",
      "home sound system malaysia",
      "home cinema",
      "private cinema",
      "private cinema sound system",
      "home theatre",
      "home theatre sound system malaysia",
      "villa sound system design",
      "apartment sound system installation",
      "architectural speakers for interior design",
      "invisible speakers for living room",
      "invisible speakers for home theatre",
      "discreet speakers for restaurant",
      "architectural design speakers",
      "dolby atmos & immersive audio",
      "professional cinema speakers",
      "acoustic treatment & tuning",
    ],
    projects: [
      "twin-palms-residence",
      "meridian-east",
      "kl-bt",
    ],
    speakers: [
      { brand: "k-array", slug: "lyzard-kz14-i" },
      { brand: "k-array", slug: "vyper-kv25-ii" },
      { brand: "amina", slug: "edge-5i" },
    ],
  },

  /* ------------------------------------------------
   * 11. Theatre & cinema
   * ------------------------------------------------ */
  {
    id: "theatre",
    label: "Theatre & cinema",
    description:
      "Cinema and presentation spaces that need controlled throw and heartfelt clarity.",
    keywords: [
      "theatre",
      "theater",
      "cinema",
      "auditorium",
      "screening",
      "stage",
      "performance space",
      "film screening",
      "presentation room",
      "playhouse",
      "performance theatre",
      "GSC Aurum",
      "GSC cinema",
      "GSC movies",
      "boutique cinema",
      "premiere cinema",
      "art house cinema",
      "rooftop cinema",
      "cinema sound system",
      "cinema speakers",
    ],
    projects: [
      "gsc-aurum-the-gardens-mall",
      "gsc-aurum-southkey",
      "rosewood",
    ],
    speakers: [
      { brand: "k-array", slug: "vyper-kv52-ii" },
      { brand: "k-array", slug: "kobra-kk102-i" },
      { brand: "k-gear", slug: "gh4" },
    ],
  },

  /* ------------------------------------------------
   * 12. Karaoke & entertainment suites
   * ------------------------------------------------ */
  {
    id: "karaoke",
    label: "Karaoke & entertainment suites",
    description:
      "High-energy, upstairs bars and private suites that need precise imaging plus deep lows.",
    keywords: [
      "karaoke",
      "karaoke bar",
      "sing-along",
      "karaoke lounge",
      "karaoke suite",
      "karaoke room",
      "private karaoke",
      "karaoke night",
      "karaoke entertainment",
      "karaoke party",
      "ktv room",
      "ktv sound system",
    ],
    projects: [
      "the-kitch-n-club",
      "wedge-range",
      "handlebar-bar",
    ],
    speakers: [
      { brand: "k-array", slug: "kobra-kk52-i" },
      { brand: "k-array", slug: "python-kp52-i" },
      { brand: "k-gear", slug: "gh4" },
    ],
  },

  /* ------------------------------------------------
   * 13. Outdoor & landscape (Frog-is focus)
   * ------------------------------------------------ */
  {
    id: "outdoor",
    label: "Outdoor & landscape",
    description:
      "Weather-resistant speakers that disappear into gardens, pools and terraces while keeping the energy outside.",
    keywords: [
      "outdoor speakers",
      "outdoor speaker",
      "outdoor sound system",
      "outdoor music system",
      "garden speakers",
      "garden speaker",
      "garden sound system",
      "garden audio",
      "terrace speakers",
      "balcony speakers",
      "pool speakers",
      "landscape speakers",
      "landscape audio",
      "outdoor garden speakers weatherproof",
      "outdoor terrace speakers weatherproof",
      "outdoor garden audio system",
      "landscape spot speakers",
      "pathway speakers",
    ],
    projects: [
      "aspen-vervea",
      "eco-horizon",
      "eco-meadow",
    ],
    speakers: [
      // Frog-is outdoor point-source models that match the category brief
      { brand: "frogis", slug: "fi-ct4ip" },
      { brand: "frogis", slug: "fi-ct6ip" },
      { brand: "k-gear", slug: "gf82i" },
    ],
  },

  /* ------------------------------------------------
   * 14. HiFi & reference listening
   * ------------------------------------------------ */
  {
    id: "hifi",
    label: "HiFi & reference listening",
    description:
      "Reference-grade systems for audiophile lounges, galleries and bespoke media rooms, partnered with posh signature hardware.",
    keywords: [
      "hifi",
      "hi-fi",
      "audiophile",
      "reference audio",
      "reference system",
      "audiophile lounge",
      "high fidelity",
      "reference listening",
      "bespoke hi-fi",
      "posh audio",
      "gallery-grade stereo",
      "rich lounge audio",
      "audiophile listening room",
      "premium stereo system",
      "designer audio console",
      "design radio",
      "italian design radio",
      "radiofonografo",
      "brionvega radiofonografo",
      "brionvega hifi",
      "brionvega vintage",
      "premium residential sound malaysia",
      "home theatre & cinema speakers malaysia",
      "architectural speakers for interior design projects",
      "premium designer speakers for living room",
      "architecture-grade speakers",
    ],
    projects: [
      "rosewood",
      "twin-palms-residence",
      "meridian-east",
    ],
    speakers: [
      { brand: "k-array", slug: "vyper-kv52-ii" },
      { brand: "k-array", slug: "dolomite-krd202p" },
      { brand: "k-array", slug: "vyper-kv102-ii" },
      { brand: "brionvega", slug: "radiofonografo-rosso" },
      { brand: "brionvega", slug: "radiofonografo-noce" },
      { brand: "brionvega", slug: "totem-speaker" },
    ],
  },
];

const normalizeCategoryText = (value: string) =>
  value.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();

export const findCategorySuggestion = (query: string) => {
  const q = normalizeCategoryText(query);
  if (!q) return undefined;

  return CATEGORY_SUGGESTIONS.find((entry) => {
    const label = normalizeCategoryText(entry.label);
    const id = normalizeCategoryText(entry.id);

    if (label === q || id === q) return true;
    if (label.includes(q) || q.includes(label)) return true;

    return entry.keywords.some((keyword) => {
      const k = normalizeCategoryText(keyword);
      return k === q || q.includes(k) || k.includes(q);
    });
  });
};

export const searchCategorySuggestions = CATEGORY_SUGGESTIONS;
