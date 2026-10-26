import type { SiteImage } from "./images";
import { images } from "./images";

export type ProjectCategory = "residential" | "adu" | "multifamily" | "hospitality" | "commercial";

export const categoryLabels: Record<ProjectCategory, string> = {
  residential: "Residential",
  adu: "ADU",
  multifamily: "Multifamily",
  hospitality: "Hospitality",
  commercial: "Commercial",
};

/**
 * A completed V & A Flooring Inc project. Add entries only with verified company photography
 * and details confirmed by V & A Flooring Inc. Optional fields that are left out are simply
 * not displayed — never fill them with estimates.
 */
export type Project = {
  /** URL slug, used only when `story` is provided (creates /projects/[slug]). */
  slug: string;
  name: string;
  category: ProjectCategory;
  /** Company photography (kind: "company"). The first image is the cover. */
  photos: SiteImage[];
  location?: string;
  propertyType?: string;
  flooringMaterial?: string;
  scope?: string;
  /** Short paragraph for the project card. */
  summary?: string;
  /** Longer verified write-up. When present, a project detail page is generated. */
  story?: string[];
};

export const projects: Project[] = [
  // Example shape — add verified projects here:
  // {
  //   slug: "glendale-apartment-community",
  //   name: "Apartment community common areas",
  //   category: "multifamily",
  //   photos: [{ src: lobbyPhoto, alt: "…", kind: "company" }],
  //   location: "Glendale, CA",
  //   flooringMaterial: "…",
  //   scope: "…",
  // },
];

export function projectHasDetail(p: Project): boolean {
  return Array.isArray(p.story) && p.story.length > 0 && p.photos.length > 0;
}

/** Property types V & A Flooring Inc serves, shown with labelled illustrative imagery. */
export const propertyTypes: {
  category: ProjectCategory;
  title: string;
  text: string;
  image: SiteImage;
}[] = [
  {
    category: "residential",
    title: "Residential renovations",
    text: "Single rooms through whole-home updates, often in homes that stay occupied during the work.",
    image: images.livingWindows,
  },
  {
    category: "adu",
    title: "ADUs",
    text: "Accessory dwelling units, where flooring is scheduled alongside the rest of the build.",
    image: images.aduDining,
  },
  {
    category: "multifamily",
    title: "Multifamily communities",
    text: "Apartment units, corridors and common areas for owners and property managers.",
    image: images.lobby,
  },
  {
    category: "hospitality",
    title: "Hotels and hospitality",
    text: "Guest rooms, corridors and public spaces, planned around occupancy and operations.",
    image: images.corridorCarpet,
  },
  {
    category: "commercial",
    title: "Commercial projects",
    text: "Larger commercial spaces coordinated with general contractors and project schedules.",
    image: images.office,
  },
];
