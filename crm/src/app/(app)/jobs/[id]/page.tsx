import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Badge, PageHead } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Notes } from "@/components/Notes";
import { fmtDate } from "@/lib/format";
import { deleteJob, setJobStatus, updateJob } from "../actions";
import { jobFormData } from "../data";
import { JobForm } from "../JobForm";

export const metadata = { title: "Job" };

export default async function JobPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const id = Number((await params).id);
  const { saved } = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const db = await getDb();
  const [job] = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id));
  if (!job) notFound();
  const data = await jobFormData();
  const crew = job.crewId ? (await db.select().from(schema.crews).where(eq(schema.crews.id, job.crewId)))[0] : undefined;
  const account = data.accounts.find((a) => a.id === job.accountId);
  const property = data.properties.find((p) => p.id === job.propertyId);
  const estimate = data.estimates.find((e) => e.id === job.estimateId);
  const next =
    job.status === "scheduled"
      ? [{ s: "in_progress" as const, l: "Start job" }, { s: "cancelled" as const, l: "Cancel job" }]
      : job.status === "in_progress"
        ? [{ s: "completed" as const, l: "Mark completed" }]
        : [{ s: "scheduled" as const, l: "Reopen" }];
  return (
    <>
      <PageHead
        title={job.title}
        sub={
          <>
            <Badge status={job.status} /> · {fmtDate(job.scheduledDate)}
            {job.startTime ? ` at ${job.startTime}` : ""} · {crew ? crew.name : "No crew assigned"}
          </>
        }
        crumbs={[{ href: "/jobs", label: "Jobs" }]}
      >
        {next.map((n, i) => (
          <form key={n.s} action={setJobStatus.bind(null, id, n.s)}>
            <button className={`btn${i === 0 ? " btnPrimary" : ""}`}>{n.l}</button>
          </form>
        ))}
        {job.scheduledDate && (
          <Link className="btn" href={`/schedule?week=${job.scheduledDate}`}>
            See week
          </Link>
        )}
      </PageHead>
      {saved && (
        <p className="notice" role="status" style={{ marginBottom: 16 }}>
          Job saved.
        </p>
      )}
      <div className="split">
        <div className="stack">
          <section className="card" aria-labelledby="details">
            <h2 id="details">Job details</h2>
            <JobForm {...data} job={job} action={updateJob.bind(null, id)} submitLabel="Save changes" />
          </section>
          <form action={deleteJob.bind(null, id)}>
            <ConfirmButton message={`Delete the job “${job.title}”? This can’t be undone.`}>Delete job</ConfirmButton>
          </form>
        </div>
        <div className="stack">
          <section className="card" aria-labelledby="links">
            <h2 id="links">Linked records</h2>
            <dl className="dl">
              <dt>Account</dt>
              <dd>{account ? <Link href={`/accounts/${account.id}`}>{account.name}</Link> : "—"}</dd>
              <dt>Property</dt>
              <dd>{property?.name ?? "—"}</dd>
              <dt>Estimate</dt>
              <dd>{estimate ? <Link href={`/estimates/${estimate.id}`}>{estimate.number}</Link> : "—"}</dd>
              <dt>Crew lead</dt>
              <dd>
                {crew?.leadName ?? "—"}
                {crew?.phone && (
                  <>
                    {" · "}
                    <a href={`tel:${crew.phone.replace(/[^\d+]/g, "")}`}>{crew.phone}</a>
                  </>
                )}
              </dd>
              <dt>Address</dt>
              <dd>
                {job.address ? (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`} target="_blank" rel="noreferrer">
                    {job.address}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </dl>
          </section>
          <Notes entity="job" id={id} path={`/jobs/${id}`} />
        </div>
      </div>
    </>
  );
}
