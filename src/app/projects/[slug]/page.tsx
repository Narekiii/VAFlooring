import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { InquiryCta } from "@/components/home/InquiryCta";
import { routes } from "@/content/navigation";
import { caseStudies, categoryLabels } from "@/content/projects";
import { getService, serviceHref } from "@/content/services";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

// Detail pages exist only for verified projects with a written story; every other slug is a 404.
export const dynamicParams = false;

const detailed = () => caseStudies;

export function generateStaticParams() {
  return detailed().map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = detailed().find((p) => p.slug === slug);
  if (!project) return {};
  return pageMetadata({
    title: project.name,
    description: project.summary ?? `${project.name}: flooring by V & A Flooring Inc.`,
    path: `${routes.projects}/${project.slug}`,
    image: project.photos[0]
      ? {
          url: project.photos[0].src.src,
          width: project.photos[0].src.width,
          height: project.photos[0].src.height,
          alt: project.photos[0].alt,
        }
      : undefined,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = detailed().find((p) => p.slug === slug);
  if (!project) notFound();
  const facts: [string, string | undefined][] = [
    ["Location", project.location],
    ["Property type", project.propertyType ?? categoryLabels[project.category]],
    ["Flooring", project.flooringMaterial],
    ["Scope", project.scope],
    ["Size", project.scale],
    ["Completed", project.completed],
  ];
  const related = (project.services ?? []).map(getService).filter((x) => x !== undefined);
  const [cover, ...rest] = project.photos;
  return (
    <>
      <PageHero
        title={project.name}
        subtitle={project.summary}
        image={cover}
        description={project.summary}
        crumbs={[
          { name: "Our Projects", href: routes.projects },
          { name: project.name, href: `${routes.projects}/${project.slug}` },
        ]}
      />
      <Section tone="white">
        <Container>
          <div className={styles.layout}>
            <dl className={styles.facts}>
              {facts
                .filter((f): f is [string, string] => Boolean(f[1]))
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            <div className={styles.story}>
              {project.story?.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
              {project.challenge && (
                <>
                  <h2 className={styles.h}>The challenge</h2>
                  <p>{project.challenge}</p>
                </>
              )}
              {project.outcome && (
                <>
                  <h2 className={styles.h}>The outcome</h2>
                  <p>{project.outcome}</p>
                </>
              )}
              {project.testimonial && (
                <blockquote className={styles.quote}>
                  <p>“{project.testimonial.quote}”</p>
                  <footer>{project.testimonial.attribution}</footer>
                </blockquote>
              )}
              {related.length > 0 && (
                <p className={styles.related}>
                  Related services:{" "}
                  {related.map((r, i) => (
                    <span key={r.slug}>
                      {i > 0 && " · "}
                      <Link href={serviceHref(r)}>{r.name}</Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
          {rest.length > 0 && (
            <ul className={styles.gallery}>
              {rest.map((img) => (
                <li key={img.src.src}>
                  <Figure image={img} ratio="3 / 2" sizes="(min-width: 64rem) 38rem, 100vw" />
                </li>
              ))}
            </ul>
          )}
          <p className={styles.back}>
            <TextLink href={routes.projects}>All projects</TextLink>
          </p>
        </Container>
      </Section>
      <InquiryCta />
    </>
  );
}
