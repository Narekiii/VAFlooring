import { business, facts, licenseLine, regionLine } from "@/content/site";
import { homeFaqs, publishedServices, serviceAreas, serviceHref } from "@/content/services";
import { routes } from "@/content/navigation";
import { siteUrl } from "@/lib/seo";

/**
 * /llms.txt — a plain-text summary of the business for AI assistants and answer engines
 * (see llmstxt.org). Generated from the same verified content as the site.
 */
export const dynamic = "force-static";

const plain = (s: string) => s.replace(/ /g, " ");

export function GET() {
  const base = siteUrl() ?? "";
  const link = (path: string) => `${base}${path}`;
  const lines = [
    `# ${business.name}`,
    "",
    `> ${business.name} is a family-owned, licensed flooring contractor based in Sun Valley (Los Angeles), California, founded in ${business.founded} by ${business.founder}. It supplies flooring materials and installs hardwood, laminate, luxury vinyl plank (LVP), carpet and tile flooring for home renovations, ADUs, multifamily communities, hotels and commercial projects across ${regionLine}.`,
    "",
    "## Key facts",
    `- Founded: ${business.founded} (family owned)`,
    `- Service area: ${regionLine}, California`,
    ...serviceAreas.map((a) => `  - ${a.county}: ${a.places.join(", ")}`),
    ...(business.license ? [`- License: California ${licenseLine(business.license)}${business.bondedInsured ? ", bonded and insured" : ""}`] : []),
    ...(business.epaLeadSafe ? [`- EPA Lead-Safe Certified Firm, certification ${business.epaLeadSafe}`] : []),
    "- Recognized by Lowe’s for craftsmanship and professionalism (96.67% scores for 2015), dedication (2016) and determination (2019)",
    ...(business.address ? [`- Address: ${business.address.streetAddress}, ${business.address.addressLocality}, ${business.address.addressRegion} ${business.address.postalCode}`] : []),
    `- Installation capacity: ${facts.installationCrewsLong.toLowerCase()}`,
    "- Provides: flooring materials and installation from one company",
    `- Manufacturers include: ${facts.manufacturers.join(", ")}, with American-made options available`,
    `- ${facts.lowesLine}`,
    ...(business.phone ? [`- Phone: ${business.phone}`] : []),
    ...(business.email ? [`- Email: ${business.email}`] : []),
    "",
    "## Services",
    ...publishedServices.map((s) => `- [${s.name}](${link(serviceHref(s))}): ${plain(s.cardText)}`),
    `- [Residential flooring](${link(routes.residential)}): home renovations, single rooms and ADUs`,
    `- [Commercial & multifamily flooring](${link(routes.commercial)}): general contractors, developers, property managers, hotels and apartment communities`,
    "",
    "## Pages",
    `- [Materials & brands](${link(routes.materials)})`,
    `- [Service areas](${link(routes.serviceAreas)})`,
    `- [Our story](${link(routes.story)})`,
    `- [Projects](${link(routes.projects)})`,
    `- [Request an estimate](${link(routes.estimate)})`,
    "",
    "## FAQ",
    ...homeFaqs.flatMap((f) => [`### ${plain(f.q)}`, plain(f.a), ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
