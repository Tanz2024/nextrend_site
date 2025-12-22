/**
 * Asset URL utilities for Cloudflare R2 CDN
 * Centralizes all asset URL generation with validation and security
 */

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

if (!R2_BASE_URL) {
  console.warn(
    "NEXT_PUBLIC_R2_BASE_URL not found in environment variables. Falling back to /images/*."
  );
}

/**
 * Builds a secure asset URL from R2 CDN
 * @param folderPath - The folder path (e.g., 'K_array_images', 'Bearricks_lifestyles')
 * @param filename - The filename with extension OR a full URL
 * @returns Complete HTTPS URL to the asset
 */
export function buildAssetUrl(folderPath: string, filename: string): string {
  if (!filename) return "";

  // If already a full URL, just return it (avoid double-prefix bugs)
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename.replace(/^http:/, "https:");
  }

  // Fallback to local /images for dev if R2_BASE_URL not set
  if (!R2_BASE_URL) {
    const cleanFolderLocal = folderPath.replace(/^\/+|\/+$/g, "");
    const cleanFilenameLocal = filename.replace(/^\/+/, "");
    const joinedLocal = [cleanFolderLocal, cleanFilenameLocal]
      .filter(Boolean)
      .join("/");

    // Served from /public/images/*
    return `/images/${joinedLocal}`;
  }

  // Normalise paths
  const cleanFolder = folderPath.replace(/^\/+|\/+$/g, ""); // trim leading/trailing slashes
  const cleanFilename = filename.replace(/^\/+/, ""); // trim leading slash

  const joined = [cleanFolder, cleanFilename].filter(Boolean).join("/");

  // encodeURI handles spaces etc. but does NOT double-encode '%' from %20 etc.
  const safePath = encodeURI(joined).replace(/&/g, "%26");

  const fullUrl = `${R2_BASE_URL}/${safePath}`;

  // Ensure HTTPS for security
  return fullUrl.replace(/^http:/, "https:");
}

/**
 * Asset folder constants for consistency
 * (Update these to match actual folder names in your R2 bucket)
 */
export const ASSET_FOLDERS = {
  K_ARRAY_SPEAKERS: "K_array_images/speakers_images",
  K_ARRAY_SUBWOOFERS: "K_array_images/subwoofers_images",
  K_ARRAY_SYSTEMS: "K_array_images/systems_images",
  K_ARRAY_MONITORS: "K_array_images/monitors_images",
  K_GEAR: "K_Gear_images",
  BEARBRICKS_LIFESTYLES: "Bearricks_lifestyles",
  BEARBRICKS_PRODUCTS: "Bearricks_products",
  AMINA: "Amina_images",
  BRIONVEGA: "Brionvega_products",
  TRINNOV: "Trinnov_images",
  FROGIS: "Frogis_images",
  JOURNAL: "journal_project_images",
  JOURNAL_IMAGES: "journal_images",
  LOGOS: "logos",
  ABOUTUS: "aboutus_images",
  LIFESTYLES_VIDEO: "lifestyles_video",
  EVENTS: "Events_image_videos",
  PROJECT_SITES: "project_sites",
  PROJECT_IMAGES: "project_images",
  /**
   * GENERAL:
   * - If your general site images (Consultation.jpg, BYD.jpeg, etc.)
   *   are at the bucket ROOT, keep this as "".
   * - If you actually put them under an "images/" folder IN the bucket,
   *   change this to "images".
   */
  GENERAL: "",
} as const;

/**
 * Convenience functions for specific asset types
 */

export function buildKArraySpeakerUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.K_ARRAY_SPEAKERS, filename);
}

export function buildKArraySubwooferUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.K_ARRAY_SUBWOOFERS, filename);
}

export function buildKArraySystemUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.K_ARRAY_SYSTEMS, filename);
}

export function buildKArrayMonitorUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.K_ARRAY_MONITORS, filename);
}

/**
 * For general K-array paths that already include folder structure,
 * e.g. "K_array_images/systems_images/Azimut-KAMUT2L II_main.jpg"
 */
export function buildKArrayUrl(path: string) {
  if (!path) return "";

  // If caller already includes folder structure, don't prefix again
  const finalPath = path.includes("/")
    ? path
    : `K_array_images/${path}`;

  return buildAssetUrl("", finalPath);
}

export function buildKGearUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.K_GEAR, filename);
}

export function buildBearbricksLifestyleUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.BEARBRICKS_LIFESTYLES, filename);
}

export function buildBearbricksProductUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.BEARBRICKS_PRODUCTS, filename);
}

export function buildAminaUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.AMINA, filename);
}

export function buildBrionvegaUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.BRIONVEGA, filename);
}

export function buildTrinnovUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.TRINNOV, filename);
}

export function buildFrogisUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.FROGIS, filename);
}

export function buildJournalUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.JOURNAL, filename);
}

export function buildJournalImageUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.JOURNAL_IMAGES, filename);
}

export function buildLogoUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.LOGOS, filename);
}

export function buildAboutUsUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.ABOUTUS, filename);
}

export function buildGeneralImageUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.GENERAL, filename);
}

export function buildLifestyleVideoUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.LIFESTYLES_VIDEO, filename);
}

export function buildEventsUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.EVENTS, filename);
}

export function buildProjectSiteUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.PROJECT_SITES, filename);
}

export function buildProjectImageUrl(filename: string) {
  return buildAssetUrl(ASSET_FOLDERS.PROJECT_IMAGES, filename);
}

/**
 * Legacy path converter - converts old /images/ paths to R2 URLs
 * @param oldPath - The old path starting with /images/
 * @returns New R2 URL (or the original path if R2 is not configured)
 */
export function convertLegacyPath(oldPath: string): string {
  if (!oldPath || !oldPath.startsWith("/images/")) {
    return oldPath;
  }

  // If R2 isn't configured, just keep serving from /public/images
  if (!R2_BASE_URL) {
    return oldPath;
  }

  // Strip the /images/ prefix
  const relative = decodeURIComponent(oldPath.replace(/^\/images\//, ""));

  if (!relative) {
    return oldPath;
  }

  // If there is folder structure (e.g. "K_array_images/systems_images/…")
  // map directly from bucket root (this matches K-array layout on R2).
  if (relative.includes("/")) {
    return buildAssetUrl("", relative);
  }

  // Single file directly under /images (e.g. "/images/Consultation.jpg")
  // Route via GENERAL folder so you can decide where those live on R2.
  return buildAssetUrl(ASSET_FOLDERS.GENERAL, relative);
}
