import type { Metadata } from "next";
import { business } from "@/content/site";
import type { SiteImage } from "@/content/images";

/** The live domain. Used when NEXT_PUBLIC_SITE_URL is not set. */
export const PRODUCTION_URL = "https://www.vaflooring.la";

/**
 * The site's public origin, used for canonical URLs, the sitemap, robots.txt and structured data.
 *
 * - NEXT_PUBLIC_SITE_URL, when set, always wins (e.g. a different domain).
 * - Vercel preview/development deployments return null, so drafts are never indexed.
 * - Every other build (production) uses PRODUCTION_URL, so the sitemap works with no setup.
 */
export function siteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      return null;
    }
  }
  const env = process.env.VERCEL_ENV;
  if (env === "preview" || env === "development") return null;
  return PRODUCTION_URL;
}

/** Base used to resolve Open Graph image URLs. Falls back to the Vercel deployment URL. */
export function metadataBase(): URL | undefined {
  const url = siteUrl();
  if (url) return new URL(url);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return undefined;
}

export const isIndexable = () => siteUrl() !== null;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Social sharing image; defaults to the site-wide image in src/app/opengraph-image.jpg. */
  image?: SiteImage | { url: string; width: number; height: number; alt: string };
  /** Ask search engines not to index this page (it stays crawlable so links are followed). */
  noindex?: boolean;
};

const toShare = (i: NonNullable<PageMeta["image"]>) =>
  "src" in i ? { url: i.src.src, width: i.src.width, height: i.src.height, alt: i.alt } : i;

const defaultShareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "V & A Flooring Inc: Flooring Expertise. Family Accountability. Since 1999.",
};

/** Per-page metadata with canonical URL (only when the domain is known) and Open Graph data. */
export function pageMetadata({ title, description, path, image = defaultShareImage, noindex }: PageMeta): Metadata {
  const share = toShare(image);
  const base = siteUrl();
  const isHome = path === "/";
  const fullTitle = isHome ? title : `${title} | ${business.name}`;
  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: base ? { canonical: path } : undefined,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: business.name,
      locale: "en_US",
      title: fullTitle,
      description,
      url: base ? path : undefined,
      images: [share],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [share],
    },
  };
}
