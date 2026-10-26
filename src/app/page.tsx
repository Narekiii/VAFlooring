import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { MaterialsIntro } from "@/components/home/MaterialsIntro";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Commitments } from "@/components/home/Commitments";
import { LowesNote } from "@/components/home/LowesNote";
import { Credentials } from "@/components/credentials/Credentials";
import { FounderPreview } from "@/components/home/FounderPreview";
import { FaqSection } from "@/components/home/FaqSection";
import { InquiryCta } from "@/components/home/InquiryCta";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { homeFaqs } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Flooring Installation Los Angeles | Hardwood, Laminate, LVP | V & A Flooring Inc",
  description:
    "Licensed, family-owned flooring contractor since 1999. Hardwood, laminate, vinyl plank (LVP), carpet and tile supply and installation for homes, ADUs, apartments, hotels and commercial projects in LA, Orange and Ventura counties.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <Section tone="ivory" labelledBy="services-title">
        <Container>
          <SectionHead id="services-title" kicker="Services" title="Flooring services in Los Angeles">
            <p>
              V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc supplies flooring materials and installs them with our own crews. We
              install hardwood, laminate, luxury vinyl plank, carpet and tile flooring for homeowners, builders,
              property managers and commercial clients across Los Angeles, Orange and Ventura counties.
            </p>
          </SectionHead>
          <ServicesGrid />
        </Container>
      </Section>
      <MaterialsIntro />
      <FeaturedWork />
      <Commitments>
        <LowesNote />
      </Commitments>
      <Credentials limit={4} tone="white" />
      <FounderPreview />
      <FaqSection
        faqs={homeFaqs}
        title="Questions about V & A Flooring Inc"
        intro="Quick answers about who we are, what we install and how to start a project."
      />
      <InquiryCta />
    </>
  );
}
