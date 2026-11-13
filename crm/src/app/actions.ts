"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { clearFailures, clientIpHash, credentialsMatch, endSession, isRateLimited, recordFailure, requireAdmin, startSession } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geocode";
import { siteAddress } from "@/lib/labels";
import { ProjectInput, type ProjectFormValues, type SaveState } from "@/lib/project-input";

/* ---------------- Sign in / out ---------------- */

export type LoginState = { error?: string } | undefined;
const GENERIC = "Invalid username or password.";

export async function signIn(_: LoginState, form: FormData): Promise<LoginState> {
  const username = String(form.get("username") ?? "").trim().slice(0, 100);
  const password = String(form.get("password") ?? "").slice(0, 500);
  const ip = await clientIpHash();
  if (await isRateLimited(ip)) return { error: "Too many attempts. Please wait 15 minutes and try again." };
  if (!credentialsMatch(username.toLowerCase(), password)) {
    await recordFailure(ip);
    return { error: GENERIC };
  }
  await clearFailures(ip);
  await startSession();
  redirect("/");
}

export async function signOut() {
  await endSession();
  redirect("/login");
}

/* ---------------- Projects ---------------- */

/** Where to go after saving: only same-site paths. */
const safeReturn = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "");
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : "/";
};

const addressKey = (a: { street: string | null; city: string | null; state: string | null; zip: string | null }) =>
  siteAddress(a).toLowerCase().replace(/\s+/g, " ");

export async function saveProject(id: number | null, _: SaveState, form: FormData): Promise<SaveState> {
  await requireAdmin();
  const raw = Object.fromEntries(form.entries()) as Partial<ProjectFormValues>;
  const parsed = ProjectInput.safeParse({
    ...raw,
    pinEdited: raw.pinEdited ?? "",
    pinSource: raw.pinSource ?? "",
    stage: raw.stage ?? "",
    followUpType: raw.followUpType ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: NonNullable<SaveState>["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof ProjectFormValues;
      if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { error: "Please fix the highlighted fields. Nothing was saved yet.", fieldErrors };
  }
  const v = parsed.data;
  const db = await getDb();
  const [existing] = id ? await db.select().from(schema.projects).where(eq(schema.projects.id, id)) : [];
  if (id && !existing) return { error: "This project no longer exists. It may have been deleted." };

  const addr = siteAddress(v);
  const addressChanged = !existing || addressKey(existing) !== addressKey(v);

  // Map pin: what the person did in the form wins; otherwise a new or changed address is looked up.
  let pin: { latitude: number | null; longitude: number | null; geocodeStatus: (typeof schema.projects.$inferInsert)["geocodeStatus"] };
  if (v.pinEdited === "1") {
    pin =
      v.latitude !== null && v.longitude !== null
        ? { latitude: v.latitude, longitude: v.longitude, geocodeStatus: v.pinSource === "matched" ? "matched" : "manual" }
        : { latitude: null, longitude: null, geocodeStatus: addr ? "unmatched" : null };
  } else if (addressChanged) {
    if (!addr) pin = { latitude: null, longitude: null, geocodeStatus: null };
    else {
      const g = await geocodeAddress(addr);
      pin = g.status === "matched" ? { latitude: g.latitude, longitude: g.longitude, geocodeStatus: "matched" } : { latitude: null, longitude: null, geocodeStatus: g.status };
    }
  } else {
    pin = { latitude: existing!.latitude, longitude: existing!.longitude, geocodeStatus: existing!.geocodeStatus };
  }

  const values = {
    name: v.name,
    company: v.company,
    projectManager: v.projectManager,
    siteSupervisor: v.siteSupervisor,
    street: v.street,
    city: v.city,
    state: v.state,
    zip: v.zip,
    officeAddress: v.officeAddress,
    email: v.email,
    phone: v.phone,
    stage: v.stage,
    observedOn: v.observedOn,
    notes: v.notes,
    followUpType: v.followUpType,
    followUpDate: v.followUpDate,
    ...pin,
  };
  try {
    if (id) await db.update(schema.projects).set({ ...values, updatedAt: new Date() }).where(eq(schema.projects.id, id));
    else await db.insert(schema.projects).values(values);
  } catch {
    return { error: "The project couldn’t be saved. Check your connection and try again." };
  }
  revalidatePath("/", "layout");
  redirect(safeReturn(form.get("returnTo")));
}

export async function deleteProject(id: number, form: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  revalidatePath("/", "layout");
  redirect(safeReturn(form.get("returnTo")));
}

/** Map tab: look up a saved project's address again. */
export async function retryGeocode(id: number) {
  await requireAdmin();
  const db = await getDb();
  const [p] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!p) return;
  const addr = siteAddress(p);
  const g = addr ? await geocodeAddress(addr) : ({ status: "unmatched" } as const);
  await db
    .update(schema.projects)
    .set(
      g.status === "matched"
        ? { latitude: g.latitude, longitude: g.longitude, geocodeStatus: "matched", updatedAt: new Date() }
        : { latitude: null, longitude: null, geocodeStatus: addr ? g.status : null, updatedAt: new Date() },
    )
    .where(eq(schema.projects.id, id));
  revalidatePath("/map");
}

