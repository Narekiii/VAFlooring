# V & A Flooring Prospecting (crm.vaflooring.la)

A small internal CRM for job-site prospecting: add a project at the site, record what you saw, set the next call or visit, and find it again on the list, calendar or map. Works on a phone and on a desktop.

- **Stack:** Next.js 16 (App Router, TypeScript), PostgreSQL with Drizzle ORM, Leaflet + OpenStreetMap, U.S. Census Geocoder.
- **Lives in:** the `crm/` folder of the website repository. It is a separate app with its own Vercel project; the website is not affected.
- **Cost:** everything below uses free plans (see [Costs](#costs)).

## Environment variables

| Name | Required | What it is |
|---|---|---|
| `CRM_ADMIN_PASSWORD` | yes | Password for the single administrator account. The username is always `admin`. |
| `SESSION_SECRET` | yes | 32+ random characters used to sign the login cookie. Generate with `openssl rand -base64 48`. Changing it signs everyone out. |
| `DATABASE_URL` | production | PostgreSQL connection string (Neon). Leave unset locally to use the embedded database in `./.data`. |
| `GEOCODER_URL` | no | Only for testing: overrides the Census Geocoder address. |

All of these are read on the server only. None is sent to the browser, written to logs or shown in error messages. Never commit real values; `.env*` files are git-ignored. `.env.example` lists the names.

## Run it locally

```bash
cd crm
npm install
cp .env.example .env.local     # set CRM_ADMIN_PASSWORD and SESSION_SECRET
npm run dev                    # http://localhost:3200
```

Without `DATABASE_URL` the app uses an embedded PostgreSQL (PGlite) in `crm/.data/` and applies the migrations automatically. Delete that folder to start over with an empty list.

## Database and migrations

- The schema is in `src/db/schema.ts` and the SQL migrations are in `drizzle/`.
- `npm run db:migrate` applies the migrations to `DATABASE_URL`. `npm run build` runs it first, so every Vercel deployment migrates the database before the new version goes live.
- After changing the schema, run `npm run db:generate` to create a new migration, then commit it.

Tables:
- `projects`: one row per project, holding the latest observation, one upcoming follow-up and the map pin. Dates are stored as date-only values, as Los Angeles calendar dates.
- `login_failures`: hashed client IPs of failed sign-ins, used for the rate limit (5 failures in 15 minutes blocks that client for 15 minutes).

## Deploy to crm.vaflooring.la (free)

### 1. Create the database (Neon, free)

1. In Vercel, open **Storage → Create Database → Neon (Serverless Postgres)** and choose the **Free** plan, region **US West** (closest to LA).
   (You can also sign up at neon.tech directly and copy the connection string.)
2. Keep the default database. Vercel can add `DATABASE_URL` to the project for you in step 2. If you created it on neon.tech, copy the **pooled** connection string.

### 2. Create the Vercel project

1. Vercel → **Add New… → Project** → import **Narekiii/VAFlooring** (the same repository as the website).
2. **Root Directory:** `crm` (important: this keeps it separate from the website).
3. Framework preset: Next.js (detected). Leave the build command as `npm run build`.
4. **Environment Variables:** add `CRM_ADMIN_PASSWORD`, `SESSION_SECRET` and `DATABASE_URL` (or connect the Neon database from step 1 to this project, which adds `DATABASE_URL`).
5. **Production branch:** `main` (default). The app deploys once this code is merged into `main`.
6. Deploy. Open the `*.vercel.app` address Vercel gives you, sign in with `admin` and your password, and check that it works.

### 3. Add the domain

1. In the CRM project: **Settings → Domains → Add** → `crm.vaflooring.la`.
2. Vercel shows the DNS record to create. For a subdomain it is normally:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `crm` | the target Vercel shows (for example `cname.vercel-dns.com.`, or a project-specific `…vercel-dns.com` value) |

   Use exactly the value Vercel shows on that screen.
3. Where to add it:
   - **If vaflooring.la already uses Vercel's nameservers** (the website's domain is managed in Vercel → Domains), Vercel adds the record itself. Nothing to do.
   - **Otherwise**, add the CNAME at the company where vaflooring.la's DNS is managed (the registrar, or Cloudflare if you use it). With Cloudflare, set the record to **DNS only** (grey cloud) so Vercel can issue the certificate.
4. Wait until Vercel shows **Valid Configuration** (usually minutes). Vercel issues the HTTPS certificate automatically and redirects HTTP to HTTPS. The app also sends an HSTS header and uses `Secure` cookies in production.

## Security notes

- One administrator account: username `admin`, password from `CRM_ADMIN_PASSWORD`, compared on the server in constant time.
- Sessions: a signed (HS256) cookie that expires after 7 days. It is `HttpOnly`, `Secure` in production and `SameSite=Lax`.
- Every page, server action and API route checks the session on the server. Signed-out requests are redirected to the login page; `/api/geocode` returns 401.
- Failed sign-ins are rate-limited, and the message is always "Invalid username or password."
- Address lookups go from the server to the U.S. Census Geocoder with an 8-second timeout. Only the project address is sent.
- Pages are marked `noindex` and can't be embedded in other sites.

## Map pins

- When a project's address is first saved or changed, the server looks it up once and stores the coordinates. Opening the map never triggers a lookup.
- If there's no match, or the lookup service is down, the project is still saved and appears under **Projects without a pin** on the Map tab. From there you can retry the lookup, or open the project and use **Map location** to look the address up again, enter coordinates, or clear the pin.
- Changing the address clears the old pin and looks the new address up.
- Map tiles: © OpenStreetMap contributors, used under the OpenStreetMap tile usage policy (fine for one person's light use).

## Costs

- **Vercel:** the free Hobby plan is meant for personal, non-commercial use. A business tool should run on a paid Pro team, or under the same Vercel plan the website already uses. If the website is already on Pro, adding this project costs nothing extra.
- **Neon:** free plan (0.5 GB storage is far more than this app needs). The database sleeps when idle, so the first request after a quiet period takes about a second longer.
- **U.S. Census Geocoder** and **OpenStreetMap tiles:** free, no API keys.
