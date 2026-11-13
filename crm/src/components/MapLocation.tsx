"use client";

import { useState } from "react";

type PinValues = { street: string; city: string; state: string; zip: string; latitude: string; longitude: string; pinEdited: string; pinSource: string };
type Status = "matched" | "manual" | "unmatched" | "unavailable" | null;

/** The expandable "Map location" section: pin status, address lookup, manual coordinates, clear pin. */
export function MapLocation<T extends PinValues>({
  v,
  setV,
  savedStatus,
  addressTouched,
  isNew,
  errors,
}: {
  v: T;
  setV: React.Dispatch<React.SetStateAction<T>>;
  savedStatus: Status;
  addressTouched: boolean;
  isNew: boolean;
  errors: { latitude?: string; longitude?: string };
}) {
  const [lookup, setLookup] = useState<{ busy: boolean; msg?: string }>({ busy: false });
  const hasAddress = Boolean(v.street.trim() || v.city.trim() || v.zip.trim());
  const hasPin = v.latitude !== "" && v.longitude !== "";

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

  const summary = hasPin
    ? v.pinEdited
      ? v.pinSource === "matched"
        ? "Pin found from the address (save to keep it)."
        : "Pin set from the coordinates below (save to keep it)."
      : savedStatus === "manual"
        ? "Pin set from coordinates you entered."
        : "Pin set from the address."
    : v.pinEdited
      ? "Pin cleared (save to keep the change)."
      : addressTouched || isNew
        ? hasAddress
          ? "The address will be looked up when you save."
          : "Add an address to place a pin."
        : savedStatus === "unmatched"
          ? "No pin: the address couldn’t be matched."
          : savedStatus === "unavailable"
            ? "No pin: address lookup was unavailable. Try again."
            : "No pin yet.";

  const coord = (k: "latitude" | "longitude", label: string) => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      <input
        id={k}
        name={k}
        inputMode="decimal"
        value={v[k]}
        autoComplete="off"
        onChange={(e) => {
          const value = e.target.value;
          setV((cur) => ({ ...cur, [k]: value, pinEdited: "1", pinSource: "manual" }));
        }}
        {...(errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {})}
      />
      {errors[k] && (
        <span className="fieldError" id={`${k}-err`}>
          {errors[k]}
        </span>
      )}
    </div>
  );

  return (
    <details className="section" open={Boolean(errors.latitude || errors.longitude) || undefined}>
      <summary>Map location</summary>
      <input type="hidden" name="pinEdited" value={v.pinEdited} />
      <input type="hidden" name="pinSource" value={v.pinSource} />
      <p className="pinStatus" role="status">
        {summary}
      </p>
      <div className="grid">
        {coord("latitude", "Latitude")}
        {coord("longitude", "Longitude")}
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
  );
}
