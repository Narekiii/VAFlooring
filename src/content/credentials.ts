import type { StaticImageData } from "next/image";

import cslb2026 from "@/assets/images/credentials/cslb-license-866991-certified-copy-2026.jpg";
import cslb2005 from "@/assets/images/credentials/cslb-license-866991-2005.jpg";
import epa from "@/assets/images/credentials/epa-lead-safe-certified-firm-2025.jpg";
import lowes2016a from "@/assets/images/credentials/lowes-recognition-craftsmanship-2016.jpg";
import lowes2016b from "@/assets/images/credentials/lowes-recognition-dedication-2016.jpg";
import lowes2019 from "@/assets/images/credentials/lowes-recognition-most-determined-2019.jpg";
import team from "@/assets/images/credentials/va-flooring-installation-team.jpg";

/**
 * Licenses, certifications and recognition supplied by V & A Flooring Inc (photos of the
 * original documents). Only documents issued to V & A Flooring Inc belong here.
 */
export type Credential = {
  title: string;
  issuer: string;
  detail: string;
  group: "license" | "certification" | "recognition" | "team";
  src: StaticImageData;
  alt: string;
};

export const credentials: Credential[] = [
  {
    title: "California Contractor License #866991",
    issuer: "Contractors State License Board",
    detail: "C-15 Flooring and Floor Covering · C-54 Tile (Ceramic and Mosaic). Certified copy, September 2026; issued November 4, 2005.",
    group: "license",
    src: cslb2026,
    alt: "Certified copy of California Contractors State License Board license number 866991 issued to V and A Flooring Inc for C15 flooring and floor covering and C54 tile, issued November 4, 2005",
  },
  {
    title: "EPA Lead-Safe Certified Firm",
    issuer: "U.S. Environmental Protection Agency",
    detail: "Certification #NAT-44728-4. Issued June 5, 2025; valid through June 19, 2030.",
    group: "certification",
    src: epa,
    alt: "U.S. EPA Lead-Safe Certified Firm certificate for V&A Flooring Inc., certification number NAT-44728-4, issued June 5, 2025, expiring June 19, 2030",
  },
  {
    title: "Original contractor license, 2005",
    issuer: "Contractors State License Board",
    detail: "License #866991, C-15 Flooring and Floor Covering, issued November 4, 2005.",
    group: "license",
    src: cslb2005,
    alt: "Original 2005 California Contractors State License Board certificate for V & A Flooring Inc, license number 866991, C15 flooring and floor covering",
  },
  {
    title: "Craftsmanship and professionalism, 2015",
    issuer: "Lowe’s, Field Service Market #880",
    detail: "Certificate of Recognition for craftsmanship and professionalism scores of 96.67% for 2015. Awarded February 4, 2016.",
    group: "recognition",
    src: lowes2016a,
    alt: "Lowe’s Certificate of Recognition awarded to V&A Flooring Inc. for outstanding craftsmanship and professionalism scores of 96.67% for 2015, dated February 4, 2016",
  },
  {
    title: "Amazing Dedication",
    issuer: "Lowe’s, Field Service Market #880",
    detail: "Certificate of Recognition. Awarded February 4, 2016.",
    group: "recognition",
    src: lowes2016b,
    alt: "Lowe’s Certificate of Recognition awarded to V&A Flooring for amazing dedication, dated February 4, 2016",
  },
  {
    title: "Most Determined",
    issuer: "Lowe’s",
    detail: "Certificate of Recognition. Presented November 15, 2019.",
    group: "recognition",
    src: lowes2019,
    alt: "Lowe’s Certificate of Recognition presented to V and A Flooring Inc for Most Determined, dated November 15, 2019",
  },
  {
    title: "Our installation team",
    issuer: "V & A Flooring Inc",
    detail: "Installers and staff at the V & A Flooring warehouse.",
    group: "team",
    src: team,
    alt: "Group photo of V & A Flooring Inc installers and staff in the V & A Flooring warehouse, with carpet rolls on racks behind them",
  },
];
