/**
 * Delivers website form submissions (estimate requests and contact messages) to the
 * destinations configured in environment variables (see .env.example):
 *
 *   ESTIMATE_WEBHOOK_URL   — any HTTPS endpoint that accepts JSON (Zapier, Make, a CRM, Formspree…)
 *   ESTIMATE_WEBHOOK_SECRET (optional) — sent as the X-Webhook-Secret header
 *   RESEND_API_KEY + ESTIMATE_EMAIL_TO + ESTIMATE_EMAIL_FROM — email delivery through Resend
 *
 * Both forms share the same destinations. A submission is reported as sent only when at
 * least one destination accepts it.
 */

const TIMEOUT_MS = 10_000;

export type Submission = {
  /** Machine-readable type sent to the webhook, e.g. "estimate_request". */
  type: string;
  /** Email subject line. */
  subject: string;
  /** Heading at the top of the email. */
  heading: string;
  replyTo: string;
  /** Label/value pairs shown in the email. */
  rows: [string, string][];
  /** Free-text message shown below the rows. */
  message: { label: string; text: string };
  /** Flat JSON sent to the webhook. */
  json: Record<string, unknown>;
};

export type Meta = { submittedAt: string; page: string | null };
export type DeliveryResult = "sent" | "not_configured" | "failed";

type Destination = { name: string; send: (s: Submission, meta: Meta) => Promise<void> };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function emailText(s: Submission, meta: Meta) {
  return [
    s.heading,
    "",
    ...s.rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `${s.message.label}:`,
    s.message.text,
    "",
    `Submitted ${meta.submittedAt}${meta.page ? ` from ${meta.page}` : ""}`,
  ].join("\n");
}

function emailHtml(s: Submission, meta: Meta) {
  const tr = s.rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#4A5A66">${esc(k)}</td><td style="padding:4px 0;color:#172B3A">${esc(v)}</td></tr>`)
    .join("");
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#303538">
<p style="font-size:17px;color:#172B3A"><strong>${esc(s.heading)}</strong></p>
<table style="border-collapse:collapse">${tr}</table>
<p style="margin-top:16px;color:#4A5A66">${esc(s.message.label)}</p>
<p style="white-space:pre-wrap">${esc(s.message.text)}</p>
<p style="color:#4A5A66;font-size:13px">Submitted ${esc(meta.submittedAt)}${meta.page ? ` from ${esc(meta.page)}` : ""}</p>
</div>`;
}

function destinations(): Destination[] {
  const list: Destination[] = [];
  const hook = process.env.ESTIMATE_WEBHOOK_URL?.trim();
  if (hook) {
    list.push({
      name: "webhook",
      async send(s, meta) {
        const res = await fetch(hook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.ESTIMATE_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ESTIMATE_WEBHOOK_SECRET } : {}),
          },
          body: JSON.stringify({ type: s.type, ...meta, ...s.json }),
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
      async send(s, meta) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to: to.split(",").map((x) => x.trim()).filter(Boolean),
            reply_to: s.replyTo,
            subject: s.subject,
            text: emailText(s, meta),
            html: emailHtml(s, meta),
          }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      },
    });
  }
  return list;
}

export async function deliver(s: Submission, meta: Meta, tag: string): Promise<DeliveryResult> {
  const targets = destinations();
  if (targets.length === 0) {
    console.error(
      `[${tag}] No delivery destination configured. Set ESTIMATE_WEBHOOK_URL or RESEND_API_KEY, ESTIMATE_EMAIL_TO and ESTIMATE_EMAIL_FROM.`,
    );
    return "not_configured";
  }
  const outcomes = await Promise.allSettled(targets.map((t) => t.send(s, meta)));
  outcomes.forEach((o, i) => {
    if (o.status === "rejected") console.error(`[${tag}] ${targets[i].name} delivery failed:`, o.reason);
  });
  return outcomes.some((o) => o.status === "fulfilled") ? "sent" : "failed";
}

const MAX_BODY_BYTES = 20_000;

/** Reads a small JSON object body, rejecting oversized, malformed or honeypot-filled requests. */
export async function readFormBody(
  req: Request,
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; status: number; code: string; message: string }> {
  const length = Number(req.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) return { ok: false, status: 413, code: "too_large", message: "The request is too large." };
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) throw new Error("too large");
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
  } catch {
    return { ok: false, status: 400, code: "bad_request", message: "The request could not be read." };
  }
  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return { ok: false, status: 400, code: "rejected", message: "The request could not be processed." };
  }
  return { ok: true, body };
}
