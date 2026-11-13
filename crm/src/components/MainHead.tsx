import Link from "next/link";

type Tab = "projects" | "properties" | "calendar" | "map";

/** "Prospecting" heading, the add button(s) and the four tabs. */
export function MainHead({ tab, date, from }: { tab: Tab; date?: string; from?: string }) {
  const q = (base: string) => {
    const p = new URLSearchParams();
    if (date) p.set("date", date);
    if (from) p.set("from", from);
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  const tabs = [
    { key: "projects", href: "/", label: "Projects" },
    { key: "properties", href: "/properties", label: "Properties" },
    { key: "calendar", href: "/calendar", label: "Calendar" },
    { key: "map", href: "/map", label: "Map" },
  ] as const;
  const addProject = (
    <Link key="p" href={q("/projects/new")} className={`btn${tab === "properties" ? "" : " btnPrimary"}`}>
      + Add project
    </Link>
  );
  const addProperty = (
    <Link key="m" href={q("/properties/new")} className={`btn${tab === "properties" ? " btnPrimary" : ""}`}>
      + Add property
    </Link>
  );
  const buttons = tab === "projects" ? [addProject] : tab === "properties" ? [addProperty] : [addProject, addProperty];
  return (
    <>
      <div className="head">
        <h1>Prospecting</h1>
        <div className="headActions">{buttons}</div>
      </div>
      <nav className="tabs" aria-label="Views">
        {tabs.map((t) => (
          <Link key={t.key} href={t.href} aria-current={t.key === tab ? "page" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
