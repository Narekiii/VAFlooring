import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Section } from "@/components/ui/Section";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { business, facts } from "@/content/site";
import styles from "./FounderSection.module.css";

/** "Meet our founder": Armond Markarian (homepage and Our Story). */
export function FounderSection({ tone = "ivory", storyLink = false }: { tone?: "ivory" | "white" | "sand"; storyLink?: boolean }) {
  return (
    <Section tone={tone} labelledBy="founder-title">
      <Container>
        <div className={styles.founder}>
          <Figure
            image={images.founder}
            ratio="4 / 5"
            sizes="(min-width: 64rem) 28rem, 100vw"
            className={styles.founderPhoto}
          />
          <div className={styles.founderText}>
            <p className="kicker">Meet our founder</p>
            <h2 id="founder-title">{business.founder}</h2>
            <p className={styles.founderRole}>Founder, President &amp; CEO</p>
            <p className={styles.founderLede}>
              Armond Markarian founded V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc in {business.founded} after years of
              working as a flooring installer. He built the company on a simple idea: a flooring company should be
              judged by the quality of its installation and by how it treats customers after the sale.
            </p>
            <p>
              Today he leads a family-owned company with {facts.installationCrewsLong.toLowerCase()}, a showroom,
              design center and warehouse in Sun Valley, and projects that range from single rooms to apartment
              communities, hotels and commercial interiors across Los Angeles, Orange and Ventura counties.
            </p>
            {storyLink && (
              <p className={styles.founderLink}>
                <Link href={routes.story}>Read our story</Link>
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
