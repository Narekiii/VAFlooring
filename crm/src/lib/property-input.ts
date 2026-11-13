import { z } from "zod";
import { FLOORING_TYPES, FOLLOW_UP_TYPES, PROPERTY_TYPES, PROSPECT_STATUSES } from "@/db/schema";
import { isIsoDate } from "./dates";

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .transform((s) => (s === "" ? null : s));
const email = z
  .string()
  .trim()
  .max(200)
  .refine((s) => s === "" || z.email().safeParse(s).success, "Enter a valid email address.")
  .transform((s) => (s === "" ? null : s));
const optionalDate = z
  .string()
  .trim()
  .refine((s) => s === "" || isIsoDate(s), "Enter a valid date.")
  .transform((s) => (s === "" ? null : s));
const count = (max: number) =>
  z
    .string()
    .trim()
    .refine((s) => s === "" || (/^\d+$/.test(s) && Number(s) <= max), `Enter a whole number up to ${max.toLocaleString("en-US")}.`)
    .transform((s) => (s === "" ? null : Number(s)));
const coord = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .refine((s) => s === "" || (Number.isFinite(Number(s)) && Number(s) >= min && Number(s) <= max), `Enter a ${label} between ${min} and ${max}.`)
    .transform((s) => (s === "" ? null : Number(s)));

/** Server-side validation for the property form. Only the property name is required. */
export const PropertyInput = z
  .object({
    name: z.string().trim().min(1, "Enter a property name.").max(200, "Keep the property name under 200 characters."),
    managementCompany: text(200),
    propertyType: z.enum(["", ...PROPERTY_TYPES]).transform((s) => (s === "" ? null : s)),
    units: count(100000),
    street: text(200),
    city: text(100),
    state: text(30),
    zip: z
      .string()
      .trim()
      .refine((s) => s === "" || /^\d{5}(-\d{4})?$/.test(s), "Enter a 5-digit ZIP code.")
      .transform((s) => (s === "" ? null : s)),
    companyOfficeAddress: text(300),
    website: z
      .string()
      .trim()
      .max(300)
      .refine((s) => s === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(s), "Enter a web address like example.com.")
      .transform((s) => (s === "" ? null : /^https?:\/\//i.test(s) ? s : `https://${s}`)),
    managerName: text(120),
    managerPhone: text(40),
    managerEmail: email,
    maintenanceName: text(120),
    maintenancePhone: text(40),
    maintenanceEmail: email,
    officePhone: text(40),
    decisionMaker: text(200),
    status: z.enum(PROSPECT_STATUSES),
    flooring: z.array(z.enum(FLOORING_TYPES)).max(FLOORING_TYPES.length),
    turnoversPerMonth: count(10000),
    currentVendor: text(200),
    pricingSentOn: optionalDate,
    lastContactOn: optionalDate,
    notes: text(10000),
    followUpType: z.enum(["", ...FOLLOW_UP_TYPES]).transform((s) => (s === "" ? null : s)),
    followUpDate: optionalDate,
    latitude: coord(-90, 90, "latitude"),
    longitude: coord(-180, 180, "longitude"),
    pinEdited: z.enum(["", "1"]),
    pinSource: z.enum(["", "matched", "manual"]),
  })
  .superRefine((v, ctx) => {
    if (v.followUpDate && !v.followUpType) ctx.addIssue({ code: "custom", path: ["followUpType"], message: "Choose Call or Visit." });
    if (v.followUpType && !v.followUpDate) ctx.addIssue({ code: "custom", path: ["followUpDate"], message: "Pick a follow-up date, or clear the follow-up." });
    if ((v.latitude === null) !== (v.longitude === null)) ctx.addIssue({ code: "custom", path: ["latitude"], message: "Enter both latitude and longitude, or neither." });
  });

type Input = z.input<typeof PropertyInput>;
export type PropertyFormValues = { [K in Exclude<keyof Input, "flooring">]: string } & { flooring: string[] };

export const emptyPropertyValues = (): PropertyFormValues => ({
  name: "",
  managementCompany: "",
  propertyType: "",
  units: "",
  street: "",
  city: "",
  state: "CA",
  zip: "",
  companyOfficeAddress: "",
  website: "",
  managerName: "",
  managerPhone: "",
  managerEmail: "",
  maintenanceName: "",
  maintenancePhone: "",
  maintenanceEmail: "",
  officePhone: "",
  decisionMaker: "",
  status: "new",
  flooring: [],
  turnoversPerMonth: "",
  currentVendor: "",
  pricingSentOn: "",
  lastContactOn: "",
  notes: "",
  followUpType: "",
  followUpDate: "",
  latitude: "",
  longitude: "",
  pinEdited: "",
  pinSource: "",
});

export type PropertySaveState = { error?: string; fieldErrors?: Partial<Record<keyof PropertyFormValues, string>> } | undefined;
