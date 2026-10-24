import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { Figure } from "@/components/ui/Figure";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { InquiryCta } from "@/components/home/InquiryCta";
import { images } from "@/content/images";
import { estimateFor, routes } from "@/content/navigation";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Commercial & Multifamily Flooring in Los Angeles",
  description:
    "Flooring materials and installation for general contractors, developers, property managers, hotels and multifamily owners in Los Angeles. More than 20 installation crews, coordinated around your schedule.",
  path: routes.commercial,
});

const capabilities = [
  {
    title: "More than 20 installation crews",
    body: "Installation capacity for multifamily, hospitality and commercial scopes, with crews assigned to match the phasing of your project.",
  },
  {
    title: "Materials and installation from one company",
    body: "Product supply and installation are coordinated by the same team, so the flooring package isn’t handed between separate vendors.",
  },
  {
    title: "Experience across property types",
    body: "Hotels and hospitality properties, multifamily buildings and apartment communities, and large commercial projects.",
  },
  {
    title: "Coordination around your schedule",
    body: "We work with your superintendent or property team to sequence flooring with other trades, occupied units or guest operations.",
  },
  {
    title: "Clear scope discussions",
    body: "We go through areas, quantities, inclusions and exclusions with you before work starts, so everyone is working from the same understanding.",
  },
];

const clients = [
  { title: "General contractors", body: "Flooring scopes coordinated with your schedule, site requirements and the trades around us." },
  { title: "Developers", body: "Material selection and installation planning for multifamily and commercial buildings." },
  { title: "Property managers", body: "Flooring for apartment units and common areas, planned around the residents who live there." },
  { title: "Hospitality operators", body: "Guest rooms, corridors and public areas, scheduled with occupancy and operations in mind." },
  { title: "Multifamily owners", body: "Consistent materials across buildings and phases, with one company responsible for supply and installation." },
];

const types = [
  { title: "Multifamily", text: "Apartment units, corridors, lobbies and amenity spaces.", image: images.lobby },
  { title: "Hospitality", text: "Guest rooms, corridors and public areas in hotels.", image: images.corridorCarpet },
  { title: "Commercial", text: "Offices and other commercial interiors.", image: images.office },
];

export default function CommercialPage() {
  return (
    <>
      <PageHero
        title={"Commercial\u00a0& Multifamily Flooring"}
        subtitle="Experience and capacity for larger projects."
        image={images.corridor}
        actions={<ButtonLink href={estimateFor.commercial}>Discuss a Commercial Project</ButtonLink>}
      >
        <p>
          Flooring materials and installation for general contractors, developers, property managers, hospitality
          operators and multifamily owners. With more than 20 installation crews and materials supplied by one company,
          we plan flooring around your schedule and keep the scope clear from the start.
        </p>
      </PageHero>

      <Section tone="white" labelledBy="capabilities">
        <Container>
          <SectionHead id="capabilities" title="What we bring to a larger project" />
          <FeatureList items={capabilities} />
        </Container>
      </Section>

      <Section tone="navy" labelledBy="drawings">
        <Container>
          <div className={styles.drawings}>
            <h2 id="drawings">Bring us your drawings</h2>
            <div className={styles.drawingsBody}>
              <p>
                Share what you have: drawings, finish schedules and specifications, quantities, and your installation
                timeline. We’ll review the flooring scope with you, ask the questions that affect pricing and
                scheduling, and prepare an estimate.
              </p>
              <ul className={styles.checklist}>
                <li>Drawings and finish schedules</li>
                <li>Specified products or approved equals</li>
                <li>Quantities and areas</li>
                <li>Phasing and installation timeline</li>
              </ul>
              <p className={styles.small}>
                Start with a short request and we’ll arrange the best way to receive your documents.
              </p>
              <div className={styles.actions}>
                <ButtonLink href={estimateFor.commercial} variant="light">
                  Discuss a Commercial Project
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="ivory" labelledBy="clients">
        <Container>
          <SectionHead id="clients" title="Who we work with">
            <p>The same accountability we bring to a homeowner, applied to the pace and coordination of a larger job.</p>
          </SectionHead>
          <FeatureList items={clients} />
        </Container>
      </Section>

      <Section tone="white" labelledBy="types">
        <Container>
          <SectionHead id="types" title="Property types">
            <p>The illustrations below show the kinds of spaces our crews work in.</p>
          </SectionHead>
          <ul className={styles.types}>
            {types.map((t) => (
              <li key={t.title}>
                <Figure image={t.image} ratio="4 / 3" sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 50vw, 100vw" />
                <h3 className={styles.typeTitle}>{t.title}</h3>
                <p className={styles.typeText}>{t.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <InquiryCta
        title="Planning a larger project?"
        body="Tell us about the property, the scope and your schedule. We’ll follow up to review drawings, specifications, quantities and installation timelines with you."
        ctaLabel="Discuss a Commercial Project"
        ctaHref={estimateFor.commercial}
      />
    </>
  );
}
