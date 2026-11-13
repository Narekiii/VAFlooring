/**
 * Emergency access: creates (or resets the password of) a team member directly in the database.
 * Usage: DATABASE_URL=... npm run user:add -- "Full Name" email@example.com "temporary-password"
 */
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../src/db/schema";

const [name, email, password] = process.argv.slice(2);
if (!process.env.DATABASE_URL || !name || !email || !password || password.length < 10) {
  console.error('Usage: DATABASE_URL=... npm run user:add -- "Full Name" email@example.com "password (10+ chars)"');
  process.exit(1);
}
const client = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
const db = drizzle(client);
const hash = await bcrypt.hash(password, 12);
const lower = email.toLowerCase();
const [existing] = await db.select().from(users).where(sql`lower(${users.email}) = ${lower}`);
if (existing) {
  await db.update(users).set({ passwordHash: hash, active: true, name }).where(sql`${users.id} = ${existing.id}`);
  console.log(`Password reset for ${lower}.`);
} else {
  await db.insert(users).values({ name, email: lower, passwordHash: hash });
  console.log(`Created ${lower}.`);
}
await client.end();
