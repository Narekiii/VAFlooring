CREATE TYPE "public"."follow_up_type" AS ENUM('call', 'visit');--> statement-breakpoint
CREATE TYPE "public"."geocode_status" AS ENUM('matched', 'manual', 'unmatched', 'unavailable');--> statement-breakpoint
CREATE TYPE "public"."construction_stage" AS ENUM('planning', 'foundation', 'framing', 'drywall', 'interior', 'finished');--> statement-breakpoint
CREATE TABLE "login_failures" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip_hash" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"project_manager" text,
	"site_supervisor" text,
	"street" text,
	"city" text,
	"state" text,
	"zip" text,
	"office_address" text,
	"email" text,
	"phone" text,
	"stage" "construction_stage",
	"observed_on" date,
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
CREATE INDEX "login_failures_ip_at_idx" ON "login_failures" USING btree ("ip_hash","at");--> statement-breakpoint
CREATE INDEX "projects_follow_up_idx" ON "projects" USING btree ("follow_up_date");--> statement-breakpoint
CREATE INDEX "projects_stage_idx" ON "projects" USING btree ("stage");