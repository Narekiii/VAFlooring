import { Field, Select } from "@/components/ui";
import { stageLabel } from "@/lib/format";

type Lead = {
  name?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  source?: string | null;
  interest?: string | null;
  stage?: string | null;
  valueCents?: number | null;
  nextFollowUp?: string | null;
  accountId?: number | null;
  ownerId?: number | null;
};

export const SOURCES = ["Phone call", "Walk-in", "Website", "Referral", "Property manager outreach", "Lowe’s", "Yelp", "Google", "Instagram", "Other"];

export function LeadForm({
  lead = {},
  accounts,
  users,
  action,
  submitLabel,
}: {
  lead?: Lead;
  accounts: { id: number; name: string }[];
  users: { id: number; name: string }[];
  action: (form: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="form">
      <Field label="Contact name" name="name" defaultValue={lead.name} required />
      <Field label="Company" name="company" defaultValue={lead.company} hint="Property management company, if any" />
      <Field label="Phone" name="phone" type="tel" defaultValue={lead.phone} />
      <Field label="Email" name="email" type="email" defaultValue={lead.email} />
      <Field label="Property / job address" name="address" defaultValue={lead.address} full />
      <Field label="What they need" name="interest" defaultValue={lead.interest} full placeholder="e.g. LVP in 3 vacant units, ~2,400 sq ft" />
      <Select label="Stage" name="stage" defaultValue={lead.stage ?? "new"} options={Object.entries(stageLabel).map(([value, label]) => ({ value, label }))} />
      <Select label="Source" name="source" defaultValue={lead.source} empty="—" options={SOURCES.map((s) => ({ value: s, label: s }))} />
      <Field label="Estimated value ($)" name="value" type="number" step="0.01" min="0" defaultValue={lead.valueCents != null ? (lead.valueCents / 100).toFixed(2) : ""} />
      <Field label="Next follow-up" name="nextFollowUp" type="date" defaultValue={lead.nextFollowUp} />
      <Select label="Account" name="accountId" defaultValue={lead.accountId} empty="Not linked" options={accounts.map((a) => ({ value: a.id, label: a.name }))} />
      <Select label="Owner" name="ownerId" defaultValue={lead.ownerId} empty="Unassigned" options={users.map((u) => ({ value: u.id, label: u.name }))} />
      <div className="full">
        <button className="btn btnPrimary">{submitLabel}</button>
      </div>
    </form>
  );
}
