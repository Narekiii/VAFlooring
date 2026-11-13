import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // This app lives in crm/ inside the website repository; trace files from here.
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["@electric-sql/pglite"],
  async headers() {
    const security = [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "same-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    // HTTPS only in production (Vercel serves HTTPS and redirects HTTP; HSTS keeps browsers on HTTPS).
    if (process.env.NODE_ENV === "production") security.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" });
    return [{ source: "/:path*", headers: security }];
  },
};

export default nextConfig;
