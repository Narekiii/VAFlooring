import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, Field, PageHead } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Notes } from "@/components/Notes";
import { fmtDate, money, unitLabel } from "@/lib/format";
import { priceListFor } from "@/lib/prices";
import { addContact, addProperty, deleteAccount, deleteContact, deleteProperty, saveAccountPrices, updateAccount } from "../actions";
import { AccountForm } from "../AccountForm";

export const metadata = { title: "Account" };

export default async function AccountPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; prices?: string }> }) {
  const id = Number((await params).id);
  const sp = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const db = await getDb();
  const [acc] = await db.select().from(schema.accounts).where(eq(schema.accounts.id, id));
  if (!acc) notFound();
  const [contacts, props, prices, ests, jobs, leads] = await Promise.all([
    db.select().from(schema.contacts).where(eq(schema.contacts.accountId, id)).orderBy(asc(schema.contacts.name)),
    db.select().from(schema.properties).where(eq(schema.properties.accountId, id)).orderBy(asc(schema.properties.name)),
    priceListFor(id),
    db.select().from(schema.estimates).where(eq(schema.estimates.accountId, id)).orderBy(desc(schema.estimates.createdAt)).limit(20),
    db.select().from(schema.jobs).where(eq(schema.jobs.accountId, id)).orderBy(desc(schema.jobs.scheduledDate)).limit(20),
    db.select().from(schema.leads).where(eq(schema.leads.accountId, id)).orderBy(desc(schema.leads.updatedAt)).limit(20),
  ]);
  const propName = (pid: number | null) => props.find((p) => p.id === pid)?.name;
  return (
    <>
      <PageHead
        title={acc.name}
        sub={`${props.length} ${props.length === 1 ? "property" : "properties"} · ${contacts.length} ${contacts.length === 1 ? "contact" : "contacts"}`}
        crumbs={[{ href: "/accounts", label: "Accounts" }]}
      >
        <Link className="btn btnPrimary" href={`/estimates/new?account=${acc.id}`}>
          New estimate
        </Link>
        <Link className="btn" href={`/jobs/new?account=${acc.id}`}>
          Schedule a job
        </Link>
        <Link className="btn" href={`/leads/new?account=${acc.id}`}>
          New lead
        </Link>
      </PageHead>
      {sp.saved && (
        <p className="notice" role="status" style={{ marginBottom: 16 }}>
          Account saved.
        </p>
      )}
      <div className="split">
        <div className="stack">
          <section className="card" aria-labelledby="props">
            <h2 id="props">Properties</h2>
            {props.length === 0 ? (
              <p className="empty">No properties yet.</p>
            ) : (
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Address</th>
                      <th className="num">Units</th>
                      <th>
                        <span className="visually-hidden">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                          {p.notes && <div className="small muted">{p.notes}</div>}
                        </td>
                        <td>{p.address ?? "—"}</td>
                        <td className="num">{p.units ?? "—"}</td>
                        <td className="num">
                          <form action={deleteProperty.bind(null, acc.id, p.id)}>
                            <ConfirmButton className="linkBtn linkDanger" message={`Remove the property “${p.name}”?`}>
                              Remove<span className="visually-hidden"> {p.name}</span>
                            </ConfirmButton>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <form action={addProperty.bind(null, acc.id)} className="inline" style={{ marginTop: 14 }}>
              <Field prefix="prop" label="Property name" name="name" required />
              <Field prefix="prop" label="Address" name="address" />
              <div className="field" style={{ flex: "0 1 100px" }}>
                <label htmlFor="prop-units">Units</label>
                <input id="prop-units" name="units" type="number" min="0" />
              </div>
              <button className="btn">Add property</button>
            </form>
          </section>

          <section className="card" aria-labelledby="prices-h" id="prices">
            <div className="cardHead">
              <h2 id="prices-h">Price list for {acc.name}</h2>
            </div>
            {sp.prices && (
              <p className="notice" role="status" style={{ marginBottom: 12 }}>
                Prices saved.
              </p>
            )}
            <p className="small muted" style={{ marginBottom: 10 }}>
              Material + installation. Leave a rate blank to use the standard price.
            </p>
            <form action={saveAccountPrices.bind(null, acc.id)}>
              <div className="tableWrap">
                <table className="table" aria-labelledby="prices-h">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Unit</th>
                      <th className="num">Standard</th>
                      <th className="num">This account</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((p) => (
                      <tr key={p.code}>
                        <td>
                          <strong>{p.name}</strong>
                          {p.description && <div className="small muted">{p.description}</div>}
                        </td>
                        <td>per {unitLabel[p.unit]}</td>
                        <td className="num">{money(p.standardCents)}</td>
                        <td className="num">
                          <label htmlFor={`rate_${p.code}`} className="visually-hidden">
                            {p.name} rate for this account
                          </label>
                          <input id={`rate_${p.code}`} name={`rate_${p.code}`} type="number" step="0.01" min="0" defaultValue={p.custom ? (p.rateCents / 100).toFixed(2) : ""} placeholder={(p.standardCents / 100).toFixed(2)} style={{ width: 110, textAlign: "right" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn">Save prices</button>
              </div>
            </form>
          </section>

          <section className="card" aria-labelledby="work">
            <h2 id="work">Estimates &amp; jobs</h2>
            <div className="grid2">
              <div>
                <h3 style={{ marginBottom: 8 }}>Estimates</h3>
                {ests.length === 0 ? (
                  <p className="empty">None yet.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {ests.map((e) => (
                      <li key={e.id}>
                        <Link href={`/estimates/${e.id}`}>{e.number}</Link> {e.title} <Badge status={e.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 style={{ marginBottom: 8 }}>Jobs</h3>
                {jobs.length === 0 ? (
                  <p className="empty">None yet.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {jobs.map((j) => (
                      <li key={j.id}>
                        <Link href={`/jobs/${j.id}`}>{j.title}</Link> <span className="small muted">{fmtDate(j.scheduledDate)}</span> <Badge status={j.status} />
                        {propName(j.propertyId) && <span className="small muted"> · {propName(j.propertyId)}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {leads.length > 0 && (
              <>
                <h3 style={{ margin: "14px 0 8px" }}>Leads</h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {leads.map((l) => (
                    <li key={l.id}>
                      <Link href={`/leads/${l.id}`}>{l.name}</Link> <Badge status={l.stage} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="card" aria-labelledby="details">
            <h2 id="details">Company details</h2>
            <AccountForm account={acc} action={updateAccount.bind(null, acc.id)} submitLabel="Save changes" />
          </section>
          <form action={deleteAccount.bind(null, acc.id)}>
            <ConfirmButton message={`Delete ${acc.name} with its contacts, properties and custom prices? Estimates and jobs are kept. This can’t be undone.`}>Delete account</ConfirmButton>
          </form>
        </div>

        <div className="stack">
          <section className="card" aria-labelledby="contacts">
            <h2 id="contacts">Contacts</h2>
            {contacts.length === 0 && <p className="empty">No contacts yet.</p>}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {contacts.map((c) => (
                <li key={c.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
                  <strong>{c.name}</strong>
                  {c.title && <span className="muted"> · {c.title}</span>}
                  <div className="small">
                    {c.phone && <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}>{c.phone}</a>}
                    {c.phone && c.email && " · "}
                    {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
                  </div>
                  <form action={deleteContact.bind(null, acc.id, c.id)}>
                    <ConfirmButton className="linkBtn linkDanger" message={`Remove ${c.name}?`}>
                      Remove<span className="visually-hidden"> {c.name}</span>
                    </ConfirmButton>
                  </form>
                </li>
              ))}
            </ul>
            <form action={addContact.bind(null, acc.id)} className="stack" style={{ gap: 10, marginTop: 14 }}>
              <h3>Add a contact</h3>
              <Field prefix="contact" label="Name" name="name" required />
              <Field prefix="contact" label="Title" name="title" placeholder="Property manager, maintenance…" />
              <Field prefix="contact" label="Phone" name="phone" type="tel" />
              <Field prefix="contact" label="Email" name="email" type="email" />
              <div>
                <button className="btn">Add contact</button>
              </div>
            </form>
          </section>
          <Notes entity="account" id={acc.id} path={`/accounts/${acc.id}`} />
        </div>
      </div>
    </>
  );
}
