import type { ReactNode } from "react";
import { addressLine, business, facts, hoursLines, licenseLine, mapsHref, regionLine, telHref } from "@/content/site";
import styles from "./CompanyFacts.module.css";

/**
 * Key company facts as a definition list. Written to be quotable on its own, so search engines
 * and AI assistants can lift accurate answers (who, where, licensed, what, when).
 */
export function CompanyFacts({ headingId, title = "V & A Flooring Inc at a glance" }: { headingId: string; title?: string }) {
  const address = addressLine();
  const maps = mapsHref();
  const hours = hoursLines();
  const rows: [string, ReactNode][] = [
    ["Business", `${business.name}, a family-owned flooring contractor and flooring showroom`],
    ["Founded", `${business.founded} by ${business.founder}, a flooring installer`],
    ...(address
      ? ([["Showroom", maps ? <a href={maps} target="_blank" rel="noopener noreferrer">{address}<span className="visually-hidden"> (opens Google Maps in a new tab)</span></a> : address]] as [string, ReactNode][])
      : []),
    ...(business.phone ? ([["Phone", <a href={telHref(business.phone)}>{business.phone}</a>]] as [string, ReactNode][]) : []),
    ...(hours.length ? ([["Hours", hours.join(" · ")]] as [string, ReactNode][]) : []),
    ...(business.license
      ? ([["License", `California ${licenseLine(business.license)}${business.bondedInsured ? ", bonded and insured" : ""}`]] as [string, ReactNode][])
      : []),
    ...(business.epaLeadSafe ? ([["Certification", `EPA Lead-Safe Certified Firm, ${business.epaLeadSafe}`]] as [string, ReactNode][]) : []),
    ["Flooring", "Hardwood, laminate, luxury vinyl plank (LVP/LVT), carpet and carpet tile, porcelain and ceramic tile: materials and installation"],
    ["Clients", "Homeowners, ADU builders, general contractors, developers, property managers, hotels and commercial clients"],
    ["Service area", `${regionLine}, California`],
    ["Capacity", facts.installationCrewsLong],
  ];
  return (
    <div className={styles.facts}>
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      <dl className={styles.list}>
        {rows.map(([k, v]) => (
          <div key={k} className={styles.row}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
