import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, PageHead } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Notes } from "@/components/Notes";
import { fmtDate, fmtDateTime, lineCents, money, unitShort } from "@/lib/format";
import { deleteEstimate, setEstimateStatus, updateEstimate } from "../actions";
import { editorData, loadEstimate } from "../data";
import { EstimateEditor } from "../EstimateEditor";

export const metadata = { title: "Estimate" };

export default async function EstimatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ edit?: string; saved?: string }> }) {
  const id = Number((await params).id);
  const sp = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const data = await loadEstimate(id);
  if (!data) notFound();
  const { est, items, account, property, lead, total } = data;
  const crumbs = [{ href: "/estimates", label: "Estimates" }];

  if (sp.edit) {
    const ed = await editorData();
    if (lead && !ed.leads.some((l) => l.id === lead.id)) ed.leads.unshift({ id: lead.id, name: lead.name, address: lead.address });
    return (
      <>
        <PageHead title={`Edit ${est.number}`} crumbs={[...crumbs, { href: `/estimates/${id}`, label: est.number }]} />
        <EstimateEditor {...ed} init={{ ...est, items }} action={updateEstimate.bind(null, id)} submitLabel="Save estimate" />
      </>
    );
  }

  const db = await getDb();
  const jobs = await db.select().from(schema.jobs).where(eq(schema.jobs.estimateId, id)).orderBy(asc(schema.jobs.scheduledDate));
  const next: { status: "sent" | "accepted" | "declined" | "draft"; label: string; primary?: boolean }[] =
    est.status === "draft"
      ? [{ status: "sent", label: "Mark as sent", primary: true }]
      : est.status === "sent"
        ? [
            { status: "accepted", label: "Mark accepted", primary: true },
            { status: "declined", label: "Mark declined" },
          ]
        : [{ status: "draft", label: "Reopen as draft" }];

  return (
    <>
      <PageHead
        title={`${est.number} · ${est.title}`}
        sub={
          <>
            <Badge status={est.status} /> · Created {fmtDate(est.createdAt)}
            {est.sentAt ? ` · Sent ${fmtDateTime(est.sentAt)}` : ""}
          </>
        }
        crumbs={crumbs}
      >
        <Link className="btn" href={`/print/estimates/${id}`} target="_blank">
          Print / save PDF
        </Link>
        <Link className="btn" href={`/estimates/${id}?edit=1`}>
          Edit
        </Link>
        {next.map((n) => (
          <form key={n.status} action={setEstimateStatus.bind(null, id, n.status)}>
            <button className={`btn${n.primary ? " btnPrimary" : ""}`}>{n.label}</button>
          </form>
        ))}
        {est.status === "accepted" && (
          <Link className="btn btnPrimary" href={`/jobs/new?estimate=${id}`}>
            Schedule job
          </Link>
        )}
      </PageHead>
      {sp.saved && (
        <p className="notice" role="status" style={{ marginBottom: 16 }}>
          Estimate saved.
        </p>
      )}
      <div className="split">
        <div className="stack">
          <section className="card" aria-labelledby="items">
            <h2 id="items">Line items</h2>
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="num">Qty</th>
                    <th className="num">Rate</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="empty">
                        No line items. Select Edit to add some.
                      </td>
                    </tr>
                  )}
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <strong>{it.name}</strong>
                        {it.description && <div className="small muted">{it.description}</div>}
                      </td>
                      <td className="num">
                        {Number(it.qty).toLocaleString("en-US")} {unitShort[it.unit]}
                      </td>
                      <td className="num">
                        {money(it.rateCents)}/{unitShort[it.unit]}
                      </td>
                      <td className="num">{money(lineCents(it.qty, it.rateCents))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Total</td>
                    <td className="num">{money(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {est.notes && <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{est.notes}</p>}
          </section>
          {jobs.length > 0 && (
            <section className="card" aria-labelledby="jobs">
              <h2 id="jobs">Jobs</h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {jobs.map((j) => (
                  <li key={j.id}>
                    <Link href={`/jobs/${j.id}`}>{j.title}</Link> · {fmtDate(j.scheduledDate)} <Badge status={j.status} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <form action={deleteEstimate.bind(null, id)}>
            <ConfirmButton message={`Delete estimate ${est.number}? This can’t be undone.`}>Delete estimate</ConfirmButton>
          </form>
        </div>
        <div className="stack">
          <section className="card" aria-labelledby="for">
            <h2 id="for">Customer &amp; site</h2>
            <dl className="dl">
              <dt>Account</dt>
              <dd>{account ? <Link href={`/accounts/${account.id}`}>{account.name}</Link> : "—"}</dd>
              <dt>Property</dt>
              <dd>{property?.name ?? "—"}</dd>
              <dt>Unit / area</dt>
              <dd>{est.unitLabel ?? "—"}</dd>
              <dt>Customer</dt>
              <dd>{est.customerName ?? "—"}</dd>
              <dt>Site address</dt>
              <dd>{est.siteAddress ?? "—"}</dd>
              <dt>Lead</dt>
              <dd>{lead ? <Link href={`/leads/${lead.id}`}>{lead.name}</Link> : "—"}</dd>
            </dl>
          </section>
          <Notes entity="estimate" id={id} path={`/estimates/${id}`} />
        </div>
      </div>
    </>
  );
}
