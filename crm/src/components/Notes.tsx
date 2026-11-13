import { and, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { fmtDateTime } from "@/lib/format";
import { addNote } from "@/lib/notes-actions";

/** Activity notes for a record, newest first, with a form to add one. */
export async function Notes({ entity, id, path }: { entity: "lead" | "account" | "estimate" | "job"; id: number; path: string }) {
  const db = await getDb();
  const rows = await db
    .select({ id: schema.notes.id, body: schema.notes.body, at: schema.notes.createdAt, who: schema.users.name })
    .from(schema.notes)
    .leftJoin(schema.users, eq(schema.users.id, schema.notes.userId))
    .where(and(eq(schema.notes.entity, entity), eq(schema.notes.entityId, id)))
    .orderBy(desc(schema.notes.createdAt));
  return (
    <section className="card" aria-labelledby={`notes-${entity}`}>
      <h2 id={`notes-${entity}`}>Notes &amp; activity</h2>
      <form action={addNote} className="stack" style={{ gap: 8 }}>
        <input type="hidden" name="entity" value={entity} />
        <input type="hidden" name="entityId" value={id} />
        <input type="hidden" name="path" value={path} />
        <label htmlFor={`note-${entity}`} className="visually-hidden">
          New note
        </label>
        <textarea id={`note-${entity}`} name="body" placeholder="Call notes, site details, follow-up…" required />
        <div>
          <button className="btn btnSmall">Add note</button>
        </div>
      </form>
      <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.length === 0 && <li className="empty">No notes yet.</li>}
        {rows.map((n) => (
          <li key={n.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
            <p className="small muted">
              {n.who ?? "Former user"} · {fmtDateTime(n.at)}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
