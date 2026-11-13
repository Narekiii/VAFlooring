import { date, doublePrecision, index, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
