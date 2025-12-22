import { HERO_BY_SLUG, TITLE_TO_SITE_IMAGE } from "./project-hero-images";

export function getProjectSiteImage(slug: string, title: string) {
  return HERO_BY_SLUG[slug] ?? TITLE_TO_SITE_IMAGE[title] ?? null;
}
