import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { categoryLabels, projectHasDetail, type Project } from "@/content/projects";
import { routes } from "@/content/navigation";
import styles from "./ProjectCard.module.css";

/** Card for a verified project. Fields without verified data are not rendered. */
export function ProjectCard({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const cover = project.photos[0];
  const detail = projectHasDetail(project);
  const facts: [string, string | undefined][] = [
    ["Location", project.location],
    ["Property type", project.propertyType ?? categoryLabels[project.category]],
    ["Flooring", project.flooringMaterial],
    ["Scope", project.scope],
  ];
  const shown = facts.filter((f): f is [string, string] => Boolean(f[1]));
  return (
    <article className={styles.card}>
      {cover && <Figure image={cover} ratio="4 / 3" sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 50vw, 100vw" />}
      <H className={styles.title}>
        {detail ? <Link href={`${routes.projects}/${project.slug}`}>{project.name}</Link> : project.name}
      </H>
      {project.summary && <p className={styles.summary}>{project.summary}</p>}
      {shown.length > 0 && (
        <dl className={styles.facts}>
          {shown.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
