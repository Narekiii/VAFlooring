import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb, schema } from "@/db";

export type PriceLine = {
  code: string;
  name: string;
  description: string | null;
  unit: "sqft" | "lf" | "each";
  rateCents: number;
  standardCents: number;
  /** True when the account has its own rate for this item. */
  custom: boolean;
};

/** The standard price list, with an account's own rates applied when given. */
export async function priceListFor(accountId?: number | null): Promise<PriceLine[]> {
  const db = await getDb();
  const std = await db
    .select()
    .from(schema.priceItems)
    .where(and(isNull(schema.priceItems.accountId), eq(schema.priceItems.active, true)))
    .orderBy(asc(schema.priceItems.sort), asc(schema.priceItems.id));
  const over = accountId
    ? await db.select().from(schema.priceItems).where(eq(schema.priceItems.accountId, accountId))
    : [];
  return std.map((s) => {
    const o = over.find((x) => x.code === s.code);
    return {
      code: s.code,
      name: s.name,
      description: s.description,
      unit: s.unit,
      rateCents: o?.rateCents ?? s.rateCents,
      standardCents: s.rateCents,
      custom: Boolean(o),
    };
  });
}
