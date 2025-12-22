import { buildEventsUrl } from "@/lib/assets";
import content from "./content.json";

export type EventMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string };

export type EventSummary = {
  slug: string;
  category: string;
  title: string;
  shortDescription: string;
  location: string;
  dateLabel: string;
  narrative: string;
  heroMedia: EventMedia;
  gallery: string[];
  highlights: string[];
};

export type EventDetail = {
  slug: string;
  title: string;
  category: string;
  location: string;
  dateRange: string;
  overview: string;
  profile?: string[];
  role?: string[];
  eventNarrative?: string[];
  keyProducts?: string[];
  additionalNotes?: string[];
  gallery: string[];
  heroMedia?: EventMedia;
  videos?: { title: string; url: string }[];
  externalLinks?: { label: string; href: string }[];
};

const asString = (value: unknown, fallback = "") =>
  typeof value == "string" ? value : fallback;

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown) =>
  asArray(value).filter((item) => typeof item == "string") as string[];

const mapMedia = (media: unknown, fallback: string): EventMedia | undefined => {
  if (!media || typeof media != "object") return undefined;
  const record = media as Record<string, unknown>;
  const kind = asString(record.kind);
  const src = asString(record.src);
  if (!src) return undefined;

  if (kind === "video") {
    return {
      kind: "video",
      src: buildEventsUrl(src),
      poster: asString(record.poster) ? buildEventsUrl(asString(record.poster)) : undefined,
    };
  }

  return {
    kind: "image",
    src: buildEventsUrl(src),
    alt: asString(record.alt, fallback),
  };
};

const mapGallery = (items: unknown) =>
  asStringArray(items).map((filename) => buildEventsUrl(filename));

const rawSummaries = asArray((content as any).summaries);
const rawDetails = (content as any).details ?? {};

export const EVENT_SUMMARIES: EventSummary[] = rawSummaries
  .map((item) => {
    if (!item || typeof item != "object") return null;
    const record = item as Record<string, unknown>;
    const title = asString(record.title);
    const heroMedia = mapMedia(record.heroMedia, title || "Event");

    if (!heroMedia) return null;

    return {
      slug: asString(record.slug),
      category: asString(record.category),
      title,
      shortDescription: asString(record.shortDescription),
      location: asString(record.location),
      dateLabel: asString(record.dateLabel),
      narrative: asString(record.narrative),
      heroMedia,
      gallery: mapGallery(record.gallery),
      highlights: asStringArray(record.highlights),
    };
  })
  .filter(Boolean) as EventSummary[];

export const EVENT_DETAILS: Record<string, EventDetail> = Object.fromEntries(
  Object.entries(rawDetails).map(([slug, detail]) => {
    const record = detail && typeof detail == "object" ? (detail as Record<string, unknown>) : {};
    const title = asString(record.title);

    return [
      slug,
      {
        slug: asString(record.slug, slug),
        title,
        category: asString(record.category),
        location: asString(record.location),
        dateRange: asString(record.dateRange),
        overview: asString(record.overview),
        profile: asStringArray(record.profile),
        role: asStringArray(record.role),
        eventNarrative: asStringArray(record.eventNarrative),
        keyProducts: asStringArray(record.keyProducts),
        additionalNotes: asStringArray(record.additionalNotes),
        gallery: mapGallery(record.gallery),
        heroMedia: mapMedia(record.heroMedia, title || "Event"),
        videos: asArray(record.videos)
          .map((video) => {
            if (!video || typeof video != "object") return null;
            const v = video as Record<string, unknown>;
            const url = asString(v.url);
            if (!url) return null;
            return { title: asString(v.title), url };
          })
          .filter(Boolean) as { title: string; url: string }[],
        externalLinks: asArray(record.externalLinks)
          .map((link) => {
            if (!link || typeof link != "object") return null;
            const l = link as Record<string, unknown>;
            const href = asString(l.href);
            if (!href) return null;
            return { label: asString(l.label), href };
          })
          .filter(Boolean) as { label: string; href: string }[],
      },
    ];
  })
);

export const getEventSummary = (slug: string) =>
  EVENT_SUMMARIES.find((event) => event.slug === slug);

export const getEventDetail = (slug: string) => EVENT_DETAILS[slug];
