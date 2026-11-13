import Link from "next/link";
import { and, asc, desc, eq, gte, lt, or, isNull } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, PageHead } from "@/components/ui";
import { fmtDate, todayLA } from "@/lib/format";

export const metadata = { title: "Jobs" };

export default async function Jobs({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const show = (await searchParams).show === "past" ? "past" : "upcoming";
  const today = todayLA();
  const db = await getDb();
  const rows = await db
    .select({
      id: schema.jobs.id,
      title: schema.jobs.title,
      date: schema.jobs.scheduledDate,
      time: schema.jobs.startTime,
      status: schema.jobs.status,
      unitLabel: schema.jobs.unitLabel,
      crew: schema.crews.name,
      account: schema.accounts.name,
      property: schema.properties.name,
    })
    .from(schema.jobs)
    .leftJoin(schema.crews, eq(schema.crews.id, schema.jobs.crewId))
    .leftJoin(schema.accounts, eq(schema.accounts.id, schema.jobs.accountId))
    .leftJoin(schema.properties, eq(schema.properties.id, schema.jobs.propertyId))
    .where(
      show === "past"
        ? lt(schema.jobs.scheduledDate, today)
        : or(gte(schema.jobs.scheduledDate, today), isNull(schema.jobs.scheduledDate), and(lt(schema.jobs.scheduledDate, today), eq(schema.jobs.status, "in_progress"))),
    )
    .orderBy(show === "past" ? desc(schema.jobs.scheduledDate) : asc(schema.jobs.scheduledDate))
    .limit(500);
  return (
    <>
      <PageHead title="Jobs" sub="Installations, by date.">
        <Link className="btn" href={show === "past" ? "/jobs" : "/jobs?show=past"}>
          {show === "past" ? "Show upcoming" : "Show past jobs"}
        </Link>
        <Link className="btn btnPrimary" href="/jobs/new">
          New job
        </Link>
      </PageHead>
      <div className="card tableWrap" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Job</th>
              <th>Account / property</th>
              <th>Crew</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  No {show} jobs.
                </td>
              </tr>
            )}
            {rows.map((j) => (
              <tr key={j.id}>
                <td style={{ whiteSpace: "nowrap" }}>
                  {j.date ? fmtDate(j.date) : <span className="muted">Not scheduled</span>}
                  {j.time && <div className="small muted">{j.time}</div>}
                </td>
                <td>
                  <Link href={`/jobs/${j.id}`}>
                    <strong>{j.title}</strong>
                  </Link>
                </td>
                <td>
                  {j.account ?? "—"}
                  {j.property && <div className="small muted">{j.property}</div>}
                </td>
                <td>{j.crew ?? <span className="muted">Not assigned</span>}</td>
                <td>
                  <Badge status={j.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
