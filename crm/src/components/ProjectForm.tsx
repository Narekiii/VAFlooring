"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { FOLLOW_UP_TYPES, STAGES } from "@/db/schema";
import { followUpLabel, stageLabel } from "@/lib/labels";
import type { ProjectFormValues, SaveState } from "@/lib/project-input";

type Props = {
  initial: ProjectFormValues;
  /** Saved pin state, for the Map location summary. */
  savedStatus: "matched" | "manual" | "unmatched" | "unavailable" | null;
  isNew: boolean;
  returnTo: string;
  action: (state: SaveState, form: FormData) => Promise<SaveState>;
  deleteFormId?: string;
};

const ADDRESS_FIELDS = ["street", "city", "state", "zip"] as const;

export function ProjectForm({ initial, savedStatus, isNew, returnTo, action, deleteFormId }: Props) {
  const [v, setV] = useState<ProjectFormValues>(initial);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [lookup, setLookup] = useState<{ busy: boolean; msg?: string }>({ busy: false });
  const [addressTouched, setAddressTouched] = useState(false);
  const fe = state?.fieldErrors ?? {};

  const set = (k: keyof ProjectFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setV((cur) => {
      const next = { ...cur, [k]: value };
      if ((ADDRESS_FIELDS as readonly string[]).includes(k)) {
        // A changed address makes the old pin stale: it's looked up again on save.
        next.latitude = "";
        next.longitude = "";
        next.pinEdited = "";
        next.pinSource = "";
      }
      if (k === "latitude" || k === "longitude") {
        next.pinEdited = "1";
        next.pinSource = "manual";
      }
      return next;
    });
    if ((ADDRESS_FIELDS as readonly string[]).includes(k)) setAddressTouched(true);
  };

  const err = (k: keyof ProjectFormValues) =>
    fe[k] ? (
      <span className="fieldError" id={`${k}-err`}>
        {fe[k]}
      </span>
    ) : null;
  const a11y = (k: keyof ProjectFormValues) => (fe[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});

  const text = (k: keyof ProjectFormValues, label: string, opts: { type?: string; full?: boolean; auto?: string; mode?: "tel" | "email" | "numeric" } = {}) => (
    <div className={`field${opts.full ? " full" : ""}`}>
      <label htmlFor={k}>{label}</label>
      <input id={k} name={k} type={opts.type ?? "text"} value={v[k]} onChange={set(k)} autoComplete={opts.auto ?? "off"} inputMode={opts.mode} {...a11y(k)} />
      {err(k)}
    </div>
  );

  async function lookUp() {
    setLookup({ busy: true });
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ street: v.street, city: v.city, state: v.state, zip: v.zip }),
      });
      if (res.status === 401) return setLookup({ busy: false, msg: "Your session ended. Sign in again to look up addresses." });
      const g = (await res.json()) as { status: string; latitude?: number; longitude?: number };
      if (g.status === "matched" && g.latitude != null && g.longitude != null) {
        setV((cur) => ({ ...cur, latitude: g.latitude!.toFixed(6), longitude: g.longitude!.toFixed(6), pinEdited: "1", pinSource: "matched" }));
        setLookup({ busy: false, msg: "Address found. Save to keep the pin." });
      } else if (g.status === "unmatched") setLookup({ busy: false, msg: "No match for this address. Check it, or enter coordinates below." });
      else setLookup({ busy: false, msg: "Address lookup isn’t available right now. You can still save, and retry later." });
    } catch {
      setLookup({ busy: false, msg: "Address lookup isn’t available right now. You can still save, and retry later." });
    }
  }

  // State alone (it defaults to CA) isn't an address.
  const hasAddress = Boolean(v.street.trim() || v.city.trim() || v.zip.trim());
  const hasPin = v.latitude !== "" && v.longitude !== "";
  const pinSummary = hasPin
    ? v.pinEdited
      ? v.pinSource === "matched"
        ? "Pin found from the address (save to keep it)."
        : "Pin set from the coordinates below (save to keep it)."
      : savedStatus === "manual"
        ? "Pin set from coordinates you entered."
        : "Pin set from the project address."
    : v.pinEdited
      ? "Pin cleared (save to keep the change)."
      : addressTouched || isNew
        ? hasAddress
          ? "The address will be looked up when you save."
          : "Add a project address to place a pin."
        : savedStatus === "unmatched"
          ? "No pin: the address couldn’t be matched."
          : savedStatus === "unavailable"
            ? "No pin: address lookup was unavailable. Try again."
            : "No pin yet.";

  return (
    <form
      className="form"
      noValidate
      onSubmit={(e) => {
        // Submitting by hand (not via the form's action prop) stops React from resetting the form,
        // so everything entered — checkboxes and choices included — stays put if saving fails.
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      {state?.error && (
        <p className="alert" role="alert">
          {state.error}
        </p>
      )}
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="pinEdited" value={v.pinEdited} />
      <input type="hidden" name="pinSource" value={v.pinSource} />

      <fieldset className="section">
        <legend>Project &amp; Company</legend>
        <div className="grid">
          <div className="field full">
            <label htmlFor="name">Project name (required)</label>
            <input id="name" name="name" value={v.name} onChange={set("name")} required autoComplete="off" {...a11y("name")} />
            {err("name")}
          </div>
          {text("company", "Company", { full: true, auto: "organization" })}
          <div className="field full">
            <span className="fieldLabel" id="site-label">
              Project address
            </span>
          </div>
          {text("street", "Street", { full: true, auto: "address-line1" })}
        </div>
        <div className="grid3" style={{ marginTop: 14 }}>
          {text("city", "City", { auto: "address-level2" })}
          {text("state", "State", { auto: "address-level1" })}
          {text("zip", "ZIP", { auto: "postal-code", mode: "numeric" })}
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          {text("officeAddress", "Company office address", { full: true })}
        </div>
      </fieldset>

      <fieldset className="section">
        <legend>Contacts</legend>
        <div className="grid">
          {text("projectManager", "Project manager")}
          {text("siteSupervisor", "Site supervisor")}
          {text("phone", "Contact phone", { type: "tel", auto: "tel", mode: "tel" })}
          {text("email", "Contact email", { type: "email", auto: "email", mode: "email" })}
        </div>
      </fieldset>

      <fieldset className="section">
        <legend>Last Observation</legend>
        <div className="grid">
          <div className="field">
            <label htmlFor="stage">Construction stage</label>
            <select id="stage" name="stage" value={v.stage} onChange={set("stage")} {...a11y("stage")}>
              <option value="">Not recorded</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {stageLabel[s]}
                </option>
              ))}
            </select>
            {err("stage")}
          </div>
          {text("observedOn", "Observation date", { type: "date" })}
          <div className="field full">
            <label htmlFor="notes">Site notes</label>
            <textarea id="notes" name="notes" value={v.notes} onChange={set("notes")} placeholder="What you saw, who you met, materials on site…" {...a11y("notes")} />
            {err("notes")}
          </div>
        </div>
      </fieldset>

      <fieldset className="section">
        <legend>Next Follow-Up</legend>
        <div className="grid">
          <div className="field">
            <span className="fieldLabel" id="fu-type">
              Type
            </span>
            <div className="choice" role="radiogroup" aria-labelledby="fu-type" {...(fe.followUpType ? { "aria-describedby": "followUpType-err" } : {})}>
              {FOLLOW_UP_TYPES.map((t) => (
                <label key={t}>
                  <input type="radio" name="followUpType" value={t} checked={v.followUpType === t} onChange={set("followUpType")} />
                  {followUpLabel[t]}
                </label>
              ))}
            </div>
            {err("followUpType")}
          </div>
          {text("followUpDate", "Date", { type: "date" })}
          {(v.followUpType || v.followUpDate) && (
            <div className="full">
              <button type="button" className="linkish" onClick={() => setV((cur) => ({ ...cur, followUpType: "", followUpDate: "" }))}>
                Clear follow-up
              </button>
            </div>
          )}
        </div>
        {!v.followUpType && <input type="hidden" name="followUpType" value="" />}
      </fieldset>

      <details className="section" open={Boolean(fe.latitude || fe.longitude) || undefined}>
        <summary>Map location</summary>
        <p className="pinStatus" role="status">
          {pinSummary}
        </p>
        <div className="grid">
          {text("latitude", "Latitude", { mode: "numeric" })}
          {text("longitude", "Longitude", { mode: "numeric" })}
        </div>
        <div className="quick" style={{ marginTop: 12, marginBottom: 0 }}>
          <button type="button" className="btn btnSmall" onClick={lookUp} disabled={lookup.busy || !hasAddress}>
            {lookup.busy ? "Looking up…" : "Look up address"}
          </button>
          {hasPin && (
            <button type="button" className="btn btnSmall" onClick={() => setV((cur) => ({ ...cur, latitude: "", longitude: "", pinEdited: "1", pinSource: "" }))}>
              Clear pin
            </button>
          )}
        </div>
        {lookup.msg && (
          <p className="hint" role="status" style={{ marginTop: 8 }}>
            {lookup.msg}
          </p>
        )}
      </details>

      <div className="formBar">
        <button className="btn btnPrimary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        <Link href={returnTo} className="btn">
          Cancel
        </Link>
        {deleteFormId && (
          <button
            type="submit"
            form={deleteFormId}
            className="btn btnDanger"
            style={{ marginLeft: "auto" }}
            onClick={(e) => {
              if (!window.confirm(`Delete “${initial.name}”? This can’t be undone.`)) e.preventDefault();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
