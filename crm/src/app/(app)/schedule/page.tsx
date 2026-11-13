import Link from "next/link";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { PageHead } from "@/components/ui";
import { addDays, jobStatusLabel, todayLA, weekStart } from "@/lib/format";

export const metadata = { title: "Schedule" };

const DAY = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

export default async function Schedule({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const w = (await searchParams).week;
  const today = todayLA();
  const start = weekStart(w && /^\d{4}-\d{2}-\d{2}$/.test(w) ? w : today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const end = days[6];
  const db = await getDb();
  const [crews, jobs] = await Promise.all([
    db.select().from(schema.crews).orderBy(asc(schema.crews.name)),
    db
      .select({ id: schema.jobs.id, title: schema.jobs.title, date: schema.jobs.scheduledDate, time: schema.jobs.startTime, status: schema.jobs.status, crewId: schema.jobs.crewId, property: schema.properties.name })
      .from(schema.jobs)
      .leftJoin(schema.properties, eq(schema.properties.id, schema.jobs.propertyId))
      .where(and(gte(schema.jobs.scheduledDate, start), lte(schema.jobs.scheduledDate, end)))
      .orderBy(asc(schema.jobs.startTime)),
  ]);
  const rows = [
    ...crews.filter((c) => c.active || jobs.some((j) => j.crewId === c.id)).map((c) => ({ id: c.id as number | null, name: c.name, lead: c.leadName })),
    { id: null, name: "Not assigned", lead: null },
  ];
  const range = `${DAY(start)} – ${DAY(end)}`;
  return (
    <>
      <PageHead title="Schedule" sub={`Week of ${range}`}>
        <Link className="btn" href={`/schedule?week=${addDays(start, -7)}`}>
          ← Previous week
        </Link>
        <Link className="btn" href="/schedule">
          This week
        </Link>
        <Link className="btn" href={`/schedule?week=${addDays(start, 7)}`}>
          Next week →
        </Link>
        <Link className="btn btnPrimary" href="/jobs/new">
          New job
        </Link>
      </PageHead>
      {crews.length === 0 && (
        <p className="notice" style={{ marginBottom: 14 }}>
          Add your crews on the <Link href="/crews">Crews</Link> page to see a row for each.
        </p>
      )}
      <div className="weekWrap">
        <div className="week" role="table" aria-label={`Jobs by crew, ${range}`}>
          <div role="row" style={{ display: "contents" }}>
            <div className="weekHead" role="columnheader">
              Crew
            </div>
            {days.map((d) => (
              <div key={d} className={`weekHead${d === today ? " today" : ""}`} role="columnheader">
                {DAY(d)}
                {d === today && <span className="visually-hidden"> (today)</span>}
              </div>
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.id ?? "none"} role="row" style={{ display: "contents" }}>
              <div className="crewCell" role="rowheader">
                {r.name}
                {r.lead && <div className="small muted">{r.lead}</div>}
              </div>
              {days.map((d) => {
                const cell = jobs.filter((j) => j.date === d && j.crewId === r.id);
                return (
                  <div key={d} role="cell">
                    {cell.map((j) => (
                      <Link key={j.id} href={`/jobs/${j.id}`} className={`jobChip s-${j.status}`}>
                        {j.time && <span>{j.time} · </span>}
                        {j.title}
                        {j.property && <span style={{ display: "block", fontWeight: 400 }}>{j.property}</span>}
                        {j.status !== "scheduled" && <span className="visually-hidden"> ({jobStatusLabel[j.status]})</span>}
                      </Link>
                    ))}
                    <Link href={`/jobs/new?date=${d}${r.id ? `&crew=${r.id}` : ""}`} className="small" style={{ color: "var(--muted)" }}>
                      + Add<span className="visually-hidden"> job for {r.name} on {DAY(d)}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
