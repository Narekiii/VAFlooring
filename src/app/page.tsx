import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { CustomerPaths } from "@/components/home/CustomerPaths";
import { MaterialsIntro } from "@/components/home/MaterialsIntro";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Commitments } from "@/components/home/Commitments";
import { LowesNote } from "@/components/home/LowesNote";
import { FounderPreview } from "@/components/home/FounderPreview";
import { InquiryCta } from "@/components/home/InquiryCta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "V & A Flooring | Flooring Materials & Installation in Los Angeles Since 1999",
  description:
    "Family-owned since 1999, V & A Flooring supplies flooring materials and professional installation for home renovations, ADUs, multifamily communities, hotels and commercial spaces in Los Angeles.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <CustomerPaths />
      <MaterialsIntro />
      <FeaturedWork />
      <Commitments>
        <LowesNote />
      </Commitments>
      <FounderPreview />
      <InquiryCta />
    </>
  );
}
