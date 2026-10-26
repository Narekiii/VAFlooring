/**
 * General contact message: options and validation shared by the contact form (client)
 * and /api/contact (server).
 */

export const contactTopics = [
  { value: "question", label: "A question about flooring or installation" },
  { value: "showroom", label: "Visiting the showroom" },
  { value: "trade", label: "Contractor, architect or trade inquiry" },
  { value: "existing", label: "A project we’re already working on" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["value"];

export type ContactMessage = {
  name: string;
  email: string;
  phone?: string;
  topic: ContactTopic;
  message: string;
};

export type ContactField = keyof ContactMessage;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const contactLimits = { name: 100, email: 254, phone: 30, message: 4000, messageMin: 10 } as const;

export const contactFieldOrder: ContactField[] = ["name", "email", "phone", "topic", "message"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateContact(input: Record<string, unknown>):
  | { ok: true; value: ContactMessage }
  | { ok: false; errors: ContactErrors } {
  const errors: ContactErrors = {};
  const name = str(input.name);
  const email = str(input.email);
  const phone = str(input.phone);
  const topic = str(input.topic);
  const message = str(input.message);

  if (!name) errors.name = "Enter your name.";
  else if (name.length > contactLimits.name) errors.name = `Use ${contactLimits.name} characters or fewer.`;

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > contactLimits.email || !EMAIL_RE.test(email))
    errors.email = "Enter an email address in the format name@example.com.";

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15 || phone.length > contactLimits.phone || /[^\d\s()+.\-x]/i.test(phone))
      errors.phone = "Enter a phone number with area code, or leave it blank.";
  }

  if (!topic) errors.topic = "Choose what your message is about.";
  else if (!contactTopics.some((t) => t.value === topic)) errors.topic = "Choose one of the listed topics.";

  if (!message) errors.message = "Enter your message.";
  else if (message.length < contactLimits.messageMin) errors.message = "Add a few more details so we can help.";
  else if (message.length > contactLimits.message)
    errors.message = `Use ${contactLimits.message.toLocaleString("en-US")} characters or fewer.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { name, email, phone: phone || undefined, topic: topic as ContactTopic, message } };
}

export const topicLabel = (v: string) => contactTopics.find((t) => t.value === v)?.label ?? "";
