"use server";

import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { str } from "@/lib/format";

export type TeamState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

export async function addUser(_: TeamState, form: FormData): Promise<TeamState> {
  await requireUser();
  const name = str(form.get("name"));
  const email = str(form.get("email"))?.toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { name: name ?? "", email: email ?? "" };
  if (!name || !email) return { error: "Enter a name and email.", values };
  if (password.length < 10) return { error: "The temporary password needs at least 10 characters.", values };
  const db = await getDb();
  const [exists] = await db.select({ id: schema.users.id }).from(schema.users).where(sql`lower(${schema.users.email}) = ${email}`);
  if (exists) return { error: "Someone already uses that email.", values };
  await db.insert(schema.users).values({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  revalidatePath("/settings/team");
  return { ok: `${name} can now sign in with ${email} and the temporary password. Ask them to change it under Team.` };
}

export async function setUserActive(id: number, active: boolean) {
  const me = await requireUser();
  if (me.id === id) return;
  const db = await getDb();
  await db.update(schema.users).set({ active }).where(eq(schema.users.id, id));
  revalidatePath("/settings/team");
}

export async function changePassword(_: TeamState, form: FormData): Promise<TeamState> {
  const me = await requireUser();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next.length < 10) return { error: "Use a new password of at least 10 characters." };
  const db = await getDb();
  const [u] = await db.select().from(schema.users).where(eq(schema.users.id, me.id));
  if (!u || !(await bcrypt.compare(current, u.passwordHash))) return { error: "Your current password isn’t right." };
  await db.update(schema.users).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(schema.users.id, me.id));
  return { ok: "Password changed." };
}
