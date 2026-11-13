import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { PageHead } from "@/components/ui";
import { createEstimate } from "../actions";
import { editorData } from "../data";
import { EstimateEditor } from "../EstimateEditor";

export const metadata = { title: "New estimate" };

export default async function NewEstimate({ searchParams }: { searchParams: Promise<{ account?: string; lead?: string }> }) {
  const sp = await searchParams;
  const data = await editorData();
  const accountId = Number(sp.account) || null;
  const leadId = Number(sp.lead) || null;
  let lead = null;
  if (leadId) {
    const db = await getDb();
    [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, leadId));
    if (lead && !data.leads.some((l) => l.id === lead!.id)) data.leads.unshift({ id: lead.id, name: lead.name, address: lead.address });
  }
  return (
    <>
      <PageHead title="New estimate" crumbs={[{ href: "/estimates", label: "Estimates" }]} />
      <EstimateEditor
        {...data}
        init={{
          accountId: accountId ?? lead?.accountId ?? null,
          leadId,
          customerName: lead && !lead.company ? lead.name : null,
          siteAddress: lead?.address ?? null,
          title: lead?.interest ?? null,
        }}
        action={createEstimate}
        submitLabel="Create estimate"
      />
    </>
  );
}
