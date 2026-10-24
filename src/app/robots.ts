import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Production (NEXT_PUBLIC_SITE_URL set): allow crawling and point to the sitemap.
 * Anywhere else (previews, local): disallow crawling so drafts are not indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  if (!base) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
