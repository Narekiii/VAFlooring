import { business } from "@/content/site";
import { siteUrl } from "./seo";

/**
 * Organization structured data built only from verified details in content/site.ts.
 * Contact fields, address and logo URL are included automatically once they are configured.
 */
export function organizationJsonLd() {
  const url = siteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    description:
      "Family-owned flooring company supplying flooring materials and installation for residential, multifamily, hospitality and commercial projects in Los Angeles.",
    foundingDate: String(business.founded),
    founder: { "@type": "Person", name: business.founder },
    areaServed: { "@type": "City", name: business.serviceArea },
  };
  if (url) {
    data["@id"] = `${url}/#organization`;
    data.url = url;
    data.logo = `${url}/brand/icon-512.png`;
    data.image = `${url}/opengraph-image.jpg`;
  }
  if (business.phone) data.telephone = business.phone;
  if (business.email) data.email = business.email;
  if (business.address) data.address = { "@type": "PostalAddress", addressCountry: "US", ...business.address };
  if (business.sameAs.length) data.sameAs = business.sameAs;
  return data;
}

/** Serialise JSON-LD safely for an inline <script>. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
