import { NextResponse } from "next/server";
import {
  labelFor,
  projectTypes,
  serviceOptions,
  timelineOptions,
  validateEstimate,
  type EstimateRequest,
} from "@/lib/estimate";

/**
 * Receives estimate requests and forwards them to the destinations configured in
 * environment variables (see .env.example):
 *
 *   ESTIMATE_WEBHOOK_URL   — any HTTPS endpoint that accepts JSON (Zapier, Make, a CRM, Formspree…)
 *   ESTIMATE_WEBHOOK_SECRET (optional) — sent as the X-Webhook-Secret header
 *   RESEND_API_KEY + ESTIMATE_EMAIL_TO + ESTIMATE_EMAIL_FROM — email delivery through Resend
 *
 * If nothing is configured the route answers 503 and the form tells the visitor the
 * request was not sent. It never reports success unless a destination accepted the request.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const TIMEOUT_MS = 10_000;

type Destination = { name: string; send: (r: EstimateRequest, meta: Meta) => Promise<void> };
type Meta = { submittedAt: string; page: string | null };

function destinations(): Destination[] {
  const list: Destination[] = [];
  const hook = process.env.ESTIMATE_WEBHOOK_URL?.trim();
  if (hook) {
    list.push({
      name: "webhook",
      async send(r, meta) {
        const res = await fetch(hook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.ESTIMATE_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ESTIMATE_WEBHOOK_SECRET } : {}),
          },
          body: JSON.stringify({ type: "estimate_request", ...meta, ...readable(r) }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      },
    });
  }
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ESTIMATE_EMAIL_TO?.trim();
  const from = process.env.ESTIMATE_EMAIL_FROM?.trim();
  if (key && to && from) {
    list.push({
      name: "email",
      async send(r, meta) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to: to.split(",").map((s) => s.trim()).filter(Boolean),
            reply_to: r.email,
            subject: `Estimate request: ${labelFor(projectTypes, r.projectType)} in ${r.location}`,
            text: emailText(r, meta),
            html: emailHtml(r, meta),
          }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      },
    });
  }
  return list;
}

function readable(r: EstimateRequest) {
  return {
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
}

function rows(r: EstimateRequest): [string, string][] {
  const d = readable(r);
  return [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Project type", d.projectType],
    ["City or ZIP", d.location],
    ["Approximate area", d.approximateArea ?? "Not provided"],
    ["Timeline", d.timeline ?? "Not provided"],
    ["Needs", d.service],
  ];
}

function emailText(r: EstimateRequest, meta: Meta) {
  return [
    "New estimate request from the V & A Flooring Inc website",
    "",
    ...rows(r).map(([k, v]) => `${k}: ${v}`),
    "",
    "Project description:",
    r.description,
    "",
    `Submitted ${meta.submittedAt}${meta.page ? ` from ${meta.page}` : ""}`,
  ].join("\n");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function emailHtml(r: EstimateRequest, meta: Meta) {
  const tr = rows(r)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#4A5A66">${esc(k)}</td><td style="padding:4px 0;color:#172B3A">${esc(v)}</td></tr>`)
    .join("");
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#303538">
<p style="font-size:17px;color:#172B3A"><strong>New estimate request</strong></p>
<table style="border-collapse:collapse">${tr}</table>
<p style="margin-top:16px;color:#4A5A66">Project description</p>
<p style="white-space:pre-wrap">${esc(r.description)}</p>
<p style="color:#4A5A66;font-size:13px">Submitted ${esc(meta.submittedAt)}${meta.page ? ` from ${esc(meta.page)}` : ""}</p>
</div>`;
}

export async function POST(req: Request) {
  const length = Number(req.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ code: "too_large", message: "The request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) throw new Error("too large");
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
  } catch {
    return NextResponse.json({ code: "bad_request", message: "The request could not be read." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ code: "rejected", message: "The request could not be processed." }, { status: 400 });
  }

  const result = validateEstimate(body);
  if (!result.ok) {
    return NextResponse.json({ code: "invalid", errors: result.errors }, { status: 422 });
  }

  const targets = destinations();
  if (targets.length === 0) {
    console.error(
      "[estimate] No delivery destination configured. Set ESTIMATE_WEBHOOK_URL or RESEND_API_KEY, ESTIMATE_EMAIL_TO and ESTIMATE_EMAIL_FROM.",
    );
    return NextResponse.json({ code: "not_configured" }, { status: 503 });
  }

  const meta: Meta = {
    submittedAt: new Date().toISOString(),
    page: req.headers.get("referer"),
  };
  const outcomes = await Promise.allSettled(targets.map((t) => t.send(result.value, meta)));
  const delivered = outcomes.filter((o) => o.status === "fulfilled").length;
  outcomes.forEach((o, i) => {
    if (o.status === "rejected") console.error(`[estimate] ${targets[i].name} delivery failed:`, o.reason);
  });

  if (delivered === 0) {
    return NextResponse.json({ code: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ code: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
