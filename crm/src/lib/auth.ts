import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, lt, count } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { SESSION_COOKIE, SESSION_HOURS, signSession, verifySession } from "./session";

export const ADMIN_USERNAME = "admin";
const MAX_FAILURES = 5;
const WINDOW_MINUTES = 15;

const sha = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time comparison of the submitted credentials with the configured ones. */
export function credentialsMatch(username: string, password: string): boolean {
  const expected = process.env.CRM_ADMIN_PASSWORD;
  if (!expected) return false;
  const userOk = timingSafeEqual(sha(username), sha(ADMIN_USERNAME));
  const passOk = timingSafeEqual(sha(password), sha(expected));
  return userOk && passOk;
}

export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`vaf:${ip}`).digest("hex");
}

/** True when this client has failed too often recently. */
export async function isRateLimited(ipHash: string): Promise<boolean> {
  const db = await getDb();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000);
  const [r] = await db
    .select({ n: count() })
    .from(schema.loginFailures)
    .where(and(eq(schema.loginFailures.ipHash, ipHash), gt(schema.loginFailures.at, since)));
  return r.n >= MAX_FAILURES;
}

export async function recordFailure(ipHash: string) {
  const db = await getDb();
  await db.insert(schema.loginFailures).values({ ipHash });
  // Housekeeping: drop records older than a day.
  await db.delete(schema.loginFailures).where(lt(schema.loginFailures.at, new Date(Date.now() - 86_400_000)));
}

export async function clearFailures(ipHash: string) {
  const db = await getDb();
  await db.delete(schema.loginFailures).where(eq(schema.loginFailures.ipHash, ipHash));
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, await signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isSignedIn(): Promise<boolean> {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages and server actions: continue only when signed in. */
export async function requireAdmin() {
  if (!(await isSignedIn())) redirect("/login");
}
