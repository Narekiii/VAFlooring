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
import { ProductGrid } from "@/components/products/ProductGrid";
import { FaqSection } from "@/components/home/FaqSection";
import { productFaqs } from "@/content/products";
import { routes } from "@/content/navigation";
import { facts } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const description =
  "Flooring store and showroom in Sun Valley, LA: hardwood, laminate, LVP, carpet and tile from Mohawk, Shaw and Engineered Floors, for homes and contractors.";

export const metadata = pageMetadata({
  title: "Flooring Store & Showroom in Los Angeles",
  description,
  path: routes.products,
  image: images.showroomSelection,
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        description={description}
        pageType="CollectionPage"
        kicker="Flooring store · Sun Valley, Los Angeles"
        title="Flooring Products & Brands"
        subtitle="Hardwood, laminate, vinyl, carpet and tile, in our showroom and in stock."
        image={images.showroomSelection}
        crumbs={[{ name: "Products", href: routes.products }]}
        actions={
          <>
            <ButtonLink href={routes.contact} variant="light">
              Visit the showroom
            </ButtonLink>
            <ButtonLink href={routes.estimate} variant="outline-light">
              Ask About Materials
            </ButtonLink>
          </>
        }
      >
        <p>
          V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc sells flooring materials from our showroom, design center and warehouse in
          Sun Valley to homeowners, contractors and property managers across Los Angeles, Orange and Ventura counties.
          We help you match a product to the room, the traffic it sees, the upkeep you expect and your budget, and our
          own crews can install it.
        </p>
      </PageHero>

      <Section tone="ivory" labelledBy="categories">
        <Container>
          <SectionHead id="categories" kicker="Products" title="Flooring we sell and install" />
          <ProductGrid headingId="categories" />
        </Container>
      </Section>

      <Section tone="navy" labelledBy="warehouse-title">
        <Container>
          <MediaSplit image={images.warehouse}>
            <p className="kicker">Warehouse</p>
            <h2 id="warehouse-title">A fully stocked, operational warehouse</h2>
            <p>
              Our Sun Valley warehouse keeps flooring, cushion and moldings on hand, so we can provide quality materials
              at competitive prices to customers and contractors, and keep our installation crews supplied.
            </p>
            <TextLink href={routes.contact} tone="light">Visit or contact us</TextLink>
          </MediaSplit>
        </Container>
      </Section>

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

      <FaqSection faqs={productFaqs} tone="white" title="Buying flooring from V & A Flooring Inc" intro="Quick answers about our showroom, brands and who we supply." />

      <InquiryCta
        title="Not sure where to start?"
        body="Tell us about the space and how it’s used. We’ll follow up with questions and help you narrow down the options; there’s no obligation."
        ctaLabel="Ask About Materials"
      />
    </>
  );
}
