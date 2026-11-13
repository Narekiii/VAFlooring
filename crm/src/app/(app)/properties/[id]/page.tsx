import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { deleteProperty, saveProperty } from "@/app/actions";
import { PropertyForm } from "@/components/PropertyForm";
import { FollowUpPill } from "@/components/ProjectRow";
import { todayLA } from "@/lib/dates";
import { directionsUrl, prospectStatusLabel, siteAddress, telHref } from "@/lib/labels";
import { safeFrom, toPropertyFormValues } from "@/lib/project-values";

export const metadata = { title: "Property" };

export default async function EditProperty({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const returnTo = safeFrom((await searchParams).from ?? "/properties");
  const db = await getDb();
  const [p] = await db.select().from(schema.properties).where(eq(schema.properties.id, id));
  if (!p) notFound();
  const addr = siteAddress(p);
  const calls = [
    p.managerPhone && { label: `Call manager${p.managerName ? ` (${p.managerName})` : ""}`, href: telHref(p.managerPhone) },
    p.maintenancePhone && { label: `Call maintenance${p.maintenanceName ? ` (${p.maintenanceName})` : ""}`, href: telHref(p.maintenancePhone) },
    p.officePhone && { label: "Call leasing office", href: telHref(p.officePhone) },
    p.managerEmail && { label: `Email ${p.managerEmail}`, href: `mailto:${p.managerEmail}` },
    p.maintenanceEmail && { label: `Email ${p.maintenanceEmail}`, href: `mailto:${p.maintenanceEmail}` },
  ].filter(Boolean) as { label: string; href: string }[];
  return (
    <>
      <p style={{ marginBottom: 8 }}>
        <Link href={returnTo}>← Back</Link>
      </p>
      <h1 style={{ marginBottom: 6, overflowWrap: "anywhere" }}>{p.name}</h1>
      <p className="rowMeta" style={{ marginBottom: 12 }}>
        <span className={`pill pill-status-${p.status}`}>{prospectStatusLabel[p.status]}</span>
        <FollowUpPill p={p} today={todayLA()} />
      </p>
      {(calls.length > 0 || addr || p.website) && (
        <div className="quick" aria-label="Contact and directions">
          {calls.map((c) => (
            <a key={c.href} className="btn btnSmall" href={c.href} style={{ overflowWrap: "anywhere" }}>
              {c.label}
            </a>
          ))}
          {p.website && (
            <a className="btn btnSmall" href={p.website} target="_blank" rel="noreferrer">
              Website
            </a>
          )}
          {addr && (
            <a className="btn btnSmall" href={directionsUrl(addr)} target="_blank" rel="noreferrer">
              Directions
            </a>
          )}
        </div>
      )}
      <PropertyForm
        initial={toPropertyFormValues(p)}
        savedStatus={p.geocodeStatus}
        isNew={false}
        returnTo={returnTo}
        action={saveProperty.bind(null, id)}
        deleteFormId="delete-property"
      />
      <form id="delete-property" action={deleteProperty.bind(null, id)} hidden>
        <input type="hidden" name="returnTo" value={returnTo} />
      </form>
    </>
  );
}
