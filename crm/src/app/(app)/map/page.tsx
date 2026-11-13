import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { retryGeocode, retryPropertyGeocode } from "@/app/actions";
import { MainHead } from "@/components/MainHead";
import { MapView, type Pin } from "@/components/MapView";
import { prospectStatusLabel, siteAddress, stageLabel } from "@/lib/labels";

export const metadata = { title: "Map" };

const reason = { unmatched: "Address not matched", unavailable: "Lookup was unavailable", matched: "", manual: "" } as const;

type NoPin = { kind: "project" | "property"; id: number; name: string; address: string; why: string };

export default async function MapTab() {
  const db = await getDb();
  const [projects, props] = await Promise.all([
    db.select().from(schema.projects).orderBy(asc(schema.projects.name)),
    db.select().from(schema.properties).orderBy(asc(schema.properties.name)),
  ]);
  const pins: Pin[] = [
    ...projects
      .filter((r) => r.latitude != null && r.longitude != null)
      .map((r) => ({ kind: "project" as const, id: r.id, name: r.name, address: siteAddress(r), detail: r.stage ? `Stage: ${stageLabel[r.stage]}` : "", lat: r.latitude!, lng: r.longitude! })),
    ...props
      .filter((r) => r.latitude != null && r.longitude != null)
      .map((r) => ({
        kind: "property" as const,
        id: r.id,
        name: r.name,
        address: siteAddress(r),
        detail: [prospectStatusLabel[r.status], r.units ? `${r.units} units` : ""].filter(Boolean).join(" · "),
        lat: r.latitude!,
        lng: r.longitude!,
      })),
  ];
  const noPin: NoPin[] = [
    ...projects.filter((r) => r.latitude == null || r.longitude == null).map((r) => ({ kind: "project" as const, id: r.id, name: r.name, address: siteAddress(r), why: r.geocodeStatus ? reason[r.geocodeStatus] : "" })),
    ...props.filter((r) => r.latitude == null || r.longitude == null).map((r) => ({ kind: "property" as const, id: r.id, name: r.name, address: siteAddress(r), why: r.geocodeStatus ? reason[r.geocodeStatus] : "" })),
  ];
  const nProjects = pins.filter((p) => p.kind === "project").length;
  return (
    <>
      <MainHead tab="map" />
      <MapView pins={pins} />
      <p className="legend">
        <span>
          <i aria-hidden="true" /> Projects ({nProjects})
        </span>
        <span>
          <i className="pm" aria-hidden="true" /> Properties ({pins.length - nProjects})
        </span>
      </p>
      {noPin.length > 0 && (
        <section className="nopin" aria-labelledby="nopin-title">
          <h2 id="nopin-title">Projects and properties without a pin ({noPin.length})</h2>
          <p className="hint" style={{ marginBottom: 10 }}>
            Retry the address lookup, or open the record to fix the address or enter coordinates under Map location.
          </p>
          <ul className="list">
            {noPin.map((r) => (
              <li key={`${r.kind}${r.id}`} className="row">
                <Link href={`/${r.kind === "property" ? "properties" : "projects"}/${r.id}?from=${encodeURIComponent("/map")}`} className="rowMain">
                  <span className="kind">{r.kind === "property" ? "Property" : "Project"}</span>
                  <span className="rowName">{r.name}</span>
                  <span className="rowSub">{r.address || "No address"}</span>
                  {r.why && <span className="rowSub">{r.why}</span>}
                </Link>
                {r.address && (
                  <div className="rowSide">
                    <form action={(r.kind === "property" ? retryPropertyGeocode : retryGeocode).bind(null, r.id)}>
                      <button className="btn btnSmall">
                        Retry lookup<span className="visually-hidden"> for {r.name}</span>
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
