import { asc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Field, PageHead } from "@/components/ui";
import { addCrew, updateCrew } from "./actions";

export const metadata = { title: "Crews" };

export default async function Crews() {
  const db = await getDb();
  const crews = await db.select().from(schema.crews).orderBy(asc(schema.crews.name));
  return (
    <>
      <PageHead title="Crews" sub="Installation crews you assign to jobs. Inactive crews stay on past jobs but drop off the schedule." />
      <div className="split">
        <section className="card" aria-labelledby="list">
          <h2 id="list">Crews ({crews.length})</h2>
          {crews.length === 0 && <p className="empty">No crews yet. Add your first crew.</p>}
          <div className="stack" style={{ gap: 10 }}>
            {crews.map((c) => (
              <form key={c.id} action={updateCrew.bind(null, c.id)} className="inline" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
                <Field prefix={`c${c.id}`} label="Crew name" name="name" defaultValue={c.name} required />
                <Field prefix={`c${c.id}`} label="Crew lead" name="leadName" defaultValue={c.leadName} />
                <Field prefix={`c${c.id}`} label="Phone" name="phone" type="tel" defaultValue={c.phone} />
                <div className="field" style={{ flex: "0 0 auto", flexDirection: "row", alignItems: "center", gap: 6, minHeight: 40 }}>
                  <input id={`c${c.id}-active`} name="active" type="checkbox" defaultChecked={c.active} />
                  <label htmlFor={`c${c.id}-active`}>Active</label>
                </div>
                <button className="btn btnSmall">
                  Save<span className="visually-hidden"> {c.name}</span>
                </button>
              </form>
            ))}
          </div>
        </section>
        <section className="card" aria-labelledby="add">
          <h2 id="add">Add a crew</h2>
          <form action={addCrew} className="stack" style={{ gap: 10 }}>
            <Field prefix="new" label="Crew name" name="name" required placeholder="e.g. Crew 1 – Carlos" />
            <Field prefix="new" label="Crew lead" name="leadName" />
            <Field prefix="new" label="Phone" name="phone" type="tel" />
            <div>
              <button className="btn btnPrimary">Add crew</button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
