import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Steps } from "@/components/ui/Steps";
import { TextLink } from "@/components/ui/TextLink";
import { installProcess } from "@/content/installation";
import { routes } from "@/content/navigation";
import { facts } from "@/content/site";
import styles from "./HomeSections.module.css";

const pillars = [
  { big: facts.installationCrews, small: "Installation crews of our own" },
  { big: "1 company", small: "From selection to the finished floor" },
  { big: "In stock", small: "A fully stocked, operational warehouse" },
  { big: "Since 1999", small: "More than two decades of installation" },
];

/** 3 · How we do it: the process, then the people and places behind it. */
export function HomeHowWeDo() {
  return (
    <Section tone="sand" labelledBy="how-title">
      <Container>
        <SectionHead id="how-title" kicker="How we do it" title="From showroom to finished floor">
          <p>
            Every project follows the same five steps, whether it is one bedroom or a multi-building community. The
            people who help you choose the floor work alongside the crews who install it.
          </p>
        </SectionHead>
        <ul className={styles.pillars} aria-label="How we work, at a glance">
          {pillars.map((p) => (
            <li key={p.small}>
              <span className={styles.pillarBig}>{p.big}</span>
              <span className={styles.pillarSmall}>{p.small}</span>
            </li>
          ))}
        </ul>
        <Steps steps={installProcess} />
        <p className={styles.more}>
          <TextLink href={routes.installation}>How we install flooring</TextLink>
        </p>
      </Container>
    </Section>
  );
}
