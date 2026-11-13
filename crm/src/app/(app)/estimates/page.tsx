import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, PageHead } from "@/components/ui";
import { estimateStatusLabel, fmtDate, money } from "@/lib/format";

export const metadata = { title: "Estimates" };

const STATUSES = Object.keys(estimateStatusLabel) as (keyof typeof estimateStatusLabel)[];

export default async function Estimates({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const status = (await searchParams).status as (typeof STATUSES)[number] | undefined;
  const filter = status && STATUSES.includes(status) ? status : undefined;
  const db = await getDb();
  const totals = db
    .select({ estimateId: schema.estimateItems.estimateId, cents: sql<number>`coalesce(sum(round(${schema.estimateItems.qty} * ${schema.estimateItems.rateCents})), 0)`.as("cents") })
    .from(schema.estimateItems)
    .groupBy(schema.estimateItems.estimateId)
    .as("t");
  const rows = await db
    .select({
      id: schema.estimates.id,
      number: schema.estimates.number,
      title: schema.estimates.title,
      status: schema.estimates.status,
      createdAt: schema.estimates.createdAt,
      account: schema.accounts.name,
      customer: schema.estimates.customerName,
      unitLabel: schema.estimates.unitLabel,
      cents: totals.cents,
    })
    .from(schema.estimates)
    .leftJoin(schema.accounts, eq(schema.accounts.id, schema.estimates.accountId))
    .leftJoin(totals, eq(totals.estimateId, schema.estimates.id))
    .where(filter ? eq(schema.estimates.status, filter) : undefined)
    .orderBy(desc(schema.estimates.createdAt))
    .limit(500);
  return (
    <>
      <PageHead title="Estimates" sub="Quotes built from your price list.">
        <Link className="btn btnPrimary" href="/estimates/new">
          New estimate
        </Link>
      </PageHead>
      <nav aria-label="Filter by status" className="row" style={{ marginBottom: 14, gap: 8 }}>
        <Link className="btn btnSmall" href="/estimates" aria-current={!filter ? "page" : undefined} style={!filter ? { background: "var(--navy)", color: "#fff" } : undefined}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} className="btn btnSmall" href={`/estimates?status=${s}`} aria-current={filter === s ? "page" : undefined} style={filter === s ? { background: "var(--navy)", color: "#fff" } : undefined}>
            {estimateStatusLabel[s]}
          </Link>
        ))}
      </nav>
      <div className="card tableWrap" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Title</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Created</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No estimates{filter ? ` marked ${estimateStatusLabel[filter].toLowerCase()}` : " yet"}.
                </td>
              </tr>
            )}
            {rows.map((e) => (
              <tr key={e.id}>
                <td>
                  <Link href={`/estimates/${e.id}`}>
                    <strong>{e.number}</strong>
                  </Link>
                </td>
                <td>
                  {e.title}
                  {e.unitLabel && <div className="small muted">{e.unitLabel}</div>}
                </td>
                <td>{e.account ?? e.customer ?? "—"}</td>
                <td>
                  <Badge status={e.status} />
                </td>
                <td>{fmtDate(e.createdAt)}</td>
                <td className="num">{money(Number(e.cents ?? 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
