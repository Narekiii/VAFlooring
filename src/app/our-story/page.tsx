import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { InquiryCta } from "@/components/home/InquiryCta";
import { Credentials } from "@/components/credentials/Credentials";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { business, facts } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "About Us: Family-Owned Flooring Company Since 1999",
  description:
    "Founded in 1999 by installer Armond Markarian, V & A Flooring Inc is a family-owned Los Angeles flooring company built on good materials, careful installation and support after the job.",
  path: routes.story,
});

const chapters = [
  {
    when: "Early 1990s",
    title: "Learning the work from the floor up",
    body: [
      "Armond Markarian started out as a flooring installer and ran a small business of his own, which gave him a direct view of the work that happens after a sale is made.",
    ],
  },
  {
    when: "",
    title: "Seeing what customers were missing",
    body: [
      "He noticed that many flooring businesses put most of their attention on selling products and gave far less to how those products were installed, or to how customers were supported afterward.",
      "He saw an opportunity to build a company around taking better care of customers.",
    ],
  },
  {
    when: "1999",
    title: "Founding V\u00a0&\u00a0A Flooring\u00a0Inc",
    body: [
      "In 1999 Armond founded V\u00a0&\u00a0A Flooring\u00a0Inc with a commitment to good materials, careful installation, honest guidance, and continued support after the job was complete.",
    ],
  },
  {
    when: "Since 1999",
    title: "Growing with family accountability",
    body: [
      `The company has grown to ${facts.installationCrewsLong.toLowerCase()} and has served Lowe’s installation customers for more than 20 years. Its work now spans home renovations, ADUs, apartment communities, hotels and large commercial projects.`,
      "Through that growth it has remained family owned, with the same expectation that someone is personally accountable for every job.",
    ],
  },
  {
    when: "Looking ahead",
    title: "Building capacity, improving the work",
    body: [
      "Our goals are to keep growing responsibly, expand our installation capacity, and keep improving the quality of our installation and service. Growth lets us serve more customers and take on larger projects, and we pursue it at a pace that keeps our commitments to every customer intact.",
    ],
  },
];

const values = [
  {
    title: "Honesty",
    body: "Straight answers about materials, pricing and timing, including when the answer isn’t the one you hoped to hear.",
  },
  {
    title: "Hard Work",
    body: "The company was started by an installer, and we still judge ourselves by the floors our crews leave behind.",
  },
  {
    title: "Initiative",
    body: "V\u00a0&\u00a0A Flooring\u00a0Inc began with someone seeing a problem and acting on it. We bring the same determination to solving problems on each job.",
  },
  {
    title: "Trust",
    body: "Reliability is earned one project at a time: showing up when we said we would, doing what we agreed to, and following through after the job is done.",
  },
];

export default function StoryPage() {
  return (
    <>
      <PageHero
        kicker="About V & A Flooring Inc"
        title="Our Story"
        subtitle={`A family-owned Los Angeles flooring company since ${business.founded}.`}
        image={images.plankDetail}
        crumbs={[{ name: "Our Story", href: routes.story }]}
      >
        <p>
          V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc was founded by Armond Markarian, an installer who believed a flooring company should be
          judged by the quality of its installation and by how it treats customers after the sale.
        </p>
      </PageHero>

      <Section tone="white" labelledBy="story-title">
        <Container>
          <h2 id="story-title" className="visually-hidden">
            How V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc began
          </h2>
          <ol className={styles.timeline}>
            {chapters.map((c) => (
              <li key={c.title} className={styles.chapter}>
                {c.when ? <p className={styles.when}>{c.when}</p> : <span aria-hidden="true" />}
                <div className={styles.chapterBody}>
                  <h3 className={styles.chapterTitle}>{c.title}</h3>
                  {c.body.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="navy" labelledBy="values-title">
        <Container>
          <div className={styles.valuesHead}>
            <div>
              <p className="kicker">Values</p>
              <h2 id="values-title">What we value</h2>
            </div>
            <p className={styles.valuesLine} aria-hidden="true">
              Honesty. Hard Work. Initiative. Trust.
            </p>
          </div>
          <ul className={styles.values}>
            {values.map((v) => (
              <li key={v.title} className={styles.value}>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="sand" compact labelledBy="next-title">
        <Container>
          <div className={styles.next}>
            <h2 id="next-title" className={styles.nextTitle}>
              See how we approach homes and larger projects.
            </h2>
            <div className={styles.nextLinks}>
              <ButtonLink href={routes.residential} variant="secondary">
                Residential Flooring
              </ButtonLink>
              <ButtonLink href={routes.commercial} variant="secondary">
                Commercial &amp; Multifamily
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <Credentials tone="white" />

      <InquiryCta />
    </>
  );
}
