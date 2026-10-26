import { business, facts } from "@/content/site";
import { serviceAreas } from "@/content/services";
import { publishedServices, serviceHref, type Faq, type Service } from "@/content/services";
import { siteUrl } from "./seo";
import { images } from "@/content/images";

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

export function organizationJsonLd() {
  const url = siteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    alternateName: ["V & A Flooring", "VA Flooring", "V and A Flooring Inc"],
    slogan: "Flooring Expertise. Family Accountability. Since 1999.",
    description:
      "Family-owned, licensed flooring contractor in Sun Valley, California, supplying and installing hardwood, laminate, luxury vinyl plank (LVP), carpet and tile flooring for home renovations, ADUs, multifamily communities, hotels and commercial projects across Los Angeles, Orange and Ventura counties.",
    legalName: business.legalName,
    foundingDate: String(business.founded),
    founder: { "@type": "Person", name: business.founder },
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Flooring services",
      itemListElement: publishedServices.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, serviceType: s.serviceType, url: abs(serviceHref(s)) },
      })),
    },
  };
  if (url) {
    data["@id"] = orgId();
    data.url = url;
    data.logo = `${url}/brand/icon-512.png`;
    data.image = [
      `${url}/opengraph-image.jpg`,
      ...[images.storefront, images.showroomAisle, images.designCenter, images.warehouse].map((i) => `${url}${i.src.src}`),
    ];
  }
  if (business.phone) data.telephone = business.phone;
  if (business.email) data.email = business.email;
  if (business.address) data.address = { "@type": "PostalAddress", addressCountry: "US", ...business.address };
  if (business.sameAs.length) data.sameAs = business.sameAs;
  return data;
}

function areaServed() {
  return serviceAreas.map((a) => ({
    "@type": "AdministrativeArea",
    name: `${a.county}, California`,
  }));
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
    publisher: { "@id": orgId() },
    inLanguage: "en-US",
  };
}

export function serviceJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.serviceType,
    description: plain(s.summary),
    url: abs(serviceHref(s)),
    provider: orgId() ? { "@id": orgId() } : { "@type": "HomeAndConstructionBusiness", name: business.name },
    areaServed: areaServed(),
    audience: { "@type": "Audience", audienceType: "Homeowners, builders, property managers and commercial clients" },
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
