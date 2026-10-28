import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { business, facts, regionLine } from "@/content/site";
import styles from "./HomeSections.module.css";

/** 1 · Introduction: who we are, answer-first. */
export function HomeIntro() {
  return (
    <Section tone="white" labelledBy="intro-title">
      <Container>
        <div className={styles.split}>
          <div>
            <p className="kicker">Introduction</p>
            <h2 id="intro-title">A family-owned flooring company in Los Angeles since {business.founded}</h2>
            <p className={styles.lede}>
              {business.name} sells flooring materials and installs them. From our showroom, design center and warehouse
              in Sun Valley, we supply hardwood, laminate, luxury vinyl plank, carpet and tile, and our{" "}
              {facts.installationCrewsLong.toLowerCase()} install it for homes, ADUs, apartment communities, hotels and
              commercial projects across {regionLine}.
            </p>
            <p>
              The company was founded in {business.founded} by {business.founder}, a flooring installer who wanted good
              materials, careful installation and honest guidance to come from one place. It is still family owned.
            </p>
            <div className={styles.links}>
              <TextLink href={routes.story}>Read our story</TextLink>
              <TextLink href={routes.contact}>Visit the showroom</TextLink>
            </div>
          </div>
          <Figure image={images.team} ratio="4 / 3" sizes="(min-width: 64rem) 36rem, 100vw" caption="Our team at the V & A Flooring warehouse." />
        </div>
      </Container>
    </Section>
  );
}
