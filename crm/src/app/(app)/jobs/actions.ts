"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { int, str } from "@/lib/format";

const STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

async function fields(form: FormData) {
  const status = String(form.get("status") ?? "scheduled") as Status;
  const propertyId = int(form.get("propertyId"));
  let accountId = int(form.get("accountId"));
  if (propertyId) {
    // A property always belongs to its account.
    const db = await getDb();
    const [p] = await db.select({ accountId: schema.properties.accountId }).from(schema.properties).where(eq(schema.properties.id, propertyId));
    if (p) accountId = p.accountId;
  }
  const date = str(form.get("scheduledDate"));
  return {
    title: str(form.get("title")) ?? "Flooring job",
    estimateId: int(form.get("estimateId")),
    accountId,
    propertyId,
    unitLabel: str(form.get("unitLabel")),
    address: str(form.get("address")),
    crewId: int(form.get("crewId")),
    scheduledDate: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
    startTime: str(form.get("startTime")),
    status: STATUSES.includes(status) ? status : "scheduled",
    notes: str(form.get("notes")),
  };
}

export async function createJob(form: FormData) {
  await requireUser();
  const db = await getDb();
  const [row] = await db.insert(schema.jobs).values(await fields(form)).returning({ id: schema.jobs.id });
  redirect(`/jobs/${row.id}`);
}

export async function updateJob(id: number, form: FormData) {
  await requireUser();
  const db = await getDb();
  await db.update(schema.jobs).set(await fields(form)).where(eq(schema.jobs.id, id));
  redirect(`/jobs/${id}?saved=1`);
}

export async function setJobStatus(id: number, status: Status) {
  await requireUser();
  if (!STATUSES.includes(status)) return;
  const db = await getDb();
  await db.update(schema.jobs).set({ status }).where(eq(schema.jobs.id, id));
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/schedule");
}

export async function deleteJob(id: number) {
  await requireUser();
  const db = await getDb();
  await db.delete(schema.jobs).where(eq(schema.jobs.id, id));
  redirect("/jobs");
}
