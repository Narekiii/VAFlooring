"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import type { NavItem } from "@/content/navigation";
import styles from "./Header.module.css";

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function MobileMenu({ items, cta }: { items: NavItem[]; cta: { label: string; href: string } }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const list = [toggleRef.current!, ...focusables()];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 76.0625rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const link = (item: NavItem, sub = false) => (
    <li key={item.href}>
      <Link
        href={item.href}
        className={sub ? styles.panelSubLink : styles.panelLink}
        aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
        onClick={() => close(false)}
      >
        {item.label}
      </Link>
    </li>
  );

  return (
    <div className={styles.mobile}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close(false) : setOpen(true))}
      >
        <span className={styles.toggleIcon} aria-hidden="true" data-open={open}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.toggleText}>{open ? "Close" : "Menu"}</span>
      </button>
      <div id={panelId} ref={panelRef} className={styles.panel} hidden={!open} data-surface="dark">
        <nav aria-label="Mobile">
          {items
            .filter((i) => i.children)
            .map((group) => (
              <div key={group.label} className={styles.panelGroup}>
                <p className={styles.panelHeading}>{group.label}</p>
                <ul className={styles.panelSubLinks}>{group.children!.map((c) => link(c, true))}</ul>
              </div>
            ))}
          <ul className={styles.panelLinks}>{items.filter((i) => !i.children).map((i) => link(i))}</ul>
          <Link href={cta.href} className={`${buttonClass("light")} ${styles.panelCta}`} onClick={() => close(false)}>
            {cta.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
