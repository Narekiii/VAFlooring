import "server-only";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleLite } from "drizzle-orm/pglite";
import postgres from "postgres";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";

/**
 * Production: PostgreSQL from DATABASE_URL (migrated by `npm run db:migrate`, which `npm run build` runs).
 * Local development without DATABASE_URL: an embedded PostgreSQL (PGlite) in ./.data, migrated on first use.
 */
type DB = ReturnType<typeof drizzlePg<typeof schema>>;
const g = globalThis as unknown as { __db?: DB; __dbReady?: Promise<unknown> };

function make(): DB {
  const url = process.env.DATABASE_URL;
  if (url) return drizzlePg(postgres(url, { prepare: false, max: 1 }), { schema });
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) throw new Error("DATABASE_URL is not set.");
  const db = drizzleLite(new PGlite(process.env.PGLITE_DIR ?? "./.data/pglite"), { schema });
  g.__dbReady = import("drizzle-orm/pglite/migrator").then(({ migrate }) => migrate(db, { migrationsFolder: "./drizzle" }));
  return db as unknown as DB;
}

export async function getDb(): Promise<DB> {
  const db = (g.__db ??= make());
  if (g.__dbReady) await g.__dbReady;
  return db;
}
export { schema };
