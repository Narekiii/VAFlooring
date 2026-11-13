import "server-only";

export type GeocodeResult = { status: "matched"; latitude: number; longitude: number } | { status: "unmatched" } | { status: "unavailable" };

const CENSUS = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";
const TIMEOUT_MS = 8000;

/**
 * Looks up a U.S. street address with the U.S. Census Geocoder (free, no key).
 * Only the address is sent. Never throws: returns "unmatched" or "unavailable" instead.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const q = address.trim();
  if (!q) return { status: "unmatched" };
  const url = new URL(process.env.GEOCODER_URL || CENSUS);
  url.searchParams.set("address", q.slice(0, 300));
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("format", "json");
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store", headers: { Accept: "application/json" } });
    if (!res.ok) return { status: "unavailable" };
    const data = (await res.json()) as { result?: { addressMatches?: { coordinates?: { x?: number; y?: number } }[] } };
    const c = data.result?.addressMatches?.[0]?.coordinates;
    if (typeof c?.x === "number" && typeof c?.y === "number" && Number.isFinite(c.x) && Number.isFinite(c.y)) {
      return { status: "matched", latitude: c.y, longitude: c.x };
    }
    return { status: "unmatched" };
  } catch {
    return { status: "unavailable" };
  }
}
