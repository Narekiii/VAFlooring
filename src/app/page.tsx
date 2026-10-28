import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { HomeIntro } from "@/components/home/HomeIntro";
import { FounderSection } from "@/components/company/FounderSection";
import { HomeTeam } from "@/components/home/HomeTeam";
import { HomeWhyUs } from "@/components/home/HomeWhyUs";
import { HomeHowWeDo } from "@/components/home/HomeHowWeDo";
import { HomeWhatWeDo } from "@/components/home/HomeWhatWeDo";
import { Showroom } from "@/components/home/Showroom";
import { Credentials } from "@/components/credentials/Credentials";
import { FaqSection } from "@/components/home/FaqSection";
import { InquiryCta } from "@/components/home/InquiryCta";
import { homeFaqs } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageJsonLd } from "@/lib/structured-data";
import { images } from "@/content/images";

const description =
  "Family-owned flooring store and installer in Sun Valley since 1999. Hardwood, laminate, LVP, carpet and tile, supplied and installed across Los Angeles.";

export const metadata = pageMetadata({
  title: "Hardwood & Laminate Flooring Los Angeles | V & A Flooring Inc",
  description,
  path: "/",
});

/**
 * Homepage story: 1 Introduction → 2 Why us → 3 How we do it → 4 What we do,
 * then FAQ and the estimate call to action.
 */
export default function HomePage() {
  return (
    <>
      {/* 1 · Introduction */}
      <Hero />
      <CredibilityStrip />
      <HomeIntro />
      <FounderSection storyLink />
      <HomeTeam />

      {/* 2 · Why us */}
      <HomeWhyUs />
      <Credentials limit={4} tone="white" />

      {/* 3 · How we do it */}
      <HomeHowWeDo />
      <Showroom />

      {/* 4 · What we do */}
      <HomeWhatWeDo />

      <FaqSection
        faqs={homeFaqs}
        tone="ivory"
        title="Questions about V & A Flooring Inc"
        intro="Quick answers about who we are, what we sell and install, and how to start a project."
      />
      <InquiryCta />
      <JsonLd
        data={webPageJsonLd({
          path: "/",
          name: "V & A Flooring Inc: Flooring Store and Installation in Los Angeles",
          description,
          image: images.showroomAisle,
        })}
      />
    </>
  );
}
