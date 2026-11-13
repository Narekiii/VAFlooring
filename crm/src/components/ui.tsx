import Link from "next/link";
import { estimateStatusLabel, jobStatusLabel, stageLabel } from "@/lib/format";

export function PageHead({
  title,
  sub,
  crumbs,
  children,
}: {
  title: string;
  sub?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="pageHead">
      <div>
        {crumbs && (
          <p className="crumbs">
            {crumbs.map((c, i) => (
              <span key={c.href}>
                {i > 0 && " / "}
                <Link href={c.href}>{c.label}</Link>
              </span>
            ))}
          </p>
        )}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="actions">{children}</div>}
    </div>
  );
}

type AnyStatus = keyof typeof stageLabel | keyof typeof estimateStatusLabel | keyof typeof jobStatusLabel;
const labels: Record<string, string> = { ...stageLabel, ...estimateStatusLabel, ...jobStatusLabel };
export function Badge({ status }: { status: AnyStatus }) {
  return <span className={`badge b-${status}`}>{labels[status] ?? status}</span>;
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  hint,
  full,
  placeholder,
  step,
  min,
  prefix = "f",
}: {
  prefix?: string;
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  hint?: string;
  full?: boolean;
  placeholder?: string;
  step?: string;
  min?: string;
}) {
  const id = `${prefix}-${name}`;
  return (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {type === "textarea" ? (
        <textarea id={id} name={name} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} step={step} min={min} />
      )}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  full,
  empty,
}: {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  defaultValue?: string | number | null;
  full?: boolean;
  empty?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} defaultValue={defaultValue == null ? "" : String(defaultValue)}>
        {empty !== undefined && <option value="">{empty}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
