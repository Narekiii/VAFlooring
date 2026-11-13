import "server-only";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { lineCents } from "@/lib/format";
import { priceListFor } from "@/lib/prices";

/** Everything the estimate editor needs: accounts, properties, open leads and each account's price list. */
export async function editorData() {
  const db = await getDb();
  const [accounts, properties, leads] = await Promise.all([
    db.select({ id: schema.accounts.id, name: schema.accounts.name, address: schema.accounts.address }).from(schema.accounts).orderBy(asc(schema.accounts.name)),
    db.select({ id: schema.properties.id, accountId: schema.properties.accountId, name: schema.properties.name, address: schema.properties.address }).from(schema.properties).orderBy(asc(schema.properties.name)),
    db
      .select({ id: schema.leads.id, name: schema.leads.name, address: schema.leads.address })
      .from(schema.leads)
      .where(inArray(schema.leads.stage, ["new", "contacted", "estimate_sent"]))
      .orderBy(desc(schema.leads.updatedAt))
      .limit(300),
  ]);
  const lists = await Promise.all([priceListFor(null), ...accounts.map((a) => priceListFor(a.id))]);
  const priceLists: Record<string, Awaited<ReturnType<typeof priceListFor>>> = { std: lists[0], "": lists[0] };
  accounts.forEach((a, i) => (priceLists[String(a.id)] = lists[i + 1]));
  return { accounts, properties, leads, priceLists };
}

export async function loadEstimate(id: number) {
  const db = await getDb();
  const [est] = await db.select().from(schema.estimates).where(eq(schema.estimates.id, id));
  if (!est) return null;
  const items = await db.select().from(schema.estimateItems).where(eq(schema.estimateItems.estimateId, id)).orderBy(asc(schema.estimateItems.sort));
  const [account] = est.accountId ? await db.select().from(schema.accounts).where(eq(schema.accounts.id, est.accountId)) : [];
  const [property] = est.propertyId ? await db.select().from(schema.properties).where(eq(schema.properties.id, est.propertyId)) : [];
  const [lead] = est.leadId ? await db.select().from(schema.leads).where(eq(schema.leads.id, est.leadId)) : [];
  const total = items.reduce((a, it) => a + lineCents(it.qty, it.rateCents), 0);
  return { est, items, account, property, lead, total };
}
