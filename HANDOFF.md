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
- [x] **Phone, address, license** added: (818) 843-4773 · 10945 Pendleton St, Sun Valley, CA 91352 ·
      CSLB #866991 (B, C-15, C-54), bonded & insured. The license was supplied as "#86699"; public
      CSLB records list V & A Flooring Inc at this address as **#866991**. Confirm before launch.
- [ ] **Public email address** (`email`). Hidden until provided.

- [x] **Name** now reads “V & A Flooring Inc” across the site, titles and structured data.
- [ ] **License classifications.** The September 2026 CSLB certified copy lists **C-15 and C-54 only**.
      The site also shows **B (General Building)**, as you supplied and as BuildZoom lists. If B is no
      longer on the license, remove it from `license.classifications` in `src/content/site.ts`.
- [x] **Certificates added** (Our Story page; four on the homepage): CSLB license (2005 and 2026
      certified copy), EPA Lead-Safe Certified Firm NAT-44728-4 (valid to June 19, 2030), three Lowe’s
      recognition certificates (2016, 2016, 2019) and the team photo. The EPA certificate issued to
      “Mafloor & Blinds” was **not** added because it names a different company.
- [ ] The Lowe’s certificates show the Lowe’s logo as printed. Confirm you’re comfortable publishing
      them; a note under the section says the marks belong to their owners and imply no endorsement.

## Recommended

- [ ] **Operating hours** (`hours`), if the business publishes them.
- [ ] **Owner portrait** of Armond Markarian. None was supplied, so none is shown; the
      Our Story page is ready for one.
- [ ] **Company photography.** All current images are original illustrative renderings,
      labelled "Illustrative rendering" on the site. Replace them with real V & A Flooring
      project and crew photos in `src/content/images.ts`.
- [ ] **Verified projects.** `src/content/projects.ts` is empty. Add projects with real
      photos and confirmed details (name, location, property type, material, scope). The
      Projects page switches from property types to a filterable portfolio automatically.
- [x] **Flooring categories** confirmed: hardwood, laminate, vinyl/LVP, carpet, tile. Each has its
      own keyword landing page.
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

## Local SEO outside the website (high impact)

- [ ] **Google Business Profile**: claim/verify it with exactly this name, address and phone,
      category "Flooring contractor", the five services, the service-area counties and a link
      to the site. This drives Google Maps and "near me" results more than anything on the site.
- [ ] Use the same name, address and phone on Yelp, Bing Places, Apple Business Connect,
      BBB, Houzz and Angi.
- [ ] Ask satisfied customers for Google reviews (the site deliberately shows no invented ones).
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Optional hardening

- Add bot protection (for example Cloudflare Turnstile) or a Vercel Firewall rate limit on
  `/api/estimate` if spam appears. A hidden honeypot field is already in place.
- Add analytics only with an appropriate privacy notice.
