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
import storefront from "@/assets/images/company/storefront-10945-pendleton.jpg";
import designCenter from "@/assets/images/company/design-center-lobby.jpg";
import showroomAisle from "@/assets/images/company/showroom-main-aisle.jpg";
import showroomPlanks from "@/assets/images/company/showroom-hardwood-laminate.jpg";
import showroomHardwood from "@/assets/images/company/showroom-hardwood-displays.jpg";
import showroomCarpetLvp from "@/assets/images/company/showroom-carpet-lvp.jpg";
import showroomCarpetVinyl from "@/assets/images/company/showroom-carpet-vinyl.jpg";
import showroomTile from "@/assets/images/company/showroom-tile-stone.jpg";
import showroomSelection from "@/assets/images/company/showroom-selection-table.jpg";
import warehouse from "@/assets/images/company/warehouse-inventory.jpg";

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
  /* ---- Company photography: V & A Flooring Inc showroom, design center and warehouse, Sun Valley ---- */
  storefront: {
    src: storefront,
    alt: "V & A Flooring Inc building and showroom entrance at 10945 Pendleton St, Sun Valley",
    kind: "company",
    focus: "55% 50%",
  },
  designCenter: {
    src: designCenter,
    alt: "Reception area of the V & A Flooring Inc design center with flooring sample displays",
    kind: "company",
    focus: "40% 55%",
  },
  showroomAisle: {
    src: showroomAisle,
    alt: "Main aisle of the V & A Flooring Inc showroom lined with wood-look plank sample displays",
    kind: "company",
    focus: "60% 55%",
  },
  showroomPlanks: {
    src: showroomPlanks,
    alt: "V & A Flooring Inc showroom with racks of hardwood, laminate and vinyl plank samples",
    kind: "company",
    focus: "35% 55%",
  },
  showroomHardwood: {
    src: showroomHardwood,
    alt: "Hardwood flooring sample displays in the V & A Flooring Inc showroom",
    kind: "company",
    focus: "45% 60%",
  },
  showroomCarpetLvp: {
    src: showroomCarpetLvp,
    alt: "Luxury vinyl plank and carpet sample displays in the V & A Flooring Inc showroom",
    kind: "company",
    focus: "45% 60%",
  },
  showroomCarpetVinyl: {
    src: showroomCarpetVinyl,
    alt: "Carpet and vinyl plank sample racks in the V & A Flooring Inc showroom",
    kind: "company",
    focus: "55% 60%",
  },
  showroomTile: {
    src: showroomTile,
    alt: "Porcelain tile and stone-look sample displays in the V & A Flooring Inc showroom",
    kind: "company",
    focus: "60% 55%",
  },
  showroomSelection: {
    src: showroomSelection,
    alt: "Selection table in the V & A Flooring Inc showroom surrounded by vinyl plank, laminate, carpet and tile sample displays",
    kind: "company",
    focus: "55% 55%",
  },
  warehouse: {
    src: warehouse,
    alt: "V & A Flooring Inc warehouse with carpet rolls, pallets of plank flooring and moldings",
    kind: "company",
    focus: "50% 60%",
  },
} satisfies Record<string, SiteImage>;
