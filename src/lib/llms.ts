import { addressLine, business, contentUpdated, facts, hoursLines, licenseLine, mapsHref, regionLine } from "@/content/site";
import { homeFaqs, publishedServices, serviceAreas, serviceHref } from "@/content/services";
import { productFaqs, productHref, products } from "@/content/products";
import { installProcess } from "@/content/installation";
import { reasons } from "@/content/why-us";
import { routes } from "@/content/navigation";
import { projects } from "@/content/projects";
import { siteUrl } from "./seo";

/**
 * Plain-text summaries for AI assistants and answer engines (llmstxt.org):
 *   /llms.txt       — short index with key facts and links
 *   /llms-full.txt  — the full service content, FAQs and company facts in one file
 * Both are generated from the same verified content as the website.
 */

const plain = (s: string) => s.replace(/ /g, " ");
const link = (path: string) => `${siteUrl() ?? ""}${path}`;

export function overview(): string {
  return `${business.name} is a family-owned, licensed flooring contractor and flooring showroom in Sun Valley (Los Angeles), California, founded in ${business.founded} by ${business.founder}. It sells flooring materials to homeowners and contractors and installs hardwood, laminate, luxury vinyl plank (LVP), carpet and tile flooring for home renovations, ADUs, multifamily communities, hotels and commercial projects across ${regionLine}.`;
}

export function keyFacts(): string[] {
  const address = addressLine();
  const hours = hoursLines();
  return [
    `- Business name: ${business.name} (also written V&A Flooring, VA Flooring)`,
    `- Type: flooring contractor and flooring showroom (materials and installation from one company)`,
    `- Founded: ${business.founded} by ${business.founder}; family owned`,
    ...(address ? [`- Showroom, design center and warehouse: ${address}`] : []),
    ...(business.phone ? [`- Phone: ${business.phone}`] : []),
    ...(business.email ? [`- Email: ${business.email}`] : []),
    ...(hours.length ? [`- Showroom hours: ${hours.join("; ")}`] : []),
    ...(mapsHref() ? [`- Map: ${mapsHref()}`] : []),
    ...(business.license ? [`- License: California ${licenseLine(business.license)}${business.bondedInsured ? ", bonded and insured" : ""}`] : []),
    ...(business.epaLeadSafe ? [`- EPA Lead-Safe Certified Firm, certification ${business.epaLeadSafe}`] : []),
    `- Service area: ${regionLine}, California`,
    ...serviceAreas.map((a) => `  - ${a.county}: ${a.places.join(", ")}`),
    `- Installation capacity: ${facts.installationCrewsLong.toLowerCase()}`,
    `- Clients: homeowners, ADU builders, general contractors, developers, property managers, hotels and commercial clients`,
    `- Manufacturers include: ${facts.manufacturers.join(", ")}, with American-made options available`,
    `- ${facts.lowesLine}`,
    "- Recognized by Lowe’s for craftsmanship and professionalism (96.67% scores for 2015), dedication (2016) and determination (2019)",
  ];
}

export function llmsTxt(): string {
  return [
    `# ${business.name}`,
    "",
    `> ${overview()}`,
    "",
    `Last reviewed: ${contentUpdated}. Full content: ${link("/llms-full.txt")}`,
    "",
    "## Key facts",
    ...keyFacts(),
    "",
    `## Products (${link(routes.products)})`,
    ...products.map((p) => `- [${p.name}](${link(productHref(p))}): ${plain(p.summary)}`),
    "",
    `## Installation (${link(routes.installation)})`,
    ...publishedServices.map((s) => `- [${s.name}](${link(serviceHref(s))}): ${plain(s.summary)}`),
    `- [Residential flooring](${link(routes.residential)}): home renovations, single rooms and ADUs`,
    `- [Commercial & multifamily flooring](${link(routes.commercial)}): general contractors, developers, property managers, hotels and apartment communities`,
    "",
    "## Pages",
    `- [Why choose us](${link(routes.whyUs)})`,
    `- [Service areas](${link(routes.serviceAreas)})`,
    `- [About us / our story](${link(routes.story)})`,
    `- [Contact](${link(routes.contact)})`,
    `- [Request an estimate](${link(routes.estimate)})`,
    ...(projects.length ? [`- [Projects](${link(routes.projects)})`] : []),
    "",
    "## FAQ",
    ...homeFaqs.flatMap((f) => [`### ${plain(f.q)}`, plain(f.a), ""]),
  ].join("\n");
}

export function llmsFullTxt(): string {
  const out: string[] = [
    `# ${business.name}: complete reference`,
    "",
    `> ${overview()}`,
    "",
    `Website: ${link("/")} · Last reviewed: ${contentUpdated}`,
    "",
    "## Company facts",
    ...keyFacts(),
    "",
    "## Our story",
    `In the early 1990s, ${business.founder} was working as a flooring installer and running a small business of his own. He saw many flooring companies put their energy into selling product while installation quality and customer support received far less attention. In ${business.founded} he founded ${business.name} around a different priority: good materials, careful installation, honest guidance, and support that continues after the job is complete. The company is still family owned and has grown to ${facts.installationCrewsLong.toLowerCase()}.`,
    "",
    "Values: honesty, hard work, initiative and trust.",
    "",
    "## Why clients choose us",
    ...reasons.map((r) => `- ${plain(r.title)}: ${plain(r.body)}`),
    "",
    "## How we install flooring",
    ...installProcess.map((p, i) => `${i + 1}. ${plain(p.title)}: ${plain(p.body)}`),
    "",
  ];
  for (const p of products) {
    out.push(`## ${p.name} (products)`, `URL: ${link(productHref(p))}`, "", plain(p.summary), "", `Types: ${p.types.join(", ")}`, ...(p.brands ? [`Brands include: ${p.brands.join(", ")}`] : []), "");
    for (const sec of p.sections) out.push(`### ${plain(sec.heading)}`, ...sec.body.map(plain), "");
    if (p.comparison) {
      const c = p.comparison;
      out.push(`### ${plain(c.caption)}`, `| ${c.columns.map((x) => x || "Feature").join(" | ")} |`, `| --- | --- | --- |`);
      for (const r of c.rows) out.push(`| ${r.map(plain).join(" | ")} |`);
      out.push("");
    }
    out.push(`### ${p.name} FAQ`, ...p.faqs.flatMap((f) => [`Q: ${plain(f.q)}`, `A: ${plain(f.a)}`, ""]));
  }
  out.push("## Buying flooring FAQ", ...productFaqs.flatMap((f) => [`Q: ${plain(f.q)}`, `A: ${plain(f.a)}`, ""]));
  for (const s of publishedServices) {
    out.push(`## ${s.name} (installation)`, `URL: ${link(serviceHref(s))}`, "", plain(s.summary), "");
    for (const sec of s.sections) out.push(`### ${plain(sec.heading)}`, ...sec.body.map(plain), "");
    if (s.comparison) {
      const c = s.comparison;
      out.push(`### ${plain(c.caption)}`, `| ${c.columns.map((x) => x || "Feature").join(" | ")} |`, `| --- | --- | --- |`);
      for (const r of c.rows) out.push(`| ${r.map(plain).join(" | ")} |`);
      out.push("");
    }
    out.push(`### How ${s.material} installation works`, ...s.process.map((p, i) => `${i + 1}. ${plain(p.title)}: ${plain(p.body)}`), "");
    out.push(`### Where we install ${s.material}`, ...s.fits.map((f) => `- ${plain(f.title)}: ${plain(f.body)}`), "");
    out.push(`### ${s.shortName} FAQ`, ...s.faqs.flatMap((f) => [`Q: ${plain(f.q)}`, `A: ${plain(f.a)}`, ""]));
  }
  out.push("## General FAQ", ...homeFaqs.flatMap((f) => [`Q: ${plain(f.q)}`, `A: ${plain(f.a)}`, ""]));
  out.push(
    "## How to start a project",
    `Request an estimate at ${link(routes.estimate)}${business.phone ? ` or call ${business.phone}` : ""}. Share the project city, the rooms or approximate area, the flooring being considered and the timing. Contractors and architects can send drawings, finish schedules and specifications.`,
    "",
  );
  return out.join("\n");
}
