import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import styles from "./CustomerPaths.module.css";

export function CustomerPaths() {
  return (
    <Section tone="ivory" labelledBy="paths-title">
      <Container>
        <h2 id="paths-title" className="visually-hidden">
          Residential and commercial flooring
        </h2>
        <div className={styles.grid}>
          <article className={styles.path}>
            <Figure image={images.aduKitchen} ratio="4 / 3" sizes="(min-width: 64rem) 36rem, 100vw" />
            <div className={styles.body}>
              <h3 className={styles.title}>Residential Flooring</h3>
              <p className={styles.subtitle}>For the spaces you call home.</p>
              <p>
                Whether you’re updating one room, renovating a house you live in, or finishing a new ADU, we help you
                choose materials that suit the way you live and install them with care. You’ll know what to expect
                before work begins, and you’ll have a direct line to us while it’s underway.
              </p>
              <TextLink href={routes.residential}>Explore residential flooring</TextLink>
            </div>
          </article>
          <article className={styles.path}>
            <Figure image={images.corridor} ratio="4 / 3" sizes="(min-width: 64rem) 36rem, 100vw" />
            <div className={styles.body}>
              <h3 className={styles.title}>Commercial&nbsp;&amp; Multifamily</h3>
              <p className={styles.subtitle}>Experience and capacity for larger projects.</p>
              <p>
                Hotels, apartment communities and commercial spaces need materials that arrive when they’re needed
                and crews who can keep pace with the job. With more than 20 installation crews and materials supplied
                by the same company, we coordinate flooring around your project schedule.
              </p>
              <TextLink href={routes.commercial}>Explore commercial &amp; multifamily</TextLink>
            </div>
          </article>
        </div>
      </Container>
    </Section>
  );
}
