import Link from "next/link";
import { asc, desc, eq, ilike, or } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, PageHead } from "@/components/ui";
import { fmtDate, money, stageLabel, todayLA } from "@/lib/format";
import { setLeadStage } from "./actions";

export const metadata = { title: "Leads" };

const STAGES = Object.keys(stageLabel) as (keyof typeof stageLabel)[];

export default async function Leads({ searchParams }: { searchParams: Promise<{ view?: string; q?: string }> }) {
  const { view, q } = await searchParams;
  const db = await getDb();
  const term = q?.trim();
  const rows = await db
    .select({
      id: schema.leads.id,
      name: schema.leads.name,
      company: schema.leads.company,
      phone: schema.leads.phone,
      interest: schema.leads.interest,
      stage: schema.leads.stage,
      valueCents: schema.leads.valueCents,
      nextFollowUp: schema.leads.nextFollowUp,
      owner: schema.users.name,
      updatedAt: schema.leads.updatedAt,
    })
    .from(schema.leads)
    .leftJoin(schema.users, eq(schema.users.id, schema.leads.ownerId))
    .where(term ? or(ilike(schema.leads.name, `%${term}%`), ilike(schema.leads.company, `%${term}%`), ilike(schema.leads.phone, `%${term}%`), ilike(schema.leads.address, `%${term}%`)) : undefined)
    .orderBy(asc(schema.leads.nextFollowUp), desc(schema.leads.updatedAt));
  const today = todayLA();
  const list = view === "list";
  return (
    <>
      <PageHead title="Leads" sub="Every inquiry from first call to won or lost.">
        <form className="row" role="search" style={{ gap: 6 }}>
          {list && <input type="hidden" name="view" value="list" />}
          <label htmlFor="q" className="visually-hidden">
            Search leads
          </label>
          <input id="q" name="q" type="search" defaultValue={term} placeholder="Search name, company, phone…" style={{ width: 240 }} />
          <button className="btn">Search</button>
        </form>
        <Link className="btn" href={list ? `/leads${term ? `?q=${encodeURIComponent(term)}` : ""}` : `/leads?view=list${term ? `&q=${encodeURIComponent(term)}` : ""}`}>
          {list ? "Board view" : "List view"}
        </Link>
        <Link className="btn btnPrimary" href="/leads/new">
          New lead
        </Link>
      </PageHead>

      {list ? (
        <div className="tableWrap card" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Stage</th>
                <th>Needs</th>
                <th>Follow-up</th>
                <th>Owner</th>
                <th className="num">Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No leads{term ? " match that search" : " yet"}.
                  </td>
                </tr>
              )}
              {rows.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link href={`/leads/${l.id}`}>
                      <strong>{l.name}</strong>
                    </Link>
                    {l.company && <div className="small muted">{l.company}</div>}
                  </td>
                  <td>
                    <Badge status={l.stage} />
                  </td>
                  <td className="small">{l.interest ?? "—"}</td>
                  <td className={l.nextFollowUp && l.nextFollowUp < today && !["won", "lost"].includes(l.stage) ? "overdue" : ""}>{fmtDate(l.nextFollowUp)}</td>
                  <td>{l.owner ?? "—"}</td>
                  <td className="num">{money(l.valueCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="board">
          {STAGES.map((s) => {
            const col = rows.filter((r) => r.stage === s);
            const total = col.reduce((a, r) => a + (r.valueCents ?? 0), 0);
            return (
              <section key={s} className="col" aria-labelledby={`col-${s}`}>
                <div className="colHead">
                  <h2 id={`col-${s}`} style={{ fontSize: "0.95rem" }}>
                    {stageLabel[s]} ({col.length})
                  </h2>
                  {total > 0 && <span>{money(total)}</span>}
                </div>
                {col.map((l) => {
                  const i = STAGES.indexOf(s);
                  const next = STAGES[i + 1];
                  const overdue = l.nextFollowUp && l.nextFollowUp < today && !["won", "lost"].includes(s);
                  return (
                    <article key={l.id} className="leadCard">
                      <Link href={`/leads/${l.id}`}>{l.name}</Link>
                      {l.company && <span className="leadMeta">{l.company}</span>}
                      {l.interest && <span className="small">{l.interest}</span>}
                      <span className={`leadMeta${overdue ? " overdue" : ""}`}>
                        {l.nextFollowUp ? `Follow up ${fmtDate(l.nextFollowUp)}` : "No follow-up set"}
                        {l.valueCents ? ` · ${money(l.valueCents)}` : ""}
                      </span>
                      {next && s !== "won" && (
                        <form action={setLeadStage.bind(null, l.id, next)}>
                          <button className="linkBtn">
                            Move to {stageLabel[next]}
                            <span className="visually-hidden"> ({l.name})</span>
                          </button>
                        </form>
                      )}
                    </article>
                  );
                })}
                {col.length === 0 && <p className="small muted">No leads</p>}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
