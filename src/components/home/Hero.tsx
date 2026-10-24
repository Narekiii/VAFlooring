import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container>
        <div className={styles.top}>
          {/* Lines are offset like courses of plank flooring */}
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>Flooring Expertise.</span>{" "}
            <span className={`${styles.line} ${styles.offset}`}>Family Accountability.</span>{" "}
            <span className={styles.line}>Since 1999.</span>
          </h1>
          <div className={styles.aside}>
            <p className={styles.lede}>
              Quality flooring materials and professional installation for home renovations, ADUs, multifamily
              communities, hospitality properties, and commercial spaces throughout Los Angeles.
            </p>
            <div className={styles.actions}>
              <ButtonLink href={routes.estimate}>Request an Estimate</ButtonLink>
              <ButtonLink href={routes.projects} variant="secondary">
                Explore Our Projects
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
      <Container wide className={styles.mediaWrap}>
        <Figure
          image={images.livingWide}
          ratio="var(--hero-ratio)"
          sizes="(min-width: 96rem) 90rem, 100vw"
          priority
          className={styles.media}
        />
      </Container>
    </section>
  );
}
