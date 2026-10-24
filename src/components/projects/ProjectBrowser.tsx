"use client";

import { useMemo, useState } from "react";
import { categoryLabels, type Project, type ProjectCategory } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectBrowser.module.css";

/** Filterable project grid. Only categories that have projects get a filter; filters hide entirely when fewer than two exist. */
export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const available = useMemo(() => {
    const order = Object.keys(categoryLabels) as ProjectCategory[];
    const present = new Set(projects.map((p) => p.category));
    return order.filter((c) => present.has(c));
  }, [projects]);
  const [active, setActive] = useState<ProjectCategory | "all">("all");
  const shown = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      {available.length > 1 && (
        <div className={styles.filters} role="group" aria-label="Filter projects by property type">
          <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")} className={styles.filter}>
            All projects
          </button>
          {available.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={active === c}
              onClick={() => setActive(c)}
              className={styles.filter}
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>
      )}
      <p className="visually-hidden" aria-live="polite">
        {`Showing ${shown.length} ${shown.length === 1 ? "project" : "projects"}`}
      </p>
      <ul className={styles.grid}>
        {shown.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} headingLevel={2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
