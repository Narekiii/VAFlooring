import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { ProjectBrowser } from "@/components/projects/ProjectBrowser";
import { PropertyTypeGrid } from "@/components/projects/PropertyTypeGrid";
import { InquiryCta } from "@/components/home/InquiryCta";
import { routes } from "@/content/navigation";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

const description =
  "Flooring projects by V & A Flooring Inc across residential renovations, ADUs, multifamily communities, hotels and commercial spaces in Los Angeles.";

export const metadata = pageMetadata({
  title: "Flooring Projects in Los Angeles",
  description,
  path: routes.projects,
  // Until real project write-ups are published this page has little unique content, so it is kept
  // out of search results (links on it are still followed). It becomes indexable automatically.
  noindex: projects.length === 0,
});

export default function ProjectsPage() {
  const hasProjects = projects.length > 0;
  return (
    <>
      <PageHero
        description={description}
        pageType="CollectionPage"
        kicker="Projects"
        title="Our Projects"
        subtitle="Homes, ADUs, apartment communities, hotels and commercial spaces."
        crumbs={[{ name: "Our Projects", href: routes.projects }]}
      >
        {hasProjects ? (
          <p>A selection of completed V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc projects. Use the filters to see work by property type.</p>
        ) : (
          <p>
            Until project photography is published here, the illustrations below show the property types our crews
            work in. They are renderings, not photographs of specific V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc jobs.
          </p>
        )}
      </PageHero>

      {hasProjects ? (
        <Section tone="white" compact>
          <Container>
            <ProjectBrowser projects={projects} />
          </Container>
        </Section>
      ) : (
        <Section tone="white" labelledBy="property-types">
          <Container>
            <SectionHead id="property-types" kicker="Property types" title="Property types we work in">
              <p>
                If your project resembles one of these, mention it in your request and we can talk through comparable
                work we’ve done.
              </p>
            </SectionHead>
            <PropertyTypeGrid />
          </Container>
        </Section>
      )}

      <InquiryCta />
    </>
  );
}
