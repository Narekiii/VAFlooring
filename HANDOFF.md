# Launch handoff: V & A Flooring

Items below were not supplied, so the site hides or works around them. Nothing on the
public site invents these details. All business details go in `src/content/site.ts`;
configuration goes in environment variables (see `.env.example`).

## Required before launch

- [ ] **Estimate form destination.** Not configured. Set `ESTIMATE_WEBHOOK_URL`, or
      `RESEND_API_KEY` + `ESTIMATE_EMAIL_TO` + `ESTIMATE_EMAIL_FROM`. Until then the form
      shows "Your request was not sent" and the server logs the missing configuration.
      Send one test request after deploying.
- [ ] **Production domain.** Set `NEXT_PUBLIC_SITE_URL`. Until then pages are `noindex`,
      `robots.txt` blocks crawling, the sitemap is empty and canonical URLs are omitted.
- [ ] **Public phone number** (`phone`). Hidden everywhere until provided.
- [ ] **Public email address** (`email`). Hidden until provided.

## Recommended

- [ ] **Office or showroom address** and **operating hours** (`address`, `hours`). Leave
      `null` if the business does not publish them.
- [ ] **Contractor license number** or other credentials (`license`), only if verified and
      approved for publication.
- [ ] **Owner portrait** of Armond Markarian. None was supplied, so none is shown; the
      Our Story page is ready for one.
- [ ] **Company photography.** All current images are original illustrative renderings,
      labelled "Illustrative rendering" on the site. Replace them with real V & A Flooring
      project and crew photos in `src/content/images.ts`.
- [ ] **Verified projects.** `src/content/projects.ts` is empty. Add projects with real
      photos and confirmed details (name, location, property type, material, scope). The
      Projects page switches from property types to a filterable portfolio automatically.
- [ ] **Flooring categories.** Confirm which categories are stocked or installed, then
      publish them in `src/content/materials.ts`.
- [ ] **Social profiles** (`sameAs`) for structured data, if any.

## Please confirm

- [ ] Wording of the Lowe’s line: “Serving Lowe’s installation customers for more than 20
      years.” Text only; no Lowe’s logo is used.
- [ ] Manufacturer references (Mohawk, Shaw, Engineered Floors) are text only, with a
      trademark note on the Materials page. Add logos only with approved assets and
      permission.
- [ ] Services implied in copy are limited to material guidance, supply, installation,
      scheduling and post-installation support. Demolition, furniture moving, subfloor
      repair and disposal are deliberately not mentioned.
- [ ] Drawing and photo uploads are not offered on the form (no secure upload handling).
      The commercial page asks visitors to start with a request so documents can be
      exchanged afterwards.

## Optional hardening

- Add bot protection (for example Cloudflare Turnstile) or a Vercel Firewall rate limit on
  `/api/estimate` if spam appears. A hidden honeypot field is already in place.
- Add analytics only with an appropriate privacy notice.
