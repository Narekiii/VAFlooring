import { business, facts } from "@/content/site";
import { homeFaqs, publishedServices, serviceHref } from "@/content/services";
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
    `> ${business.name} is a family-owned flooring company in ${business.serviceArea}, California, founded in ${business.founded} by ${business.founder}. It supplies flooring materials and provides professional installation, including hardwood and laminate flooring, for home renovations, ADUs, multifamily communities, hotels and hospitality properties, and large commercial projects.`,
    "",
    "## Key facts",
    `- Founded: ${business.founded} (family owned)`,
    `- Service area: ${business.serviceArea}, California`,
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
    `- [Our story](${link(routes.story)})`,
    `- [Projects](${link(routes.projects)})`,
    `- [Request an estimate](${link(routes.estimate)})`,
    "",
    "## FAQ",
    ...homeFaqs.flatMap((f) => [`### ${plain(f.q)}`, plain(f.a), ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
