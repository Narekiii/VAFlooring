import { NextResponse } from "next/server";
import { topicLabel, validateContact } from "@/lib/contact";
import { deliver, readFormBody } from "@/lib/delivery";

/** Receives contact-page messages and forwards them to the same destinations as estimate requests. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const read = await readFormBody(req);
  if (!read.ok) return NextResponse.json({ code: read.code, message: read.message }, { status: read.status });

  const result = validateContact(read.body);
  if (!result.ok) return NextResponse.json({ code: "invalid", errors: result.errors }, { status: 422 });

  const m = result.value;
  const topic = topicLabel(m.topic);
  const outcome = await deliver(
    {
      type: "contact_message",
      subject: `Website message: ${topic}`,
      heading: "New message from the V & A Flooring Inc contact page",
      replyTo: m.email,
      rows: [
        ["Name", m.name],
        ["Email", m.email],
        ["Phone", m.phone ?? "Not provided"],
        ["Topic", topic],
      ],
      message: { label: "Message", text: m.message },
      json: { name: m.name, email: m.email, phone: m.phone ?? null, topic, message: m.message },
    },
    { submittedAt: new Date().toISOString(), page: req.headers.get("referer") },
    "contact",
  );
  if (outcome === "not_configured") return NextResponse.json({ code: "not_configured" }, { status: 503 });
  if (outcome === "failed") return NextResponse.json({ code: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ code: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
