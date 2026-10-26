import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "V & A Flooring Inc",
    short_name: "V&A Flooring",
    description: "Flooring materials, showroom and installation in Los Angeles since 1999.",
    lang: "en-US",
    categories: ["business", "shopping"],
    start_url: "/",
    display: "browser",
    background_color: "#F7F4EE",
    theme_color: "#172B3A",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
