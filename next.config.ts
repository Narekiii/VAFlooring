import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
  },
  // The site moved to /products/* and /installation/*; keep every old URL working (308 permanent).
  async redirects() {
    const moved: [string, string][] = [
      ["/flooring-materials", "/products"],
      ["/residential-flooring", "/installation/residential"],
      ["/commercial-multifamily-flooring", "/installation/commercial-multifamily"],
      ["/hardwood-flooring-installation", "/installation/hardwood-flooring"],
      ["/laminate-flooring-installation", "/installation/laminate-flooring"],
      ["/lvp-vinyl-flooring-installation", "/installation/lvp-vinyl-flooring"],
      ["/carpet-installation", "/installation/carpet"],
      ["/tile-flooring-installation", "/installation/tile-flooring"],
    ];
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
