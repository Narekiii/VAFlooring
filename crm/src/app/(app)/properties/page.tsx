import Link from "next/link";
import { and, asc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { PROSPECT_STATUSES } from "@/db/schema";
import { MainHead } from "@/components/MainHead";
import { PropertyRow } from "@/components/PropertyRow";
import { todayLA } from "@/lib/dates";
import { prospectStatusLabel } from "@/lib/labels";

export const metadata = { title: "Properties" };

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export default async function PropertiesTab({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const status = PROSPECT_STATUSES.find((s) => s === sp.status);
  const p = schema.properties;
  const where: SQL[] = [];
  if (q) {
    const like = `%${escapeLike(q)}%`;
    where.push(
      or(
        ilike(p.name, like),
        ilike(p.managementCompany, like),
        ilike(p.managerName, like),
        ilike(p.maintenanceName, like),
        ilike(p.decisionMaker, like),
        ilike(p.managerEmail, like),
        ilike(p.maintenanceEmail, like),
        ilike(p.managerPhone, like),
        ilike(p.maintenancePhone, like),
        ilike(p.officePhone, like),
        ilike(p.street, like),
        ilike(p.city, like),
        ilike(p.zip, like),
        ilike(p.currentVendor, like),
      )!,
    );
  }
  if (status) where.push(eq(p.status, status));
  const db = await getDb();
  const rows = await db
    .select()
    .from(p)
    .where(where.length ? and(...where) : undefined)
    .orderBy(sql`${p.followUpDate} asc nulls last`, asc(p.name));
  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(p);
  const today = todayLA();
  const filtered = Boolean(q || status);
  const from = `/properties${filtered ? `?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}) })}` : ""}`;

  return (
    <>
      <MainHead tab="properties" />
      {total === 0 ? (
        <div className="empty">
          <h2>No properties yet</h2>
          <p>Add apartment communities and other managed properties you want to sell flooring repair and turnover work to. Only the property name is required.</p>
          <Link href="/properties/new" className="btn btnPrimary">
            + Add property
          </Link>
        </div>
      ) : (
        <>
          <form className="filters" role="search" action="/properties">
            <div className="field q">
              <label htmlFor="q" className="visually-hidden">
                Search properties
              </label>
              <input id="q" name="q" type="search" defaultValue={q} placeholder="Search property, company, contact, address" />
            </div>
            <div className="field">
              <label htmlFor="status" className="visually-hidden">
                Status
              </label>
              <select id="status" name="status" defaultValue={status ?? ""}>
                <option value="">All statuses</option>
                {PROSPECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {prospectStatusLabel[s]}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn">Search</button>
          </form>
          <p className="count" role="status">
            {rows.length} {rows.length === 1 ? "property" : "properties"}
            {filtered && (
              <>
                {" "}
                found ·{" "}
                <Link href="/properties" className="linkish" style={{ padding: 0 }}>
                  Clear search
                </Link>
              </>
            )}
          </p>
          {rows.length === 0 ? (
            <div className="empty">
              <p>No properties match your search.</p>
            </div>
          ) : (
            <ul className="list">
              {rows.map((r) => (
                <PropertyRow key={r.id} p={r} today={today} from={from} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
