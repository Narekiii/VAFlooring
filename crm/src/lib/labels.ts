import type { Project } from "@/db/schema";

export const stageLabel = {
  planning: "Planning",
  foundation: "Foundation",
  framing: "Framing",
  drywall: "Drywall",
  interior: "Interior",
  finished: "Finished",
} as const;

export const followUpLabel = { call: "Call", visit: "Visit" } as const;

type Addr = Pick<Project, "street" | "city" | "state" | "zip">;

/** "123 Main St, Van Nuys, CA 91406". Empty when there's no street, city or ZIP (a state alone isn't an address). */
export const siteAddress = (p: Addr) => {
  if (!p.street?.trim() && !p.city?.trim() && !p.zip?.trim()) return "";
  const cityLine = [p.city, [p.state, p.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return [p.street, cityLine].filter(Boolean).join(", ");
};

export const directionsUrl = (address: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const propertyTypeLabel = {
  apartments: "Apartments / multifamily",
  condo_hoa: "Condo / HOA",
  single_family: "Single-family rentals",
  senior: "Senior living",
  student: "Student housing",
  mixed_use: "Mixed-use",
  commercial: "Commercial",
  other: "Other",
} as const;

export const prospectStatusLabel = {
  new: "New",
  contacted: "Contacted",
  meeting: "Meeting set",
  pricing_sent: "Pricing sent",
  customer: "Customer",
  not_interested: "Not interested",
} as const;

export const flooringLabel = {
  lvp: "LVP",
  carpet: "Carpet",
  laminate: "Laminate",
  tile: "Tile",
  hardwood: "Hardwood",
  sheet_vinyl: "Sheet vinyl",
} as const;
