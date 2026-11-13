import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { PageHead } from "@/components/ui";
import { createJob } from "../actions";
import { jobFormData } from "../data";
import { JobForm } from "../JobForm";

export const metadata = { title: "New job" };

export default async function NewJob({ searchParams }: { searchParams: Promise<{ estimate?: string; account?: string; date?: string; crew?: string }> }) {
  const sp = await searchParams;
  const data = await jobFormData();
  const db = await getDb();
  const estId = Number(sp.estimate) || null;
  const [est] = estId ? await db.select().from(schema.estimates).where(eq(schema.estimates.id, estId)) : [];
  const [prop] = est?.propertyId ? await db.select().from(schema.properties).where(eq(schema.properties.id, est.propertyId)) : [];
  return (
    <>
      <PageHead title="Schedule a job" crumbs={[{ href: "/jobs", label: "Jobs" }]} />
      <div className="card">
        <JobForm
          {...data}
          job={{
            title: est ? `${est.unitLabel ? `${est.unitLabel} – ` : ""}${est.title}` : null,
            estimateId: est?.id ?? null,
            accountId: est?.accountId ?? (Number(sp.account) || null),
            propertyId: est?.propertyId ?? null,
            unitLabel: est?.unitLabel ?? null,
            address: est?.siteAddress ?? prop?.address ?? null,
            scheduledDate: sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : null,
            crewId: Number(sp.crew) || null,
          }}
          action={createJob}
          submitLabel="Create job"
        />
      </div>
    </>
  );
}
