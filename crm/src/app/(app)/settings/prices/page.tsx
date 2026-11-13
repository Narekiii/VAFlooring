import { asc, isNull } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Field, PageHead } from "@/components/ui";
import { unitLabel } from "@/lib/format";
import { addPrice, updatePrice } from "./actions";

export const metadata = { title: "Price list" };

const UnitSelect = ({ id, value }: { id: string; value?: string }) => (
  <div className="field" style={{ flex: "0 1 140px" }}>
    <label htmlFor={id}>Unit</label>
    <select id={id} name="unit" defaultValue={value ?? "sqft"}>
      {Object.entries(unitLabel).map(([v, l]) => (
        <option key={v} value={v}>
          per {l}
        </option>
      ))}
    </select>
  </div>
);

export default async function Prices() {
  const db = await getDb();
  const items = await db.select().from(schema.priceItems).where(isNull(schema.priceItems.accountId)).orderBy(asc(schema.priceItems.sort), asc(schema.priceItems.id));
  return (
    <>
      <PageHead title="Price list" sub="Standard rates (material + installation) used on new estimates. Set an account’s own rates on its account page." />
      <div className="stack">
        <section className="card" aria-labelledby="std">
          <h2 id="std">Standard rates</h2>
          <div className="stack" style={{ gap: 10 }}>
            {items.map((p) => (
              <form key={p.id} action={updatePrice.bind(null, p.id)} className="inline" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
                <Field prefix={`p${p.id}`} label="Item" name="name" defaultValue={p.name} required />
                <Field prefix={`p${p.id}`} label="Description" name="description" defaultValue={p.description} />
                <UnitSelect id={`p${p.id}-unit`} value={p.unit} />
                <div className="field" style={{ flex: "0 1 120px" }}>
                  <label htmlFor={`p${p.id}-rate`}>Rate ($)</label>
                  <input id={`p${p.id}-rate`} name="rate" type="number" step="0.01" min="0" defaultValue={(p.rateCents / 100).toFixed(2)} required />
                </div>
                <div className="field" style={{ flex: "0 0 auto", flexDirection: "row", alignItems: "center", gap: 6, minHeight: 40 }}>
                  <input id={`p${p.id}-active`} name="active" type="checkbox" defaultChecked={p.active} />
                  <label htmlFor={`p${p.id}-active`}>In use</label>
                </div>
                <button className="btn btnSmall">
                  Save<span className="visually-hidden"> {p.name}</span>
                </button>
              </form>
            ))}
          </div>
        </section>
        <section className="card" aria-labelledby="add">
          <h2 id="add">Add an item</h2>
          <form action={addPrice} className="inline">
            <Field prefix="new" label="Item" name="name" required placeholder="e.g. Floor leveling" />
            <Field prefix="new" label="Description" name="description" />
            <UnitSelect id="new-unit" />
            <div className="field" style={{ flex: "0 1 120px" }}>
              <label htmlFor="new-rate">Rate ($)</label>
              <input id="new-rate" name="rate" type="number" step="0.01" min="0" required />
            </div>
            <button className="btn btnPrimary">Add item</button>
          </form>
        </section>
      </div>
    </>
  );
}
