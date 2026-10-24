# V & A Flooring website

Marketing website for V & A Flooring, a family-owned flooring materials and installation
company in Los Angeles (since 1999). Built with Next.js (App Router), TypeScript and CSS
Modules. No UI framework or CSS library.

Before launch, work through **[HANDOFF.md](HANDOFF.md)**: it lists the business details and
configuration that are still missing.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck
```

Node 20.9 or newer. Deploys to Vercel with no extra configuration; set the environment
variables below in the Vercel project settings.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production domain, e.g. `https://www.example.com`. Enables canonical URLs, `sitemap.xml` and indexing. While empty, every page is `noindex` and `robots.txt` disallows crawling, so previews are not indexed. |
| `ESTIMATE_WEBHOOK_URL` | HTTPS endpoint that receives each estimate request as JSON (Zapier, Make, a CRM intake URL, Formspree…). |
| `ESTIMATE_WEBHOOK_SECRET` | Optional. Sent as the `X-Webhook-Secret` header. |
| `RESEND_API_KEY`, `ESTIMATE_EMAIL_TO`, `ESTIMATE_EMAIL_FROM` | Email delivery through Resend. `ESTIMATE_EMAIL_TO` accepts a comma-separated list; the sender must be on a domain verified in Resend. |

The estimate form needs **at least one** delivery destination. With none configured, the API
returns `503` and the form tells the visitor their request was **not** sent. The form never
reports success unless a destination accepted the request.

## Where things live

```
src/
  app/                    Routes (one folder per page), metadata, sitemap, robots, icons
    tokens.css            Brand tokens: color, type scale, spacing (mirrored in lib/brand.ts)
    api/estimate/         Estimate request handler (validation + delivery)
  components/
    brand/                Logo component and generated logo path data
    layout/               Header, mobile menu, footer
    home/                 Homepage sections (some reused on other pages)
    ui/                   Buttons, sections, page hero, figure, steps, lists
    projects/, materials/, contact/
  content/                Editable content and configuration
    site.ts               Business details. null fields are hidden everywhere.
    images.ts             Image manifest (illustrative vs company photography)
    projects.ts           Verified projects (empty until supplied) and property types
    materials.ts          Selection guidance; flooring categories (unpublished)
    navigation.ts         Routes and menus
  lib/                    SEO helpers, structured data, form validation, brand tokens
public/brand/             Logo SVGs and app icons
docs/brand-reference.html Brand reference (logo, color, typography)
design-source/            Scripts that generate the logo, renderings and social image
```

## Common edits

**Add a phone number, email, address or hours.** Fill in `src/content/site.ts`. They appear in
the footer, the estimate page, the call-to-action sections and the structured data
automatically.

**Add a completed project.** Put photographs in `src/assets/images/`, then add an entry to
`projects` in `src/content/projects.ts` with `kind: "company"` images. Optional fields you
leave out are not shown. Adding `story` paragraphs creates a detail page at
`/projects/<slug>`. Filters on the Projects page appear automatically once two or more
property types have projects. The homepage shows the first three projects.

**Replace an illustrative image with real photography.** Swap the import in
`src/content/images.ts`, update the `alt` text and set `kind: "company"`; the
"Illustrative rendering" label disappears.

**Publish flooring categories.** In `src/content/materials.ts`, write a description and set
`published: true` for each category V & A Flooring confirms it stocks or installs.

## Accessibility and quality notes

- Color pairs are checked against WCAG 2.2 AA (ratios are listed in `tokens.css` and the
  brand reference). Brass is never used for text on light backgrounds.
- Skip link, visible focus styles, keyboard-operable mobile menu (focus contained, Escape to
  close), native `<details>` accordion, labelled form fields with inline and summary errors.
- Motion is limited to hover and state changes and is disabled under
  `prefers-reduced-motion`.
- Fonts (Libre Baskerville and Inter, SIL Open Font License) are self-hosted and subset; images
  use `next/image` with blur placeholders and fixed aspect ratios to avoid layout shift.
