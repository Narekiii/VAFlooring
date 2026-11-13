import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geocode";
import { siteAddress } from "@/lib/labels";

export const dynamic = "force-dynamic";

/** Address lookup for the project form's "Look up address" button. Signed-in only. */
export async function POST(req: Request) {
  if (!(await isSignedIn())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const s = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, 200) : null);
  const address = siteAddress({ street: s("street"), city: s("city"), state: s("state"), zip: s("zip") });
  if (!address) return NextResponse.json({ status: "unmatched" });
  return NextResponse.json(await geocodeAddress(address));
}
