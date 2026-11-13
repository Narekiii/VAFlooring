import Link from "next/link";
import { saveProject } from "@/app/actions";
import { ProjectForm } from "@/components/ProjectForm";
import { isIsoDate, todayLA } from "@/lib/dates";
import { emptyValues } from "@/lib/project-input";
import { safeFrom } from "@/lib/project-values";

export const metadata = { title: "Add project" };

export default async function NewProject({ searchParams }: { searchParams: Promise<{ date?: string; from?: string }> }) {
  const sp = await searchParams;
  const returnTo = safeFrom(sp.from);
  const initial = { ...emptyValues(), observedOn: todayLA(), followUpDate: sp.date && isIsoDate(sp.date) ? sp.date : "" };
  return (
    <>
      <p style={{ marginBottom: 8 }}>
        <Link href={returnTo}>← Back</Link>
      </p>
      <h1 style={{ marginBottom: 16 }}>Add project</h1>
      <ProjectForm initial={initial} savedStatus={null} isNew returnTo={returnTo} action={saveProject.bind(null, null)} />
    </>
  );
}
