"use server";

import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { int, str } from "@/lib/format";

const entities = ["lead", "account", "estimate", "job"] as const;
type Entity = (typeof entities)[number];

export async function addNote(form: FormData) {
  const user = await requireUser();
  const entity = String(form.get("entity")) as Entity;
  const entityId = int(form.get("entityId"));
  const body = str(form.get("body"));
  if (!entities.includes(entity) || !entityId || !body) return;
  const db = await getDb();
  await db.insert(schema.notes).values({ entity, entityId, body: body.slice(0, 4000), userId: user.id });
  revalidatePath(String(form.get("path") ?? "/"));
}
