import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function jobFormData() {
  const db = await getDb();
  const [accounts, properties, crews, estimates] = await Promise.all([
    db.select({ id: schema.accounts.id, name: schema.accounts.name }).from(schema.accounts).orderBy(asc(schema.accounts.name)),
    db.select({ id: schema.properties.id, accountId: schema.properties.accountId, name: schema.properties.name }).from(schema.properties).orderBy(asc(schema.properties.name)),
    db.select({ id: schema.crews.id, name: schema.crews.name }).from(schema.crews).where(eq(schema.crews.active, true)).orderBy(asc(schema.crews.name)),
    db.select({ id: schema.estimates.id, number: schema.estimates.number, title: schema.estimates.title }).from(schema.estimates).orderBy(desc(schema.estimates.createdAt)).limit(300),
  ]);
  return { accounts, properties, crews, estimates };
}
