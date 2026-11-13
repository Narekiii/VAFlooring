import { Field, Select } from "@/components/ui";
import { jobStatusLabel } from "@/lib/format";

type Job = {
  title?: string | null;
  estimateId?: number | null;
  accountId?: number | null;
  propertyId?: number | null;
  unitLabel?: string | null;
  address?: string | null;
  crewId?: number | null;
  scheduledDate?: string | null;
  startTime?: string | null;
  status?: string | null;
  notes?: string | null;
};

export function JobForm({
  job = {},
  accounts,
  properties,
  crews,
  estimates,
  action,
  submitLabel,
}: {
  job?: Job;
  accounts: { id: number; name: string }[];
  properties: { id: number; accountId: number; name: string }[];
  crews: { id: number; name: string }[];
  estimates: { id: number; number: string; title: string }[];
  action: (f: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const accName = (id: number) => accounts.find((a) => a.id === id)?.name ?? "";
  return (
    <form action={action} className="form">
      <Field label="Job title" name="title" defaultValue={job.title} required full placeholder="e.g. Unit 12B – LVP and baseboards" />
      <Field label="Date" name="scheduledDate" type="date" defaultValue={job.scheduledDate} />
      <Field label="Start time" name="startTime" type="time" defaultValue={job.startTime} />
      <Select label="Crew" name="crewId" defaultValue={job.crewId} empty="Not assigned" options={crews.map((c) => ({ value: c.id, label: c.name }))} />
      <Select label="Status" name="status" defaultValue={job.status ?? "scheduled"} options={Object.entries(jobStatusLabel).map(([value, label]) => ({ value, label }))} />
      <Select label="Account" name="accountId" defaultValue={job.accountId} empty="No account" options={accounts.map((a) => ({ value: a.id, label: a.name }))} />
      <Select
        label="Property"
        name="propertyId"
        defaultValue={job.propertyId}
        empty="No property"
        options={properties.map((p) => ({ value: p.id, label: `${accName(p.accountId)} – ${p.name}` }))}
      />
      <Field label="Unit / area" name="unitLabel" defaultValue={job.unitLabel} />
      <Select label="Estimate" name="estimateId" defaultValue={job.estimateId} empty="No estimate" options={estimates.map((e) => ({ value: e.id, label: `${e.number} – ${e.title}` }))} />
      <Field label="Job site address" name="address" defaultValue={job.address} full />
      <Field label="Crew instructions" name="notes" type="textarea" defaultValue={job.notes} full hint="Access, materials staged, what to remove or keep…" />
      <div className="full">
        <button className="btn btnPrimary">{submitLabel}</button>
      </div>
    </form>
  );
}
