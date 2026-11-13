"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { int, str, toCents } from "@/lib/format";

const accountFields = (form: FormData) => ({
  name: str(form.get("name")) ?? "Unnamed account",
  phone: str(form.get("phone")),
  email: str(form.get("email")),
  address: str(form.get("address")),
  notes: str(form.get("notes")),
});

export async function createAccount(form: FormData) {
  await requireUser();
  const db = await getDb();
  const [row] = await db.insert(schema.accounts).values(accountFields(form)).returning({ id: schema.accounts.id });
  redirect(`/accounts/${row.id}`);
}

export async function updateAccount(id: number, form: FormData) {
  await requireUser();
  const db = await getDb();
  await db.update(schema.accounts).set(accountFields(form)).where(eq(schema.accounts.id, id));
  redirect(`/accounts/${id}?saved=1`);
}

export async function deleteAccount(id: number) {
  await requireUser();
  const db = await getDb();
  await db.delete(schema.accounts).where(eq(schema.accounts.id, id));
  redirect("/accounts");
}

export async function addContact(accountId: number, form: FormData) {
  await requireUser();
  const name = str(form.get("name"));
  if (!name) return;
  const db = await getDb();
  await db.insert(schema.contacts).values({ accountId, name, title: str(form.get("title")), phone: str(form.get("phone")), email: str(form.get("email")) });
  revalidatePath(`/accounts/${accountId}`);
}

export async function deleteContact(accountId: number, contactId: number) {
  await requireUser();
  const db = await getDb();
  await db.delete(schema.contacts).where(and(eq(schema.contacts.id, contactId), eq(schema.contacts.accountId, accountId)));
  revalidatePath(`/accounts/${accountId}`);
}

export async function addProperty(accountId: number, form: FormData) {
  await requireUser();
  const name = str(form.get("name"));
  if (!name) return;
  const db = await getDb();
  await db.insert(schema.properties).values({ accountId, name, address: str(form.get("address")), units: int(form.get("units")), notes: str(form.get("notes")) });
  revalidatePath(`/accounts/${accountId}`);
}

export async function deleteProperty(accountId: number, propertyId: number) {
  await requireUser();
  const db = await getDb();
  await db.delete(schema.properties).where(and(eq(schema.properties.id, propertyId), eq(schema.properties.accountId, accountId)));
  revalidatePath(`/accounts/${accountId}`);
}

/** Saves the account's own rates. A blank rate (or one equal to the standard rate) uses the standard price. */
export async function saveAccountPrices(accountId: number, form: FormData) {
  await requireUser();
  const db = await getDb();
  const std = await db.select().from(schema.priceItems).where(and(eq(schema.priceItems.active, true)));
  for (const s of std.filter((x) => x.accountId === null)) {
    const cents = toCents(form.get(`rate_${s.code}`));
    await db.delete(schema.priceItems).where(and(eq(schema.priceItems.accountId, accountId), eq(schema.priceItems.code, s.code)));
    if (cents != null && cents >= 0 && cents !== s.rateCents) {
      await db.insert(schema.priceItems).values({ accountId, code: s.code, name: s.name, description: s.description, unit: s.unit, rateCents: cents, sort: s.sort });
    }
  }
  redirect(`/accounts/${accountId}?prices=1#prices`);
}
