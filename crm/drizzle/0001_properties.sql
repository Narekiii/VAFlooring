CREATE TYPE "public"."property_type" AS ENUM('apartments', 'condo_hoa', 'single_family', 'senior', 'student', 'mixed_use', 'commercial', 'other');--> statement-breakpoint
CREATE TYPE "public"."prospect_status" AS ENUM('new', 'contacted', 'meeting', 'pricing_sent', 'customer', 'not_interested');--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"management_company" text,
	"property_type" "property_type",
	"units" integer,
	"street" text,
	"city" text,
	"state" text,
	"zip" text,
	"company_office_address" text,
	"website" text,
	"manager_name" text,
	"manager_phone" text,
	"manager_email" text,
	"maintenance_name" text,
	"maintenance_phone" text,
	"maintenance_email" text,
	"office_phone" text,
	"decision_maker" text,
	"status" "prospect_status" DEFAULT 'new' NOT NULL,
	"flooring" text[],
	"turnovers_per_month" integer,
	"current_vendor" text,
	"pricing_sent_on" date,
	"last_contact_on" date,
	"notes" text,
	"follow_up_type" "follow_up_type",
	"follow_up_date" date,
	"latitude" double precision,
	"longitude" double precision,
	"geocode_status" "geocode_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "properties_follow_up_idx" ON "properties" USING btree ("follow_up_date");--> statement-breakpoint
CREATE INDEX "properties_status_idx" ON "properties" USING btree ("status");