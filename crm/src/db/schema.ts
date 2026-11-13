import { date, doublePrecision, index, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const STAGES = ["planning", "foundation", "framing", "drywall", "interior", "finished"] as const;
export const FOLLOW_UP_TYPES = ["call", "visit"] as const;
export const GEOCODE_STATUSES = ["matched", "manual", "unmatched", "unavailable"] as const;

export const stage = pgEnum("construction_stage", STAGES);
export const followUpType = pgEnum("follow_up_type", FOLLOW_UP_TYPES);
export const geocodeStatus = pgEnum("geocode_status", GEOCODE_STATUSES);

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    company: text("company"),
    projectManager: text("project_manager"),
    siteSupervisor: text("site_supervisor"),
    street: text("street"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    officeAddress: text("office_address"),
    email: text("email"),
    phone: text("phone"),
    stage: stage("stage"),
    /** Date-only (Los Angeles calendar date), never shifted by time zones. */
    observedOn: date("observed_on"),
    notes: text("notes"),
    followUpType: followUpType("follow_up_type"),
    followUpDate: date("follow_up_date"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    /** How the pin was set, or why there isn't one. Null = no address yet. */
    geocodeStatus: geocodeStatus("geocode_status"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("projects_follow_up_idx").on(t.followUpDate), index("projects_stage_idx").on(t.stage)],
);

/* ---------- Property management prospects ---------- */

export const PROPERTY_TYPES = ["apartments", "condo_hoa", "single_family", "senior", "student", "mixed_use", "commercial", "other"] as const;
export const PROSPECT_STATUSES = ["new", "contacted", "meeting", "pricing_sent", "customer", "not_interested"] as const;
export const FLOORING_TYPES = ["lvp", "carpet", "laminate", "tile", "hardwood", "sheet_vinyl"] as const;

export const propertyType = pgEnum("property_type", PROPERTY_TYPES);
export const prospectStatus = pgEnum("prospect_status", PROSPECT_STATUSES);

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    managementCompany: text("management_company"),
    propertyType: propertyType("property_type"),
    units: integer("units"),
    street: text("street"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    companyOfficeAddress: text("company_office_address"),
    website: text("website"),
    managerName: text("manager_name"),
    managerPhone: text("manager_phone"),
    managerEmail: text("manager_email"),
    maintenanceName: text("maintenance_name"),
    maintenancePhone: text("maintenance_phone"),
    maintenanceEmail: text("maintenance_email"),
    officePhone: text("office_phone"),
    decisionMaker: text("decision_maker"),
    status: prospectStatus("status").notNull().default("new"),
    /** Flooring in the units, as codes from FLOORING_TYPES. */
    flooring: text("flooring").array(),
    turnoversPerMonth: integer("turnovers_per_month"),
    currentVendor: text("current_vendor"),
    pricingSentOn: date("pricing_sent_on"),
    lastContactOn: date("last_contact_on"),
    notes: text("notes"),
    followUpType: followUpType("follow_up_type"),
    followUpDate: date("follow_up_date"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    geocodeStatus: geocodeStatus("geocode_status"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("properties_follow_up_idx").on(t.followUpDate), index("properties_status_idx").on(t.status)],
);

export type Property = typeof properties.$inferSelect;

/** Failed sign-in attempts, for rate limiting (works across serverless instances). */
export const loginFailures = pgTable(
  "login_failures",
  {
    id: serial("id").primaryKey(),
    /** SHA-256 of the client IP, so raw addresses aren't stored. */
    ipHash: text("ip_hash").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("login_failures_ip_at_idx").on(t.ipHash, t.at)],
);

export type Project = typeof projects.$inferSelect;
