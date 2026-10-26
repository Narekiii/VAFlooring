import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** Search and AI-answer crawlers that are explicitly welcome (all others follow the "*" rule). */
const answerEngines = [
  "Googlebot",
  "Bingbot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Applebot-Extended",
  "DuckAssistBot",
];

/**
 * Production (NEXT_PUBLIC_SITE_URL set): allow crawling, including AI search and answer engines,
 * and point to the sitemap. Anywhere else (previews, local): disallow crawling so drafts are not indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  if (!base) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: answerEngines, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
