import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { PageHead } from "@/components/ui";
import { createLead } from "../actions";
import { LeadForm } from "../LeadForm";

export const metadata = { title: "New lead" };

export default async function NewLead({ searchParams }: { searchParams: Promise<{ account?: string }> }) {
  const db = await getDb();
  const accounts = await db.select({ id: schema.accounts.id, name: schema.accounts.name }).from(schema.accounts).orderBy(asc(schema.accounts.name));
  const users = await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users).where(eq(schema.users.active, true));
  const acc = Number((await searchParams).account) || null;
  return (
    <>
      <PageHead title="New lead" crumbs={[{ href: "/leads", label: "Leads" }]} />
      <div className="card">
        <LeadForm lead={{ accountId: acc }} accounts={accounts} users={users} action={createLead} submitLabel="Create lead" />
      </div>
    </>
  );
}
