import type { StaticImageData } from "next/image";

import livingWide from "@/assets/images/residential-living-room-wide.jpg";
import livingWindows from "@/assets/images/residential-living-room-windows.jpg";
import aduKitchen from "@/assets/images/residential-adu-kitchen.jpg";
import aduDining from "@/assets/images/residential-adu-dining.jpg";
import corridor from "@/assets/images/hospitality-corridor.jpg";
import corridorCarpet from "@/assets/images/hospitality-corridor-carpet.jpg";
import lobby from "@/assets/images/multifamily-lobby.jpg";
import office from "@/assets/images/commercial-office.jpg";
import plankDetail from "@/assets/images/oak-plank-detail.jpg";
import samples from "@/assets/images/flooring-samples.jpg";
import tileKitchen from "@/assets/images/tile-floor-kitchen.jpg";

/**
 * Image manifest.
 *
 * kind: "illustrative" — original 3D renderings created for this website. They are labelled
 *        "Illustrative rendering" wherever they appear and must never be described as
 *        V & A Flooring Inc projects.
 * kind: "company" — photography supplied and verified by V & A Flooring Inc (projects, crews, team).
 *
 * To use real photography, replace the import for an entry, update `alt`, and set kind to
 * "company". Every component reads from this file.
 */
export type SiteImage = {
  src: StaticImageData;
  alt: string;
  kind: "illustrative" | "company";
  /** Default focal point for cropping (CSS object-position). */
  focus?: string;
};

export const images = {
  livingWide: {
    src: livingWide,
    alt: "Living room with wide oak plank flooring and afternoon light falling across the floor",
    kind: "illustrative",
    focus: "50% 70%",
  },
  livingWindows: {
    src: livingWindows,
    alt: "Oak plank floor in a living room with sunlight streaming through tall windows",
    kind: "illustrative",
    focus: "40% 60%",
  },
  aduKitchen: {
    src: aduKitchen,
    alt: "Compact ADU kitchen and dining area with pale oak plank flooring",
    kind: "illustrative",
    focus: "45% 60%",
  },
  aduDining: {
    src: aduDining,
    alt: "Dining area beside a sliding glass door in an ADU with pale oak plank flooring",
    kind: "illustrative",
    focus: "35% 60%",
  },
  corridor: {
    src: corridor,
    alt: "Hotel guest corridor with patterned carpet running between rows of room doors",
    kind: "illustrative",
    focus: "50% 65%",
  },
  corridorCarpet: {
    src: corridorCarpet,
    alt: "Patterned carpet in a hotel corridor, viewed toward a window at the far end",
    kind: "illustrative",
    focus: "50% 70%",
  },
  lobby: {
    src: lobby,
    alt: "Apartment building lobby with long wood-look planks, lounge seating and resident mailboxes",
    kind: "illustrative",
    focus: "45% 60%",
  },
  office: {
    src: office,
    alt: "Open office with carpet tile flooring and a glass-walled meeting room",
    kind: "illustrative",
    focus: "45% 60%",
  },
  plankDetail: {
    src: plankDetail,
    alt: "Close view of oak plank seams and grain in a band of sunlight",
    kind: "illustrative",
    focus: "50% 50%",
  },
  samples: {
    src: samples,
    alt: "Wood-look plank samples in five tones beside two carpet swatches",
    kind: "illustrative",
    focus: "50% 45%",
  },
  tileKitchen: {
    src: tileKitchen,
    alt: "Dining area and kitchen with large porcelain floor tiles beside a sliding glass door",
    kind: "illustrative",
    focus: "40% 65%",
  },
} satisfies Record<string, SiteImage>;
