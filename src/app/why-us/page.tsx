import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MediaSplit } from "@/components/ui/MediaSplit";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { Credentials } from "@/components/credentials/Credentials";
import { Commitments } from "@/components/home/Commitments";
import { FaqSection } from "@/components/home/FaqSection";
import { InquiryCta } from "@/components/home/InquiryCta";
import { LowesNote } from "@/components/home/LowesNote";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import type { Faq } from "@/content/services";
import { business, facts, licenseLine, regionLine } from "@/content/site";
import { reasons } from "@/content/why-us";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const description =
  "Why LA homeowners and contractors choose V & A Flooring Inc: one company for materials and installation, 20+ in-house crews, licensed and family owned since 1999.";

export const metadata = pageMetadata({
  title: "Why Choose Our LA Flooring Company",
  description,
  path: routes.whyUs,
  image: images.storefront,
});

const clients = [
  "Homeowners",
  "ADU builders",
  "General contractors and developers",
  "Property managers and apartment communities",
  "Hotels and hospitality operators",
  "Commercial clients",
];

const faqs: Faq[] = [
  {
    q: "What makes V & A Flooring Inc different from a flooring store?",
    a: `We sell flooring and install it with our own crews, so the same company is responsible for the product, the order and the installation. A store that only sells materials leaves installation to someone else.`,
  },
  {
    q: "Is V & A Flooring Inc an EPA Lead-Safe Certified Firm?",
    a: `Yes. ${business.name} is a U.S. EPA Lead-Safe Certified Firm, certification ${business.epaLeadSafe}.`,
  },
  {
    q: "Who owns V & A Flooring Inc?",
    a: `${business.name} is family owned. It was founded in ${business.founded} by ${business.founder}, a flooring installer.`,
  },
  {
    q: "Do you work with contractors and property managers?",
    a: "Yes. We supply and install flooring for general contractors, developers, property managers and hospitality operators, as well as homeowners, and coordinate installation around the project schedule.",
  },
];

export default function WhyUsPage() {
  return (
    <>
      <PageHero
        description={description}
        kicker="Why us"
        title={"Why Choose V\u00a0&\u00a0A Flooring\u00a0Inc"}
        subtitle="Flooring Expertise. Family Accountability. Since 1999."
        image={images.storefront}
        crumbs={[{ name: "Why Us", href: routes.whyUs }]}
        actions={
          <ButtonLink href={routes.estimate} variant="light">
            Request an Estimate
          </ButtonLink>
        }
      >
        <p>
          Homeowners, contractors and property managers choose {business.name} because one family-owned company
          supplies the flooring and installs it with its own crews. We have been in business since {business.founded}
          {business.license ? `, hold California ${licenseLine(business.license)}` : ""}, and serve {regionLine}.
        </p>
      </PageHero>

      <Section tone="ivory" labelledBy="reasons-title">
        <Container>
          <SectionHead id="reasons-title" kicker="What sets us apart" title="Six reasons clients choose us" />
          <ol className={styles.reasons}>
            {reasons.map((r, i) => (
              <li key={r.title}>
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
          <LowesNote />
        </Container>
      </Section>

      <Commitments title="Our commitments on every project" />

      <Section tone="navy" labelledBy="team-title">
        <Container>
          <MediaSplit image={images.team} reverse>
            <p className="kicker">Our team</p>
            <h2 id="team-title">{facts.installationCrewsLong}, one point of contact</h2>
            <p>
              Our installers, support team and warehouse work from the same Sun Valley location, so materials, crews and
              scheduling are coordinated in one place for every project.
            </p>
            <p>We work with:</p>
            <ul className={styles.clients}>
              {clients.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <TextLink href={routes.story} tone="light">Read our story</TextLink>
          </MediaSplit>
        </Container>
      </Section>

      <Credentials tone="white" />

      <FaqSection faqs={faqs} tone="ivory" title="Choosing a flooring company" intro="Quick answers about who we are and how we work." />

      <InquiryCta />
    </>
  );
}
