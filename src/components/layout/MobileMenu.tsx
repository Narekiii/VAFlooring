"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { NavLinks } from "./NavLinks";
import styles from "./Header.module.css";

type Item = { label: string; href: string };

export function MobileMenu({ items, cta }: { items: readonly Item[]; cta: Item }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Close when the route changes (e.g. browser back).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      // Keep focus within the toggle button and the open panel.
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  // Close if the viewport grows to the desktop layout while open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 63.0625rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
          <NavLinks
            items={items}
            className={styles.panelLinks}
            linkClassName={styles.panelLink}
            onNavigate={() => close(false)}
          />
          <Link href={cta.href} className={`${buttonClass("light")} ${styles.panelCta}`} onClick={() => close(false)}>
            {cta.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
