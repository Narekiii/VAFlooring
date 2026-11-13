"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { str } from "@/lib/format";

export async function addCrew(form: FormData) {
  await requireUser();
  const name = str(form.get("name"));
  if (!name) return;
  const db = await getDb();
  await db.insert(schema.crews).values({ name, leadName: str(form.get("leadName")), phone: str(form.get("phone")) });
  revalidatePath("/crews");
}

export async function updateCrew(id: number, form: FormData) {
  await requireUser();
  const db = await getDb();
  await db
    .update(schema.crews)
    .set({ name: str(form.get("name")) ?? "Crew", leadName: str(form.get("leadName")), phone: str(form.get("phone")), active: form.get("active") === "on" })
    .where(eq(schema.crews.id, id));
  revalidatePath("/crews");
}
