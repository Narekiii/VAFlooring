/** All calendar dates are Los Angeles dates stored as YYYY-MM-DD strings (date-only, no time zone shift). */
export const TZ = "America/Los_Angeles";

export const todayLA = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());

export const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;

const asUTC = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** "Nov 13, 2026" */
export const fmtDate = (iso: string | null | undefined) =>
  iso ? asUTC(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";

/** "Fri, Nov 13" */
export const fmtDay = (iso: string) => asUTC(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

export const addDays = (iso: string, n: number) => {
  const d = asUTC(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** Month helpers: "2026-11" */
export const monthOf = (iso: string) => iso.slice(0, 7);
export const addMonths = (month: string, n: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
};
export const monthLabel = (month: string) => asUTC(`${month}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** The calendar grid for a month: whole weeks, Sunday first. */
export function monthGrid(month: string): string[] {
  const first = `${month}-01`;
  const start = addDays(first, -asUTC(first).getUTCDay());
  const nextMonth = `${addMonths(month, 1)}-01`;
  const days: string[] = [];
  for (let d = start; d < nextMonth || days.length % 7 !== 0; d = addDays(d, 1)) days.push(d);
  return days;
}
