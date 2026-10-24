export const routes = {
  home: "/",
  residential: "/residential-flooring",
  commercial: "/commercial-multifamily-flooring",
  materials: "/flooring-materials",
  projects: "/projects",
  story: "/our-story",
  estimate: "/request-an-estimate",
} as const;

export const primaryNav = [
  { label: "Residential", href: routes.residential },
  { label: "Commercial", href: routes.commercial },
  { label: "Materials", href: routes.materials },
  { label: "Projects", href: routes.projects },
  { label: "Our Story", href: routes.story },
] as const;

export const estimateCta = { label: "Request an Estimate", href: routes.estimate } as const;

/** Estimate page links that pre-select a project type in the form. */
export const estimateFor = {
  residential: `${routes.estimate}?type=residential`,
  adu: `${routes.estimate}?type=adu`,
  commercial: `${routes.estimate}?type=commercial`,
} as const;

/** Full page names for the footer. */
export const footerNav = [
  { label: "Home", href: routes.home },
  { label: "Residential Flooring", href: routes.residential },
  { label: "Commercial & Multifamily", href: routes.commercial },
  { label: "Materials & Brands", href: routes.materials },
  { label: "Our Projects", href: routes.projects },
  { label: "Our Story", href: routes.story },
] as const;
