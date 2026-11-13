"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { FLOORING_TYPES, FOLLOW_UP_TYPES, PROPERTY_TYPES, PROSPECT_STATUSES } from "@/db/schema";
import { flooringLabel, followUpLabel, propertyTypeLabel, prospectStatusLabel } from "@/lib/labels";
import type { PropertyFormValues, PropertySaveState } from "@/lib/property-input";
import { MapLocation } from "./MapLocation";

type Props = {
  initial: PropertyFormValues;
  savedStatus: "matched" | "manual" | "unmatched" | "unavailable" | null;
  isNew: boolean;
  returnTo: string;
  action: (state: PropertySaveState, form: FormData) => Promise<PropertySaveState>;
  deleteFormId?: string;
};

const ADDRESS = ["street", "city", "state", "zip"];
type K = Exclude<keyof PropertyFormValues, "flooring">;

export function PropertyForm({ initial, savedStatus, isNew, returnTo, action, deleteFormId }: Props) {
  const [v, setV] = useState<PropertyFormValues>(initial);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [addressTouched, setAddressTouched] = useState(false);
  const fe = state?.fieldErrors ?? {};

  const set = (k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setV((cur) => ({ ...cur, [k]: value, ...(ADDRESS.includes(k) ? { latitude: "", longitude: "", pinEdited: "", pinSource: "" } : {}) }));
    if (ADDRESS.includes(k)) setAddressTouched(true);
  };
  const err = (k: keyof PropertyFormValues) =>
    fe[k] ? (
      <span className="fieldError" id={`${k}-err`}>
        {fe[k]}
      </span>
    ) : null;
  const a11y = (k: keyof PropertyFormValues) => (fe[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});
  const text = (k: K, label: string, o: { type?: string; full?: boolean; auto?: string; mode?: "tel" | "email" | "numeric" | "url"; hint?: string } = {}) => (
    <div className={`field${o.full ? " full" : ""}`}>
      <label htmlFor={k}>{label}</label>
      <input id={k} name={k} type={o.type ?? "text"} value={v[k]} onChange={set(k)} autoComplete={o.auto ?? "off"} inputMode={o.mode} {...a11y(k)} />
      {o.hint && <span className="hint">{o.hint}</span>}
      {err(k)}
    </div>
  );
  const select = (k: K, label: string, options: Record<string, string>, empty?: string) => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      <select id={k} name={k} value={v[k]} onChange={set(k)} {...a11y(k)}>
        {empty !== undefined && <option value="">{empty}</option>}
        {Object.entries(options).map(([value, l]) => (
          <option key={value} value={value}>
            {l}
          </option>
        ))}
      </select>
      {err(k)}
    </div>
  );

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

      <fieldset className="section">
        <legend>Property &amp; Management</legend>
        <div className="grid">
          <div className="field full">
            <label htmlFor="name">Property name (required)</label>
            <input id="name" name="name" value={v.name} onChange={set("name")} required autoComplete="off" {...a11y("name")} />
            {err("name")}
          </div>
          {text("managementCompany", "Management company", { full: true, auto: "organization" })}
          {select("propertyType", "Property type", Object.fromEntries(PROPERTY_TYPES.map((t) => [t, propertyTypeLabel[t]])), "Not recorded")}
          {text("units", "Number of units", { mode: "numeric" })}
          <div className="field full">
            <span className="fieldLabel">Property address</span>
          </div>
          {text("street", "Street", { full: true, auto: "address-line1" })}
        </div>
        <div className="grid3" style={{ marginTop: 14 }}>
          {text("city", "City", { auto: "address-level2" })}
          {text("state", "State", { auto: "address-level1" })}
          {text("zip", "ZIP", { auto: "postal-code", mode: "numeric" })}
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          {text("companyOfficeAddress", "Management company office address", { full: true })}
          {text("website", "Website", { full: true, mode: "url", hint: "Property or management company website" })}
        </div>
      </fieldset>

      <fieldset className="section">
        <legend>Contacts</legend>
        <div className="grid">
          {text("managerName", "Property manager")}
          {text("managerPhone", "Manager phone", { type: "tel", mode: "tel" })}
          {text("managerEmail", "Manager email", { type: "email", mode: "email", full: true })}
          {text("maintenanceName", "Maintenance supervisor")}
          {text("maintenancePhone", "Maintenance phone", { type: "tel", mode: "tel" })}
          {text("maintenanceEmail", "Maintenance email", { type: "email", mode: "email", full: true })}
          {text("officePhone", "Leasing office phone", { type: "tel", mode: "tel" })}
          {text("decisionMaker", "Who approves flooring vendors", { hint: "e.g. regional manager, owner, maintenance director" })}
        </div>
      </fieldset>

      <fieldset className="section">
        <legend>Flooring &amp; Opportunity</legend>
        <div className="grid">
          {select("status", "Status", Object.fromEntries(PROSPECT_STATUSES.map((s) => [s, prospectStatusLabel[s]])))}
          {text("turnoversPerMonth", "Unit turnovers per month", { mode: "numeric", hint: "Your best estimate" })}
          <div className="field full">
            <span className="fieldLabel" id="flooring-label">
              Flooring in the units
            </span>
            <div className="choice" role="group" aria-labelledby="flooring-label">
              {FLOORING_TYPES.map((f) => (
                <label key={f}>
                  <input
                    type="checkbox"
                    name="flooring"
                    value={f}
                    checked={v.flooring.includes(f)}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setV((cur) => ({ ...cur, flooring: on ? [...cur.flooring, f] : cur.flooring.filter((x) => x !== f) }));
                    }}
                  />
                  {flooringLabel[f]}
                </label>
              ))}
            </div>
          </div>
          {text("currentVendor", "Current flooring vendor", { full: true })}
          {text("pricingSentOn", "Pricing sent on", { type: "date" })}
          {text("lastContactOn", "Last contact", { type: "date" })}
          <div className="field full">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={v.notes}
              onChange={set("notes")}
              placeholder="Who you met, their pain points, how they handle turnovers, what they pay now…"
              {...a11y("notes")}
            />
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

      <MapLocation v={v} setV={setV} savedStatus={savedStatus} addressTouched={addressTouched} isNew={isNew} errors={{ latitude: fe.latitude, longitude: fe.longitude }} />

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
