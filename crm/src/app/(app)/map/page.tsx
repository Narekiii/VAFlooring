import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { retryGeocode } from "@/app/actions";
import { MainHead } from "@/components/MainHead";
import { MapView, type Pin } from "@/components/MapView";
import { siteAddress, stageLabel } from "@/lib/labels";

export const metadata = { title: "Map" };

const reason = { unmatched: "Address not matched", unavailable: "Lookup was unavailable", matched: "", manual: "" } as const;

export default async function MapTab() {
  const db = await getDb();
  const rows = await db.select().from(schema.projects).orderBy(asc(schema.projects.name));
  const pins: Pin[] = rows
    .filter((r) => r.latitude != null && r.longitude != null)
    .map((r) => ({ id: r.id, name: r.name, address: siteAddress(r), stage: r.stage ? stageLabel[r.stage] : "", lat: r.latitude!, lng: r.longitude! }));
  const noPin = rows.filter((r) => r.latitude == null || r.longitude == null);
  return (
    <>
      <MainHead tab="map" />
      <MapView pins={pins} />
      <p className="hint" style={{ marginTop: 6 }}>
        {pins.length} {pins.length === 1 ? "project" : "projects"} on the map.
      </p>
      {noPin.length > 0 && (
        <section className="nopin" aria-labelledby="nopin-title">
          <h2 id="nopin-title">Projects without a pin ({noPin.length})</h2>
          <p className="hint" style={{ marginBottom: 10 }}>
            Retry the address lookup, or open the project to fix the address or enter coordinates under Map location.
          </p>
          <ul className="list">
            {noPin.map((r) => {
              const addr = siteAddress(r);
              return (
                <li key={r.id} className="row">
                  <Link href={`/projects/${r.id}?from=${encodeURIComponent("/map")}`} className="rowMain">
                    <span className="rowName">{r.name}</span>
                    <span className="rowSub">{addr || "No project address"}</span>
                    {r.geocodeStatus && reason[r.geocodeStatus] && <span className="rowSub">{reason[r.geocodeStatus]}</span>}
                  </Link>
                  {addr && (
                    <div className="rowSide">
                      <form action={retryGeocode.bind(null, r.id)}>
                        <button className="btn btnSmall">
                          Retry lookup<span className="visually-hidden"> for {r.name}</span>
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
