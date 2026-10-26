"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { business, telHref } from "@/content/site";
import {
  fieldOrder,
  limits,
  projectTypes,
  serviceOptions,
  timelineOptions,
  validateEstimate,
  type FieldErrors,
  type FieldName,
} from "@/lib/estimate";
import styles from "./EstimateForm.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; name: string; email: string; phone: string }
  | { kind: "error"; message: string };

const labels: Record<FieldName, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  projectType: "Project type",
  location: "Project city or ZIP code",
  area: "Approximate flooring area",
  timeline: "Desired timeline",
  service: "What you need",
  description: "Project description",
};

export function EstimateForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [projectType, setProjectType] = useState("");
  const [summaryFocus, setSummaryFocus] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Pre-select the project type when arriving from a page CTA, e.g. ?type=commercial
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    if (t && projectTypes.some((p) => p.value === t)) setProjectType(t);
  }, []);

  useEffect(() => {
    if (status.kind === "sent") successRef.current?.focus();
  }, [status.kind]);

  // Move focus to the error summary after a failed submission so it is announced.
  useEffect(() => {
    if (summaryFocus > 0) summaryRef.current?.focus();
  }, [summaryFocus]);

  const errorCount = Object.keys(errors).length;

  function readForm(form: HTMLFormElement) {
    const fd = new FormData(form);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") data[k] = v;
    });
    return data;
  }

  function showErrors(e: FieldErrors) {
    setErrors(e);
    setSummaryFocus((n) => n + 1);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const data = readForm(e.currentTarget);
    const result = validateEstimate(data);
    if (!result.ok) {
      setStatus({ kind: "idle" });
      showErrors(result.errors);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: data.website ?? "" }),
      });
      if (res.ok) {
        setStatus({ kind: "sent", name: result.value.name, email: result.value.email, phone: result.value.phone });
        return;
      }
      const payload = (await res.json().catch(() => ({}))) as { code?: string; errors?: FieldErrors };
      if (res.status === 422 && payload.errors) {
        setStatus({ kind: "idle" });
        showErrors(payload.errors);
        return;
      }
      setStatus({
        kind: "error",
        message:
          payload.code === "not_configured"
            ? "Your request was not sent. Online estimate requests aren’t available right now. Please try again later."
            : "Your request was not sent because of a problem on our side. Your details are still in the form; please try again in a few minutes.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Your request was not sent. Check your internet connection, then try again. Your details are still in the form.",
      });
    }
  }

  if (status.kind === "sent") {
    const first = status.name.split(/\s+/)[0];
    return (
      <div className={styles.success} role="status">
        <h2 ref={successRef} tabIndex={-1} className={styles.successTitle}>
          Thank you, {first}. Your request has been sent.
        </h2>
        <p>
          V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc has received your project details. We’ll contact you at {status.email} or {status.phone} to
          talk through your project and the next steps toward an estimate.
        </p>
        <button
          type="button"
          className={buttonClass("secondary")}
          onClick={() => {
            setStatus({ kind: "idle" });
            setProjectType("");
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  const describedBy = (name: FieldName, hint = false) =>
    [hint ? `${name}-hint` : "", errors[name] ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;

  const fieldError = (name: FieldName) =>
    errors[name] ? (
      <p id={`${name}-error`} className={styles.error}>
        <span className="visually-hidden">Error: </span>
        {errors[name]}
      </p>
    ) : null;

  const sending = status.kind === "sending";

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={onSubmit} aria-busy={sending} aria-describedby="form-note">
      <p id="form-note" className={styles.note}>
        All fields are required unless marked optional.
      </p>

      {errorCount > 0 && (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1} aria-labelledby="error-summary-title">
          <h2 id="error-summary-title" className={styles.summaryTitle}>
            {errorCount === 1 ? "Check 1 field before sending" : `Check ${errorCount} fields before sending`}
          </h2>
          <ul>
            {fieldOrder
              .filter((f) => errors[f])
              .map((f) => (
                <li key={f}>
                  <a href={`#${f === "service" ? "service-materials" : f}`}>
                    {labels[f]}: {errors[f]}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={limits.name}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
          />
          {fieldError("name")}
        </div>
      </div>

      <div className={`${styles.row} ${styles.two}`}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={limits.email}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
          />
          {fieldError("email")}
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={limits.phone}
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
          />
          {fieldError("phone")}
        </div>
      </div>

      <div className={`${styles.row} ${styles.two}`}>
        <div className={styles.field}>
          <label htmlFor="projectType">Project type</label>
          <div className={styles.selectWrap}>
            <select
              id="projectType"
              name="projectType"
              required
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              aria-invalid={Boolean(errors.projectType)}
              aria-describedby={describedBy("projectType")}
            >
              <option value="">Choose one</option>
              {projectTypes.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {fieldError("projectType")}
        </div>
        <div className={styles.field}>
          <label htmlFor="location">Project city or ZIP code</label>
          <input
            id="location"
            name="location"
            type="text"
            autoComplete="postal-code"
            maxLength={limits.location}
            required
            aria-invalid={Boolean(errors.location)}
            aria-describedby={describedBy("location")}
          />
          {fieldError("location")}
        </div>
      </div>

      <div className={`${styles.row} ${styles.two}`}>
        <div className={styles.field}>
          <label htmlFor="area">
            Approximate flooring area <span className={styles.optional}>(optional)</span>
          </label>
          <p id="area-hint" className={styles.hint}>
            In square feet, if you know it.
          </p>
          <input
            id="area"
            name="area"
            type="text"
            inputMode="numeric"
            maxLength={limits.area}
            aria-invalid={Boolean(errors.area)}
            aria-describedby={describedBy("area", true)}
          />
          {fieldError("area")}
        </div>
        <div className={styles.field}>
          <label htmlFor="timeline">
            Desired timeline <span className={styles.optional}>(optional)</span>
          </label>
          <p id="timeline-hint" className={styles.hint}>
            When you’d like the flooring installed.
          </p>
          <div className={styles.selectWrap}>
            <select id="timeline" name="timeline" defaultValue="" aria-invalid={Boolean(errors.timeline)} aria-describedby={describedBy("timeline", true)}>
              <option value="">Choose one</option>
              {timelineOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {fieldError("timeline")}
        </div>
      </div>

      <fieldset
        className={styles.fieldset}
        aria-invalid={Boolean(errors.service)}
        aria-describedby={errors.service ? "service-error" : undefined}
      >
        <legend>What do you need?</legend>
        <div className={styles.choices}>
          {serviceOptions.map((o) => (
            <label key={o.value} className={styles.choice} htmlFor={`service-${o.value}`}>
              <input id={`service-${o.value}`} type="radio" name="service" value={o.value} required />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {fieldError("service")}
      </fieldset>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="description">Project description</label>
          <p id="description-hint" className={styles.hint}>
            The rooms or areas involved, current flooring, materials you’re considering, and anything else we should
            know. For larger projects, mention whether you have drawings or specifications.
          </p>
          <textarea
            id="description"
            name="description"
            rows={6}
            maxLength={limits.description}
            required
            aria-invalid={Boolean(errors.description)}
            aria-describedby={describedBy("description", true)}
          />
          {fieldError("description")}
        </div>
      </div>

      {/* Honeypot for automated submissions. Hidden from people and assistive technology. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className={buttonClass("primary")} disabled={sending}>
          {sending ? "Sending request…" : "Send Request"}
        </button>
        <div aria-live="polite" className={styles.live}>
          {sending ? "Sending your request." : ""}
        </div>
      </div>

      {status.kind === "error" && (
        <div className={styles.failure} role="alert">
          <p>{status.message}</p>
          {(business.phone || business.email) && (
            <p>
              You can also reach us{" "}
              {business.phone && (
                <>
                  by phone at <a href={telHref(business.phone)}>{business.phone}</a>
                </>
              )}
              {business.phone && business.email && " or "}
              {business.email && (
                <>
                  by email at <a href={`mailto:${business.email}`}>{business.email}</a>
                </>
              )}
              .
            </p>
          )}
        </div>
      )}
    </form>
  );
}
