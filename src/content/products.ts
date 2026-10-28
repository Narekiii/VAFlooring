import { images, type SiteImage } from "./images";
import type { Faq } from "./services";

/**
 * Flooring product pages (one per floor type at /products/<slug>).
 *
 * These pages answer "buy / choose" searches (flooring store, types, comparisons, brands).
 * Installation content lives on /installation/<slug> (content/services.ts).
 * Keep claims general and accurate: no performance claims (waterproof, scratchproof,
 * warranty terms) and no brand-by-category claims unless V & A Flooring Inc confirms them.
 */

export type Comparison = { caption: string; columns: [string, string, string]; rows: [string, string, string][] };

export type Product = {
  slug: string;
  /** Menu / card name, e.g. "Hardwood Flooring". */
  name: string;
  /** One-line description in the Products menu. */
  navText: string;
  /** Lower-case word used in sentences. */
  material: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** Answer-first summary (top of page, llms.txt, structured data). */
  summary: string;
  cardText: string;
  /** Category photo (hero). */
  image: SiteImage;
  /** Real showroom photo of this category. */
  showroomImage: SiteImage;
  /** Types we carry, shown at a glance. */
  types: string[];
  /** Manufacturers V & A Flooring Inc has confirmed for this category. */
  brands?: string[];
  /** Matching installation page slug (content/services.ts). */
  installSlug: string;
  sections: { heading: string; body: string[] }[];
  comparison?: Comparison;
  faqs: Faq[];
};

export const products: Product[] = [
  {
    slug: "hardwood-flooring",
    name: "Hardwood Flooring",
    navText: "Solid and engineered hardwood in a range of species and finishes.",
    material: "hardwood",
    h1: "Hardwood Flooring in Los Angeles: Solid & Engineered",
    metaTitle: "Hardwood Flooring Store in Los Angeles",
    metaDescription:
      "Compare solid and engineered hardwood flooring at our Sun Valley showroom, with products from Mohawk and Shaw. Supplied and installed by V & A Flooring Inc.",
    summary:
      "V & A Flooring Inc sells solid and engineered hardwood flooring from its showroom and warehouse in Sun Valley, Los Angeles, with products from established manufacturers including Mohawk and Shaw. Compare samples in person, and have the floor you choose installed by our own crews.",
    cardText: "Solid and engineered hardwood in a range of species, widths and finishes.",
    image: images.livingWindows,
    showroomImage: images.showroomHardwood,
    types: ["Engineered hardwood", "Solid hardwood", "Narrow strip and wide plank", "Factory-finished colors and sheens"],
    brands: ["Mohawk", "Shaw"],
    installSlug: "hardwood-flooring",
    sections: [
      {
        heading: "Engineered and solid hardwood",
        body: [
          "Engineered hardwood has a real wood wear layer bonded over a layered core. Depending on the product, it can be glued, nailed or floated, which makes it a common choice for concrete slabs, condos and ADUs.",
          "Solid hardwood is milled from a single piece of wood and is typically nailed or stapled over a wood subfloor in living rooms, bedrooms and hallways.",
        ],
      },
      {
        heading: "Species, width and finish",
        body: [
          "Species such as oak, maple and hickory, depending on the product line, in narrow strips or wide planks, with factory finishes in a range of colors and sheens. We help you compare samples against your space, the light it gets and your budget.",
          "Our selection includes products from Mohawk and Shaw, including American-made options.",
        ],
      },
    ],
    comparison: {
      caption: "Engineered vs. solid hardwood",
      columns: ["", "Engineered hardwood", "Solid hardwood"],
      rows: [
        ["Construction", "Real wood wear layer over a layered core", "One piece of wood throughout"],
        ["Typical installation", "Glue-down, nail-down or floating, by product", "Nail-down or staple-down"],
        ["Over concrete slabs", "Many products are designed for it", "Generally not recommended"],
        ["Common uses", "Slabs, condos, ADUs, multifamily", "Living rooms, bedrooms, hallways over wood subfloors"],
      ],
    },
    faqs: [
      {
        q: "What is the difference between solid and engineered hardwood?",
        a: "Solid hardwood is one piece of wood throughout. Engineered hardwood has a real wood wear layer on a layered core. Engineered products can often go over concrete slabs and in more locations, while solid hardwood is usually nailed over a wood subfloor.",
      },
      {
        q: "Which hardwood flooring brands do you carry?",
        a: "Our hardwood selection includes products from manufacturers such as Mohawk and Shaw, including American-made options. We can also supply a specific product your designer or architect has specified.",
      },
      {
        q: "Where can I see hardwood flooring samples in Los Angeles?",
        a: "At our showroom and design center at 10945 Pendleton St in Sun Valley, in the San Fernando Valley. You can compare hardwood samples side by side and talk through species, widths and finishes with our team.",
      },
    ],
  },
  {
    slug: "laminate-flooring",
    name: "Laminate Flooring",
    navText: "Wood- and stone-look laminate for homes, ADUs and rentals.",
    material: "laminate",
    h1: "Laminate Flooring in Los Angeles: Wood & Stone Looks",
    metaTitle: "Laminate Flooring Store in Los Angeles",
    metaDescription:
      "Wood-look and stone-look laminate flooring at our Sun Valley showroom. Compare laminate and LVP, then have it installed by our own crews.",
    summary:
      "V & A Flooring Inc sells wood-look and stone-look laminate flooring from its showroom and warehouse in Sun Valley, Los Angeles. We help you choose a laminate by the room, the traffic it sees and your budget, using each manufacturer’s published specifications, and our crews can install it.",
    cardText: "Wood-look and stone-look laminate in plank and tile formats.",
    image: images.aduDining,
    showroomImage: images.showroomPlanks,
    types: ["Wood-look planks", "Stone-look tiles", "Smooth to embossed textures", "Attached or separate underlayment"],
    installSlug: "laminate-flooring",
    sections: [
      {
        heading: "Choosing a laminate",
        body: [
          "Laminate comes in wood-look and stone-look designs, plank and tile formats, and textures from smooth to deeply embossed. Plank thickness, attached or separate underlayment and sound-reduction options vary by product.",
          "Some laminate lines are designed for greater water resistance and higher traffic. We use each manufacturer’s published specifications, not marketing labels, to match a product to the room.",
        ],
      },
      {
        heading: "A wood look with a predictable budget",
        body: [
          "Laminate is a practical way to get a wood or stone look at a lower cost than many hardwood options, from a single room to a whole home or a building of rental units. It has different care and repair characteristics from hardwood, and we walk through the trade-offs with you.",
        ],
      },
    ],
    comparison: {
      caption: "Laminate vs. luxury vinyl plank (LVP)",
      columns: ["", "Laminate", "Luxury vinyl plank"],
      rows: [
        ["Core", "Wood-based (high-density fiberboard)", "Vinyl-based, often a rigid SPC or WPC core"],
        ["Look", "Printed wood or stone design", "Printed wood or stone design"],
        ["Moisture", "Varies by product; check the specifications", "Varies by product; check the specifications"],
        ["Typical installation", "Floating", "Floating or glue-down"],
      ],
    },
    faqs: [
      {
        q: "Is laminate a good alternative to hardwood?",
        a: "For many rooms, yes. Laminate offers a wood look at a lower cost than many hardwood options. It has different care and repair characteristics, so we walk through the trade-offs for your space.",
      },
      {
        q: "What is the difference between laminate and luxury vinyl plank?",
        a: "Laminate has a wood-based core with a printed design layer; luxury vinyl plank is vinyl-based. They differ in feel, sound, moisture behavior and price, and we can help you compare them.",
      },
    ],
  },
  {
    slug: "vinyl-lvp-flooring",
    name: "Vinyl & LVP Flooring",
    navText: "Luxury vinyl plank and tile, rigid-core and glue-down.",
    material: "vinyl",
    h1: "Luxury Vinyl Plank (LVP) & Vinyl Flooring in Los Angeles",
    metaTitle: "LVP & Vinyl Flooring Store in Los Angeles",
    metaDescription:
      "Rigid-core LVP and glue-down LVT at our Sun Valley flooring showroom, for homes, apartment units and commercial spaces across Los Angeles.",
    summary:
      "V & A Flooring Inc sells luxury vinyl plank (LVP), luxury vinyl tile (LVT) and other vinyl flooring from its showroom and warehouse in Sun Valley, Los Angeles, for homes, ADUs, apartment communities, hotels and commercial spaces. Compare rigid-core and glue-down products in person, then have them installed by our crews.",
    cardText: "Rigid-core LVP and glue-down LVT for homes, units and commercial spaces.",
    image: images.lobby,
    showroomImage: images.showroomCarpetLvp,
    types: ["Rigid-core LVP (SPC and WPC)", "Glue-down LVT and LVP", "Wood-look and stone-look designs", "Multiple wear-layer thicknesses"],
    installSlug: "lvp-vinyl-flooring",
    sections: [
      {
        heading: "Rigid-core LVP and glue-down LVT",
        body: [
          "Rigid-core planks (SPC and WPC) click together and are commonly installed as a floating floor in homes and units. Glue-down LVT and LVP are thinner, adhered to the subfloor, and widely used in corridors, hospitality and commercial spaces.",
          "Wear-layer thickness, texture, plank size and pattern vary by product line. We compare them with you against how the space is used.",
        ],
      },
      {
        heading: "Vinyl for kitchens, baths and entries",
        body: [
          "Luxury vinyl is one of the most requested floors for kitchens, family rooms, ADUs and apartment units. Water resistance depends on the specific product and its installation, so we review the manufacturer’s specifications with you for kitchens, baths and entries.",
        ],
      },
    ],
    comparison: {
      caption: "Floating LVP vs. glue-down LVT",
      columns: ["", "Floating (rigid-core) LVP", "Glue-down LVT / LVP"],
      rows: [
        ["Installation", "Planks click together over the subfloor", "Adhered to the subfloor"],
        ["Common uses", "Homes, ADUs, apartment units", "Corridors, hospitality, commercial spaces"],
        ["Subfloor", "Must meet the product’s flatness requirements", "Usually needs a smoother, well-prepared subfloor"],
      ],
    },
    faqs: [
      {
        q: "What is LVP flooring?",
        a: "LVP stands for luxury vinyl plank, a vinyl-based floor made to look like wood planks. LVT is the tile-format version. Both come in floating (click) and glue-down types.",
      },
      {
        q: "How water-resistant is luxury vinyl?",
        a: "It depends on the specific product and how it is installed. The manufacturer’s specifications and warranty terms are what matter, and we review them with you before you choose a vinyl floor for a kitchen, bath or entry.",
      },
    ],
  },
  {
    slug: "carpet",
    name: "Carpet & Carpet Tile",
    navText: "Broadloom carpet and carpet tile for homes, hotels and offices.",
    material: "carpet",
    h1: "Carpet & Carpet Tile in Los Angeles",
    metaTitle: "Carpet & Carpet Tile Store in Los Angeles",
    metaDescription:
      "Broadloom carpet and carpet tile from Mohawk, Shaw and Engineered Floors at our Sun Valley showroom. Supplied and installed by V & A Flooring Inc.",
    summary:
      "V & A Flooring Inc sells broadloom carpet and carpet tile from its showroom and warehouse in Sun Valley, Los Angeles, with products from manufacturers including Mohawk, Shaw and Engineered Floors. We help homeowners, property managers and hospitality clients choose carpet and cushion, and our crews install it.",
    cardText: "Broadloom carpet and carpet tile from Mohawk, Shaw and Engineered Floors.",
    image: images.corridorCarpet,
    showroomImage: images.showroomCarpetVinyl,
    types: ["Broadloom (wall-to-wall) carpet", "Carpet tile and carpet planks", "Cushion options", "Residential and commercial styles"],
    brands: ["Mohawk", "Shaw", "Engineered Floors"],
    installSlug: "carpet",
    sections: [
      {
        heading: "Broadloom carpet and carpet tile",
        body: [
          "Broadloom is wall-to-wall carpet installed over cushion, available in many textures, constructions and colors. Carpet tile comes in modular squares or planks that can be laid in patterns and replaced individually, which is why it is common in offices and corridors.",
          "Cushion type and thickness affect comfort, sound and performance. For commercial projects we work from the carpet and cushion specified in your documents.",
        ],
      },
      {
        heading: "Carpet brands we carry",
        body: [
          "Our selection includes products from Mohawk, Shaw and Engineered Floors, including American-made options, for bedrooms and family rooms as well as apartment units, hotel corridors and offices.",
        ],
      },
    ],
    comparison: {
      caption: "Broadloom carpet vs. carpet tile",
      columns: ["", "Broadloom carpet", "Carpet tile"],
      rows: [
        ["Format", "Wall-to-wall rolls over cushion", "Modular squares or planks"],
        ["Repairs", "Sections are patched or replaced", "Individual tiles can be replaced"],
        ["Common uses", "Bedrooms, family rooms, apartment units, hotel rooms", "Offices, corridors, commercial spaces"],
      ],
    },
    faqs: [
      {
        q: "Which carpet brands do you offer?",
        a: "Our selection includes products from manufacturers such as Mohawk, Shaw and Engineered Floors, including American-made options.",
      },
      {
        q: "Carpet or carpet tile for an office?",
        a: "Carpet tile is common in offices because tiles can be replaced individually and laid in patterns. Broadloom gives a seamless look. We help you choose based on the space and any specifications.",
      },
    ],
  },
  {
    slug: "tile",
    name: "Porcelain & Ceramic Tile",
    navText: "Porcelain and ceramic floor tile, including large-format.",
    material: "tile",
    h1: "Porcelain & Ceramic Floor Tile in Los Angeles",
    metaTitle: "Porcelain & Ceramic Tile Store in LA",
    metaDescription:
      "Porcelain and ceramic floor tile, including large-format and wood-look tile, at our Sun Valley showroom. Installed by a C-54 licensed tile contractor.",
    summary:
      "V & A Flooring Inc sells porcelain and ceramic floor tile, including large-format and wood-look tile, from its showroom in Sun Valley, Los Angeles. We help you compare tile by where it will go and the look you want, and we install it under our California C-54 tile classification.",
    cardText: "Porcelain and ceramic floor tile, including large-format and wood-look.",
    image: images.tileKitchen,
    showroomImage: images.showroomTile,
    types: ["Porcelain tile", "Ceramic tile", "Large-format tile", "Wood-look porcelain planks"],
    installSlug: "tile-flooring",
    sections: [
      {
        heading: "Porcelain and ceramic tile",
        body: [
          "Porcelain is dense and low-absorption, and comes in many sizes including large-format and wood-look planks. Ceramic tile offers a wide range of colors and finishes for residential floors.",
        ],
      },
      {
        heading: "Choosing size, finish and color",
        body: [
          "Tile size, finish and color change how a room reads, and larger tiles need a flatter subfloor. Bring your plans or photos of the space to the showroom and we’ll help you compare options side by side.",
        ],
      },
    ],
    comparison: {
      caption: "Porcelain vs. ceramic floor tile",
      columns: ["", "Porcelain", "Ceramic"],
      rows: [
        ["Body", "Dense, low water absorption", "Less dense, more absorbent"],
        ["Formats", "Wide range, including large-format and wood-look", "Wide range of colors, sizes and finishes"],
        ["Typical cost", "Often higher", "Often lower"],
      ],
    },
    faqs: [
      {
        q: "Porcelain or ceramic: which should I choose?",
        a: "Porcelain is denser and absorbs less water; ceramic offers many design options and is often less expensive. The right choice depends on where the tile goes and the look you want.",
      },
      {
        q: "Do you carry large-format and wood-look tile?",
        a: "Yes. Our tile selection includes large-format porcelain and wood-look porcelain planks as well as ceramic tile. Large-format tile needs a flat, stable subfloor, which we review before installation.",
      },
    ],
  },
];

export const productHref = (p: Product) => `/products/${p.slug}`;
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** General questions for the Products page (visible + FAQPage schema). */
export const productFaqs: Faq[] = [
  {
    q: "Do you sell flooring to contractors as well as homeowners?",
    a: "Yes. We supply flooring materials to homeowners, contractors, builders and property managers from our Sun Valley showroom and warehouse, and we can install them with our own crews.",
  },
  {
    q: "Which flooring brands do you carry?",
    a: "We offer products from established manufacturers including Mohawk, Shaw and Engineered Floors, with American-made options available.",
  },
  {
    q: "Where is your flooring showroom?",
    a: "Our showroom, design center and warehouse are at 10945 Pendleton St, Sun Valley, CA 91352, in the San Fernando Valley area of Los Angeles.",
  },
];
