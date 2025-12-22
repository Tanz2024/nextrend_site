// lib/topSearchTerms.ts

export type TopSearchTerm = {
  query: string;       // what the user sees: e.g. "Wall / invisible speakers"
  href: string;        // where we redirect: brand / product page
  description: string; // short premium copy for cards
  keywords: string[];  // phrases we match against
  aliases?: string[];  // extra exact-match labels
  onlyProducts?: boolean;
};

export const TOP_SEARCH_TERMS: TopSearchTerm[] = [
  // 1. Wall / invisible speakers – Amina focus
  {
    query: "Wall / invisible speakers",
    href: "/products/amina",
    description:
      "Wall, ceiling and fully invisible speakers that disappear into plaster, paint or panels while keeping coverage even.",
    keywords: [
      // user phrases – wall & ceiling
      "wall speakers",
      "wall speaker",
      "wall & ceiling speakers",
      "wall & ceiling speaker",
      "wall and ceiling speakers",
      "wall and ceiling speaker",
      "ceiling speakers",
      "ceiling speaker",
      "in ceiling speakers",
      "in-ceiling speakers",
      "in wall speakers",
      "in-wall speakers",
      "mounted speakers",
      "wall mounted speakers",
      "wall-mounted speakers",
      "on wall speakers",
      "on-wall speakers",

      // invisible / hidden
      "hidden speakers",
      "hidden audio",
      "invisible speakers",
      "invisible sound system",
      "plaster over speakers",
      "plaster-in speakers",
      "flush wall speakers",
      "flush ceiling speakers",
      "wall-integrated audio",
      "ceiling-integrated audio",
      "discreet architectural sound",
      "gallery sound system",
      "museum audio",
      "boutique lobby speakers",
      "luxury residence audio",
      "condo sound system",
      "condominium speakers",
      "bungalow hidden speakers",

      // brand (Amina)
      "amina",
      "amina invisible",
      "amina speakers",
      "amina invisible speakers",
    ],
    aliases: [
      "Wall Speakers",
      "Ceiling Speakers",
      "Invisible Speakers",
      "Hidden Speakers",
      "Wall and Ceiling Speakers",
      "Wall & Ceiling Speakers",
      "Amina Invisible Speakers",
    ],
  },

  // 2. Shop & café speakers – K-GEAR
  {
    query: "Shop & café speakers",
    href: "/products/k-gear",
    description:
      "Compact installation speakers for shops, cafés and everyday spaces where music runs all day.",
    keywords: [
      // user phrases
      "shop speakers",
      "shop speaker system",
      "retail speakers",
      "retail speaker system",
      "cafe speakers",
      "cafe speaker system",
      "café speakers",
      "café speaker system",
      "coffee shop speakers",
      "kopitiam speakers",
      "kopitiam sound system",
      "bubble tea shop speakers",
      "background music speakers",
      "background music system",
      "small speakers",
      "compact speakers",
      "small install speakers",
      "installation speakers",
      "install speakers",
      "commercial speakers",
      "commercial audio speakers",
      "restaurant ceiling speakers",
      "restaurant background music",
      "flagship store speakers",
      "boutique retail audio",
      "lifestyle store sound",
      "multibrand showroom sound",
      "hair salon speakers",
      "salon sound system",
      "clinic lobby speakers",
      "clinic sound system",

      // brand (K-GEAR)
      "kgear",
      "k gear",
      "k-gear",
      "kgear speakers",
      "k gear speakers",
      "k-gear speakers",
      "kgear audio",
    ],
    aliases: [
      "Shop Speakers",
      "Café Speakers",
      "Retail Speakers",
      "KGEAR Speakers",
      "K Gear Speakers",
      "K-Gear Speakers",
    ],
  },

  // 3. Frog-is – outdoor / garden / pool
  {
    query: "Outdoor & garden speakers",
    href: "/products/frogis",
    description:
      "Outdoor and landscape speakers for gardens, pools and terraces where the music lives outside.",
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
      "rooftop bar speakers",
      "rooftop sound system",
      "bbq terrace speakers",
      // small typos / variations
      "gardener speakers",
      "gardener sound system",
      // brand
      "frogis",
      "frog-is",
      "frogis speakers",
      "frog-is speakers",
    ],
    aliases: [
      "Outdoor Speakers",
      "Garden Speakers",
      "Landscape Speakers",
      "Frog-is Speakers",
    ],
  },

  // 4. Trinnov – home theatre / cinema
  {
    query: "Home theater & cinema sound",
    href: "/products/trinnov",
    description:
      "Immersive home theater and private cinema systems with Trinnov processing and Dolby Atmos.",
    keywords: [
      "home theater",
      "home theatre",
      "home theater system",
      "home theatre system",
      "home cinema",
      "home cinema system",
      "private cinema",
      "cinema sound",
      "dolby atmos home",
      "atmos home theater",
      "immersive home theatre",
      "reference residential audio",
      "cinema processor",
      "home theater processor",
      "theatre audio",
      "theatre sound system",
      "cinema audio",
      "private screening room",
      "media room audio",
      "luxury home cinema malaysia",
      "bangsar home theater",
      "mont kiara home theater",

      // brand
      "trinnov",
      "trinnov audio",
      "trinnov processor",
      "trinnov altitude",
      "trinnov home cinema",
      "trinnov home theater",
    ],
    aliases: [
      "Home Theater",
      "Home Theatre",
      "Home Cinema",
      "Trinnov Home Cinema",
      "Trinnov Home Theater",
    ],
  },

  // 5. K-array – hospitality, club, party, conference
  {
    query: "Hospitality, club & event sound",
    href: "/products/k-array",
    description:
      "Slim line-array and design-forward systems for restaurants, lounges, clubs, weddings and corporate events.",
    keywords: [
      // hospitality
      "restaurant sound system",
      "restaurant sound systems",
      "restaurant music system",
      "restaurant audio",
      "bar sound system",
      "bar sound systems",
      "bar audio",
      "lounge sound system",
      "hotel sound system",
      "hospitality sound system",
      "hospitality audio",
      "resort",
      "resorts",
      "resort sound system",
      "resort audio",
      "resort speaker system",
      "resort entertainment audio",
      "restaurant",
      "restuarant",
      "cafe sound system",
      "cafe speakers",
      "cafes speakers",
      "cafe audio",
      "cafe background music",
      "luxury restaurant audio",
      "hotel lounge speakers",
      "resort lounge sound",
      "private club audio",
      "sports sound system",
      "sports bar sound system",
      "sports arena audio",
      "sports venue audio",
      "sports club audio",
      "karaoke sound system",
      "karaoke audio",
      "karaoke speakers",

      // party & nightclub
      "club sound system",
      "nightclub sound system",
      "night club sound system",
      "nightclub speakers",
      "club speakers",
      "dj speakers",
      "dj sound system",
      "party speakers",
      "party sound system",
      "dance floor sound system",
      "beach club sound system",

      // event / wedding / conference / summit
      "event sound system",
      "event speakers",
      "event audio",
      "live event sound system",
      "concert sound system",
      "wedding sound system",
      "banquet hall sound system",
      "wedding hall sound system",
      "ballroom sound system",
      "ballroom audio",
      "conference sound system",
      "conference speakers",
      "conference audio",
      "summit sound system",
      "summit audio",
      "corporate event sound system",
      "corporate event audio",

      // technical
      "slim speakers",
      "slim column speakers",
      "column speakers",
      "line array",
      "line array speakers",
      "pro audio speakers",

      // brand
      "k-array",
      "k array",
      "k-array speakers",
      "k array speakers",
    ],
    aliases: [
      "Restaurant Sound System",
      "Hospitality Audio",
      "Club Sound System",
      "Event Sound System",
      "Conference Sound System",
      "K-array Speakers",
      "K Array Speakers",
    ],
  },

  // 6. Brionvega – vintage design radios
  {
    query: "Vintage design radios",
    href: "/products/brionvega",
    description:
      "Reissued Italian design radios and systems from Brionvega – mid-century icons updated for today.",
    onlyProducts: true,
    keywords: [
      "vintage radio",
      "retro radio",
      "design radio",
      "designer radio",
      "italian design radio",
      "radiofonografo",
      "brionvega radiofonografo",
      "rr231",
      "rr226",
      "brionvega hifi",
      "brionvega record player",
      "brionvega turntable",
      "living room stereo",
      "designer hifi",
      // brand
      "brionvega",
      "brionvega radio",
      "brionvega vintage",
    ],
    aliases: [
      "Brionvega",
      "Brionvega Radio",
      "Brionvega Radiofonografo",
      "Vintage Brionvega",
    ],
  },

  // 7. BE@RBRICK – art / collectible speakers
  {
    query: "Art & collectible speakers",
    href: "/products/bearbricks",
    description:
      "BE@RBRICK speakers that turn collectible figures into full-range wireless audio systems.",
    keywords: [
      "bearbrick speaker",
      "bearbrick speakers",
      "bearbrick audio",
      "bearbrick bluetooth speaker",
      "be@rbrick speaker",
      "be@rbrick audio",
      "art toy speaker",
      "collectible speaker",
      "designer speaker",
      "design speaker toy",
      "display hifi",
      "living room art speaker",
      // brand
      "bearbrick",
      "bearbricks",
      "be@rbrick",
    ],
    aliases: [
      "BE@RBRICK Audio",
      "Bearbrick Speakers",
      "Bearbricks",
      "Bearbrick Audio Speaker",
    ],
  },

  // 8. Mall & atrium sound – K-array
  {
    query: "Mall & atrium sound",
    href: "/products/k-array",
    description:
      "High-SPL, controlled coverage for shopping malls, atriums and open public spaces.",
    keywords: [
      "mall sound system",
      "shopping mall sound system",
      "shopping mall speakers",
      "mall speakers",
      "mall pa system",
      "mall paging system",
      "atrium speakers",
      "atrium sound system",
      "mall event sound",
      "centre court sound",
      "shopping centre sound system",
      "ioi city mall speakers",
      "pavilion mall audio",
      "klcc mall sound",
      "mid valley mall speakers",
    ],
    aliases: [
      "Mall Sound System",
      "Atrium Sound System",
      "Shopping Mall Speakers",
    ],
  },

  // 9. School, hall & PA – K-array
  {
    query: "School & hall PA system",
    href: "/products/k-array",
    description:
      "Clear speech and music for school halls, auditoriums, surau and multi-purpose venues.",
    keywords: [
      "school sound system",
      "school hall sound system",
      "school pa system",
      "school speakers",
      "dewan sound system",
      "dewan speakers",
      "hall sound system",
      "hall pa system",
      "auditorium sound system",
      "auditorium speakers",
      "assembly hall sound",
      "lecture hall speakers",
      "mosque sound system",
      "masjid sound system",
      "masjid speakers",
      "surau sound system",
      "surau speakers",
      "pa system malaysia",
      "public address system",
    ],
    aliases: [
      "School Sound System",
      "Hall Sound System",
      "PA System",
      "Masjid & Surau Sound System",
    ],
  },

  // 10. Office, boardroom & VC
  {
    query: "Office & boardroom audio",
    href: "/products/k-array",
    description:
      "Discreet speakers and DSP for meeting rooms, boardrooms and video-conference spaces.",
    keywords: [
      "office sound system",
      "office speakers",
      "meeting room speakers",
      "meeting room sound system",
      "boardroom speakers",
      "boardroom sound system",
      "conference room speakers",
      "vc room audio",
      "zoom room speakers",
      "microsoft teams room audio",
      "huddle room audio",
      "presentation room sound",
    ],
    aliases: [
      "Boardroom Sound System",
      "Meeting Room Speakers",
      "Office Sound System",
    ],
  },
];

const normalizeQuery = (value?: string | null) =>
  value?.trim().toLowerCase() || "";

/**
 * Find the best matching TopSearchTerm for a free-form search.
 * 1) Strong exact matches on query / aliases / full keywords.
 * 2) Fuzzy scoring on partial keyword / phrase overlap.
 */
export function findTopSearchTerm(candidate?: string | null) {
  const normalized = normalizeQuery(candidate);
  if (!normalized) return undefined;

  // 1) exact match: query / alias / keyword
  const exact = TOP_SEARCH_TERMS.find((term) => {
    const lowerQuery = term.query.toLowerCase();
    if (lowerQuery === normalized) return true;

    if (term.aliases?.some((alias) => alias.toLowerCase() === normalized)) {
      return true;
    }

    if (
      term.keywords.some(
        (keyword) => keyword.toLowerCase() === normalized,
      )
    ) {
      return true;
    }

    return false;
  });
  if (exact) return exact;

  // 2) scored fuzzy match
  let best: { term: TopSearchTerm; score: number } | undefined;

  for (const term of TOP_SEARCH_TERMS) {
    let score = 0;
    const q = normalized;

    // base on query label itself
    const label = term.query.toLowerCase();
    if (label.includes(q)) score += 25;
    if (q.includes(label)) score += 15;

    // aliases
    if (term.aliases) {
      for (const alias of term.aliases) {
        const a = alias.toLowerCase();
        if (a === q) score += 40;
        else if (a.includes(q) || q.includes(a)) score += 18;
      }
    }

    // keywords
    for (const kw of term.keywords) {
      const k = kw.toLowerCase();
      if (k === q) {
        score += 30;
      } else {
        if (k.length >= 4 && q.length >= 3) {
          if (k.includes(q)) score += 10;
          if (q.includes(k)) score += 8;
        }
      }
    }

    if (!best || score > best.score) {
      best = { term, score };
    }
  }

  // require a minimum score so random junk doesn't map to something weird
  if (best && best.score >= 12) {
    return best.term;
  }

  return undefined;
}

/**
 * Shuffle helper for “Top searches” pills.
 * Use in UI so visitors don’t always see the same order.
 *
 * Example:
 *   const suggestions = getTopSearchSuggestions(6);
 */
export function getTopSearchSuggestions(limit?: number): TopSearchTerm[] {
  const items = [...TOP_SEARCH_TERMS];

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return typeof limit === "number" ? items.slice(0, limit) : items;
}
