import { buildGeneralImageUrl, buildProjectSiteUrl } from "@/lib/assets";
import content from "./content.json";
import { PROJECT_LIST } from "./project-data";

const resolveProjectImage = (value: unknown) => {
  if (typeof value != "string" || !value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return buildGeneralImageUrl(value);
  }
  if (value.includes("/")) {
    return buildGeneralImageUrl(value);
  }
  return buildProjectSiteUrl(value);
};

const rawTitleMap = (content as any).titleToSiteImage ?? {};

export const TITLE_TO_SITE_IMAGE: Record<string, string> = Object.fromEntries(
  Object.entries(rawTitleMap).map(([title, filename]) => [
    title,
    resolveProjectImage(filename),
  ]),
);

export const HERO_BY_SLUG: Record<string, string> = PROJECT_LIST.reduce(
  (acc, project) => {
    const image = TITLE_TO_SITE_IMAGE[project.title];
    if (image) acc[project.slug] = image;
    return acc;
  },
  {} as Record<string, string>
);
