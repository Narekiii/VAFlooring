"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { business, telHref } from "@/content/site";
import {
  contactFieldOrder,
  contactLimits,
  contactTopics,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact";
import styles from "./EstimateForm.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; name: string; email: string }
  | { kind: "error"; message: string };

const labels: Record<ContactField, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  topic: "Topic",
  message: "Message",
};

/** General contact form. Posts to /api/contact; never reports success unless the message was delivered. */
export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [summaryFocus, setSummaryFocus] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status.kind === "sent") successRef.current?.focus();
  }, [status.kind]);

  useEffect(() => {
    if (summaryFocus > 0) summaryRef.current?.focus();
  }, [summaryFocus]);

  const errorCount = Object.keys(errors).length;

  function showErrors(e: ContactErrors) {
    setErrors(e);
    setSummaryFocus((n) => n + 1);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const data: Record<string, string> = {};
    new FormData(e.currentTarget).forEach((v, k) => {
      if (typeof v === "string") data[k] = v;
    });
    const result = validateContact(data);
    if (!result.ok) {
      setStatus({ kind: "idle" });
      showErrors(result.errors);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: data.website ?? "" }),
      });
      if (res.ok) {
        setStatus({ kind: "sent", name: result.value.name, email: result.value.email });
        return;
      }
      const payload = (await res.json().catch(() => ({}))) as { code?: string; errors?: ContactErrors };
      if (res.status === 422 && payload.errors) {
        setStatus({ kind: "idle" });
        showErrors(payload.errors);
        return;
      }
      setStatus({
        kind: "error",
        message:
          payload.code === "not_configured"
            ? "Your message was not sent. Online messages aren’t available right now. Please call us or try again later."
            : "Your message was not sent because of a problem on our side. Your message is still in the form; please try again in a few minutes.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Your message was not sent. Check your internet connection, then try again. Your message is still in the form.",
      });
    }
  }

  if (status.kind === "sent") {
    const first = status.name.split(/\s+/)[0];
    return (
      <div className={styles.success} role="status">
        <h2 ref={successRef} tabIndex={-1} className={styles.successTitle}>
          Thank you, {first}. Your message has been sent.
        </h2>
        <p>We’ll reply to {status.email}. If it’s urgent, please call us.</p>
        <button type="button" className={buttonClass("secondary")} onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </button>
      </div>
    );
  }

  const describedBy = (name: ContactField, hint = false) =>
    [hint ? `contact-${name}-hint` : "", errors[name] ? `contact-${name}-error` : ""].filter(Boolean).join(" ") || undefined;

  const fieldError = (name: ContactField) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className={styles.error}>
        <span className="visually-hidden">Error: </span>
        {errors[name]}
      </p>
    ) : null;

  const sending = status.kind === "sending";

  return (
    <form className={styles.form} noValidate onSubmit={onSubmit} aria-busy={sending} aria-describedby="contact-note">
      <p id="contact-note" className={styles.note}>
        All fields are required unless marked optional.
      </p>

      {errorCount > 0 && (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1} aria-labelledby="contact-error-title">
          <h2 id="contact-error-title" className={styles.summaryTitle}>
            {errorCount === 1 ? "Check 1 field before sending" : `Check ${errorCount} fields before sending`}
          </h2>
          <ul>
            {contactFieldOrder
              .filter((f) => errors[f])
              .map((f) => (
                <li key={f}>
                  <a href={`#contact-${f}`}>
                    {labels[f]}: {errors[f]}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={contactLimits.name}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
          />
          {fieldError("name")}
        </div>
      </div>

      <div className={`${styles.row} ${styles.two}`}>
        <div className={styles.field}>
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={contactLimits.email}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
          />
          {fieldError("email")}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-phone">
            Phone <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={contactLimits.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
          />
          {fieldError("phone")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-topic">What is your message about?</label>
          <div className={styles.selectWrap}>
            <select
              id="contact-topic"
              name="topic"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.topic)}
              aria-describedby={describedBy("topic")}
            >
              <option value="">Choose one</option>
              {contactTopics.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {fieldError("topic")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-message">Message</label>
          <p id="contact-message-hint" className={styles.hint}>
            For a project estimate, the estimate form asks the questions we need to price the work.
          </p>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={contactLimits.message}
            required
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message", true)}
          />
          {fieldError("message")}
        </div>
      </div>

      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className={buttonClass("primary")} disabled={sending}>
          {sending ? "Sending message…" : "Send Message"}
        </button>
        <div aria-live="polite" className={styles.live}>
          {sending ? "Sending your message." : ""}
        </div>
      </div>

      {status.kind === "error" && (
        <div className={styles.failure} role="alert">
          <p>{status.message}</p>
          {business.phone && (
            <p>
              You can also reach us by phone at <a href={telHref(business.phone)}>{business.phone}</a>.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
