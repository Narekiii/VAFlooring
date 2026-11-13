import { jwtVerify, SignJWT } from "jose";

/** Signed, expiring session cookie. Edge-safe (used by the proxy): no database or Node APIs here. */
export const SESSION_COOKIE = "vaf_session";
export const SESSION_HOURS = 24 * 7; // one week

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return new TextEncoder().encode(s);
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode("development-only-session-secret-change-me");
}

export async function signSession(): Promise<string> {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.sub === "admin";
  } catch {
    return false;
  }
}
