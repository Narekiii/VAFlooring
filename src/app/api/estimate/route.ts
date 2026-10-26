import { NextResponse } from "next/server";
import { labelFor, projectTypes, serviceOptions, timelineOptions, validateEstimate, type EstimateRequest } from "@/lib/estimate";
import { deliver, readFormBody, type Submission } from "@/lib/delivery";

/**
 * Receives estimate requests and forwards them to the configured destinations (see lib/delivery.ts).
 * If nothing is configured the route answers 503 and the form tells the visitor the request was
 * not sent. It never reports success unless a destination accepted the request.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function submission(r: EstimateRequest): Submission {
  const d = {
    name: r.name,
    email: r.email,
    phone: r.phone,
    projectType: labelFor(projectTypes, r.projectType),
    location: r.location,
    approximateArea: r.area ?? null,
    timeline: r.timeline ? labelFor(timelineOptions, r.timeline) : null,
    service: labelFor(serviceOptions, r.service),
    description: r.description,
  };
  return {
    type: "estimate_request",
    subject: `Estimate request: ${d.projectType} in ${r.location}`,
    heading: "New estimate request from the V & A Flooring Inc website",
    replyTo: r.email,
    rows: [
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Project type", d.projectType],
      ["City or ZIP", d.location],
      ["Approximate area", d.approximateArea ?? "Not provided"],
      ["Timeline", d.timeline ?? "Not provided"],
      ["Needs", d.service],
    ],
    message: { label: "Project description", text: r.description },
    json: d,
  };
}

export async function POST(req: Request) {
  const read = await readFormBody(req);
  if (!read.ok) return NextResponse.json({ code: read.code, message: read.message }, { status: read.status });

  const result = validateEstimate(read.body);
  if (!result.ok) return NextResponse.json({ code: "invalid", errors: result.errors }, { status: 422 });

  const outcome = await deliver(
    submission(result.value),
    { submittedAt: new Date().toISOString(), page: req.headers.get("referer") },
    "estimate",
  );
  if (outcome === "not_configured") return NextResponse.json({ code: "not_configured" }, { status: 503 });
  if (outcome === "failed") return NextResponse.json({ code: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ code: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
