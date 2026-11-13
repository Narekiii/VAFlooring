"use server";

import { and, eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { int, str, todayLA } from "@/lib/format";

const Item = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).nullable().optional(),
  unit: z.enum(["sqft", "lf", "each"]),
  qty: z.coerce.number().min(0).max(10_000_000),
  rateCents: z.coerce.number().int().min(0).max(100_000_000),
});

export type EstimateState = { error?: string } | undefined;

function parse(form: FormData) {
  let items: z.infer<typeof Item>[] = [];
  try {
    items = z.array(Item).max(200).parse(JSON.parse(String(form.get("items") ?? "[]")));
  } catch {
    return { error: "Check the line items: each needs a description, a quantity and a rate." } as const;
  }
  const accountId = int(form.get("accountId"));
  const propertyId = int(form.get("propertyId"));
  return {
    values: {
      title: str(form.get("title")) ?? "Flooring estimate",
      accountId,
      propertyId: accountId ? propertyId : null,
      leadId: int(form.get("leadId")),
      customerName: str(form.get("customerName")),
      siteAddress: str(form.get("siteAddress")),
      unitLabel: str(form.get("unitLabel")),
      notes: str(form.get("notes")),
    },
    items,
  } as const;
}

async function nextNumber() {
  const db = await getDb();
  const year = todayLA().slice(0, 4);
  const rows = await db.select({ n: schema.estimates.number }).from(schema.estimates).where(like(schema.estimates.number, `E-${year}-%`));
  const max = rows.reduce((m, r) => Math.max(m, Number(r.n.split("-")[2]) || 0), 0);
  return `E-${year}-${String(max + 1).padStart(4, "0")}`;
}

async function writeItems(estimateId: number, items: z.infer<typeof Item>[]) {
  const db = await getDb();
  await db.delete(schema.estimateItems).where(eq(schema.estimateItems.estimateId, estimateId));
  if (items.length)
    await db.insert(schema.estimateItems).values(
      items.map((it, i) => ({ estimateId, name: it.name, description: it.description ?? null, unit: it.unit, qty: String(it.qty), rateCents: it.rateCents, sort: i })),
    );
}

export async function createEstimate(_: EstimateState, form: FormData): Promise<EstimateState> {
  const user = await requireUser();
  const p = parse(form);
  if ("error" in p) return { error: p.error };
  const db = await getDb();
  let id = 0;
  for (let attempt = 0; attempt < 3 && !id; attempt++) {
    try {
      const [row] = await db
        .insert(schema.estimates)
        .values({ ...p.values, number: await nextNumber(), createdBy: user.id })
        .returning({ id: schema.estimates.id });
      id = row.id;
    } catch (e) {
      if (attempt === 2) throw e;
    }
  }
  await writeItems(id, p.items);
  if (p.values.leadId) {
    await db.update(schema.leads).set({ updatedAt: new Date() }).where(eq(schema.leads.id, p.values.leadId));
  }
  redirect(`/estimates/${id}`);
}

export async function updateEstimate(id: number, _: EstimateState, form: FormData): Promise<EstimateState> {
  await requireUser();
  const p = parse(form);
  if ("error" in p) return { error: p.error };
  const db = await getDb();
  await db.update(schema.estimates).set(p.values).where(eq(schema.estimates.id, id));
  await writeItems(id, p.items);
  redirect(`/estimates/${id}?saved=1`);
}

export async function setEstimateStatus(id: number, status: "draft" | "sent" | "accepted" | "declined") {
  await requireUser();
  const db = await getDb();
  const [est] = await db.select().from(schema.estimates).where(eq(schema.estimates.id, id));
  if (!est) return;
  await db
    .update(schema.estimates)
    .set({ status, sentAt: status === "sent" && !est.sentAt ? new Date() : est.sentAt })
    .where(eq(schema.estimates.id, id));
  // Keep the linked lead's stage in step.
  if (est.leadId) {
    const stage = status === "sent" ? "estimate_sent" : status === "accepted" ? "won" : status === "declined" ? "lost" : null;
    if (stage) await db.update(schema.leads).set({ stage, updatedAt: new Date() }).where(and(eq(schema.leads.id, est.leadId)));
  }
  revalidatePath(`/estimates/${id}`);
}

export async function deleteEstimate(id: number) {
  await requireUser();
  const db = await getDb();
  await db.delete(schema.estimates).where(eq(schema.estimates.id, id));
  redirect("/estimates");
}
