import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { business } from "@/content/site";
import { palette } from "@/lib/brand";
import { isIndexable, metadataBase } from "@/lib/seo";
import { jsonLdString, organizationJsonLd } from "@/lib/structured-data";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const baskerville = localFont({
  src: "./fonts/LibreBaskerville-Variable.woff2",
  variable: "--font-baskerville",
  weight: "400 700",
  display: "swap",
  fallback: ["Baskerville", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: `${business.name} | Flooring Materials & Installation in Los Angeles`,
    template: `%s | ${business.name}`,
  },
  description:
    "Family-owned since 1999, V & A Flooring supplies flooring materials and professional installation for homes, ADUs, multifamily, hospitality and commercial projects in Los Angeles.",
  applicationName: business.name,
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: palette.navy,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${inter.variable} ${baskerville.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
