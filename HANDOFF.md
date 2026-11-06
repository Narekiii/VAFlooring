# Launch handoff: V & A Flooring

Items below were not supplied, so the site hides or works around them. Nothing on the
public site invents these details. All business details go in `src/content/site.ts`;
configuration goes in environment variables (see `.env.example`).

## Required before launch

- [ ] **Estimate and contact form destination.** Not configured. Both forms share it. Set `ESTIMATE_WEBHOOK_URL`, or
      `RESEND_API_KEY` + `ESTIMATE_EMAIL_TO` + `ESTIMATE_EMAIL_FROM`. Until then the form
      shows "Your request was not sent" and the server logs the missing configuration.
      Send one test request after deploying.
- [x] **Production domain.** Built in as `https://www.vaflooring.la`: sitemap.xml, robots.txt,
      canonical URLs and indexing work with no setup. Set `NEXT_PUBLIC_SITE_URL` only for a different
      domain. Vercel preview deployments stay `noindex`. After launch, submit
      `https://www.vaflooring.la/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
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

- [ ] **Confirm hours and map pin.** Showroom hours (Mon–Fri 8:00 AM–4:00 PM, closed weekends),
      the map coordinates and the Google place ID were taken from the public Google Business
      Profile listing for 10945 Pendleton St. They appear on the Contact page, footer, homepage
      and in structured data. Correct them in `src/content/site.ts` if they differ.
- [ ] **Owner portrait** of Armond Markarian. None was supplied, so none is shown; the
      Our Story page is ready for one.
- [~] **Company photography.** Real photos of the storefront, showroom, design center and
      warehouse are now used (`kind: "company"` in `src/content/images.ts`): homepage hero and
      showroom section, service-page sidebars, Commercial, Materials, Service Areas, Our Story and
      the estimate page. Room scenes (homepage service cards, residential page, project cards,
      service-page heroes) are still illustrative renderings, labelled as such. Replace them with
      real completed-installation photos when available.
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
      trademark note on the Products page. Add logos only with approved assets and
      permission.
- [ ] Services implied in copy are limited to material guidance, supply, installation,
      scheduling and post-installation support. Demolition, furniture moving, subfloor
      repair and disposal are deliberately not mentioned.
- [ ] Drawing and photo uploads are not offered on the form (no secure upload handling).
      The commercial page asks visitors to start with a request so documents can be
      exchanged afterwards.

## Local SEO outside the website (high impact)

- [ ] **Google Business Profile name.** The listing currently shows the name as
      “v&aflooring,inc”. Change it to exactly **V & A Flooring Inc** so the name matches the
      website, structured data and other directories (NAP consistency is a local ranking factor).
- [ ] **Reviews.** The listing has few reviews and a low average. Recent, genuine reviews are one
      of the strongest local-ranking and AI-answer signals. Ask every satisfied customer, reply to
      every review (including negative ones) promptly and professionally. Do not add review
      markup to the website for reviews collected elsewhere; Google ignores self-served ratings.
- [ ] **Google Business Profile**: claim/verify it with exactly this name, address and phone,
      category "Flooring contractor", the five services, the service-area counties and a link
      to the site. This drives Google Maps and "near me" results more than anything on the site.
- [ ] Use the same name, address and phone on Yelp, Bing Places, Apple Business Connect,
      BBB, Houzz and Angi.
- [ ] Ask satisfied customers for Google reviews (the site deliberately shows no invented ones).
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools
      (set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION` to verify).
- [ ] Add the Google Business Profile, Yelp, BBB and Houzz URLs to `sameAs` in
      `src/content/site.ts` once the listings are consistent. This links the entities for search
      engines and AI assistants.

## SEO audit follow-up (November 2026): owner and dashboard actions

These cannot be done from the code. In order of priority:

1. **Domain routing (critical).** The audit saw `https://vaflooring.la` return 503 and `http://vaflooring.la`
   serve a JavaScript redirect to `/lander`. A `/lander` page is typical of a registrar's parking or forwarding
   page, so the bare domain is most likely not pointed at the website host.
   - In the hosting dashboard (e.g. Vercel → Project → Domains) add `vaflooring.la` and set it to
     redirect (308) to `www.vaflooring.la`. Keep `www.vaflooring.la` as the primary domain.
   - At the domain registrar: turn off parking/forwarding for `vaflooring.la` and set the DNS records the
     host shows (for Vercel, usually an A record for the bare domain and a CNAME for `www`). Use the
     values the dashboard gives; do not copy them from elsewhere.
   - The code also redirects `vaflooring.la/*` to `https://www.vaflooring.la/*` in one hop (keeping the
     path and query string) as soon as that domain reaches this deployment.
   - Test afterwards from a phone on mobile data: `http://vaflooring.la/hardwood-flooring-installation`
     should land on `https://www.vaflooring.la/installation/hardwood-flooring`.
2. **Google Search Console and Bing Webmaster Tools.** Verify the domain, submit
   `https://www.vaflooring.la/sitemap.xml`, and use URL Inspection on the homepage and a few service
   pages. Check the "Google-selected canonical" and the excluded-pages report.
3. **Old domain `vaflooringinc.com`.** Public search shows it with the same address and phone, plus
   unrelated content (a granite listing). Confirm who controls it. If you own it and are retiring it,
   point it at this host and redirect each old page to its closest new page (send the old URL list and
   the redirect map can be added to `next.config.ts`). If you don't control it, report the listing.
4. **One consistent business identity everywhere.** Use exactly: V & A Flooring Inc, 10945 Pendleton St,
   Sun Valley, CA 91352, (818) 843-4773, https://www.vaflooring.la, Mon–Fri 8:00 AM–4:00 PM, Sat & Sun by
   reservation. Update Google Business Profile (its name currently reads "v&aflooring,inc"), Bing Places,
   Apple Business Connect, BBB, Yelp, Houzz, Angi and any supplier dealer locators.
   - **BBB** lists 3812 Foothill Blvd, Glendale and an incorporation date of 2002. Update the address. The
     website says the company was *founded* in 1999; if it was *incorporated* in 2002, that is fine (they
     are different facts). Tell us and the site can state both accurately.
5. **Email.** Confirm `Floor@VaFlooring.LA` is a working, monitored mailbox before launch.
6. **Profiles for structured data.** Instagram, Yelp and Google Business Profile are added. Send the other official URLs (BBB,
   Facebook, Instagram, LinkedIn, Houzz). They go into `business.sameAs` in `src/content/site.ts`.
7. **Analytics and lead tracking.** None is installed yet. Choose a tool (e.g. Google Analytics 4 or
   Plausible); successful estimate/contact submissions, phone clicks and directions clicks can then be
   tracked without personal data.

### Content needed (verified information only)

- **3–6 real projects** for `/projects`: city or neighborhood, property type, what was done, flooring
  product, verified size (sq ft or units), the challenge, the outcome, real job photos and, optionally, an
  approved customer quote. Add them in `src/content/projects.ts` with `published: true`. The Projects page
  becomes indexable and joins the sitemap automatically once three case studies are published.
- **City pages** (Sun Valley, Burbank, Glendale) only once each has its own projects and local details;
  otherwise they would be thin "doorway" pages, which search engines penalise.
- **Service details** for the installation pages: what an estimate includes and excludes, whether you
  remove and dispose of old flooring, subfloor leveling and moisture testing, how occupied units are
  scheduled, and the installation workmanship warranty (term and coverage). None of this is on the site
  yet because it has not been confirmed.

## Product catalog (November 2026)

- `/products/catalog`, `/products/brands` and one page per brand are built from the supplied product export by
  `scripts/catalog/transform.py` (run: `python3 -I scripts/catalog/transform.py <VA_Flooring_Products folder> . <Mohawk_Shaw folder>`; the third folder adds Mohawk Flooring and Shaw Floors, with carpet listed one card per style). Re-run it when
  the export is updated, then rebuild.
- Confirm with each manufacturer/distributor that V & A can sell their products before promoting the brand pages.
- Product photos are loaded from the manufacturers' websites. Replace them with V & A-hosted copies (with permission)
  when possible; the cards fall back to "Photo on request" if an image fails.
- After deploy, resubmit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools and request indexing for
  `/products/catalog` and `/products/brands`.
- Brand names are listed as text only. Do not add manufacturer logos without written permission.

## Site structure

- Menu: Products ▾ / Installation ▾ / Why Us / Our Story / Contact Us, plus the Request an Estimate button.
- Homepage order: Introduction → Why Us → How We Do It → What We Do → FAQ → estimate call to action.
- `/products` and `/products/<type>` target buying searches ("hardwood flooring store Los Angeles"):
  types, comparisons, brands and the showroom. Content: `src/content/products.ts`.
- `/installation` and `/installation/<type>`, plus residential and commercial, target installation
  searches. Content: `src/content/services.ts` and `src/content/installation.ts`.
- `/why-us` holds the reasons, commitments, team and all certificates. Content: `src/content/why-us.ts`.
- Old URLs (for example `/hardwood-flooring-installation` and `/flooring-materials`) permanently redirect
  (308) to the new ones; see `next.config.ts`.
- Please confirm: you sell materials on their own to homeowners and contractors (stated on the Products
  page), and the types listed on each product page match what you carry.

## SEO / GEO built into the site

- Unique title (≤ ~64 characters) and meta description (≤ 160) per page, canonical URLs,
  Open Graph and Twitter cards with a real company photo per page.
- Structured data: HomeAndConstructionBusiness + HomeGoodsStore (address, geo, hours, map,
  phone, licenses, service areas down to city level, offer catalog), WebSite, WebPage /
  AboutPage / ContactPage per page, Service per flooring type, FAQPage, BreadcrumbList.
- `sitemap.xml` with last-modified dates and image entries; `robots.txt` that welcomes search
  and AI answer engines (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others).
- `/llms.txt` (summary) and `/llms-full.txt` (all service content and FAQs) for AI assistants.
- Quotable “at a glance” fact tables on the Contact and Our Story pages; answer-first FAQs on
  every service page, the home page, Service Areas and Contact.
- The Projects page is `noindex` and left out of the sitemap until real projects are added,
  so a thin page doesn't dilute the site. It becomes indexable automatically.
- Update `contentUpdated` in `src/content/site.ts` whenever content changes materially.

## Optional hardening

- Add bot protection (for example Cloudflare Turnstile) or a Vercel Firewall rate limit on
  `/api/estimate` if spam appears. A hidden honeypot field is already in place.
- Add analytics only with an appropriate privacy notice.
