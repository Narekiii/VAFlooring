import Link from "next/link";
import { and, asc, count, eq, gte, inArray, isNotNull, lte, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, PageHead } from "@/components/ui";
import { addDays, fmtDate, money, todayLA } from "@/lib/format";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const user = await requireUser();
  const today = todayLA();
  const in7 = addDays(today, 7);
  const db = await getDb();
  const open = inArray(schema.leads.stage, ["new", "contacted", "estimate_sent"]);
  const totals = db
    .select({ estimateId: schema.estimateItems.estimateId, cents: sql<number>`coalesce(sum(round(${schema.estimateItems.qty} * ${schema.estimateItems.rateCents})), 0)`.as("cents") })
    .from(schema.estimateItems)
    .groupBy(schema.estimateItems.estimateId)
    .as("t");
  const [[openLeads], followUps, [sent], upcoming, newLeads] = await Promise.all([
    db.select({ n: count(), cents: sql<number>`coalesce(sum(${schema.leads.valueCents}), 0)` }).from(schema.leads).where(open),
    db
      .select({ id: schema.leads.id, name: schema.leads.name, company: schema.leads.company, date: schema.leads.nextFollowUp, stage: schema.leads.stage, phone: schema.leads.phone })
      .from(schema.leads)
      .where(and(open, isNotNull(schema.leads.nextFollowUp), lte(schema.leads.nextFollowUp, today)))
      .orderBy(asc(schema.leads.nextFollowUp))
      .limit(15),
    db
      .select({ n: count(), cents: sql<number>`coalesce(sum(${totals.cents}), 0)` })
      .from(schema.estimates)
      .leftJoin(totals, eq(totals.estimateId, schema.estimates.id))
      .where(eq(schema.estimates.status, "sent")),
    db
      .select({ id: schema.jobs.id, title: schema.jobs.title, date: schema.jobs.scheduledDate, time: schema.jobs.startTime, status: schema.jobs.status, crew: schema.crews.name, property: schema.properties.name })
      .from(schema.jobs)
      .leftJoin(schema.crews, eq(schema.crews.id, schema.jobs.crewId))
      .leftJoin(schema.properties, eq(schema.properties.id, schema.jobs.propertyId))
      .where(and(gte(schema.jobs.scheduledDate, today), lte(schema.jobs.scheduledDate, in7), inArray(schema.jobs.status, ["scheduled", "in_progress"])))
      .orderBy(asc(schema.jobs.scheduledDate), asc(schema.jobs.startTime))
      .limit(20),
    db.select({ n: count() }).from(schema.leads).where(eq(schema.leads.stage, "new")),
  ]);
  return (
    <>
      <PageHead title={`Hello, ${user.name.split(" ")[0]}`} sub={`Today is ${fmtDate(today)}.`}>
        <Link className="btn" href="/leads/new">
          New lead
        </Link>
        <Link className="btn" href="/estimates/new">
          New estimate
        </Link>
        <Link className="btn btnPrimary" href="/jobs/new">
          Schedule a job
        </Link>
      </PageHead>
      <div className="grid4" style={{ marginBottom: 16 }}>
        <Link href="/leads" className="card stat" style={{ textDecoration: "none" }}>
          <strong>{openLeads.n}</strong>
          <span>Open leads · {money(Number(openLeads.cents))}</span>
        </Link>
        <Link href="/leads?view=list" className="card stat" style={{ textDecoration: "none" }}>
          <strong>{newLeads[0].n}</strong>
          <span>New, not yet contacted</span>
        </Link>
        <Link href="/estimates?status=sent" className="card stat" style={{ textDecoration: "none" }}>
          <strong>{sent.n}</strong>
          <span>Estimates awaiting an answer · {money(Number(sent.cents))}</span>
        </Link>
        <Link href="/schedule" className="card stat" style={{ textDecoration: "none" }}>
          <strong>{upcoming.length}</strong>
          <span>Jobs in the next 7 days</span>
        </Link>
      </div>
      <div className="grid2">
        <section className="card" aria-labelledby="fu">
          <div className="cardHead">
            <h2 id="fu">Follow-ups due</h2>
            <Link href="/leads?view=list" className="small">
              All leads
            </Link>
          </div>
          {followUps.length === 0 ? (
            <p className="empty">Nothing due. Nice work.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {followUps.map((l) => (
                <li key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
                  <span>
                    <Link href={`/leads/${l.id}`}>
                      <strong>{l.name}</strong>
                    </Link>
                    {l.company && <span className="muted"> · {l.company}</span>}
                    <span className={`small${l.date! < today ? " overdue" : ""}`} style={{ display: "block" }}>
                      {l.date! < today ? `Overdue since ${fmtDate(l.date)}` : "Due today"}
                    </span>
                  </span>
                  <Badge status={l.stage} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card" aria-labelledby="up">
          <div className="cardHead">
            <h2 id="up">Coming up this week</h2>
            <Link href="/schedule" className="small">
              Open schedule
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="empty">No jobs scheduled in the next 7 days.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {upcoming.map((j) => (
                <li key={j.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
                  <Link href={`/jobs/${j.id}`}>
                    <strong>{j.title}</strong>
                  </Link>
                  <span className="small" style={{ display: "block" }}>
                    {fmtDate(j.date)}
                    {j.time ? ` at ${j.time}` : ""} · {j.crew ?? "No crew assigned"}
                    {j.property ? ` · ${j.property}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
