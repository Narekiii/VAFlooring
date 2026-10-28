import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { routes } from "@/content/navigation";
import { reasons } from "@/content/why-us";
import { LowesNote } from "./LowesNote";
import styles from "./HomeSections.module.css";

/** 2 · Why us: the reasons clients choose V & A Flooring Inc. */
export function HomeWhyUs() {
  return (
    <Section tone="ivory" labelledBy="why-title">
      <Container>
        <SectionHead id="why-title" kicker="Why us" title="Why clients choose V & A Flooring Inc">
          <p>One company for materials and installation, with the crews, credentials and experience to stand behind both.</p>
        </SectionHead>
        <ol className={styles.reasons}>
          {reasons.map((r, i) => (
            <li key={r.title}>
              <span className={styles.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
        <div className={styles.footRow}>
          <LowesNote />
          <TextLink href={routes.whyUs}>More on why clients choose us</TextLink>
        </div>
      </Container>
    </Section>
  );
}
