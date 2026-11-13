import { asc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { PageHead } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { fmtDate } from "@/lib/format";
import { setUserActive } from "./actions";
import { AddUserForm, PasswordForm } from "./TeamForms";

export const metadata = { title: "Team" };

export default async function Team() {
  const me = await requireUser();
  const db = await getDb();
  const users = await db.select().from(schema.users).orderBy(asc(schema.users.name));
  return (
    <>
      <PageHead title="Team" sub="Everyone here can see and edit everything in the CRM." />
      <div className="split">
        <section className="card tableWrap" aria-labelledby="members">
          <h2 id="members">Team members</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Added</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                    {u.id === me.id && <span className="muted"> (you)</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>{fmtDate(u.createdAt)}</td>
                  <td>
                    {u.id === me.id ? (
                      <span className="badge b-won">Active</span>
                    ) : (
                      <form action={setUserActive.bind(null, u.id, !u.active)} className="row" style={{ gap: 8 }}>
                        <span className={`badge ${u.active ? "b-won" : "b-lost"}`}>{u.active ? "Active" : "Removed"}</span>
                        <button className="linkBtn">
                          {u.active ? "Remove access" : "Restore access"}
                          <span className="visually-hidden"> for {u.name}</span>
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="stack">
          <section className="card" aria-labelledby="add">
            <h2 id="add">Add a team member</h2>
            <AddUserForm />
          </section>
          <section className="card" aria-labelledby="pw">
            <h2 id="pw">Your password</h2>
            <PasswordForm />
          </section>
        </div>
      </div>
    </>
  );
}
