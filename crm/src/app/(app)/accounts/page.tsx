import Link from "next/link";
import { asc, count, eq, ilike, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { PageHead } from "@/components/ui";

export const metadata = { title: "Accounts" };

export default async function Accounts({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const term = (await searchParams).q?.trim();
  const db = await getDb();
  const props = db
    .select({ accountId: schema.properties.accountId, n: count().as("n"), units: sql<number>`coalesce(sum(${schema.properties.units}), 0)`.as("units") })
    .from(schema.properties)
    .groupBy(schema.properties.accountId)
    .as("p");
  const rows = await db
    .select({ id: schema.accounts.id, name: schema.accounts.name, phone: schema.accounts.phone, email: schema.accounts.email, properties: props.n, units: props.units })
    .from(schema.accounts)
    .leftJoin(props, eq(props.accountId, schema.accounts.id))
    .where(term ? ilike(schema.accounts.name, `%${term}%`) : undefined)
    .orderBy(asc(schema.accounts.name));
  return (
    <>
      <PageHead title="Accounts" sub="Property management companies and other repeat customers.">
        <form className="row" role="search" style={{ gap: 6 }}>
          <label htmlFor="q" className="visually-hidden">
            Search accounts
          </label>
          <input id="q" name="q" type="search" defaultValue={term} placeholder="Search company…" style={{ width: 220 }} />
          <button className="btn">Search</button>
        </form>
        <Link className="btn btnPrimary" href="/accounts/new">
          New account
        </Link>
      </PageHead>
      <div className="card tableWrap" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Phone</th>
              <th>Email</th>
              <th className="num">Properties</th>
              <th className="num">Units</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  {term ? "No accounts match that search." : "No accounts yet. Add your first property management company."}
                </td>
              </tr>
            )}
            {rows.map((a) => (
              <tr key={a.id}>
                <td>
                  <Link href={`/accounts/${a.id}`}>
                    <strong>{a.name}</strong>
                  </Link>
                </td>
                <td>{a.phone ?? "—"}</td>
                <td>{a.email ?? "—"}</td>
                <td className="num">{a.properties ?? 0}</td>
                <td className="num">{Number(a.units ?? 0) || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
