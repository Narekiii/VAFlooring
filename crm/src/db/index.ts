import "server-only";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleLite } from "drizzle-orm/pglite";
import postgres from "postgres";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";

/**
 * Production: Postgres from DATABASE_URL. Local development (no DATABASE_URL): an embedded
 * Postgres (PGlite) stored in ./.data, migrated on first use.
 */
type DB = ReturnType<typeof drizzlePg<typeof schema>>;
const g = globalThis as unknown as { __crmDb?: DB; __crmReady?: Promise<void> };

function make(): DB {
  const url = process.env.DATABASE_URL;
  if (url) {
    const client = postgres(url, { prepare: false, max: 5 });
    return drizzlePg(client, { schema });
  }
  const lite = new PGlite(process.env.PGLITE_DIR ?? "./.data/pglite");
  const db = drizzleLite(lite, { schema });
  g.__crmReady = import("drizzle-orm/pglite/migrator").then(({ migrate }) => migrate(db, { migrationsFolder: "./drizzle" }));
  return db as unknown as DB;
}

/** The database, ready to query (the local embedded one is migrated on first use). */
export async function getDb(): Promise<DB> {
  const db = (g.__crmDb ??= make());
  if (g.__crmReady) await g.__crmReady;
  return db;
}
export { schema };
