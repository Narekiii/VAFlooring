"use server";

import bcrypt from "bcryptjs";
import { count, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/db";
import { endSession, startSession } from "@/lib/auth";
import { str } from "@/lib/format";

/** `values` refills the form after an error (React resets forms when an action finishes). */
export type FormState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

const userCount = async () => {
  const db = await getDb();
  const [r] = await db.select({ n: count() }).from(schema.users);
  return r.n;
};

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form.get("email"))?.toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { email: email ?? "" };
  if (!email || !password) return { error: "Enter your email and password.", values };
  const db = await getDb();
  const [u] = await db.select().from(schema.users).where(sql`lower(${schema.users.email}) = ${email}`);
  // Same message and similar timing whether or not the account exists.
  const ok = await bcrypt.compare(password, u?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
  if (!u || !ok || !u.active) return { error: "That email and password don’t match an active account.", values };
  await startSession(u.id);
  redirect("/");
}

/** First run only: creates the first account when no users exist yet. */
export async function setupFirstUser(_: FormState, form: FormData): Promise<FormState> {
  if ((await userCount()) > 0) return { error: "Setup is already complete. Sign in instead." };
  const name = str(form.get("name"));
  const email = str(form.get("email"))?.toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { name: name ?? "", email: email ?? "" };
  if (!name || !email) return { error: "Enter your name and email.", values };
  if (password.length < 10) return { error: "Use a password of at least 10 characters.", values };
  const db = await getDb();
  const [u] = await db
    .insert(schema.users)
    .values({ name, email, passwordHash: await bcrypt.hash(password, 12) })
    .returning({ id: schema.users.id });
  await startSession(u.id);
  redirect("/");
}

export async function logout() {
  await endSession();
  redirect("/login");
}

export async function needsSetup() {
  return (await userCount()) === 0;
}

