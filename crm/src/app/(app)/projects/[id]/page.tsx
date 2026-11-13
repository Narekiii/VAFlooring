import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { deleteProject, saveProject } from "@/app/actions";
import { ProjectForm } from "@/components/ProjectForm";
import { FollowUpPill } from "@/components/ProjectRow";
import { fmtDate, todayLA } from "@/lib/dates";
import { directionsUrl, siteAddress, stageLabel, telHref } from "@/lib/labels";
import { safeFrom, toFormValues } from "@/lib/project-values";

export const metadata = { title: "Project" };

export default async function EditProject({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const returnTo = safeFrom((await searchParams).from);
  const db = await getDb();
  const [p] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!p) notFound();
  const addr = siteAddress(p);
  return (
    <>
      <p style={{ marginBottom: 8 }}>
        <Link href={returnTo}>← Back</Link>
      </p>
      <h1 style={{ marginBottom: 6, overflowWrap: "anywhere" }}>{p.name}</h1>
      <p className="rowMeta" style={{ marginBottom: 12 }}>
        {p.stage && (
          <span className="pill">
            {stageLabel[p.stage]}
            {p.observedOn ? ` · seen ${fmtDate(p.observedOn)}` : ""}
          </span>
        )}
        <FollowUpPill p={p} today={todayLA()} />
      </p>
      {(p.phone || p.email || addr) && (
        <div className="quick" aria-label="Contact and directions">
          {p.phone && (
            <a className="btn btnSmall" href={telHref(p.phone)}>
              Call {p.phone}
            </a>
          )}
          {p.email && (
            <a className="btn btnSmall" href={`mailto:${p.email}`} style={{ overflowWrap: "anywhere" }}>
              Email {p.email}
            </a>
          )}
          {addr && (
            <a className="btn btnSmall" href={directionsUrl(addr)} target="_blank" rel="noreferrer">
              Directions
            </a>
          )}
        </div>
      )}
      <ProjectForm
        initial={toFormValues(p)}
        savedStatus={p.geocodeStatus}
        isNew={false}
        returnTo={returnTo}
        action={saveProject.bind(null, id)}
        deleteFormId="delete-project"
      />
      <form id="delete-project" action={deleteProject.bind(null, id)} hidden>
        <input type="hidden" name="returnTo" value={returnTo} />
      </form>
    </>
  );
}
