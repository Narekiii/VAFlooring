import type { MetadataRoute } from "next";
import { images, type SiteImage } from "@/content/images";
import { routes } from "@/content/navigation";
import { projectHasDetail, projects } from "@/content/projects";
import { publishedServices, serviceHref } from "@/content/services";
import { contentUpdated } from "@/content/site";
import { siteUrl } from "@/lib/seo";

/** Generated only when NEXT_PUBLIC_SITE_URL is set; otherwise an empty sitemap is served. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  const img = (...list: SiteImage[]) => list.filter((i) => i.kind === "company").map((i) => `${base}${i.src.src}`);
  const pages: { path: string; priority: number; images?: string[] }[] = [
    { path: routes.home, priority: 1, images: img(images.showroomAisle, images.storefront, images.showroomSelection, images.designCenter, images.warehouse) },
    ...publishedServices.map((s) => ({ path: serviceHref(s), priority: 0.95, images: img(s.detailImage) })),
    { path: routes.residential, priority: 0.9 },
    { path: routes.commercial, priority: 0.9, images: img(images.warehouse) },
    { path: routes.materials, priority: 0.8, images: img(images.showroomSelection, images.showroomTile) },
    { path: routes.serviceAreas, priority: 0.8, images: img(images.storefront) },
    { path: routes.contact, priority: 0.8, images: img(images.storefront) },
    { path: routes.estimate, priority: 0.8, images: img(images.storefront) },
    { path: routes.story, priority: 0.6, images: img(images.designCenter) },
    // The projects index is listed only once real projects are published (see projects/page.tsx).
    ...(projects.length > 0 ? [{ path: routes.projects, priority: 0.6 }] : []),
    ...projects.filter(projectHasDetail).map((p) => ({ path: `${routes.projects}/${p.slug}`, priority: 0.5 })),
  ];
  return pages.map(({ path, priority, images: list }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: contentUpdated,
    changeFrequency: "monthly",
    priority,
    ...(list && list.length ? { images: list } : {}),
  }));
}
