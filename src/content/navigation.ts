import { services } from "./services";

export const routes = {
  home: "/",
  residential: "/residential-flooring",
  commercial: "/commercial-multifamily-flooring",
  flooring: "/flooring",
  serviceAreas: "/service-areas",
  projects: "/projects",
  story: "/our-story",
  estimate: "/request-an-estimate",
} as const;

export const serviceLinks = services.map((s) => ({ label: s.name, href: `/${s.slug}` }));

export const primaryNav = [
  { label: "Residential", href: routes.residential },
  { label: "Commercial", href: routes.commercial },
  { label: "Flooring", href: routes.flooring, children: [{ label: "All flooring", href: routes.flooring }, ...serviceLinks] },
  { label: "Projects", href: routes.projects },
  { label: "Our Story", href: routes.story },
] as const;

export type NavItem = { label: string; href: string; children?: readonly { label: string; href: string }[] };

export const estimateCta = { label: "Request an Estimate", href: routes.estimate } as const;

/** Estimate page links that pre-select a project type in the form. */
export const estimateFor = {
  residential: `${routes.estimate}?type=residential`,
  adu: `${routes.estimate}?type=adu`,
  commercial: `${routes.estimate}?type=commercial`,
} as const;

/** Company pages for the footer. */
export const footerNav = [
  { label: "Home", href: routes.home },
  { label: "Residential Flooring", href: routes.residential },
  { label: "Commercial & Multifamily", href: routes.commercial },
  { label: "Flooring Types & Brands", href: routes.flooring },
  { label: "Service Areas", href: routes.serviceAreas },
  { label: "Our Projects", href: routes.projects },
  { label: "Our Story", href: routes.story },
] as const;
