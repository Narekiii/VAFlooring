import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/session";

/** Everything except the login page requires a valid session cookie. Pages re-check the user is still active. */
export async function proxy(req: NextRequest) {
  const uid = await readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (uid) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)"],
};
