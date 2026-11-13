"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups: { label: string; links: { href: string; label: string }[] }[] = [
  { label: "Sales", links: [{ href: "/", label: "Dashboard" }, { href: "/leads", label: "Leads" }, { href: "/accounts", label: "Accounts" }, { href: "/estimates", label: "Estimates" }] },
  { label: "Operations", links: [{ href: "/schedule", label: "Schedule" }, { href: "/jobs", label: "Jobs" }, { href: "/crews", label: "Crews" }] },
  { label: "Settings", links: [{ href: "/settings/prices", label: "Price list" }, { href: "/settings/team", label: "Team" }] },
];

export function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
  return (
    <nav aria-label="Main">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="navLabel">{g.label}</p>
          <ul className="nav">
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={active(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
