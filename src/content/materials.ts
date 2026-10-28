/**
 * Materials & Brands content.
 *
 * Flooring categories are deliberately unpublished until V & A Flooring Inc confirms which
 * categories it stocks and installs. To publish one, set `published: true` after
 * confirming the description is accurate. Do not add performance claims (waterproof,
 * scratchproof, warranty terms, commercial ratings) unless they come from the specific
 * manufacturer's product documentation.
 */

export const selectionFactors: { title: string; body: string }[] = [
  {
    title: "Appearance",
    body: "Color, plank width or pattern, texture and sheen all change how a room feels. We help you compare options in the context of your space: cabinetry, wall colors and the light the room actually gets.",
  },
  {
    title: "Intended use",
    body: "A bedroom, a busy kitchen, an apartment corridor and a hotel lobby ask very different things of a floor. We start with how the space is used, by how many people, and how often.",
  },
  {
    title: "Maintenance expectations",
    body: "Some floors suit a quick routine; others need more care to look their best. We talk through realistic upkeep for your household, residents or staff before you commit.",
  },
  {
    title: "Budget",
    body: "We help you weigh material cost against the rest of the project, so the budget goes where it matters most. Where it helps, we'll show options at more than one price point.",
  },
  {
    title: "Installation requirements",
    body: "Subfloor conditions, transitions between rooms, moisture considerations and installation method all affect which products make sense. We factor these in early so the material and the installation plan agree.",
  },
  {
    title: "Applicable product specifications",
    body: "For commercial and multifamily work, we review the specifications on your drawings and match products to them. For any product, we refer to the manufacturer’s own documentation rather than general claims.",
  },
];

export type MaterialCategory = {
  name: string;
  body: string;
  published: boolean;
  href?: string;
};

/** Hidden until confirmed by company inventory or supplied product information. */
export const materialCategories: MaterialCategory[] = [
  {
    name: "Hardwood flooring",
    body: "Solid and engineered hardwood for homes, ADUs, multifamily and commercial spaces, supplied and installed by our crews.",
    published: true,
    href: "/products/hardwood-flooring",
  },
  {
    name: "Laminate flooring",
    body: "Wood-look and stone-look laminate for homes, rentals and multifamily units, matched to the manufacturer’s ratings for each room.",
    published: true,
    href: "/products/laminate-flooring",
  },
  {
    name: "Luxury vinyl plank and tile",
    body: "Rigid-core LVP and glue-down LVT for kitchens, ADUs, apartment units, corridors and commercial interiors.",
    published: true,
    href: "/products/vinyl-lvp-flooring",
  },
  {
    name: "Carpet and carpet tile",
    body: "Broadloom carpet and modular carpet tile for bedrooms, apartment units, hotel corridors and offices.",
    published: true,
    href: "/products/carpet",
  },
  {
    name: "Porcelain and ceramic tile",
    body: "Floor tile for kitchens, entries, ADUs and commercial spaces, installed under our C-54 tile classification.",
    published: true,
    href: "/products/tile",
  },
];

export const publishedCategories = () => materialCategories.filter((c) => c.published && c.body.trim().length > 0);
