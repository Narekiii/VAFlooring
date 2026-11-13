import Link from "next/link";
import { and, asc, gte, isNotNull, lte } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { MainHead } from "@/components/MainHead";
import { ProjectRow } from "@/components/ProjectRow";
import { PropertyRow } from "@/components/PropertyRow";
import type { Project, Property } from "@/db/schema";
import { addMonths, fmtDay, isIsoDate, monthGrid, monthLabel, monthOf, todayLA } from "@/lib/dates";

export const metadata = { title: "Calendar" };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function CalendarTab({ searchParams }: { searchParams: Promise<{ month?: string; day?: string }> }) {
  const sp = await searchParams;
  const today = todayLA();
  const day = sp.day && isIsoDate(sp.day) ? sp.day : null;
  const month = sp.month && /^\d{4}-(0[1-9]|1[0-2])$/.test(sp.month) ? sp.month : day ? monthOf(day) : monthOf(today);
  const selected = day ?? (monthOf(today) === month ? today : `${month}-01`);
  const grid = monthGrid(month);
  const db = await getDb();
  const p = schema.projects;
  const m = schema.properties;
  const [projects, props] = await Promise.all([
    db
      .select()
      .from(p)
      .where(and(isNotNull(p.followUpType), gte(p.followUpDate, grid[0]), lte(p.followUpDate, grid[grid.length - 1])))
      .orderBy(asc(p.name)),
    db
      .select()
      .from(m)
      .where(and(isNotNull(m.followUpType), gte(m.followUpDate, grid[0]), lte(m.followUpDate, grid[grid.length - 1])))
      .orderBy(asc(m.name)),
  ]);
  type Item = { kind: "project"; r: Project } | { kind: "property"; r: Property };
  const rows: Item[] = [...projects.map((r) => ({ kind: "project" as const, r })), ...props.map((r) => ({ kind: "property" as const, r }))].sort((a, b) =>
    a.r.name.localeCompare(b.r.name),
  );
  const byDay = new Map<string, Item[]>();
  for (const it of rows) byDay.set(it.r.followUpDate!, [...(byDay.get(it.r.followUpDate!) ?? []), it]);
  const selectedRows = byDay.get(selected) ?? [];
  const href = (m: string, d?: string) => `/calendar?month=${m}${d ? `&day=${d}` : ""}`;
  const here = href(month, selected);
  const weeks = Array.from({ length: grid.length / 7 }, (_, i) => grid.slice(i * 7, i * 7 + 7));

  return (
    <>
      <MainHead tab="calendar" date={selected} from={here} />
      <div className="calHead">
        <h2 id="cal-title">{monthLabel(month)}</h2>
        <nav className="calNav" aria-label="Month">
          <Link className="btn btnSmall" href={href(addMonths(month, -1))}>
            ← <span className="visually-hidden">Previous month</span>
            <span aria-hidden="true">Previous</span>
          </Link>
          <Link className="btn btnSmall" href={href(monthOf(today), today)}>
            Today
          </Link>
          <Link className="btn btnSmall" href={href(addMonths(month, 1))}>
            <span aria-hidden="true">Next</span>
            <span className="visually-hidden">Next month</span> →
          </Link>
        </nav>
      </div>
      <table className="cal" aria-labelledby="cal-title">
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} scope="col">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((w) => (
            <tr key={w[0]}>
              {w.map((d) => {
                const items = byDay.get(d) ?? [];
                const calls = items.filter((it) => it.r.followUpType === "call").length;
                const visits = items.length - calls;
                const label = [fmtDay(d), calls ? `${calls} ${calls === 1 ? "call" : "calls"}` : "", visits ? `${visits} ${visits === 1 ? "visit" : "visits"}` : ""].filter(Boolean).join(", ");
                const cls = ["day", monthOf(d) !== month ? "out" : "", d === today ? "today" : "", d === selected ? "sel" : ""].filter(Boolean).join(" ");
                return (
                  <td key={d}>
                    <Link href={href(month, d)} className={cls} aria-label={label} aria-current={d === selected ? "date" : undefined} scroll={false}>
                      <span className="dayNum">{Number(d.slice(8))}</span>
                      {items.length > 0 && (
                        <span className="dayCounts" aria-hidden="true">
                          {calls > 0 && (
                            <span className="dc-call">
                              <span className="long">
                                {calls} {calls === 1 ? "call" : "calls"}
                              </span>
                              <span className="short">{calls}C</span>
                            </span>
                          )}
                          {visits > 0 && (
                            <span className="dc-visit">
                              <span className="long">
                                {visits} {visits === 1 ? "visit" : "visits"}
                              </span>
                              <span className="short">{visits}V</span>
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <section className="dayList" aria-labelledby="day-title">
        <h2 id="day-title">
          {fmtDay(selected)}
          {selected === today ? " (today)" : ""}
        </h2>
        {selectedRows.length === 0 ? (
          <div className="empty">
            <p>No calls or visits scheduled for this day.</p>
            <div className="headActions" style={{ justifyContent: "center" }}>
              <Link className="btn" href={`/projects/new?date=${selected}&from=${encodeURIComponent(here)}`}>
                + Add project
              </Link>
              <Link className="btn" href={`/properties/new?date=${selected}&from=${encodeURIComponent(here)}`}>
                + Add property
              </Link>
            </div>
          </div>
        ) : (
          <ul className="list">
            {selectedRows.map((it) =>
              it.kind === "project" ? (
                <ProjectRow key={`p${it.r.id}`} p={it.r} today={today} from={here} showKind />
              ) : (
                <PropertyRow key={`m${it.r.id}`} p={it.r} today={today} from={here} showKind />
              ),
            )}
          </ul>
        )}
      </section>
    </>
  );
}
