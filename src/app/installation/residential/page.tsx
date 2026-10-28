import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FeatureList } from "@/components/ui/FeatureList";
import { MediaSplit } from "@/components/ui/MediaSplit";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Steps } from "@/components/ui/Steps";
import { TextLink } from "@/components/ui/TextLink";
import { Commitments } from "@/components/home/Commitments";
import { publishedServices, serviceHref } from "@/content/services";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { InquiryCta } from "@/components/home/InquiryCta";
import { images } from "@/content/images";
import { estimateFor, routes } from "@/content/navigation";
import { pageMetadata } from "@/lib/seo";

const description =
  "Flooring for LA homes, single rooms and ADUs: hardwood, laminate, LVP, carpet and tile, supplied and installed by one licensed, family-owned company.";

export const metadata = pageMetadata({
  title: "Home Flooring Installation in Los Angeles",
  description,
  path: routes.residential,
});

const homeProjects = [
  {
    title: "Renovating the home you live in",
    body: "Many homeowners stay in their homes while flooring is replaced. We plan the order of rooms and the installation days with you, so you know what to expect each day.",
  },
  {
    title: "Building an ADU",
    body: "We supply and install flooring for accessory dwelling units and coordinate timing with you or your builder, so the floor goes in at the right stage of the project.",
  },
  {
    title: "Updating individual rooms",
    body: "Not every project is a whole house. A bedroom, a living area or one level of a home gets the same material guidance and careful installation.",
  },
];

const process = [
  {
    title: "Material selection",
    body: "We talk through how the room is used, who lives there, the look you want and your budget, then help you narrow the options. You’ll get plain guidance on what each material is suited for and where it isn’t.",
  },
  {
    title: "Project scope discussion",
    body: "We confirm the rooms and areas involved, the condition of the existing floor and what the installation will require. We’re clear about what the estimate includes and what it doesn’t.",
  },
  {
    title: "Installation planning",
    body: "We schedule installation dates with you and explain what to expect on each day, including how to prepare the rooms we’ll be working in.",
  },
  {
    title: "Communication during the work",
    body: "You’ll know who to contact while the work is underway. If something unexpected comes up, we explain it and talk through the options with you before moving ahead.",
  },
  {
    title: "Support after completion",
    body: "When the installation is finished, we stay available. If you have questions about your new floor or notice a concern, contact us and we’ll follow up.",
  },
];

export default function ResidentialPage() {
  return (
    <>
      <PageHero
        description={description}
        kicker="Residential flooring"
        title="Residential Flooring Installation in Los Angeles"
        subtitle="For the spaces you call home."
        image={images.livingWindows}
        crumbs={[
          { name: "Installation", href: routes.installation },
          { name: "Residential Flooring", href: routes.residential },
        ]}
        actions={
          <ButtonLink href={estimateFor.residential} variant="light">
            Discuss Your Home Project
          </ButtonLink>
        }
      >
        <p>
          Hardwood, laminate, vinyl plank, carpet and tile flooring, supplied and installed for homeowners renovating the house they live in,
          building an ADU, or updating a single room. We help you choose a floor that suits how you live, plan the installation around your
          household, and stay reachable after the work is done.
        </p>
      </PageHero>

      <Section tone="white" labelledBy="home-projects">
        <Container>
          <SectionHead id="home-projects" kicker="Home projects" title="Home projects we help with">
            <p>
              From a single room to a new ADU, every home project starts with the same questions: how the space is
              used, what you want it to feel like, and what you want to spend.
            </p>
          </SectionHead>
          <FeatureList items={homeProjects} />
        </Container>
      </Section>

      <Section tone="sand" labelledBy="home-floors">
        <Container>
          <SectionHead id="home-floors" kicker="Flooring for your home" title="Flooring for Los Angeles homes">
            <p>
              The two floors homeowners ask us about most. We’ll help you weigh the look, upkeep and cost of each for the
              rooms you’re updating.
            </p>
          </SectionHead>
          <ServicesGrid headingId="home-floors" only={publishedServices.map(serviceHref)} />
        </Container>
      </Section>

      <Section tone="ivory" labelledBy="process">
        <Container>
          <SectionHead id="process" kicker="How it works" title="How a home flooring project works">
            <p>
              We supply the materials and install them, so one team is responsible from the first conversation through
              the finished floor.
            </p>
          </SectionHead>
          <Steps steps={process} />
        </Container>
      </Section>

      <Section tone="white" labelledBy="adu">
        <Container>
          <MediaSplit image={images.aduKitchen}>
            <p className="kicker">ADUs</p>
            <h2 id="adu">ADU flooring installation</h2>
            <p>
              An ADU is a complete home in a compact footprint, and the same floor often runs from the kitchen through
              the living area and into the bedroom. We help you choose materials that suit the whole unit and schedule
              installation to fit the rest of your build.
            </p>
            <p>
              If you’re working with a builder, we’re glad to coordinate directly with them on timing and site
              readiness.
            </p>
            <TextLink href={estimateFor.adu}>Ask about flooring for your ADU</TextLink>
          </MediaSplit>
        </Container>
      </Section>

      <Commitments title="Our commitments to you" />

      <InquiryCta
        title="Planning a home project?"
        body="Tell us about the rooms, the timing you have in mind and any materials you’re considering. We’ll follow up to talk it through with you; there’s no obligation."
        ctaLabel="Discuss Your Home Project"
        ctaHref={estimateFor.residential}
      />
    </>
  );
}
