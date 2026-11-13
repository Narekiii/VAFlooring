"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { int, str, toCents } from "@/lib/format";

const STAGES = ["new", "contacted", "estimate_sent", "won", "lost"] as const;
type Stage = (typeof STAGES)[number];

function fields(form: FormData) {
  const stage = String(form.get("stage") ?? "new") as Stage;
  return {
    name: str(form.get("name")) ?? "Unnamed lead",
    company: str(form.get("company")),
    phone: str(form.get("phone")),
    email: str(form.get("email")),
    address: str(form.get("address")),
    source: str(form.get("source")),
    interest: str(form.get("interest")),
    stage: STAGES.includes(stage) ? stage : "new",
    valueCents: toCents(form.get("value")),
    nextFollowUp: str(form.get("nextFollowUp")),
    accountId: int(form.get("accountId")),
    ownerId: int(form.get("ownerId")),
  };
}

export async function createLead(form: FormData) {
  const user = await requireUser();
  const db = await getDb();
  const v = fields(form);
  const [row] = await db
    .insert(schema.leads)
    .values({ ...v, ownerId: v.ownerId ?? user.id })
    .returning({ id: schema.leads.id });
  redirect(`/leads/${row.id}`);
}

export async function updateLead(id: number, form: FormData) {
  await requireUser();
  const db = await getDb();
  await db.update(schema.leads).set({ ...fields(form), updatedAt: new Date() }).where(eq(schema.leads.id, id));
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}?saved=1`);
}

export async function setLeadStage(id: number, stage: Stage) {
  await requireUser();
  if (!STAGES.includes(stage)) return;
  const db = await getDb();
  await db.update(schema.leads).set({ stage, updatedAt: new Date() }).where(eq(schema.leads.id, id));
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
}

export async function deleteLead(id: number) {
  await requireUser();
  const db = await getDb();
  await db.delete(schema.leads).where(eq(schema.leads.id, id));
  redirect("/leads");
}

/** Turns a lead into a property-management account (keeps the lead, linked to the new account). */
export async function convertLeadToAccount(id: number) {
  await requireUser();
  const db = await getDb();
  const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, id));
  if (!lead) redirect("/leads");
  if (lead.accountId) redirect(`/accounts/${lead.accountId}`);
  const [acc] = await db
    .insert(schema.accounts)
    .values({ name: lead.company ?? lead.name, phone: lead.phone, email: lead.email, address: lead.address })
    .returning({ id: schema.accounts.id });
  if (lead.company) {
    await db.insert(schema.contacts).values({ accountId: acc.id, name: lead.name, phone: lead.phone, email: lead.email });
  }
  await db.update(schema.leads).set({ accountId: acc.id, updatedAt: new Date() }).where(eq(schema.leads.id, id));
  redirect(`/accounts/${acc.id}`);
}
