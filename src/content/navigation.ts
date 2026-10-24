import { publishedServices, serviceHref } from "./services";

export const routes = {
  home: "/",
  residential: "/residential-flooring",
  commercial: "/commercial-multifamily-flooring",
  materials: "/flooring-materials",
  serviceAreas: "/service-areas",
  projects: "/projects",
  story: "/our-story",
  estimate: "/request-an-estimate",
} as const;

export type NavLink = { label: string; href: string; description?: string };
export type NavItem = NavLink & { children?: NavLink[] };

const serviceChildren: NavLink[] = publishedServices.map((s) => ({
  label: s.name,
  href: serviceHref(s),
  description: s.cardText,
}));

export const primaryNav: NavItem[] = [
  {
    label: "Flooring",
    href: routes.materials,
    children: [
      ...serviceChildren,
      { label: "Materials & Brands", href: routes.materials, description: "Mohawk, Shaw, Engineered Floors and how we help you choose." },
    ],
  },
  { label: "Residential", href: routes.residential },
  { label: "Commercial", href: routes.commercial },
  { label: "Projects", href: routes.projects },
  { label: "Service Areas", href: routes.serviceAreas },
  { label: "Our Story", href: routes.story },
];

export const estimateCta = { label: "Request an Estimate", href: routes.estimate } as const;

/** Estimate page links that pre-select a project type in the form. */
export const estimateFor = {
  residential: `${routes.estimate}?type=residential`,
  adu: `${routes.estimate}?type=adu`,
  commercial: `${routes.estimate}?type=commercial`,
} as const;

export const footerServices: NavLink[] = [
  ...publishedServices.map((s) => ({ label: s.name, href: serviceHref(s) })),
  { label: "Residential Flooring", href: routes.residential },
  { label: "Commercial & Multifamily Flooring", href: routes.commercial },
];

export const footerCompany: NavLink[] = [
  { label: "Home", href: routes.home },
  { label: "Materials & Brands", href: routes.materials },
  { label: "Service Areas", href: routes.serviceAreas },
  { label: "Our Projects", href: routes.projects },
  { label: "Our Story", href: routes.story },
  { label: "Request an Estimate", href: routes.estimate },
];
