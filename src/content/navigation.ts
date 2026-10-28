import { productHref, products } from "./products";
import { publishedServices, serviceHref } from "./services";

/**
 * Site structure (built around search intent):
 *   /products/*      buying and choosing flooring (store, showroom, brands)
 *   /installation/*  having flooring installed (crews, process, project types)
 *   /why-us, /our-story, /contact, /service-areas, /request-an-estimate
 * Old URLs are permanently redirected in next.config.ts.
 */
export const routes = {
  home: "/",
  products: "/products",
  installation: "/installation",
  residential: "/installation/residential",
  commercial: "/installation/commercial-multifamily",
  whyUs: "/why-us",
  serviceAreas: "/service-areas",
  projects: "/projects",
  story: "/our-story",
  estimate: "/request-an-estimate",
  contact: "/contact",
} as const;

export type NavLink = { label: string; href: string; description?: string; group?: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const productNav: NavLink[] = [
  ...products.map((p) => ({ label: p.name, href: productHref(p), description: p.navText })),
  { label: "All Products & Brands", href: routes.products, description: "Mohawk, Shaw, Engineered Floors and how we help you choose." },
];

export const installationNav: NavLink[] = [
  ...publishedServices.map((s) => ({ label: s.navLabel, href: serviceHref(s), group: "By floor type" })),
  { label: "Residential Flooring", href: routes.residential, group: "By project" },
  { label: "Commercial & Multifamily", href: routes.commercial, group: "By project" },
  { label: "Service Areas", href: routes.serviceAreas, group: "By project" },
  { label: "How We Install", href: routes.installation, group: "By project" },
];

export const primaryNav: NavItem[] = [
  { label: "Products", href: routes.products, children: productNav },
  { label: "Installation", href: routes.installation, children: installationNav },
  { label: "Why Us", href: routes.whyUs },
  { label: "Our Story", href: routes.story },
  { label: "Contact Us", href: routes.contact },
];

export const estimateCta = { label: "Request an Estimate", href: routes.estimate } as const;

/** Estimate page links that pre-select a project type in the form. */
export const estimateFor = {
  residential: `${routes.estimate}?type=residential`,
  adu: `${routes.estimate}?type=adu`,
  commercial: `${routes.estimate}?type=commercial`,
} as const;

export const footerProducts: NavLink[] = [
  ...products.map((p) => ({ label: p.name, href: productHref(p) })),
  { label: "All Products & Brands", href: routes.products },
];

export const footerServices: NavLink[] = [
  ...publishedServices.map((s) => ({ label: s.name, href: serviceHref(s) })),
  { label: "Residential Flooring", href: routes.residential },
  { label: "Commercial & Multifamily Flooring", href: routes.commercial },
  { label: "How We Install", href: routes.installation },
];

export const footerCompany: NavLink[] = [
  { label: "Home", href: routes.home },
  { label: "Why Us", href: routes.whyUs },
  { label: "Our Story", href: routes.story },
  { label: "Service Areas", href: routes.serviceAreas },
  { label: "Our Projects", href: routes.projects },
  { label: "Contact Us", href: routes.contact },
  { label: "Request an Estimate", href: routes.estimate },
];
