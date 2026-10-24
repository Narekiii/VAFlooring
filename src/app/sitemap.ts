import type { MetadataRoute } from "next";
import { routes } from "@/content/navigation";
import { projectHasDetail, projects } from "@/content/projects";
import { publishedServices, serviceHref } from "@/content/services";
import { siteUrl } from "@/lib/seo";

/** Generated only when NEXT_PUBLIC_SITE_URL is set; otherwise an empty sitemap is served. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  const pages: { path: string; priority: number }[] = [
    { path: routes.home, priority: 1 },
    ...publishedServices.map((s) => ({ path: serviceHref(s), priority: 0.95 })),
    { path: routes.residential, priority: 0.9 },
    { path: routes.commercial, priority: 0.9 },
    { path: routes.materials, priority: 0.7 },
    { path: routes.serviceAreas, priority: 0.7 },
    { path: routes.projects, priority: 0.7 },
    { path: routes.story, priority: 0.6 },
    { path: routes.estimate, priority: 0.8 },
    ...projects.filter(projectHasDetail).map((p) => ({ path: `${routes.projects}/${p.slug}`, priority: 0.5 })),
  ];
  return pages.map(({ path, priority }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
