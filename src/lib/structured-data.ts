import { addressLine, business, contentUpdated, facts, mapsHref } from "@/content/site";
import { serviceAreas } from "@/content/services";
import { publishedServices, serviceHref, type Faq, type Service } from "@/content/services";
import { productHref, products } from "@/content/products";
import { siteUrl } from "./seo";
import { images, type SiteImage } from "@/content/images";

/**
 * JSON-LD built only from verified details in content/site.ts and content/services.ts.
 * Contact fields, address and absolute URLs are added automatically once configured.
 */

const plain = (s: string) => s.replace(/ /g, " ");
const abs = (path: string) => {
  const base = siteUrl();
  return base ? `${base}${path === "/" ? "" : path}` : undefined;
};
const orgId = () => (siteUrl() ? `${siteUrl()}/#organization` : undefined);
const websiteId = () => (siteUrl() ? `${siteUrl()}/#website` : undefined);
const imageUrl = (img: SiteImage) => (siteUrl() ? `${siteUrl()}${img.src.src}` : undefined);

export function organizationJsonLd() {
  const url = siteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    // A flooring contractor that also runs a flooring showroom/store.
    "@type": ["HomeAndConstructionBusiness", "HomeGoodsStore"],
    name: business.name,
    alternateName: ["V & A Flooring", "VA Flooring", "V and A Flooring Inc"],
    slogan: "Flooring Expertise. Family Accountability. Since 1999.",
    description:
      "Family-owned, licensed flooring contractor in Sun Valley, California, supplying and installing hardwood, laminate, luxury vinyl plank (LVP), carpet and tile flooring for home renovations, ADUs, multifamily communities, hotels and commercial projects across Los Angeles, Orange and Ventura counties.",
    legalName: business.legalName,
    foundingDate: String(business.founded),
    founder: {
      "@type": "Person",
      name: business.founder,
      jobTitle: "Founder, President & CEO",
      ...(imageUrl(images.founder) ? { image: imageUrl(images.founder) } : {}),
    },
    areaServed: areaServed(),
    ...(business.license
      ? {
          hasCredential: [
            {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "license",
              name: `California contractor license #${business.license.number} (${business.license.classifications.join(", ")})`,
              recognizedBy: { "@type": "Organization", name: "Contractors State License Board", url: "https://www.cslb.ca.gov" },
            },
            ...(business.epaLeadSafe
              ? [
                  {
                    "@type": "EducationalOccupationalCredential",
                    credentialCategory: "certification",
                    name: `EPA Lead-Safe Certified Firm (${business.epaLeadSafe})`,
                    recognizedBy: { "@type": "GovernmentOrganization", name: "U.S. Environmental Protection Agency", url: "https://www.epa.gov" },
                  },
                ]
              : []),
          ],
        }
      : {}),
    knowsAbout: [
      "Flooring store",
      "Hardwood flooring",
      "Laminate flooring",
      "Luxury vinyl plank (LVP) flooring",
      "Carpet and carpet tile",
      "Porcelain and ceramic floor tile",
      "Hardwood flooring installation",
      "Engineered hardwood flooring",
      "Laminate flooring installation",
      "Luxury vinyl plank (LVP) installation",
      "Carpet and carpet tile installation",
      "Porcelain and ceramic tile installation",
      "Residential flooring",
      "ADU flooring",
      "Multifamily flooring",
      "Hospitality flooring",
      "Commercial flooring",
      ...facts.manufacturers.map((m) => `${m} flooring`),
    ],
    ...(business.geo ? { geo: { "@type": "GeoCoordinates", ...business.geo } } : {}),
    ...(mapsHref() ? { hasMap: mapsHref() } : {}),
    ...(business.hours?.length
      ? {
          openingHoursSpecification: business.hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    ...(business.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: `+1-${business.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`,
            areaServed: "US-CA",
            availableLanguage: "English",
          },
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Flooring products and installation",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Flooring products",
          ...(abs("/products") ? { url: abs("/products") } : {}),
          itemListElement: products.map((p) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Product", name: p.name, category: "Flooring", description: plain(p.cardText), url: abs(productHref(p)) },
          })),
        },
        {
          "@type": "OfferCatalog",
          name: "Flooring installation",
          ...(abs("/installation") ? { url: abs("/installation") } : {}),
          itemListElement: publishedServices.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, serviceType: s.serviceType, url: abs(serviceHref(s)) },
          })),
        },
      ],
    },
  };
  if (url) {
    data["@id"] = orgId();
    data.url = url;
    data.logo = { "@type": "ImageObject", url: `${url}/brand/icon-512.png`, width: 512, height: 512 };
    data.image = [
      `${url}/opengraph-image.jpg`,
      ...[images.storefront, images.showroomAisle, images.designCenter, images.warehouse].map((i) => `${url}${i.src.src}`),
    ];
  }
  if (business.phone) data.telephone = `+1-${business.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`;
  if (business.email) data.email = business.email;
  if (business.address) data.address = { "@type": "PostalAddress", addressCountry: "US", ...business.address };
  if (business.sameAs.length) data.sameAs = business.sameAs;
  return data;
}

function areaServed() {
  return serviceAreas.flatMap((a) => [
    { "@type": "AdministrativeArea", name: `${a.county}, California` },
    ...a.places.map((p) => ({
      "@type": "City",
      name: `${p}, CA`,
      containedInPlace: { "@type": "AdministrativeArea", name: `${a.county}, California` },
    })),
  ]);
}

export type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ItemPage";

/** WebPage node linking the page to the website, the business and its main image. */
export function webPageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  image,
  breadcrumb = true,
}: {
  path: string;
  name: string;
  description?: string;
  type?: PageType;
  image?: SiteImage;
  breadcrumb?: boolean;
}) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...(url ? { "@id": `${url}#webpage`, url } : {}),
    name: plain(name),
    ...(description ? { description: plain(description) } : {}),
    inLanguage: "en-US",
    dateModified: contentUpdated,
    ...(websiteId() ? { isPartOf: { "@id": websiteId() } } : {}),
    ...(orgId() ? { about: { "@id": orgId() }, publisher: { "@id": orgId() } } : {}),
    ...(image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            ...(imageUrl(image) ? { url: imageUrl(image), contentUrl: imageUrl(image) } : {}),
            width: image.src.width,
            height: image.src.height,
            caption: image.alt,
          },
        }
      : {}),
    ...(breadcrumb && url && path !== "/" ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

export function websiteJsonLd() {
  const url = siteUrl();
  if (!url) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: business.name,
    alternateName: ["V & A Flooring", "VA Flooring"],
    description: "Flooring materials, showroom and installation in Los Angeles, Orange and Ventura counties.",
    publisher: { "@id": orgId() },
    inLanguage: "en-US",
  };
}

export function serviceJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    ...(abs(serviceHref(s)) ? { "@id": `${abs(serviceHref(s))}#service` } : {}),
    name: s.name,
    serviceType: s.serviceType,
    description: plain(s.summary),
    url: abs(serviceHref(s)),
    provider: orgId() ? { "@id": orgId() } : { "@type": "HomeAndConstructionBusiness", name: business.name },
    areaServed: areaServed(),
    audience: { "@type": "Audience", audienceType: "Homeowners, builders, property managers and commercial clients" },
    ...(s.detailImage && imageUrl(s.detailImage) ? { image: imageUrl(s.detailImage) } : {}),
    ...(business.address
      ? {
          availableChannel: {
            "@type": "ServiceChannel",
            ...(business.phone ? { servicePhone: { "@type": "ContactPoint", telephone: business.phone } } : {}),
            serviceLocation: { "@type": "Place", name: `${business.name} showroom`, address: addressLine() },
          },
        }
      : {}),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: plain(f.q),
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
}

export type Crumb = { name: string; href: string };

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(abs(items[items.length - 1]?.href ?? "/") ? { "@id": `${abs(items[items.length - 1].href)}#breadcrumb` } : {}),
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plain(c.name),
      ...(abs(c.href) ? { item: abs(c.href) } : {}),
    })),
  };
}

/** Serialise JSON-LD safely for an inline <script>. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
