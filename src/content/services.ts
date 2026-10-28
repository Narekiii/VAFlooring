import { images, type SiteImage } from "./images";

/**
 * Flooring installation pages (one page per floor type at /installation/<slug>).
 * Choosing and buying content (types, comparisons, product FAQs) lives on the matching
 * product page in content/products.ts, so each page answers one search intent.
 * Each page gets metadata, Service + FAQPage + BreadcrumbList structured data and internal links.
 *
 * Floor types confirmed by V & A Flooring Inc: hardwood, laminate, vinyl/LVP, carpet, tile.
 * Keep claims general and accurate: no product performance claims (waterproof, scratchproof,
 * warranty terms) unless taken from a specific manufacturer's documentation.
 */

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  published: boolean;
  /** Menu / card name, e.g. "Hardwood Flooring Installation". */
  name: string;
  /** Short label for the Installation menu, e.g. "Hardwood Installation". */
  navLabel: string;
  /** Matching product page slug (see content/products.ts). */
  productSlug: string;
  /** Name without "Installation", e.g. "Hardwood Flooring". */
  shortName: string;
  /** Lower-case material word used in sentences, e.g. "hardwood". */
  material: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  /** Answer-first summary (top of page, llms.txt, schema description). */
  summary: string;
  cardText: string;
  image: SiteImage;
  detailImage: SiteImage;
  sections: { heading: string; body: string[] }[];
  comparison?: { caption: string; columns: [string, string, string]; rows: [string, string, string][] };
  process: { title: string; body: string }[];
  fits: { title: string; body: string; href?: string }[];
  faqs: Faq[];
};

const RES = "/installation/residential";
const COM = "/installation/commercial-multifamily";

const process = (m: string, extra?: string) => [
  {
    title: "Talk through the project",
    body: `Tell us about the rooms or areas, the approximate size, your timing and any ${m} products you are considering. For commercial work, share drawings and specifications.`,
  },
  {
    title: "Choose the material",
    body: `We help you compare ${m} options by appearance, intended use, maintenance, budget and installation requirements, using each manufacturer’s published specifications.`,
  },
  {
    title: "Confirm scope and estimate",
    body: "We confirm the areas, the subfloor conditions and what the estimate includes and excludes, so there are no surprises later.",
  },
  {
    title: "Schedule and install",
    body: extra ?? `Our crews install the ${m} following the manufacturer’s instructions, on dates planned with you or your project team.`,
  },
  {
    title: "Support after installation",
    body: "When the work is finished we stay reachable. If questions or concerns come up, contact us and we’ll follow up.",
  },
];

const fits = (m: string, home: string, com: string) => [
  { title: "Home renovations", body: home, href: RES },
  { title: "ADUs", body: `${m[0].toUpperCase() + m.slice(1)} flooring for accessory dwelling units, scheduled alongside the rest of the build.`, href: RES },
  { title: "Multifamily and hospitality", body: com, href: COM },
  {
    title: "Commercial projects",
    body: `${m[0].toUpperCase() + m.slice(1)} flooring for commercial interiors, coordinated with general contractors and project schedules.`,
    href: COM,
  },
];

const area = "Los Angeles, Orange and Ventura counties";

export const services: Service[] = [
  {
    slug: "hardwood-flooring",
    published: true,
    navLabel: "Hardwood Installation",
    productSlug: "hardwood-flooring",
    name: "Hardwood Flooring Installation",
    shortName: "Hardwood Flooring",
    material: "hardwood",
    h1: "Hardwood Floor Installation in Los Angeles",
    metaTitle: "Hardwood Flooring Installation Los Angeles",
    metaDescription:
      "Solid and engineered hardwood flooring supplied and installed by a licensed, family-owned LA contractor since 1999. Visit our Sun Valley showroom.",
    serviceType: "Hardwood flooring installation",
    summary:
      "V & A Flooring Inc supplies and installs solid and engineered hardwood flooring for homes, ADUs, multifamily buildings, hotels and commercial spaces across Los Angeles, Orange and Ventura counties. We are a family-owned, licensed flooring contractor (CSLB #866991, C-15) founded in 1999, with more than 20 installation crews.",
    cardText: "Solid and engineered hardwood for living areas, bedrooms, ADUs and common spaces.",
    image: images.livingWindows,
    detailImage: images.showroomHardwood,
    sections: [
      {
        heading: "Hardwood flooring supplied and installed by one company",
        body: [
          "We supply hardwood flooring and install it with our own crews, so material selection, ordering and installation stay with one accountable team. We can also install a hardwood product you or your designer have already chosen.",
          "Our selection includes products from established manufacturers such as Mohawk and Shaw, including American-made options.",
        ],
      },
      {
        heading: "Hardwood installation methods",
        body: [
          "Depending on the product and the subfloor, hardwood is nailed or stapled over a wood subfloor, glued down, or installed as a floating floor. Engineered hardwood is often glued down or floated over concrete slabs; solid hardwood is typically nailed over a wood subfloor.",
        ],
      },
      {
        heading: "What we review before installation",
        body: [
          "Subfloor type and flatness, moisture conditions, sound requirements in multifamily buildings, transitions to other floors and how the space is used. We follow the installation method the manufacturer specifies for your product and subfloor: nail-down, glue-down or floating.",
        ],
      },
    ],
    process: process("hardwood"),
    fits: fits(
      "hardwood",
      "Hardwood for occupied homes, planned room by room around the people who live there.",
      "Specified hardwood and engineered products for apartment communities and hotels, with crews scheduled around occupancy.",
    ),
    faqs: [
      {
        q: "Do you supply the hardwood as well as install it?",
        a: "Yes. V & A Flooring Inc supplies flooring materials and installs them, so selection, ordering and installation are handled by one company. We can also install a product you or your designer have already chosen.",
      },
      {
        q: "Can hardwood be installed over a concrete slab?",
        a: "Many engineered hardwood products are designed for glue-down or floating installation over concrete. Whether a product is suitable depends on the manufacturer’s requirements and the slab’s condition, including moisture, which we review before installation.",
      },
      {
        q: "How long does hardwood floor installation take?",
        a: "It depends on the area, the subfloor, the product and the installation method. Once we understand the scope, we give you a schedule before work begins.",
      },
      {
        q: "Where do you install hardwood flooring?",
        a: `We serve ${area} from our location in Sun Valley, in the San Fernando Valley.`,
      },
    ],
  },
  {
    slug: "laminate-flooring",
    published: true,
    navLabel: "Laminate Installation",
    productSlug: "laminate-flooring",
    name: "Laminate Flooring Installation",
    shortName: "Laminate Flooring",
    material: "laminate",
    h1: "Laminate Floor Installation in Los Angeles",
    metaTitle: "Laminate Flooring Installation Los Angeles",
    metaDescription:
      "Laminate flooring supplied and installed for homes, ADUs and apartments across Los Angeles. Licensed, family owned since 1999, with a Sun Valley showroom.",
    serviceType: "Laminate flooring installation",
    summary:
      "V & A Flooring Inc supplies and installs laminate flooring for homes, ADUs, rental units and multifamily properties across Los Angeles, Orange and Ventura counties. Laminate gives a wood or stone look at a range of budgets; we help you choose a product suited to the room and install it to the manufacturer’s requirements.",
    cardText: "Wood- and stone-look laminate for renovations, ADUs and rental turnovers.",
    image: images.aduDining,
    detailImage: images.showroomPlanks,
    sections: [
      {
        heading: "Laminate flooring for homes, ADUs and rentals",
        body: [
          "Laminate is a practical way to get a wood or stone look with a predictable budget. We supply laminate flooring and install it with our own crews, from a single room to a whole home or a building of rental units.",
        ],
      },
      {
        heading: "What we review before installation",
        body: [
          "Moisture exposure in kitchens, baths and entries, subfloor flatness, transitions and building sound requirements. Most laminate is installed as a floating floor over an approved underlayment, following the manufacturer’s instructions.",
        ],
      },
    ],
    process: process("laminate"),
    fits: fits(
      "laminate",
      "Whole-home updates and single rooms where a durable, budget-conscious wood look is the goal.",
      "Consistent laminate finishes across apartment units, scheduled around occupancy and turnovers.",
    ),
    faqs: [
      {
        q: "Can laminate go in kitchens or bathrooms?",
        a: "It depends on the product. Some laminate lines are rated for more moisture than others. We check the manufacturer’s specifications and warranty terms for wet areas before recommending one.",
      },
      {
        q: "How is laminate flooring installed?",
        a: "Most laminate is installed as a floating floor over an approved underlayment, following the manufacturer’s instructions. Before installation we check subfloor flatness, moisture exposure and transitions to other floors.",
      },
      {
        q: "Do you install laminate in apartments and rental units?",
        a: "Yes. We work with multifamily owners and property managers and coordinate installation around occupied units and turnover schedules.",
      },
    ],
  },
  {
    slug: "lvp-vinyl-flooring",
    published: true,
    navLabel: "LVP & Vinyl Installation",
    productSlug: "vinyl-lvp-flooring",
    name: "Vinyl & LVP Flooring Installation",
    shortName: "Vinyl & LVP Flooring",
    material: "vinyl",
    h1: "Luxury Vinyl Plank (LVP) & Vinyl Flooring Installation in Los Angeles",
    metaTitle: "LVP & Vinyl Plank Flooring Installation LA",
    metaDescription:
      "Luxury vinyl plank and tile (LVP/LVT) supplied and installed for homes, apartments and commercial spaces in Los Angeles, Orange and Ventura counties.",
    serviceType: "Luxury vinyl plank installation",
    summary:
      "V & A Flooring Inc supplies and installs luxury vinyl plank (LVP), luxury vinyl tile (LVT) and other vinyl flooring for residential, multifamily, hospitality and commercial projects across Los Angeles, Orange and Ventura counties. With more than 20 installation crews, we handle single homes and multi-unit scopes.",
    cardText: "Luxury vinyl plank and tile for homes, apartment units, corridors and commercial spaces.",
    image: images.lobby,
    detailImage: images.showroomCarpetLvp,
    sections: [
      {
        heading: "LVP and vinyl flooring from one licensed company",
        body: [
          "Luxury vinyl is one of the most requested floors for kitchens, family rooms, ADUs and apartment units. We supply vinyl flooring and install it with our own crews, for one home or an entire building.",
        ],
      },
      {
        heading: "Floating and glue-down installation",
        body: [
          "Rigid-core planks click together and are installed as a floating floor in homes and units. Glue-down LVT and LVP are adhered to the subfloor, which is common in corridors, hospitality and commercial spaces, and usually need a smoother, well-prepared subfloor.",
        ],
      },
      {
        heading: "What we review before installation",
        body: [
          "Subfloor flatness, the right format for the space, sound requirements in multifamily buildings and transitions to other floors. We follow each manufacturer’s requirements for subfloor preparation and acclimation.",
        ],
      },
    ],
    process: process("vinyl"),
    fits: fits(
      "vinyl",
      "Kitchens, entries and open living areas for busy households.",
      "Specified vinyl products across units, corridors and common areas, with crews scaled to the schedule.",
    ),
    faqs: [
      {
        q: "Do you install vinyl flooring in apartment buildings?",
        a: "Yes. Multifamily buildings and apartment communities are a core part of our work. We coordinate installation around occupied units, turnovers and construction schedules.",
      },
      {
        q: "Should I choose floating or glue-down vinyl?",
        a: "Floating rigid-core planks are common in homes and units; glue-down vinyl is often specified for corridors and commercial spaces. The right choice depends on the space, the subfloor and any project specifications.",
      },
    ],
  },
  {
    slug: "carpet",
    published: true,
    navLabel: "Carpet Installation",
    productSlug: "carpet",
    name: "Carpet Installation",
    shortName: "Carpet & Carpet Tile",
    material: "carpet",
    h1: "Carpet & Carpet Tile Installation in Los Angeles",
    metaTitle: "Carpet & Carpet Tile Installation in LA",
    metaDescription:
      "Carpet and carpet tile supplied and installed for homes, apartments, hotels and offices in Los Angeles, Orange and Ventura counties. Family owned since 1999.",
    serviceType: "Carpet installation",
    summary:
      "V & A Flooring Inc supplies and installs carpet and carpet tile for homes, apartment communities, hotels and commercial offices across Los Angeles, Orange and Ventura counties, with products from manufacturers including Mohawk, Shaw and Engineered Floors. We have served Lowe’s installation customers for more than 20 years.",
    cardText: "Broadloom carpet and carpet tile for bedrooms, apartment units, hotel corridors and offices.",
    image: images.corridorCarpet,
    detailImage: images.showroomCarpetVinyl,
    sections: [
      {
        heading: "Carpet for homes, apartments, hotels and offices",
        body: [
          "We supply and install broadloom carpet and carpet tile, from bedrooms and family rooms to hotel corridors, apartment units and offices. Our selection includes products from Mohawk, Shaw and Engineered Floors, including American-made options.",
        ],
      },
      {
        heading: "Installing broadloom and carpet tile",
        body: [
          "Broadloom carpet is installed wall to wall over cushion; carpet tile is laid in modular squares or planks that can be arranged in patterns. For hospitality designs we plan seam placement and pattern matching before installation begins.",
        ],
      },
      {
        heading: "What we review before installation",
        body: [
          "Traffic levels, maintenance routines, seam placement, pattern matching for hospitality designs and transitions to hard surfaces. We install with the cushion and adhesive systems the manufacturer specifies.",
        ],
      },
    ],
    process: process("carpet"),
    fits: fits(
      "carpet",
      "Comfort for bedrooms, family rooms and stairs, with help choosing a carpet and cushion that fit your household.",
      "Broadloom and carpet tile for hotel guest rooms, corridors and apartment communities, scheduled around occupancy.",
    ),
    faqs: [
      {
        q: "Do you install carpet on stairs?",
        a: "Yes. We install carpet in bedrooms, family rooms and on stairs, and plan seams and transitions to hard-surface floors before installation.",
      },
      {
        q: "Do you install carpet in hotels and apartment buildings?",
        a: "Yes. Hospitality properties and multifamily communities are a large part of our work, and we coordinate installation around occupancy and operations.",
      },
    ],
  },
  {
    slug: "tile-flooring",
    published: true,
    navLabel: "Tile Installation",
    productSlug: "tile",
    name: "Tile Flooring Installation",
    shortName: "Tile Flooring",
    material: "tile",
    h1: "Tile Flooring Installation in Los Angeles",
    metaTitle: "Tile Flooring Installation in Los Angeles",
    metaDescription:
      "Porcelain and ceramic floor tile installed by a CSLB C-54 licensed tile contractor in Los Angeles, including large-format tile. Family owned since 1999.",
    serviceType: "Tile flooring installation",
    summary:
      "V & A Flooring Inc installs porcelain and ceramic floor tile for kitchens, entries, ADUs, multifamily buildings and commercial spaces across Los Angeles, Orange and Ventura counties. We hold California C-54 (tile) and C-15 (flooring) contractor classifications under CSLB license #866991.",
    cardText: "Porcelain and ceramic floor tile for kitchens, entries, ADUs and commercial spaces.",
    image: images.tileKitchen,
    detailImage: images.showroomTile,
    sections: [
      {
        heading: "Floor tile installed by a licensed tile contractor",
        body: [
          "California requires a C-54 classification for tile contracting. V & A Flooring Inc holds C-54 together with C-15 flooring and B general building classifications, CSLB license #866991.",
        ],
      },
      {
        heading: "Layout and setting",
        body: [
          "Tile size, layout pattern, grout joint width and grout color all shape the finished floor, so we plan the layout with you before installation and set the tile with the materials the tile manufacturer recommends.",
        ],
      },
      {
        heading: "What we review before installation",
        body: [
          "Subfloor flatness and stiffness (especially for large-format tile), layout and transitions, and the setting materials the tile manufacturer recommends.",
        ],
      },
    ],
    process: process("tile", "Our crews prepare the substrate, set the tile to the planned layout and grout it using the setting materials the manufacturer recommends."),
    fits: fits(
      "tile",
      "Kitchens, entries and laundry rooms, with the layout planned before the first tile is set.",
      "Floor tile for multifamily common areas and hospitality spaces, coordinated with your schedule and specifications.",
    ),
    faqs: [
      {
        q: "Are you licensed to install tile in California?",
        a: "Yes. V & A Flooring Inc holds CSLB license #866991 with C-54 (ceramic and mosaic tile), C-15 (flooring and floor covering) and B (general building) classifications.",
      },
      {
        q: "Can you install large-format tile?",
        a: "Large-format tile needs a flat, stable subfloor and the setting materials the manufacturer specifies. We review the subfloor and product requirements before installation.",
      },
    ],
  },
];

export const publishedServices = services.filter((s) => s.published);
export const serviceHref = (s: Service) => `/installation/${s.slug}`;
export const getService = (slug: string) => publishedServices.find((s) => s.slug === slug);

/** General FAQs for the homepage (visible + FAQPage schema + llms.txt). */
export const homeFaqs: Faq[] = [
  {
    q: "What does V & A Flooring Inc do?",
    a: "V & A Flooring Inc is a family-owned flooring contractor based in Sun Valley, California. We supply flooring materials and install them: hardwood, laminate, luxury vinyl plank (LVP), carpet and carpet tile, and porcelain and ceramic tile, for homes, ADUs, multifamily buildings, hotels and commercial projects.",
  },
  {
    q: "Which areas do you serve?",
    a: `We serve ${area}, including the San Fernando Valley, Burbank, Glendale, Pasadena, Santa Clarita, Irvine and Thousand Oaks.`,
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. V & A Flooring Inc holds California CSLB license #866991 with B (general building), C-15 (flooring and floor covering) and C-54 (tile) classifications, and is bonded and insured.",
  },
  {
    q: "Do you sell flooring materials or only install?",
    a: "Both. We supply flooring materials from manufacturers including Mohawk, Shaw and Engineered Floors, and install them with our own crews. We can also install materials you have already chosen.",
  },
  {
    q: "Can you handle large multifamily, hotel or commercial projects?",
    a: "Yes. With more than 20 installation crews, we work with general contractors, developers, property managers and hospitality operators on multifamily, hotel and commercial flooring, coordinated around the project schedule.",
  },
  {
    q: "How long has V & A Flooring Inc been in business?",
    a: "Since 1999. The company was founded by Armond Markarian, a flooring installer, and has served Lowe’s installation customers for more than 20 years.",
  },
  {
    q: "How do I get a flooring estimate?",
    a: "Call (818) 843-4773 or send a request through our website with your project type, location, approximate area and timing. We’ll follow up to discuss the scope and prepare an estimate.",
  },
];

/** Communities within the counties served (service-area page and schema). */
export const serviceAreas: { county: string; intro: string; places: string[] }[] = [
  {
    county: "Los Angeles County",
    intro:
      "Our home county. From our Sun Valley showroom we serve the San Fernando Valley, Burbank, Glendale and Pasadena, the Santa Clarita Valley, the Westside and the South Bay: homes, ADUs, apartment communities, hotels and commercial buildings.",
    places: [
      "Los Angeles", "Sun Valley", "Burbank", "Glendale", "Pasadena", "North Hollywood", "Van Nuys", "Sherman Oaks",
      "Studio City", "Encino", "Northridge", "Granada Hills", "Santa Clarita", "Valencia", "Santa Monica",
      "West Hollywood", "Beverly Hills", "Culver City", "Torrance", "Long Beach",
    ],
  },
  {
    county: "Orange County",
    intro:
      "Flooring supply and installation for homes, multifamily communities, hospitality properties and commercial interiors across Orange County, with crews and materials coordinated from our Los Angeles base.",
    places: ["Irvine", "Anaheim", "Santa Ana", "Huntington Beach", "Costa Mesa", "Orange", "Fullerton", "Newport Beach"],
  },
  {
    county: "Ventura County",
    intro:
      "Homes, ADUs and larger projects in the Conejo Valley, Simi Valley and the Ventura County coast, with the same licensed crews and one point of contact.",
    places: ["Thousand Oaks", "Simi Valley", "Oxnard", "Ventura", "Camarillo", "Moorpark"],
  },
];
