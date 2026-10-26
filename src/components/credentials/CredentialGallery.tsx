"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Credential } from "@/content/credentials";
import styles from "./Credentials.module.css";

export function CredentialGallery({ items, headingId }: { items: Credential[]; headingId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Credential | null>(null);

  const show = (c: Credential) => {
    setOpen(c);
    dialog.current?.showModal();
  };

  return (
    <>
      <ul className={styles.grid} aria-labelledby={headingId}>
        {items.map((c) => (
          <li key={c.title} className={`${styles.item} ${c.group === "team" ? styles.wide : ""}`}>
            <button type="button" className={styles.thumb} onClick={() => show(c)} data-cert-full={c.src.src}>
              <Image
                src={c.src}
                alt={c.alt}
                sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 50vw, 100vw"
                placeholder="blur"
                className={styles.img}
              />
              <span className="visually-hidden">View larger</span>
            </button>
            <p className={styles.issuer}>{c.issuer}</p>
            <h3 className={styles.title}>{c.title}</h3>
            <p className={styles.detail}>{c.detail}</p>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={open?.title ?? "Document"}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        {open && (
          <div className={styles.dialogInner}>
            <Image src={open.src} alt={open.alt} sizes="90vw" loading="eager" placeholder="blur" unoptimized className={styles.dialogImg} />
            <div className={styles.dialogBar}>
              <p>
                <strong>{open.title}</strong> · {open.issuer}
              </p>
              <button type="button" className={styles.close} onClick={() => dialog.current?.close()}>
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
