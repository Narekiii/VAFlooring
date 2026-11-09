import type { MetadataRoute } from "next";
import { images, type SiteImage } from "@/content/images";
import { routes } from "@/content/navigation";
import { caseStudies, projectsIndexable } from "@/content/projects";
import { productHref, products } from "@/content/products";
import { brandHref, catalog } from "@/content/catalog";
import { publishedServices, serviceHref } from "@/content/services";
import { contentUpdated } from "@/content/site";
import { siteUrl } from "@/lib/seo";

/** Generated only when NEXT_PUBLIC_SITE_URL is set; otherwise an empty sitemap is served. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  const img = (...list: SiteImage[]) => list.filter((i) => i.kind === "company").map((i) => `${base}${i.src.src}`);
  const pages: { path: string; priority: number; images?: string[]; updated?: string }[] = [
    { path: routes.home, priority: 1, images: img(images.showroomAisle, images.building, images.founder, images.team, images.storefront, images.showroomSelection, images.designCenter, images.warehouse) },
    { path: routes.products, priority: 0.9, images: img(images.showroomSelection, images.warehouse, images.showroomTile) },
    ...products.map((p) => ({ path: productHref(p), priority: 0.9, images: img(p.showroomImage) })),
    { path: routes.catalog, priority: 0.8, updated: catalog.asOf },
    { path: routes.brands, priority: 0.8, images: img(images.showroomSelection), updated: catalog.asOf },
    ...catalog.brands.map((b) => ({ path: brandHref(b.slug), priority: 0.6, updated: catalog.asOf })),
    { path: routes.installation, priority: 0.9, images: img(images.warehouse, images.storefront) },
    ...publishedServices.map((s) => ({ path: serviceHref(s), priority: 0.9, images: img(s.detailImage) })),
    { path: routes.residential, priority: 0.8 },
    { path: routes.commercial, priority: 0.8, images: img(images.warehouse) },
    { path: routes.whyUs, priority: 0.8, images: img(images.storefront, images.team) },
    { path: routes.serviceAreas, priority: 0.8, images: img(images.storefront) },
    { path: routes.contact, priority: 0.8, images: img(images.storefront) },
    { path: routes.estimate, priority: 0.7, images: img(images.storefront) },
    { path: routes.story, priority: 0.6, images: img(images.founder, images.designCenter) },
    // The projects index is listed only once real projects are published (see projects/page.tsx).
    ...(projectsIndexable ? [{ path: routes.projects, priority: 0.7 }] : []),
    ...caseStudies.map((p) => ({ path: `${routes.projects}/${p.slug}`, priority: 0.6, images: img(...p.photos) })),
  ];
  return pages.map(({ path, priority, images: list, updated }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: updated && updated > contentUpdated ? updated : contentUpdated,
    changeFrequency: "monthly",
    priority,
    ...(list && list.length ? { images: list } : {}),
  }));
}
