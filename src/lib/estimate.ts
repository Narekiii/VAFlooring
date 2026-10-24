/**
 * Estimate request: field options and validation shared by the form (client) and the
 * API route (server), so both apply exactly the same rules.
 */

export const projectTypes = [
  { value: "residential", label: "Home renovation or room update" },
  { value: "adu", label: "ADU" },
  { value: "multifamily", label: "Multifamily or apartment community" },
  { value: "hospitality", label: "Hotel or hospitality" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Something else" },
] as const;

export const serviceOptions = [
  { value: "materials", label: "Materials only" },
  { value: "installation", label: "Installation only" },
  { value: "both", label: "Materials and installation" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "3-6-months", label: "In 3–6 months" },
  { value: "6-plus-months", label: "More than 6 months away" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export type ProjectType = (typeof projectTypes)[number]["value"];
export type Service = (typeof serviceOptions)[number]["value"];
export type Timeline = (typeof timelineOptions)[number]["value"];

export type EstimateRequest = {
  name: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  location: string;
  area?: string;
  timeline?: Timeline;
  service: Service;
  description: string;
};

export type FieldName = keyof EstimateRequest;
export type FieldErrors = Partial<Record<FieldName, string>>;

export const limits = {
  name: 100,
  email: 254,
  phone: 30,
  location: 100,
  area: 30,
  description: 4000,
  descriptionMin: 10,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function oneOf<T extends readonly { value: string }[]>(opts: T, v: string): v is T[number]["value"] {
  return opts.some((o) => o.value === v);
}

export function validateEstimate(input: Record<string, unknown>):
  | { ok: true; value: EstimateRequest }
  | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = str(input.name);
  const email = str(input.email);
  const phone = str(input.phone);
  const projectType = str(input.projectType);
  const location = str(input.location);
  const area = str(input.area);
  const timeline = str(input.timeline);
  const service = str(input.service);
  const description = str(input.description);

  if (!name) errors.name = "Enter your name.";
  else if (name.length > limits.name) errors.name = `Use ${limits.name} characters or fewer.`;

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > limits.email || !EMAIL_RE.test(email))
    errors.email = "Enter an email address in the format name@example.com.";

  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Enter a phone number so we can reach you.";
  else if (digits.length < 10 || digits.length > 15 || phone.length > limits.phone || /[^\d\s()+.\-x]/i.test(phone))
    errors.phone = "Enter a phone number with area code, for example (818) 555-0100.";

  if (!projectType) errors.projectType = "Choose the type of project.";
  else if (!oneOf(projectTypes, projectType)) errors.projectType = "Choose one of the listed project types.";

  if (!location) errors.location = "Enter the project’s city or ZIP code.";
  else if (location.length > limits.location) errors.location = `Use ${limits.location} characters or fewer.`;

  if (area) {
    const n = Number(area.replace(/[,\s]/g, "").replace(/(sq\.?\s*ft\.?|sf|square feet)$/i, ""));
    if (!Number.isFinite(n) || n <= 0 || area.length > limits.area)
      errors.area = "Enter the approximate area as a number of square feet, or leave it blank.";
  }

  if (timeline && !oneOf(timelineOptions, timeline)) errors.timeline = "Choose one of the listed timelines.";

  if (!service) errors.service = "Choose whether you need materials, installation or both.";
  else if (!oneOf(serviceOptions, service)) errors.service = "Choose one of the listed options.";

  if (!description) errors.description = "Tell us a little about the project.";
  else if (description.length < limits.descriptionMin)
    errors.description = "Add a few more details so we understand the project.";
  else if (description.length > limits.description)
    errors.description = `Use ${limits.description.toLocaleString("en-US")} characters or fewer.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      email,
      phone,
      projectType: projectType as ProjectType,
      location,
      area: area || undefined,
      timeline: (timeline || undefined) as Timeline | undefined,
      service: service as Service,
      description,
    },
  };
}

export function labelFor<T extends readonly { value: string; label: string }[]>(opts: T, v?: string): string {
  return opts.find((o) => o.value === v)?.label ?? "";
}

/** Field order used to focus the first invalid field. */
export const fieldOrder: FieldName[] = [
  "name",
  "email",
  "phone",
  "projectType",
  "location",
  "area",
  "timeline",
  "service",
  "description",
];
