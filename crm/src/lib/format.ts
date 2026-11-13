/** Money is stored in cents. */
export const money = (cents: number | null | undefined) =>
  cents == null ? "—" : (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export const toCents = (v: FormDataEntryValue | null | undefined): number | null => {
  const s = String(v ?? "").replace(/[$,\s]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
};

export const unitLabel = { sqft: "sq ft", lf: "linear ft", each: "each" } as const;
export const unitShort = { sqft: "sq ft", lf: "LF", each: "ea" } as const;

/** Line total in cents for a quantity (string from Postgres numeric) at a rate. */
export const lineCents = (qty: string | number, rateCents: number) => Math.round(Number(qty) * rateCents);

export const stageLabel = {
  new: "New",
  contacted: "Contacted",
  estimate_sent: "Estimate sent",
  won: "Won",
  lost: "Lost",
} as const;
export const estimateStatusLabel = { draft: "Draft", sent: "Sent", accepted: "Accepted", declined: "Declined" } as const;
export const jobStatusLabel = {
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

const LA = "America/Los_Angeles";
export const fmtDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(`${d}T12:00:00`) : d;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: typeof d === "string" ? undefined : LA });
};
export const fmtDateTime = (d: Date | null | undefined) =>
  d ? d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: LA }) : "—";

/** Today's date (YYYY-MM-DD) in Los Angeles. */
export const todayLA = () => new Intl.DateTimeFormat("en-CA", { timeZone: LA }).format(new Date());

export const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
/** Monday of the week containing the date. */
export const weekStart = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  return addDays(iso, -dow);
};

export const str = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s ? s : null;
};
export const int = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
};
