import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { facts } from "@/content/site";
import styles from "./MaterialsIntro.module.css";

const factors = ["Hardwood & laminate", "Vinyl plank, carpet & tile", "Matched to use and budget", "American-made options"];

export function MaterialsIntro() {
  return (
    <Section tone="sand" labelledBy="materials-title">
      <Container>
        <div className={styles.grid}>
          <div className={styles.text}>
            <p className="kicker">Materials &amp; brands</p>
            <h2 id="materials-title">Hardwood, laminate and more, matched to the way a space is used</h2>
            <p className={styles.lede}>
              We supply the flooring we install, so material advice comes from people who also plan the installation.
              We’ll help you narrow the options by what the floor needs to do, what it should look like and what it
              should cost.
            </p>
            <ul className={styles.factors}>
              {factors.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <TextLink href={routes.materials}>How we help you choose materials</TextLink>
          </div>
          <Figure image={images.samples} ratio="5 / 4" sizes="(min-width: 64rem) 34rem, 100vw" className={styles.figure} />
        </div>

        <div className={styles.brands}>
          <p className={styles.brandsLabel}>Products from manufacturers including</p>
          <ul className={styles.brandList}>
            {facts.manufacturers.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className={styles.madeIn}>{facts.americanMadeLine}</p>
        </div>
      </Container>
    </Section>
  );
}
