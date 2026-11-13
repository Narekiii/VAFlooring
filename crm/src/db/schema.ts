import { relations } from "drizzle-orm";
import { boolean, date, index, integer, numeric, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leadStage = pgEnum("lead_stage", ["new", "contacted", "estimate_sent", "won", "lost"]);
export const estimateStatus = pgEnum("estimate_status", ["draft", "sent", "accepted", "declined"]);
export const jobStatus = pgEnum("job_status", ["scheduled", "in_progress", "completed", "cancelled"]);
export const priceUnit = pgEnum("price_unit", ["sqft", "lf", "each"]);
export const noteEntity = pgEnum("note_entity", ["lead", "account", "estimate", "job"]);

const created = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: created(),
});

/** Property management companies (and other repeat business customers). */
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  notes: text("notes"),
  createdAt: created(),
});

export const contacts = pgTable(
  "contacts",
  {
    id: serial("id").primaryKey(),
    accountId: integer("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    title: text("title"),
    phone: text("phone"),
    email: text("email"),
  },
  (t) => [index("contacts_account_idx").on(t.accountId)],
);

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    accountId: integer("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    address: text("address"),
    units: integer("units"),
    notes: text("notes"),
  },
  (t) => [index("properties_account_idx").on(t.accountId)],
);

/** Price list. accountId null = the standard list; a row with an accountId overrides that item for the account. */
export const priceItems = pgTable(
  "price_items",
  {
    id: serial("id").primaryKey(),
    accountId: integer("account_id").references(() => accounts.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    unit: priceUnit("unit").notNull(),
    rateCents: integer("rate_cents").notNull(),
    sort: integer("sort").notNull().default(0),
    active: boolean("active").notNull().default(true),
  },
  (t) => [index("price_items_account_idx").on(t.accountId)],
);

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    company: text("company"),
    phone: text("phone"),
    email: text("email"),
    address: text("address"),
    source: text("source"),
    interest: text("interest"),
    stage: leadStage("stage").notNull().default("new"),
    valueCents: integer("value_cents"),
    nextFollowUp: date("next_follow_up"),
    accountId: integer("account_id").references(() => accounts.id, { onDelete: "set null" }),
    ownerId: integer("owner_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: created(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_stage_idx").on(t.stage)],
);

export const estimates = pgTable(
  "estimates",
  {
    id: serial("id").primaryKey(),
    number: text("number").notNull().unique(),
    title: text("title").notNull(),
    accountId: integer("account_id").references(() => accounts.id, { onDelete: "set null" }),
    propertyId: integer("property_id").references(() => properties.id, { onDelete: "set null" }),
    leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
    customerName: text("customer_name"),
    siteAddress: text("site_address"),
    unitLabel: text("unit_label"),
    status: estimateStatus("status").notNull().default("draft"),
    notes: text("notes"),
    createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: created(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (t) => [index("estimates_account_idx").on(t.accountId)],
);

export const estimateItems = pgTable(
  "estimate_items",
  {
    id: serial("id").primaryKey(),
    estimateId: integer("estimate_id").notNull().references(() => estimates.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    unit: priceUnit("unit").notNull(),
    qty: numeric("qty", { precision: 12, scale: 2 }).notNull(),
    rateCents: integer("rate_cents").notNull(),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [index("estimate_items_estimate_idx").on(t.estimateId)],
);

export const crews = pgTable("crews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  leadName: text("lead_name"),
  phone: text("phone"),
  active: boolean("active").notNull().default(true),
});

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    estimateId: integer("estimate_id").references(() => estimates.id, { onDelete: "set null" }),
    accountId: integer("account_id").references(() => accounts.id, { onDelete: "set null" }),
    propertyId: integer("property_id").references(() => properties.id, { onDelete: "set null" }),
    unitLabel: text("unit_label"),
    address: text("address"),
    crewId: integer("crew_id").references(() => crews.id, { onDelete: "set null" }),
    scheduledDate: date("scheduled_date"),
    startTime: text("start_time"),
    status: jobStatus("status").notNull().default("scheduled"),
    notes: text("notes"),
    createdAt: created(),
  },
  (t) => [index("jobs_date_idx").on(t.scheduledDate), index("jobs_crew_idx").on(t.crewId)],
);

/** Activity notes on any record. */
export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    entity: noteEntity("entity").notNull(),
    entityId: integer("entity_id").notNull(),
    body: text("body").notNull(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: created(),
  },
  (t) => [index("notes_entity_idx").on(t.entity, t.entityId)],
);

export const accountRelations = relations(accounts, ({ many }) => ({
  contacts: many(contacts),
  properties: many(properties),
}));
export const contactRelations = relations(contacts, ({ one }) => ({ account: one(accounts, { fields: [contacts.accountId], references: [accounts.id] }) }));
export const propertyRelations = relations(properties, ({ one }) => ({ account: one(accounts, { fields: [properties.accountId], references: [accounts.id] }) }));

