"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { str, toCents } from "@/lib/format";

const UNITS = ["sqft", "lf", "each"] as const;
type Unit = (typeof UNITS)[number];
const unit = (v: FormDataEntryValue | null): Unit => (UNITS.includes(String(v) as Unit) ? (String(v) as Unit) : "sqft");

export async function updatePrice(id: number, form: FormData) {
  await requireUser();
  const db = await getDb();
  const cents = toCents(form.get("rate"));
  const [item] = await db.select().from(schema.priceItems).where(and(eq(schema.priceItems.id, id), isNull(schema.priceItems.accountId)));
  if (!item) return;
  const values = {
    name: str(form.get("name")) ?? item.name,
    description: str(form.get("description")),
    unit: unit(form.get("unit")),
    rateCents: cents != null && cents >= 0 ? cents : item.rateCents,
    active: form.get("active") === "on",
  };
  await db.update(schema.priceItems).set(values).where(eq(schema.priceItems.id, id));
  // Account rates follow the item's name, description and unit.
  await db
    .update(schema.priceItems)
    .set({ name: values.name, description: values.description, unit: values.unit })
    .where(eq(schema.priceItems.code, item.code));
  revalidatePath("/settings/prices");
}

export async function addPrice(form: FormData) {
  await requireUser();
  const name = str(form.get("name"));
  const cents = toCents(form.get("rate"));
  if (!name || cents == null) return;
  const db = await getDb();
  const code = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}-${Date.now().toString(36)}`;
  await db.insert(schema.priceItems).values({ accountId: null, code, name, description: str(form.get("description")), unit: unit(form.get("unit")), rateCents: cents, sort: 100 });
  revalidatePath("/settings/prices");
}
