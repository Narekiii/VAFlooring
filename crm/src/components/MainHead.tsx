import Link from "next/link";

/** "Prospecting" heading, the Add project button and the three tabs. */
export function MainHead({ tab, addHref = "/projects/new" }: { tab: "projects" | "calendar" | "map"; addHref?: string }) {
  const tabs = [
    { key: "projects", href: "/", label: "Projects" },
    { key: "calendar", href: "/calendar", label: "Calendar" },
    { key: "map", href: "/map", label: "Map" },
  ] as const;
  return (
    <>
      <div className="head">
        <h1>Prospecting</h1>
        <Link href={addHref} className="btn btnPrimary">
          + Add project
        </Link>
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
