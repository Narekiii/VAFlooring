import { z } from "zod";
import { FOLLOW_UP_TYPES, STAGES } from "@/db/schema";
import { isIsoDate } from "./dates";

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .transform((s) => (s === "" ? null : s));
const optionalDate = z
  .string()
  .trim()
  .refine((s) => s === "" || isIsoDate(s), "Enter a valid date.")
  .transform((s) => (s === "" ? null : s));
const coord = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .refine((s) => s === "" || (Number.isFinite(Number(s)) && Number(s) >= min && Number(s) <= max), `Enter a ${label} between ${min} and ${max}.`)
    .transform((s) => (s === "" ? null : Number(s)));

/** Server-side validation for the project form. Only the project name is required. */
export const ProjectInput = z
  .object({
    name: z.string().trim().min(1, "Enter a project name.").max(200, "Keep the project name under 200 characters."),
    company: text(200),
    projectManager: text(120),
    siteSupervisor: text(120),
    street: text(200),
    city: text(100),
    state: text(30),
    zip: z
      .string()
      .trim()
      .refine((s) => s === "" || /^\d{5}(-\d{4})?$/.test(s), "Enter a 5-digit ZIP code.")
      .transform((s) => (s === "" ? null : s)),
    officeAddress: text(300),
    email: z
      .string()
      .trim()
      .max(200)
      .refine((s) => s === "" || z.email().safeParse(s).success, "Enter a valid email address.")
      .transform((s) => (s === "" ? null : s)),
    phone: text(40),
    stage: z.enum(["", ...STAGES]).transform((s) => (s === "" ? null : s)),
    observedOn: optionalDate,
    notes: text(5000),
    followUpType: z.enum(["", ...FOLLOW_UP_TYPES]).transform((s) => (s === "" ? null : s)),
    followUpDate: optionalDate,
    latitude: coord(-90, 90, "latitude"),
    longitude: coord(-180, 180, "longitude"),
    /** "1" when the person edited, looked up or cleared the pin in this form. */
    pinEdited: z.enum(["", "1"]),
    /** How the pin in the form was set: "matched" (address lookup) or "manual". */
    pinSource: z.enum(["", "matched", "manual"]),
  })
  .superRefine((v, ctx) => {
    if (v.followUpDate && !v.followUpType) ctx.addIssue({ code: "custom", path: ["followUpType"], message: "Choose Call or Visit." });
    if (v.followUpType && !v.followUpDate) ctx.addIssue({ code: "custom", path: ["followUpDate"], message: "Pick a follow-up date, or clear the follow-up." });
    if ((v.latitude === null) !== (v.longitude === null)) ctx.addIssue({ code: "custom", path: ["latitude"], message: "Enter both latitude and longitude, or neither." });
  });

export type ProjectFormValues = Record<keyof z.input<typeof ProjectInput>, string>;

export const emptyValues = (): ProjectFormValues => ({
  name: "",
  company: "",
  projectManager: "",
  siteSupervisor: "",
  street: "",
  city: "",
  state: "CA",
  zip: "",
  officeAddress: "",
  email: "",
  phone: "",
  stage: "",
  observedOn: "",
  notes: "",
  followUpType: "",
  followUpDate: "",
  latitude: "",
  longitude: "",
  pinEdited: "",
  pinSource: "",
});

export type SaveState = { error?: string; fieldErrors?: Partial<Record<keyof ProjectFormValues, string>> } | undefined;
