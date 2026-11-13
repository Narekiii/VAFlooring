import "server-only";
import { geocodeAddress } from "./geocode";
import { siteAddress } from "./labels";

type Addr = { street: string | null; city: string | null; state: string | null; zip: string | null };
type Status = "matched" | "manual" | "unmatched" | "unavailable" | null;
export type Pin = { latitude: number | null; longitude: number | null; geocodeStatus: Status };

const addressKey = (a: Addr) => siteAddress(a).toLowerCase().replace(/\s+/g, " ");

/**
 * Decides the map pin on save. What the person did in the form's Map location section wins;
 * otherwise a new or changed address is looked up once (and a stale pin is dropped); otherwise the saved pin stays.
 */
export async function resolvePin(
  existing: (Addr & Pin) | undefined,
  v: Addr & { latitude: number | null; longitude: number | null; pinEdited: "" | "1"; pinSource: "" | "matched" | "manual" },
): Promise<Pin> {
  const addr = siteAddress(v);
  if (v.pinEdited === "1") {
    return v.latitude !== null && v.longitude !== null
      ? { latitude: v.latitude, longitude: v.longitude, geocodeStatus: v.pinSource === "matched" ? "matched" : "manual" }
      : { latitude: null, longitude: null, geocodeStatus: addr ? "unmatched" : null };
  }
  if (!existing || addressKey(existing) !== addressKey(v)) {
    if (!addr) return { latitude: null, longitude: null, geocodeStatus: null };
    const g = await geocodeAddress(addr);
    return g.status === "matched" ? { latitude: g.latitude, longitude: g.longitude, geocodeStatus: "matched" } : { latitude: null, longitude: null, geocodeStatus: g.status };
  }
  return { latitude: existing.latitude, longitude: existing.longitude, geocodeStatus: existing.geocodeStatus };
}

/** Looks a saved address up again (Map tab "Retry lookup"). */
export async function lookupAgain(a: Addr): Promise<Pin> {
  const addr = siteAddress(a);
  if (!addr) return { latitude: null, longitude: null, geocodeStatus: null };
  const g = await geocodeAddress(addr);
  return g.status === "matched" ? { latitude: g.latitude, longitude: g.longitude, geocodeStatus: "matched" } : { latitude: null, longitude: null, geocodeStatus: g.status };
}
