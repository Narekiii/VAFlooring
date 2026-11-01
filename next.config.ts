import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    // Real company photography: deliver at high quality (the default is 75).
    qualities: [75, 90],
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
    // Bare domain -> www, in one hop (also for old URLs). Takes effect once vaflooring.la points at this
    // deployment; the hosting platform upgrades http -> https itself. Query strings are kept.
    const apex = [{ type: "host" as const, value: "vaflooring.la" }];
    const www = "https://www.vaflooring.la";
    return [
      ...moved.map(([source, destination]) => ({ source, has: apex, destination: `${www}${destination}`, permanent: true })),
      { source: "/:path*", has: apex, destination: `${www}/:path*`, permanent: true },
      ...moved.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
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
