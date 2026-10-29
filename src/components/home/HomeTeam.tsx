import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { facts } from "@/content/site";
import styles from "./HomeSections.module.css";

/** Installation team: same size and layout as the introduction photo, mirrored. */
export function HomeTeam() {
  return (
    <Section tone="white" labelledBy="team-band-title">
      <Container>
        <div className={`${styles.split} ${styles.splitReverse}`}>
          <Figure
            image={images.team}
            ratio="4 / 3"
            sizes="(min-width: 64rem) 36rem, 100vw"
            focus="50% 20%"
            caption="Our installation team at the V & A Flooring warehouse in Sun Valley."
          />
          <div>
            <p className="kicker">Our installation team</p>
            <h2 id="team-band-title">{facts.installationCrewsLong}, one accountable company</h2>
            <p className={styles.lede}>
              Our installers, support team and warehouse work from the same Sun Valley location, so materials, crews
              and scheduling are coordinated in one place for every project.
            </p>
            <p>From a single room to an apartment community or hotel, the people who plan your floor work alongside the crews who install it.</p>
            <div className={styles.links}>
              <TextLink href={routes.installation}>How we install</TextLink>
              <TextLink href={routes.whyUs}>Why choose us</TextLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
