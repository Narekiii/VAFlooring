import { images, type SiteImage } from "./images";

/**
 * Flooring service landing pages. Each entry generates a page at /<slug> with
 * metadata, Service + FAQPage + BreadcrumbList structured data, and internal links.
 *
 * Floor types confirmed by V & A Flooring: hardwood, laminate, vinyl/LVP, carpet, tile.
 * Keep claims general and accurate: no product performance claims (waterproof,
 * scratchproof, warranty terms) unless taken from a specific manufacturer's documentation.
 */

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  /** Short name for menus and cards. */
  name: string;
  /** Page H1 (primary keyword). */
  h1: string;
  /** <title> (≤ ~60 chars before the brand suffix). */
  title: string;
  description: string;
  /** schema.org serviceType */
  serviceType: string;
  subtitle: string;
  /** Answer-first summary used at the top of the page and in llms.txt. */
  summary: string;
  card: string;
  image: SiteImage;
  options: { title: string; body: string }[];
  fit: { title: string; body: string }[];
  /** Applies to these customer paths. */
  forHomes: string;
  forCommercial: string;
  faqs: Faq[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "hardwood-flooring",
    name: "Hardwood Flooring",
    h1: "Hardwood Flooring & Hardwood Floor Installation in Los Angeles",
    title: "Hardwood Flooring & Installation in Los Angeles",
    description:
      "Solid and engineered hardwood flooring supplied and installed by V & A Flooring, a licensed, family-owned Los Angeles flooring contractor since 1999. Serving LA, Orange and Ventura counties.",
    serviceType: "Hardwood flooring installation",
    subtitle: "Solid and engineered hardwood, supplied and installed by one licensed company.",
    summary:
      "V & A Flooring supplies and installs solid and engineered hardwood flooring for homes, ADUs, multifamily buildings, hotels and commercial spaces across Los Angeles, Orange and Ventura counties. We are a family-owned, CSLB-licensed flooring contractor (C-15) founded in 1999, with more than 20 installation crews.",
    card: "Solid and engineered hardwood for living areas, bedrooms, ADUs and common spaces.",
    image: images.plankDetail,
    options: [
      {
        title: "Engineered hardwood",
        body: "A real hardwood wear layer bonded over a layered core. Depending on the product, it can be glued, nailed or floated, which makes it a common choice for slab foundations, condos and ADUs.",
      },
      {
        title: "Solid hardwood",
        body: "Milled from a single piece of wood. It is typically nailed or stapled over a wood subfloor and suits living rooms, bedrooms and hallways on suitable subfloors.",
      },
      {
        title: "Species, width and finish",
        body: "Species such as oak, maple and hickory, depending on the product line, in narrow strips or wide planks, with factory-applied finishes in a range of sheens and colors. We help you compare samples against your space and budget.",
      },
    ],
    fit: [
      {
        title: "Where hardwood works well",
        body: "Living rooms, dining rooms, bedrooms, hallways and many open-plan spaces. Engineered hardwood broadens the options for concrete slabs and multi-level buildings.",
      },
      {
        title: "What to talk through first",
        body: "Subfloor type and flatness, moisture conditions, sound requirements in multifamily buildings, transitions to other floors, and how the space will be used day to day.",
      },
      {
        title: "Installation method",
        body: "We follow the method the manufacturer specifies for your product and subfloor, whether that is nail-down, glue-down or floating installation.",
      },
    ],
    forHomes:
      "For homeowners renovating occupied homes or building ADUs, we help choose a hardwood that suits the household and plan installation room by room.",
    forCommercial:
      "For developers, property managers and hospitality operators, we supply and install specified hardwood and engineered products and coordinate crews around the project schedule.",
    faqs: [
      {
        q: "Do you supply the hardwood as well as install it?",
        a: "Yes. V & A Flooring supplies flooring materials and installs them, so material selection, ordering and installation are handled by one company. We can also install a product you or your designer have already chosen.",
      },
      {
        q: "What is the difference between solid and engineered hardwood?",
        a: "Solid hardwood is one piece of wood throughout. Engineered hardwood has a real wood wear layer on top of a layered core. Engineered products can often be installed over concrete slabs and in more locations, while solid hardwood is usually nailed over a wood subfloor. We will recommend what fits your subfloor and space.",
      },
      {
        q: "Can hardwood be installed over a concrete slab?",
        a: "Many engineered hardwood products are designed for glue-down or floating installation over concrete. Whether a specific product is suitable depends on the manufacturer’s requirements and the slab’s condition, including moisture, which we review before installation.",
      },
      {
        q: "How long does hardwood floor installation take?",
        a: "It depends on the area, the subfloor, the product and the installation method. Once we understand the scope, we give you a schedule for your project before work begins.",
      },
      {
        q: "Which areas do you serve for hardwood flooring?",
        a: "We serve Los Angeles, Orange and Ventura counties from our location in Sun Valley, in the San Fernando Valley.",
      },
    ],
    related: ["laminate-flooring", "vinyl-flooring", "tile-flooring"],
  },
  {
    slug: "laminate-flooring",
    name: "Laminate Flooring",
    h1: "Laminate Flooring & Laminate Floor Installation in Los Angeles",
    title: "Laminate Flooring & Installation in Los Angeles",
    description:
      "Laminate flooring supplied and installed by V & A Flooring for homes, ADUs, rentals and multifamily properties in Los Angeles, Orange and Ventura counties. Licensed, family owned since 1999.",
    serviceType: "Laminate flooring installation",
    subtitle: "The look of wood or stone at a range of price points, installed by experienced crews.",
    summary:
      "V & A Flooring supplies and installs laminate flooring for homes, ADUs, rental units and multifamily properties in Los Angeles, Orange and Ventura counties. Laminate gives a wood or stone look at a range of budgets; we help you choose a product suited to the room and install it to the manufacturer’s requirements.",
    card: "Wood- and stone-look laminate for renovations, ADUs and rental turnovers.",
    image: images.aduDining,
    options: [
      {
        title: "Wood-look and stone-look laminate",
        body: "Printed designs under a protective wear layer, in plank and tile formats, with textures that range from smooth to deeply embossed.",
      },
      {
        title: "Thickness and underlayment",
        body: "Plank thickness, attached or separate underlayment and sound-reduction options vary by product. In multifamily buildings, we check building requirements for sound control.",
      },
      {
        title: "Water and wear ratings",
        body: "Some laminate lines are designed for greater water resistance and higher traffic. We use each manufacturer’s published specifications, not marketing labels, to match a product to the room.",
      },
    ],
    fit: [
      {
        title: "Where laminate works well",
        body: "Living areas, bedrooms, hallways, home offices and many ADU and rental-unit layouts where a durable, budget-conscious wood look is the goal.",
      },
      {
        title: "What to talk through first",
        body: "Moisture exposure in kitchens, baths and entries, subfloor flatness, transitions, and how much foot traffic the room sees.",
      },
      {
        title: "Installation method",
        body: "Most laminate is installed as a floating floor over an approved underlayment. We follow the manufacturer’s installation instructions for your product.",
      },
    ],
    forHomes:
      "A practical choice for whole-home updates and ADUs when you want a wood look and a predictable budget.",
    forCommercial:
      "For multifamily owners and property managers, laminate can keep finishes consistent across units, and we can schedule installation around occupancy and turnovers.",
    faqs: [
      {
        q: "Is laminate a good alternative to hardwood?",
        a: "For many rooms, yes. Laminate offers a wood look at a lower cost than many hardwood options. It is a different material with different care and repair characteristics, so we walk through the trade-offs for your space.",
      },
      {
        q: "Can laminate go in kitchens or bathrooms?",
        a: "It depends on the specific product. Some laminate lines are rated for more moisture than others. We check the manufacturer’s specifications and warranty terms for wet areas before recommending a product.",
      },
      {
        q: "Do you install laminate in apartments and rental units?",
        a: "Yes. We work with multifamily owners and property managers and can coordinate installation around occupied units and turnover schedules.",
      },
      {
        q: "What is the difference between laminate and luxury vinyl plank?",
        a: "Laminate has a wood-based core with a printed design layer, while luxury vinyl plank (LVP) is vinyl-based. They differ in feel, sound, moisture behavior and price. We can show you both and help you compare.",
      },
    ],
    related: ["vinyl-flooring", "hardwood-flooring", "carpet-installation"],
  },
  {
    slug: "vinyl-flooring",
    name: "Vinyl & LVP Flooring",
    h1: "Luxury Vinyl Plank (LVP) & Vinyl Flooring Installation in Los Angeles",
    title: "Luxury Vinyl Plank (LVP) Flooring Installation in Los Angeles",
    description:
      "Luxury vinyl plank and tile (LVP / LVT) supplied and installed by V & A Flooring for homes, ADUs, apartments, hotels and commercial spaces in Los Angeles, Orange and Ventura counties.",
    serviceType: "Luxury vinyl plank installation",
    subtitle: "LVP and LVT for homes, apartments, hotels and commercial interiors.",
    summary:
      "V & A Flooring supplies and installs luxury vinyl plank (LVP), luxury vinyl tile (LVT) and other vinyl flooring for residential, multifamily, hospitality and commercial projects across Los Angeles, Orange and Ventura counties. With more than 20 installation crews, we handle single homes and multi-unit scopes.",
    card: "Luxury vinyl plank and tile for homes, apartment units, corridors and commercial spaces.",
    image: images.lobby,
    options: [
      {
        title: "Rigid-core LVP (SPC and WPC)",
        body: "Click-together planks with a rigid core, commonly installed as a floating floor. Popular for whole-home renovations, ADUs and rental units.",
      },
      {
        title: "Glue-down LVT and LVP",
        body: "Thinner vinyl adhered to the subfloor, widely used in multifamily corridors, hospitality and commercial spaces where stability under rolling loads matters.",
      },
      {
        title: "Wear layer and design",
        body: "Wear-layer thickness, texture, plank size and pattern vary by product line. We help you compare options against traffic, budget and the look you want.",
      },
    ],
    fit: [
      {
        title: "Where vinyl works well",
        body: "Kitchens, entries, family rooms, ADUs, apartment units, corridors and many commercial interiors.",
      },
      {
        title: "What to talk through first",
        body: "Subfloor flatness, the right format for the space (floating or glue-down), sound requirements in multifamily buildings, and transitions to other flooring.",
      },
      {
        title: "Installation method",
        body: "We install floating and glue-down vinyl according to each manufacturer’s requirements, including subfloor preparation standards and acclimation guidance.",
      },
    ],
    forHomes:
      "A common choice for families and busy households who want a wood or stone look in kitchens, entries and open living areas.",
    forCommercial:
      "For multifamily, hospitality and commercial projects, we supply and install specified vinyl products across units, corridors and common areas with crews scaled to the schedule.",
    faqs: [
      {
        q: "What is LVP flooring?",
        a: "LVP stands for luxury vinyl plank: a vinyl-based floor made to look like wood planks. LVT is the tile-format version. Both come in floating (click) and glue-down types.",
      },
      {
        q: "Is LVP waterproof?",
        a: "Water resistance depends on the specific product and its installation. Some vinyl products are marketed as waterproof, but the manufacturer’s specifications and warranty terms are what matter. We review them with you for kitchens, baths and entries.",
      },
      {
        q: "Do you install vinyl flooring in apartment buildings?",
        a: "Yes. Multifamily buildings and apartment communities are a core part of our work. We coordinate installation around occupied units, turnovers and construction schedules.",
      },
      {
        q: "Should I choose floating or glue-down vinyl?",
        a: "Floating rigid-core planks are common in homes and units. Glue-down vinyl is often specified for corridors and commercial spaces. The right choice depends on the space, the subfloor and any project specifications.",
      },
    ],
    related: ["laminate-flooring", "carpet-installation", "hardwood-flooring"],
  },
  {
    slug: "carpet-installation",
    name: "Carpet & Carpet Tile",
    h1: "Carpet & Carpet Tile Installation in Los Angeles",
    title: "Carpet & Carpet Tile Installation in Los Angeles",
    description:
      "Carpet and carpet tile supplied and installed by V & A Flooring for homes, apartments, hotels and offices in Los Angeles, Orange and Ventura counties. Mohawk, Shaw and Engineered Floors products.",
    serviceType: "Carpet installation",
    subtitle: "Broadloom carpet and carpet tile for bedrooms, apartments, hotel corridors and offices.",
    summary:
      "V & A Flooring supplies and installs carpet and carpet tile for homes, apartment communities, hotels and commercial offices in Los Angeles, Orange and Ventura counties, with products from manufacturers including Mohawk, Shaw and Engineered Floors. We have served Lowe’s installation customers for more than 20 years.",
    card: "Broadloom carpet and modular carpet tile for bedrooms, units, hotel corridors and offices.",
    image: images.corridorCarpet,
    options: [
      {
        title: "Broadloom carpet",
        body: "Wall-to-wall carpet installed over cushion, available in many textures, constructions and colors for bedrooms, living areas, apartment units and hotel rooms.",
      },
      {
        title: "Carpet tile",
        body: "Modular squares or planks that can be installed in patterns and replaced individually, commonly used in offices, corridors and other commercial spaces.",
      },
      {
        title: "Cushion and specifications",
        body: "Pad type and thickness affect comfort, sound and performance. For commercial projects, we work from the carpet and cushion specified in your documents.",
      },
    ],
    fit: [
      {
        title: "Where carpet works well",
        body: "Bedrooms, family rooms, stairs, apartment units, hotel guest rooms and corridors, and offices where sound control and comfort matter.",
      },
      {
        title: "What to talk through first",
        body: "Traffic level, maintenance routine, seam placement, pattern matching for hospitality designs, and transitions to hard surfaces.",
      },
      {
        title: "Installation method",
        body: "We install broadloom over cushion and carpet tile with the adhesive system the manufacturer specifies.",
      },
    ],
    forHomes: "Comfort and warmth for bedrooms, family rooms and stairs, with help choosing a carpet and cushion that fit your household.",
    forCommercial:
      "For hotels, apartment communities and offices, we supply and install broadloom and carpet tile across rooms, corridors and common areas on your schedule.",
    faqs: [
      {
        q: "Do you install carpet in hotels and apartment buildings?",
        a: "Yes. Hospitality properties and multifamily communities are a large part of our work, and we coordinate installation around occupancy and operations.",
      },
      {
        q: "What carpet brands do you offer?",
        a: "Our selection includes products from manufacturers such as Mohawk, Shaw and Engineered Floors, including American-made options.",
      },
      {
        q: "Carpet or carpet tile: which is better for an office?",
        a: "Carpet tile is widely used in offices because tiles can be replaced individually and installed in patterns. Broadloom can offer a seamless look. We help you choose based on the space and any project specifications.",
      },
    ],
    related: ["vinyl-flooring", "laminate-flooring", "tile-flooring"],
  },
  {
    slug: "tile-flooring",
    name: "Tile Flooring",
    h1: "Tile Flooring Installation in Los Angeles",
    title: "Tile Flooring Installation in Los Angeles",
    description:
      "Porcelain and ceramic floor tile installed by V & A Flooring, a CSLB-licensed C-54 tile and C-15 flooring contractor serving Los Angeles, Orange and Ventura counties since 1999.",
    serviceType: "Tile flooring installation",
    subtitle: "Porcelain and ceramic floor tile, installed by a licensed tile contractor.",
    summary:
      "V & A Flooring installs porcelain and ceramic floor tile for kitchens, entries, ADUs, multifamily buildings and commercial spaces across Los Angeles, Orange and Ventura counties. We hold California C-54 (tile) and C-15 (flooring) contractor classifications, CSLB license #866991.",
    card: "Porcelain and ceramic floor tile for kitchens, entries, ADUs and commercial spaces.",
    image: images.tileKitchen,
    options: [
      {
        title: "Porcelain tile",
        body: "Dense, low-absorption tile in a wide range of sizes, including large-format and wood-look planks.",
      },
      {
        title: "Ceramic tile",
        body: "A versatile option in many colors, sizes and finishes for residential floors.",
      },
      {
        title: "Layout and grout",
        body: "Tile size, layout pattern, grout joint width and grout color all affect the finished look. We plan the layout with you before installation.",
      },
    ],
    fit: [
      {
        title: "Where tile works well",
        body: "Kitchens, entries, laundry rooms, ADUs and commercial spaces that need a hard, easy-to-clean surface.",
      },
      {
        title: "What to talk through first",
        body: "Subfloor flatness and stiffness (especially for large-format tile), layout and transitions, and the setting materials the tile manufacturer recommends.",
      },
      {
        title: "Licensed for tile work",
        body: "California requires a C-54 classification for tile contracting. V & A Flooring holds C-54 along with C-15 flooring and B general building classifications.",
      },
    ],
    forHomes: "Durable floors for kitchens, entries and ADUs, with layout planned before the first tile is set.",
    forCommercial: "Floor tile for multifamily common areas, hospitality and commercial interiors, coordinated with your schedule and specifications.",
    faqs: [
      {
        q: "Are you licensed to install tile in California?",
        a: "Yes. V & A Flooring holds CSLB license #866991 with C-54 (ceramic and mosaic tile), C-15 (flooring and floor covering) and B (general building) classifications.",
      },
      {
        q: "Porcelain or ceramic: which should I choose?",
        a: "Porcelain is denser and absorbs less water; ceramic offers many design options and is often less expensive. The right choice depends on where the tile goes and the look you want.",
      },
      {
        q: "Can you install large-format tile?",
        a: "Large-format tile needs a flat, stable subfloor and the setting materials the manufacturer specifies. We review the subfloor and product requirements with you before installation.",
      },
    ],
    related: ["vinyl-flooring", "hardwood-flooring", "laminate-flooring"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** Communities within the counties V & A Flooring serves (for the service-area page). */
export const serviceAreas: { county: string; places: string[] }[] = [
  {
    county: "Los Angeles County",
    places: [
      "Los Angeles",
      "Sun Valley",
      "Burbank",
      "Glendale",
      "Pasadena",
      "North Hollywood",
      "Van Nuys",
      "Sherman Oaks",
      "Encino",
      "Northridge",
      "Santa Clarita",
      "Santa Monica",
      "West Hollywood",
      "Beverly Hills",
      "Culver City",
      "Torrance",
      "Long Beach",
    ],
  },
  {
    county: "Orange County",
    places: ["Irvine", "Anaheim", "Santa Ana", "Huntington Beach", "Costa Mesa", "Orange", "Fullerton", "Newport Beach"],
  },
  {
    county: "Ventura County",
    places: ["Thousand Oaks", "Simi Valley", "Oxnard", "Ventura", "Camarillo", "Moorpark"],
  },
];
