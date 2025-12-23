/* ------------------------------------
   Project Catalogue
------------------------------------ */

import { buildGeneralImageUrl, buildProjectSiteUrl } from "@/lib/assets";
import content from "./content.json";

export type ProjectSystemMap = Record<string, string[]>;

export type ProjectCard = {
  title: string;
  context: string;
  location?: string;
  focus: string[];
  profile?: string;
  role?: string | string[];
  system?: ProjectSystemMap;
  completion?: string;
};

const asString = (value: unknown, fallback = "") =>
  typeof value == "string" ? value : fallback;

const asArray = (value: unknown) => (Array.isArray(value) ? value : []);

const asStringArray = (value: unknown) =>
  asArray(value).filter((item) => typeof item == "string") as string[];

const asSystemMap = (value: unknown) => {
  if (!value || typeof value != "object") return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .map(([zone, items]) => [zone, asStringArray(items)] as const)
    .filter(([, items]) => items.length > 0);
  return entries.length ? Object.fromEntries(entries) : undefined;
};

const completionLabelFrom = (raw?: string) => {
  if (!raw) return undefined;
  const s = raw.replace(/ /g, " ").trim();
  return s ? `Completed ${s}` : undefined;
};

export type ProjectSections = Record<string, ProjectCard[]>;

const rawSections = (content as any).sections ?? {};

export const PROJECT_SECTIONS: ProjectSections = Object.fromEntries(
  Object.entries(rawSections).map(([section, items]) => {
    const projects = asArray(items)
      .map((item) => {
        if (!item || typeof item != "object") return null;
        const record = item as Record<string, unknown>;
        return {
          title: asString(record.title),
          context: asString(record.context),
          location: asString(record.location) || undefined,
          focus: asStringArray(record.focus),
          profile: asString(record.profile) || undefined,
          role: record.role as ProjectCard["role"],
          system: asSystemMap(record.system),
          completion: asString(record.completion) || undefined,
        };
      })
      .filter(Boolean) as ProjectCard[];

    return [section, projects];
  })
);

/* ------------------------------------
   Slugs / Lists
------------------------------------ */

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export type ProjectDetail = ProjectCard & {
  slug: string;
  vertical: string;
};

export const PROJECT_LIST: ProjectDetail[] = Object.entries(
  PROJECT_SECTIONS,
).flatMap(([vertical, projects]) =>
  projects.map((project) => ({
    ...project,
    vertical,
    slug: slugify(project.title),
  })),
);

export const PROJECT_BY_SLUG: Record<string, ProjectDetail> =
  PROJECT_LIST.reduce((acc, project) => {
    acc[project.slug] = project;
    return acc;
  }, {} as Record<string, ProjectDetail>);

export type ProjectTotals = {
  totalProjects: number;
  hospitality: number;
  residential: number;
  commercialRetail: number;
  entertainmentVenues: number;
};

export const PROJECT_TOTALS: ProjectTotals = {
  totalProjects: PROJECT_LIST.length,
  hospitality: PROJECT_SECTIONS["Hospitality"]?.length ?? 0,
  residential: PROJECT_SECTIONS["Residential"]?.length ?? 0,
  commercialRetail: PROJECT_SECTIONS["Commercial & Retail"]?.length ?? 0,
  entertainmentVenues: PROJECT_SECTIONS["Entertainment & Venues"]?.length ?? 0,
};

export const PROJECT_EXPERIENCE =
  (content as any).experience ?? "10+ years";

/* ------------------------------------
   Project Detail Metadata
------------------------------------ */

export type ProjectDetailMeta = {
  description: string;
  location: string;
  application: string;
  context?: string;
  role: string;
  keyProducts: string[];
  profile?: string;
  system?: ProjectSystemMap;
  completion?: string;
  completionTime?: string;
  completionLabel?: string;
  website?: string;
  notes?: string;
  heroImage?: string;
  gallery?: (string | { src: string; description?: string; label?: string })[];

  focus?: string[];
  galleryHighlightImage?: string;
  galleryHighlightCaption?: string;
  galleryHighlightDescription?: string;
  galleryHighlightStyle?: "plain" | "atelier" | "maison" | "auto";

  galleryHighlightSecondaryImage?: string;
  galleryHighlightSecondaryCaption?: string;
  galleryHighlightSecondaryDescription?: string;
};

export const PROJECT_DETAIL_DEFAULT_ROLE =
  (content as any).detailDefaults?.role ??
  "System design, engineering & calibration partner";

export const PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS =
  asStringArray((content as any).detailDefaults?.keyProducts ?? [
    "Distributed loudspeaker & amplification suite",
    "DSP tuning, zoning, and automation control",
    "Commissioning documentation & onsite calibration",
  ]);

const parseContextParts = (context?: string | null) => {
  if (!context) {
    return { application: "", location: "" };
  }

  const normalised = context
    .replace(/ /g, " ")
    .replace(/A�/g, " \u2014 ")
    .replace(/[–—]+/g, " \u2014 ")
    .replace(/\s+/g, " ")
    .trim();

  const split = (value: string, pattern: RegExp) =>
    value
      .split(pattern)
      .map((part) => part.trim())
      .filter(Boolean);

  let parts = split(normalised, /\s*[—|/]\s*/);
  if (parts.length < 2) {
    parts = split(normalised, /\s*-\s*/);
  }

  if (parts.length >= 2) {
    return {
      application: parts[0],
      location: parts[parts.length - 1],
    };
  }

  return { application: normalised, location: "" };
};

const cloneSystemMap = (input?: ProjectSystemMap) => {
  if (!input) return undefined;
  const entries = Object.entries(input)
    .map(([zone, items]) => {
      const filtered = items.filter(
        (item) => typeof item === "string" && item.trim(),
      );
      return [zone, filtered] as const;
    })
    .filter(([, items]) => items.length > 0);

  return entries.length
    ? Object.fromEntries(entries.map(([zone, items]) => [zone, [...items]]))
    : undefined;
};

const resolveProjectImage = (value: unknown) => {
  const filename = asString(value);
  if (!filename) return "";
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return buildGeneralImageUrl(filename);
  }
  if (filename.includes("/")) {
    return buildGeneralImageUrl(filename);
  }
  return buildProjectSiteUrl(filename);
};

const mapGalleryEntries = (entries: unknown) =>
  asArray(entries)
    .map((entry) => {
      if (typeof entry === "string") {
        return resolveProjectImage(entry);
      }
      if (!entry || typeof entry != "object") return null;
      const record = entry as Record<string, unknown>;
      const src = resolveProjectImage(record.src);
      if (!src) return null;
      return {
        src,
        description: asString(record.description) || undefined,
        label: asString(record.label) || undefined,
      };
    })
    .filter(Boolean) as ProjectDetailMeta["gallery"];

const rawOverrides = (content as any).detailOverrides ?? {};

export const PROJECT_DETAIL_OVERRIDES: Partial<
  Record<string, Partial<ProjectDetailMeta>>
> = Object.fromEntries(
  Object.entries(rawOverrides).map(([slug, override]) => {
    const record = override && typeof override == "object" ? (override as Record<string, unknown>) : {};

    return [
      slug,
      {
        description: asString(record.description) || undefined,
        location: asString(record.location) || undefined,
        application: asString(record.application) || undefined,
        context: asString(record.context) || undefined,
        role: asString(record.role) || undefined,
        keyProducts: asStringArray(record.keyProducts),
        profile: asString(record.profile) || undefined,
        system: asSystemMap(record.system),
        completion: asString(record.completion) || undefined,
        completionTime: asString(record.completionTime) || undefined,
        completionLabel: asString(record.completionLabel) || undefined,
        website: asString(record.website) || undefined,
        notes: asString(record.notes) || undefined,
        heroImage: resolveProjectImage(record.heroImage) || undefined,
        gallery: mapGalleryEntries(record.gallery),
        focus: asStringArray(record.focus),
        galleryHighlightImage: resolveProjectImage(record.galleryHighlightImage) || undefined,
        galleryHighlightCaption: asString(record.galleryHighlightCaption) || undefined,
        galleryHighlightDescription: asString(record.galleryHighlightDescription) || undefined,
        galleryHighlightStyle: asString(record.galleryHighlightStyle) as ProjectDetailMeta["galleryHighlightStyle"],
        galleryHighlightSecondaryImage: resolveProjectImage(record.galleryHighlightSecondaryImage) || undefined,
        galleryHighlightSecondaryCaption: asString(record.galleryHighlightSecondaryCaption) || undefined,
        galleryHighlightSecondaryDescription: asString(record.galleryHighlightSecondaryDescription) || undefined,
      } as Partial<ProjectDetailMeta>,
    ];
  })
);

const BASE_PROJECT_DETAIL_MAP: Record<string, ProjectDetailMeta> =
  PROJECT_LIST.reduce((acc, project) => {
    const { application, location: parsedLocation } =
      parseContextParts(project.context);
    const location = project.location || parsedLocation;
    const context =
      typeof project.context === "string"
        ? project.context.trim()
        : "";
    const rawRole = project.role;
    let role = PROJECT_DETAIL_DEFAULT_ROLE;

    if (Array.isArray(rawRole)) {
      const cleaned = rawRole
        .filter((entry) => typeof entry === "string" && entry.trim())
        .map((entry) => entry.trim());
      if (cleaned.length > 0) {
        role = cleaned[0];
      }
    } else if (typeof rawRole === "string" && rawRole.trim()) {
      role = rawRole.trim();
    }

    const profileText =
      typeof project.profile === "string"
        ? project.profile.trim()
        : "";

    const description =
      profileText || context || application || project.title;

    acc[project.slug] = {
      description,
      location,
      application: application || project.vertical,
      context,
      role,
      keyProducts: [...PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS],
      profile: profileText || undefined,
      system: cloneSystemMap(project.system),
      completion: project.completion,
      completionTime: project.completion,
      completionLabel: completionLabelFrom(project.completion),
      focus: project.focus ? [...project.focus] : undefined,
    };

    return acc;
  }, {} as Record<string, ProjectDetailMeta>);

/* ------------------------------------
   Build Final Detail Map
------------------------------------ */

const buildDetailForSlug = (slug: string): ProjectDetailMeta => {
  const base = BASE_PROJECT_DETAIL_MAP[slug];
  const override = PROJECT_DETAIL_OVERRIDES[slug];

  const pickString = (value: unknown, fallback: string) => {
    const s = typeof value === "string" ? value.trim() : "";
    return s ? s : fallback;
  };

  const pickArray = <T>(value: unknown, fallback: T[]) => {
    if (Array.isArray(value) && value.length > 0) {
      return [...value] as T[];
    }
    return [...fallback];
  };

  if (!base) {
    return {
      description: "",
      location: "",
      application: "",
      role: PROJECT_DETAIL_DEFAULT_ROLE,
      keyProducts: [...PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS],
    };
  }

  if (!override) {
    const baseDetail: ProjectDetailMeta = {
      ...base,
      keyProducts: [...base.keyProducts],
      gallery: base.gallery ? [...base.gallery] : base.gallery,
      focus: base.focus ? [...base.focus] : base.focus,
      system: cloneSystemMap(base.system),
    };

    if (baseDetail.completion && !baseDetail.completionTime) {
      baseDetail.completionTime = baseDetail.completion;
    }
    if (baseDetail.completionTime && !baseDetail.completion) {
      baseDetail.completion = baseDetail.completionTime;
    }
    if (!baseDetail.completionLabel) {
      baseDetail.completionLabel = completionLabelFrom(
        baseDetail.completion || baseDetail.completionTime,
      );
    }

    return baseDetail;
  }

  const detail: ProjectDetailMeta = {
    ...base,
    description: pickString(override?.description, base.description),
    location: pickString(override?.location, base.location),
    application: pickString(override?.application, base.application),
    context: pickString(override?.context, base.context || ""),
    role: pickString(override?.role, base.role),
    keyProducts: pickArray(override?.keyProducts, base.keyProducts),
    profile: pickString(override?.profile, base.profile || ""),
    completion: pickString(
      override?.completion ?? override?.completionTime,
      base.completion || ""
    ),
    completionTime: pickString(
      override?.completionTime ?? override?.completion,
      base.completionTime || base.completion || ""
    ),
    completionLabel: pickString(
      override?.completionLabel,
      base.completionLabel || ""
    ),
    website: pickString(override?.website, base.website || ""),
    notes: pickString(override?.notes, base.notes || ""),
    heroImage: pickString(override?.heroImage, base.heroImage || ""),
  };

  if (Array.isArray(override?.gallery) && override.gallery.length > 0) {
    detail.gallery = [...override.gallery];
  } else if (base.gallery) {
    detail.gallery = [...base.gallery];
  }

  if (Array.isArray(override?.focus) && override.focus.length > 0) {
    detail.focus = [...override.focus];
  } else if (base.focus) {
    detail.focus = [...base.focus];
  }

  const overrideSystem = override?.system
    ? cloneSystemMap(override.system)
    : undefined;
  if (overrideSystem) {
    detail.system = overrideSystem;
  } else if (base.system) {
    detail.system = cloneSystemMap(base.system);
  }

  if (detail.completion && !detail.completionTime) {
    detail.completionTime = detail.completion;
  }
  if (detail.completionTime && !detail.completion) {
    detail.completion = detail.completionTime;
  }
  if (!detail.completionLabel) {
    detail.completionLabel = completionLabelFrom(
      detail.completion || detail.completionTime,
    );
  }

  const galleryArr = Array.isArray(detail.gallery) ? detail.gallery : [];
  const hasMultipleGalleryImages = galleryArr.length > 1;

  if (!detail.galleryHighlightImage && hasMultipleGalleryImages) {
    const first: any = galleryArr[0];
    detail.galleryHighlightImage =
      typeof first === "string" ? first : first.src;
  }

  if (!detail.galleryHighlightSecondaryImage && hasMultipleGalleryImages) {
    const second: any = galleryArr[1];
    if (second) {
      detail.galleryHighlightSecondaryImage =
        typeof second === "string" ? second : second.src;
    }
  }

  if (
    !detail.galleryHighlightDescription &&
    hasMultipleGalleryImages &&
    detail.description
  ) {
    detail.galleryHighlightDescription = detail.description;
  }

  if (!detail.galleryHighlightStyle && hasMultipleGalleryImages) {
    detail.galleryHighlightStyle = "plain";
  }

  return detail;
};

export const PROJECT_DETAIL_DATA: Record<string, ProjectDetailMeta> =
  Object.fromEntries(
    Object.keys(BASE_PROJECT_DETAIL_MAP).map((slug) => [
      slug,
      buildDetailForSlug(slug),
    ]),
  );
