import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { business } from "@/content/site";
import { palette } from "@/lib/brand";
import { isIndexable, metadataBase } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});


export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: `${business.name} | Hardwood & Laminate Flooring Installation in Los Angeles`,
    template: `%s | ${business.name}`,
  },
  description:
    "Family-owned flooring contractor and showroom in Sun Valley since 1999. Hardwood, laminate, LVP, carpet and tile supply and installation across Los Angeles.",
  applicationName: business.name,
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  category: "Flooring contractor",
  // Search Console / Bing Webmaster verification, set in the hosting environment.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
  // Local signals for the showroom location.
  other: {
    "geo.region": "US-CA",
    "geo.placename": "Sun Valley, Los Angeles",
    ...(business.geo
      ? {
          "geo.position": `${business.geo.latitude};${business.geo.longitude}`,
          ICBM: `${business.geo.latitude}, ${business.geo.longitude}`,
        }
      : {}),
  },
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: palette.navy,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={inter.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
