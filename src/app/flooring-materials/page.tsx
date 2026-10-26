import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MediaSplit } from "@/components/ui/MediaSplit";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { SelectionGuide } from "@/components/materials/SelectionGuide";
import { InquiryCta } from "@/components/home/InquiryCta";
import { images } from "@/content/images";
import { publishedCategories } from "@/content/materials";
import { routes } from "@/content/navigation";
import { facts } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Flooring Materials & Brands in Los Angeles: Hardwood, Laminate, LVP",
  description:
    "Hardwood, laminate, luxury vinyl plank, carpet and tile flooring materials in Los Angeles from manufacturers including Mohawk, Shaw and Engineered Floors, with American-made options and help choosing the right floor.",
  path: routes.materials,
});

export default function MaterialsPage() {
  const categories = publishedCategories();
  return (
    <>
      <PageHero
        kicker="Materials & brands"
        title="Flooring Materials & Brands"
        subtitle="The right floor depends on how the space will be used."
        image={images.showroomSelection}
        crumbs={[{ name: "Materials & Brands", href: routes.materials }]}
        actions={
          <ButtonLink href={routes.estimate} variant="light">
            Ask About Materials
          </ButtonLink>
        }
      >
        <p>
          We supply flooring materials and install them, so we can help you match a product to the room, the traffic it
          sees, the upkeep you expect and the budget you’re working with.
        </p>
      </PageHero>

      {categories.length > 0 && (
        <Section tone="ivory" labelledBy="categories">
          <Container>
            <SectionHead id="categories" kicker="Categories" title="Flooring we supply and install" />
            <ul className={styles.categories}>
              {categories.map((c) => (
                <li key={c.name}>
                  <h3>{c.href ? <Link href={c.href}>{c.name}</Link> : c.name}</h3>
                  <p>{c.body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section tone="white" labelledBy="brands">
        <Container>
          <div className={styles.brands}>
            <div>
              <p className="kicker">Brands</p>
              <h2 id="brands">Manufacturers we offer</h2>
              <p className={styles.brandsIntro}>
                We offer products from established flooring manufacturers, including:
              </p>
            </div>
            <ul className={styles.brandList}>
              {facts.manufacturers.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div className={styles.madeIn}>
            <h3>American-made options</h3>
            <p>
              Our range includes American-made options from established flooring manufacturers. If domestic
              manufacturing matters for your home or your project specifications, tell us at the start. We’ll point you
              to products that fit and confirm country of origin from the manufacturer’s product information.
            </p>
          </div>
          <p className={styles.trademark}>
            Mohawk, Shaw and Engineered Floors are trademarks of their respective owners. They are named here to identify
            products we offer and do not imply endorsement of V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc.
          </p>
        </Container>
      </Section>

      <Section tone="ivory" labelledBy="choosing">
        <Container>
          <div className={styles.guideLayout}>
            <div className={styles.guideHead}>
              <p className="kicker">Selection guide</p>
              <h2 id="choosing">How we help you choose</h2>
              <p>
                There’s no single best floor, only the best fit for a particular space. These are the questions we work
                through with you before recommending a product.
              </p>
            </div>
            <SelectionGuide />
          </div>
        </Container>
      </Section>


      <Section tone="sand" labelledBy="specified">
        <Container>
          <MediaSplit image={images.showroomTile} reverse>
            <p className="kicker">Specified products</p>
            <h2 id="specified">Already have a product in mind?</h2>
            <p>
              If you, your designer or your architect has already chosen a product, send us the details. We’ll confirm
              availability, review the manufacturer’s installation requirements, and include it in your estimate.
            </p>
            <p>
              For commercial and multifamily projects, we work from the specifications in your drawings and finish
              schedules.
            </p>
            <TextLink href={routes.commercial}>Commercial &amp; multifamily flooring</TextLink>
          </MediaSplit>
        </Container>
      </Section>

      <InquiryCta
        title="Not sure where to start?"
        body="Tell us about the space and how it’s used. We’ll follow up with questions and help you narrow down the options; there’s no obligation."
        ctaLabel="Ask About Materials"
      />
    </>
  );
}
