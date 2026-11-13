import { Field } from "@/components/ui";

type A = { name?: string | null; phone?: string | null; email?: string | null; address?: string | null; notes?: string | null };

export function AccountForm({ account = {}, action, submitLabel }: { account?: A; action: (f: FormData) => Promise<void>; submitLabel: string }) {
  return (
    <form action={action} className="form">
      <Field label="Company name" name="name" defaultValue={account.name} required full />
      <Field label="Main phone" name="phone" type="tel" defaultValue={account.phone} />
      <Field label="Main email" name="email" type="email" defaultValue={account.email} />
      <Field label="Office address" name="address" defaultValue={account.address} full />
      <Field label="Notes" name="notes" type="textarea" defaultValue={account.notes} full hint="Billing instructions, building access, preferred contact…" />
      <div className="full">
        <button className="btn btnPrimary">{submitLabel}</button>
      </div>
    </form>
  );
}
