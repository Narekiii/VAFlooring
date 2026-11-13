/** Applies database migrations to DATABASE_URL (production). Local development migrates itself. */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("DATABASE_URL not set: skipping migrations (local development uses the embedded database).");
  process.exit(0);
}
const client = postgres(url, { prepare: false, max: 1 });
await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
await client.end();
console.log("Database migrations applied.");
