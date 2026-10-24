import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { MaterialsIntro } from "@/components/home/MaterialsIntro";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Commitments } from "@/components/home/Commitments";
import { LowesNote } from "@/components/home/LowesNote";
import { FounderPreview } from "@/components/home/FounderPreview";
import { FaqSection } from "@/components/home/FaqSection";
import { InquiryCta } from "@/components/home/InquiryCta";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { homeFaqs } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hardwood & Laminate Flooring Installation in Los Angeles | V & A Flooring",
  description:
    "Family-owned Los Angeles flooring company since 1999. Hardwood and laminate flooring supply and installation for homes, ADUs, apartments, hotels and commercial projects, with 20+ installation crews.",
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
              V&nbsp;&amp;&nbsp;A Flooring supplies flooring materials and installs them with our own crews. We
              specialize in hardwood and laminate flooring installation for homeowners, builders, property managers and
              commercial clients across Los Angeles.
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
      <FounderPreview />
      <FaqSection
        faqs={homeFaqs}
        title="Questions about V & A Flooring"
        intro="Quick answers about who we are, what we install and how to start a project."
      />
      <InquiryCta />
    </>
  );
}
