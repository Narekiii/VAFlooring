import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { readSession, SESSION_COOKIE, SESSION_DAYS, signSession } from "./session";

export type CurrentUser = { id: number; name: string; email: string };

/** The signed-in, active user, or null. */
export const currentUser = cache(async (): Promise<CurrentUser | null> => {
  const uid = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!uid) return null;
  const db = await getDb();
  const [u] = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email })
    .from(schema.users)
    .where(and(eq(schema.users.id, uid), eq(schema.users.active, true)));
  return u ?? null;
});

/** For pages and actions: the user, or a redirect to the login page. */
export async function requireUser(): Promise<CurrentUser> {
  const u = await currentUser();
  if (!u) redirect("/login");
  return u;
}

export async function startSession(userId: number) {
  (await cookies()).set(SESSION_COOKIE, await signSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
