import Link from "next/link";
import { saveProperty } from "@/app/actions";
import { PropertyForm } from "@/components/PropertyForm";
import { isIsoDate, todayLA } from "@/lib/dates";
import { emptyPropertyValues } from "@/lib/property-input";
import { safeFrom } from "@/lib/project-values";

export const metadata = { title: "Add property" };

export default async function NewProperty({ searchParams }: { searchParams: Promise<{ date?: string; from?: string }> }) {
  const sp = await searchParams;
  const returnTo = safeFrom(sp.from ?? "/properties");
  const initial = { ...emptyPropertyValues(), lastContactOn: todayLA(), followUpDate: sp.date && isIsoDate(sp.date) ? sp.date : "" };
  return (
    <>
      <p style={{ marginBottom: 8 }}>
        <Link href={returnTo}>← Back</Link>
      </p>
      <h1 style={{ marginBottom: 16 }}>Add property</h1>
      <PropertyForm initial={initial} savedStatus={null} isNew returnTo={returnTo} action={saveProperty.bind(null, null)} />
    </>
  );
}
