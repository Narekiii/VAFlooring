import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MediaSplit } from "@/components/ui/MediaSplit";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Steps } from "@/components/ui/Steps";
import { TextLink } from "@/components/ui/TextLink";
import { Glance } from "@/components/detail/Glance";
import { FaqSection } from "@/components/home/FaqSection";
import { InquiryCta } from "@/components/home/InquiryCta";
import { LowesNote } from "@/components/home/LowesNote";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { images } from "@/content/images";
import { installProcess, installStandards } from "@/content/installation";
import { routes } from "@/content/navigation";
import { serviceAreas, type Faq } from "@/content/services";
import { business, facts, licenseLine, regionLine } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const description =
  "Hardwood, laminate, LVP, carpet and tile installation by our own crews across Los Angeles, Orange and Ventura counties. Licensed, family owned since 1999.";

export const metadata = pageMetadata({
  title: "Flooring Installation in Los Angeles",
  description,
  path: routes.installation,
  image: images.warehouse,
});

const installFaqs: Faq[] = [
  {
    q: "Who installs the flooring?",
    a: `Our own installation crews. ${business.name} has ${facts.installationCrewsLong.toLowerCase()}, so materials, scheduling and installation stay with one accountable company.`,
  },
  {
    q: "Will you install flooring I bought somewhere else?",
    a: "We can install a product you or your designer have already chosen. Send us the product details and we’ll review the manufacturer’s installation requirements and include it in your estimate.",
  },
  {
    q: "How long does flooring installation take?",
    a: "It depends on the area, the subfloor, the product and the installation method. Once we understand the scope, we give you a schedule before work begins.",
  },
  {
    q: "Which types of flooring do you install?",
    a: "Hardwood (solid and engineered), laminate, luxury vinyl plank and tile, broadloom carpet and carpet tile, and porcelain and ceramic tile, for homes, ADUs, multifamily buildings, hotels and commercial spaces.",
  },
];

export default function InstallationPage() {
  const glance: [string, string][] = [
    ["Floors we install", "Hardwood · Laminate · LVP & vinyl · Carpet · Tile"],
    ["Installation crews", facts.installationCrewsLong],
    ["Projects", "Homes, ADUs, multifamily, hotels and commercial"],
    ["Service area", regionLine],
    ...(business.license
      ? ([["License", `${licenseLine(business.license)}${business.bondedInsured ? ", bonded & insured" : ""}`]] as [string, string][])
      : []),
    ["In business since", `${business.founded}, family owned`],
  ];

  return (
    <>
      <PageHero
        description={description}
        pageType="CollectionPage"
        kicker="Installation · Los Angeles, Orange & Ventura counties"
        title="Flooring Installation in Los Angeles"
        subtitle="Our own crews. The manufacturer’s methods. One accountable company."
        image={images.warehouse}
        crumbs={[{ name: "Installation", href: routes.installation }]}
        actions={
          <ButtonLink href={routes.estimate} variant="light">
            Request an Estimate
          </ButtonLink>
        }
      >
        <p>
          {business.name} installs hardwood, laminate, luxury vinyl plank, carpet and tile flooring with{" "}
          {facts.installationCrewsLong.toLowerCase()}, for homes, ADUs, apartment communities, hotels and commercial
          projects across {regionLine}. We supply the materials too, so one company is responsible from selection to the
          finished floor.
        </p>
      </PageHero>

      <Glance items={glance} />

      <Section tone="ivory" labelledBy="services-title">
        <Container>
          <SectionHead id="services-title" kicker="What we install" title="Flooring installation services">
            <p>Choose a floor type or project type to see how we plan and install it.</p>
          </SectionHead>
          <ServicesGrid headingId="services-title" />
        </Container>
      </Section>

      <Section tone="sand" labelledBy="process-title">
        <Container>
          <SectionHead id="process-title" kicker="How we do it" title="How our flooring installation works">
            <p>The same five steps on every job, from a single room to a multi-building project.</p>
          </SectionHead>
          <Steps steps={installProcess} />
        </Container>
      </Section>

      <Section tone="white" labelledBy="standards-title">
        <Container>
          <SectionHead id="standards-title" kicker="Our standards" title="What we check on every installation" />
          <ul className={styles.standards}>
            {installStandards.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ul>
          <LowesNote />
        </Container>
      </Section>

      <Section tone="navy" labelledBy="areas-title">
        <Container>
          <MediaSplit image={images.storefront} reverse>
            <p className="kicker">Service areas</p>
            <h2 id="areas-title">Where we install</h2>
            <p>
              From our Sun Valley base we install flooring across {regionLine}, including{" "}
              {serviceAreas.map((a) => a.places.slice(0, 3).join(", ")).join("; ")}.
            </p>
            <TextLink href={routes.serviceAreas} tone="light">All service areas</TextLink>
          </MediaSplit>
        </Container>
      </Section>

      <FaqSection faqs={installFaqs} tone="ivory" title="Flooring installation FAQ" intro="Common questions about how we install flooring." />

      <Section tone="white" labelledBy="why-link-title">
        <Container>
          <div className={styles.whyLink}>
            <h2 id="why-link-title">Still comparing installers?</h2>
            <p>
              See why homeowners, contractors and property managers choose {business.name}:{" "}
              <Link href={routes.whyUs}>Why choose us</Link>.
            </p>
          </div>
        </Container>
      </Section>

      <InquiryCta />
    </>
  );
}
