import Link from "next/link";
import type { Project } from "@/db/schema";
import { fmtDate } from "@/lib/dates";
import { directionsUrl, followUpLabel, siteAddress, stageLabel } from "@/lib/labels";

export function FollowUpPill({ p, today }: { p: Pick<Project, "followUpType" | "followUpDate">; today: string }) {
  if (!p.followUpDate || !p.followUpType) return <span className="pill pill-none">No follow-up</span>;
  const overdue = p.followUpDate < today;
  return (
    <>
      <span className={`pill pill-${p.followUpType}`}>
        {followUpLabel[p.followUpType]} {p.followUpDate === today ? "today" : fmtDate(p.followUpDate)}
      </span>
      {overdue && <span className="pill pill-overdue">Overdue</span>}
    </>
  );
}

export function ProjectRow({ p, today, from, showKind }: { p: Project; today: string; from: string; showKind?: boolean }) {
  const addr = siteAddress(p);
  return (
    <li className="row">
      <Link href={`/projects/${p.id}?from=${encodeURIComponent(from)}`} className="rowMain">
        {showKind && <span className="kind">Project</span>}
        <span className="rowName">{p.name}</span>
        {p.company && <span className="rowSub">{p.company}</span>}
        {addr && <span className="rowSub">{addr}</span>}
        <span className="rowMeta">
          {p.stage && <span className="pill">{stageLabel[p.stage]}</span>}
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
