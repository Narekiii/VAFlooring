import Link from "next/link";
import { and, asc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { STAGES } from "@/db/schema";
import { MainHead } from "@/components/MainHead";
import { ProjectRow } from "@/components/ProjectRow";
import { todayLA } from "@/lib/dates";
import { stageLabel } from "@/lib/labels";

export const metadata = { title: "Projects" };

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export default async function ProjectsTab({ searchParams }: { searchParams: Promise<{ q?: string; stage?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const stage = STAGES.find((s) => s === sp.stage);
  const p = schema.projects;
  const where: SQL[] = [];
  if (q) {
    const like = `%${escapeLike(q)}%`;
    where.push(
      or(
        ilike(p.name, like),
        ilike(p.company, like),
        ilike(p.projectManager, like),
        ilike(p.siteSupervisor, like),
        ilike(p.email, like),
        ilike(p.phone, like),
        ilike(p.street, like),
        ilike(p.city, like),
        ilike(p.zip, like),
        ilike(p.officeAddress, like),
      )!,
    );
  }
  if (stage) where.push(eq(p.stage, stage));
  const db = await getDb();
  const rows = await db
    .select()
    .from(p)
    .where(where.length ? and(...where) : undefined)
    .orderBy(sql`${p.followUpDate} asc nulls last`, asc(p.name));
  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(p);
  const today = todayLA();
  const filtered = Boolean(q || stage);
  const from = `/${filtered ? `?${new URLSearchParams({ ...(q ? { q } : {}), ...(stage ? { stage } : {}) })}` : ""}`;

  return (
    <>
      <MainHead tab="projects" />
      {total === 0 ? (
        <div className="empty">
          <h2>No projects yet</h2>
          <p>Add the first job site you’ve visited. Only the project name is required, so you can fill in the rest later.</p>
          <Link href="/projects/new" className="btn btnPrimary">
            + Add project
          </Link>
        </div>
      ) : (
        <>
          <form className="filters" role="search" action="/">
            <div className="field q">
              <label htmlFor="q" className="visually-hidden">
                Search projects
              </label>
              <input id="q" name="q" type="search" defaultValue={q} placeholder="Search project, company, contact, address" />
            </div>
            <div className="field">
              <label htmlFor="stage" className="visually-hidden">
                Construction stage
              </label>
              <select id="stage" name="stage" defaultValue={stage ?? ""}>
                <option value="">All stages</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {stageLabel[s]}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn">Search</button>
          </form>
          <p className="count" role="status">
            {rows.length} {rows.length === 1 ? "project" : "projects"}
            {filtered && (
              <>
                {" "}
                found ·{" "}
                <Link href="/" className="linkish" style={{ padding: 0 }}>
                  Clear search
                </Link>
              </>
            )}
          </p>
          {rows.length === 0 ? (
            <div className="empty">
              <p>No projects match your search.</p>
            </div>
          ) : (
            <ul className="list">
              {rows.map((r) => (
                <ProjectRow key={r.id} p={r} today={today} from={from} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
