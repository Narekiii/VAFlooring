import type { Metadata } from "next";
import { business } from "@/content/site";

/**
 * The production domain, e.g. "https://www.vaflooring.com".
 * When NEXT_PUBLIC_SITE_URL is not set, canonical URLs and the sitemap are omitted and
 * search engines are asked not to index the site (useful for previews before launch).
 */
export function siteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.origin;
  } catch {
    return null;
  }
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
  image?: { url: string; width: number; height: number; alt: string };
};

const defaultShareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "V & A Flooring Inc: Flooring Expertise. Family Accountability. Since 1999.",
};

/** Per-page metadata with canonical URL (only when the domain is known) and Open Graph data. */
export function pageMetadata({ title, description, path, image = defaultShareImage }: PageMeta): Metadata {
  const base = siteUrl();
  const isHome = path === "/";
  const fullTitle = isHome ? title : `${title} | ${business.name}`;
  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: base ? { canonical: path } : undefined,
    openGraph: {
      type: "website",
      siteName: business.name,
      locale: "en_US",
      title: fullTitle,
      description,
      url: base ? path : undefined,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
