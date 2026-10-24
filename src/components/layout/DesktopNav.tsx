"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/content/navigation";
import styles from "./Header.module.css";

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/** Disclosure-style dropdown (button + list of links), the pattern recommended for site navigation. */
function Dropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLLIElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const active = item.children?.some((c) => isCurrent(pathname, c.href));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={wrap}
      className={styles.dropdown}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btn}
        type="button"
        className={`${styles.link} ${styles.dropBtn}`}
        aria-expanded={open}
        aria-controls={id}
        data-active={active || undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {item.label}
        <span className={styles.caret} aria-hidden="true" />
      </button>
      <div id={id} className={styles.menu} hidden={!open}>
        <ul>
          {item.children?.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className={styles.menuLink} aria-current={isCurrent(pathname, c.href) ? "page" : undefined}>
                <span className={styles.menuTitle}>{c.label}</span>
                {c.description && <span className={styles.menuDesc}>{c.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className={styles.links}>
      {items.map((item) =>
        item.children ? (
          <Dropdown key={item.label} item={item} />
        ) : (
          <li key={item.href}>
            <Link href={item.href} className={styles.link} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
