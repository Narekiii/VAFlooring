import Link from "next/link";
import type { Property } from "@/db/schema";
import { directionsUrl, propertyTypeLabel, prospectStatusLabel, siteAddress } from "@/lib/labels";
import { FollowUpPill } from "./ProjectRow";

export function PropertyRow({ p, today, from, showKind }: { p: Property; today: string; from: string; showKind?: boolean }) {
  const addr = siteAddress(p);
  const sub = [p.managementCompany, p.units ? `${p.units.toLocaleString("en-US")} units` : null, p.propertyType ? propertyTypeLabel[p.propertyType] : null].filter(Boolean).join(" · ");
  return (
    <li className="row">
      <Link href={`/properties/${p.id}?from=${encodeURIComponent(from)}`} className="rowMain">
        {showKind && <span className="kind">Property</span>}
        <span className="rowName">{p.name}</span>
        {sub && <span className="rowSub">{sub}</span>}
        {addr && <span className="rowSub">{addr}</span>}
        <span className="rowMeta">
          <span className={`pill pill-status-${p.status}`}>{prospectStatusLabel[p.status]}</span>
          <FollowUpPill p={p} today={today} />
        </span>
      </Link>
      {addr && (
        <div className="rowSide">
          <a href={directionsUrl(addr)} target="_blank" rel="noreferrer">
            Directions<span className="visually-hidden"> to {p.name}</span>
          </a>
        </div>
      )}
    </li>
  );
}
