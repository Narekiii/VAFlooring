import type { Project } from "@/db/schema";
import type { ProjectFormValues } from "./project-input";

export const toFormValues = (p: Project): ProjectFormValues => ({
  name: p.name,
  company: p.company ?? "",
  projectManager: p.projectManager ?? "",
  siteSupervisor: p.siteSupervisor ?? "",
  street: p.street ?? "",
  city: p.city ?? "",
  state: p.state ?? "",
  zip: p.zip ?? "",
  officeAddress: p.officeAddress ?? "",
  email: p.email ?? "",
  phone: p.phone ?? "",
  stage: p.stage ?? "",
  observedOn: p.observedOn ?? "",
  notes: p.notes ?? "",
  followUpType: p.followUpType ?? "",
  followUpDate: p.followUpDate ?? "",
  latitude: p.latitude != null ? String(p.latitude) : "",
  longitude: p.longitude != null ? String(p.longitude) : "",
  pinEdited: "",
  pinSource: "",
});

/** Only same-site paths are allowed as the page to return to. */
export const safeFrom = (s: string | undefined) => (s && s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : "/");

import type { Property } from "@/db/schema";
import type { PropertyFormValues } from "./property-input";

export const toPropertyFormValues = (p: Property): PropertyFormValues => ({
  name: p.name,
  managementCompany: p.managementCompany ?? "",
  propertyType: p.propertyType ?? "",
  units: p.units != null ? String(p.units) : "",
  street: p.street ?? "",
  city: p.city ?? "",
  state: p.state ?? "",
  zip: p.zip ?? "",
  companyOfficeAddress: p.companyOfficeAddress ?? "",
  website: p.website ?? "",
  managerName: p.managerName ?? "",
  managerPhone: p.managerPhone ?? "",
  managerEmail: p.managerEmail ?? "",
  maintenanceName: p.maintenanceName ?? "",
  maintenancePhone: p.maintenancePhone ?? "",
  maintenanceEmail: p.maintenanceEmail ?? "",
  officePhone: p.officePhone ?? "",
  decisionMaker: p.decisionMaker ?? "",
  status: p.status,
  flooring: p.flooring ?? [],
  turnoversPerMonth: p.turnoversPerMonth != null ? String(p.turnoversPerMonth) : "",
  currentVendor: p.currentVendor ?? "",
  pricingSentOn: p.pricingSentOn ?? "",
  lastContactOn: p.lastContactOn ?? "",
  notes: p.notes ?? "",
  followUpType: p.followUpType ?? "",
  followUpDate: p.followUpDate ?? "",
  latitude: p.latitude != null ? String(p.latitude) : "",
  longitude: p.longitude != null ? String(p.longitude) : "",
  pinEdited: "",
  pinSource: "",
});
