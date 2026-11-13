import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, PageHead } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Notes } from "@/components/Notes";
import { fmtDate, fmtDateTime, money } from "@/lib/format";
import { convertLeadToAccount, deleteLead, updateLead } from "../actions";
import { LeadForm } from "../LeadForm";

export const metadata = { title: "Lead" };

export default async function LeadPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const id = Number((await params).id);
  const { saved } = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const db = await getDb();
  const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, id));
  if (!lead) notFound();
  const accounts = await db.select({ id: schema.accounts.id, name: schema.accounts.name }).from(schema.accounts).orderBy(asc(schema.accounts.name));
  const users = await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users).where(eq(schema.users.active, true));
  const ests = await db
    .select({ id: schema.estimates.id, number: schema.estimates.number, title: schema.estimates.title, status: schema.estimates.status, createdAt: schema.estimates.createdAt })
    .from(schema.estimates)
    .where(eq(schema.estimates.leadId, id))
    .orderBy(desc(schema.estimates.createdAt));
  const account = accounts.find((a) => a.id === lead.accountId);
  return (
    <>
      <PageHead
        title={lead.name}
        sub={
          <>
            <Badge status={lead.stage} /> {lead.company ? `· ${lead.company} ` : ""}· Added {fmtDate(lead.createdAt)}
          </>
        }
        crumbs={[{ href: "/leads", label: "Leads" }]}
      >
        {lead.phone && (
          <a className="btn" href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
            Call {lead.phone}
          </a>
        )}
        <Link className="btn btnPrimary" href={`/estimates/new?lead=${lead.id}${lead.accountId ? `&account=${lead.accountId}` : ""}`}>
          Create estimate
        </Link>
        {account ? (
          <Link className="btn" href={`/accounts/${account.id}`}>
            Open account
          </Link>
        ) : (
          <form action={convertLeadToAccount.bind(null, lead.id)}>
            <button className="btn">Convert to account</button>
          </form>
        )}
      </PageHead>
      {saved && (
        <p className="notice" role="status" style={{ marginBottom: 16 }}>
          Lead saved.
        </p>
      )}
      <div className="split">
        <div className="stack">
          <section className="card" aria-labelledby="details">
            <h2 id="details">Details</h2>
            <LeadForm lead={lead} accounts={accounts} users={users} action={updateLead.bind(null, lead.id)} submitLabel="Save changes" />
          </section>
          <section className="card" aria-labelledby="ests">
            <div className="cardHead">
              <h2 id="ests">Estimates</h2>
            </div>
            {ests.length === 0 ? (
              <p className="empty">No estimates for this lead yet.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {ests.map((e) => (
                  <li key={e.id}>
                    <Link href={`/estimates/${e.id}`}>
                      {e.number} · {e.title}
                    </Link>{" "}
                    <Badge status={e.status} /> <span className="small muted">{fmtDateTime(e.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <form action={deleteLead.bind(null, lead.id)}>
            <ConfirmButton message={`Delete the lead “${lead.name}”? This can’t be undone.`}>Delete lead</ConfirmButton>
          </form>
        </div>
        <div className="stack">
          <section className="card" aria-labelledby="glance">
            <h2 id="glance">At a glance</h2>
            <dl className="dl">
              <dt>Value</dt>
              <dd>{money(lead.valueCents)}</dd>
              <dt>Follow-up</dt>
              <dd>{fmtDate(lead.nextFollowUp)}</dd>
              <dt>Email</dt>
              <dd>{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}</dd>
              <dt>Source</dt>
              <dd>{lead.source ?? "—"}</dd>
              <dt>Last updated</dt>
              <dd>{fmtDateTime(lead.updatedAt)}</dd>
            </dl>
          </section>
          <Notes entity="lead" id={lead.id} path={`/leads/${lead.id}`} />
        </div>
      </div>
    </>
  );
}
