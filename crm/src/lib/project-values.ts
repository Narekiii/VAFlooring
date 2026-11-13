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
