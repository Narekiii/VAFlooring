import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PropertyTypeGrid } from "@/components/projects/PropertyTypeGrid";
import { routes } from "@/content/navigation";
import { projects } from "@/content/projects";
import styles from "./FeaturedWork.module.css";

/**
 * Shows verified V & A Flooring projects when they exist. Until then it presents the
 * property types the company serves, with clearly labelled illustrative imagery.
 */
export function FeaturedWork() {
  const featured = projects.slice(0, 3);
  const hasProjects = featured.length > 0;
  return (
    <Section tone="white" labelledBy="work-title">
      <Container>
        <div className={styles.head}>
          <div>
            <p className="kicker">Where we work</p>
            <h2 id="work-title">{hasProjects ? "Featured work" : "The spaces we floor"}</h2>
          </div>
          <p className={styles.intro}>
            {hasProjects
              ? "A selection of recent V\u00a0&\u00a0A Flooring projects across Los Angeles."
              : "Our crews work in occupied homes, new ADUs, apartment communities, hotels and commercial buildings. The illustrations below show these property types; they are not photographs of specific V\u00a0&\u00a0A Flooring projects."}
          </p>
        </div>
        {hasProjects ? (
          <ul className={styles.projects}>
            {featured.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        ) : (
          <PropertyTypeGrid />
        )}
        <div className={styles.more}>
          <TextLink href={routes.projects}>Explore our projects</TextLink>
        </div>
      </Container>
    </Section>
  );
}
