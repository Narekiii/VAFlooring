import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { routes } from "@/content/navigation";
import styles from "./FounderPreview.module.css";

export function FounderPreview() {
  return (
    <Section tone="sand" labelledBy="founder-title">
      <Container>
        <div className={styles.grid}>
          <div>
          <p className="kicker">Our story</p>
          <h2 id="founder-title" className={styles.title}>
            Founded by an installer who believed customers deserved more care after the sale.
          </h2>
          </div>
          <div className={styles.body}>
            <p>
              In the early 1990s, Armond Markarian was working as a flooring installer and running a small business of
              his own. He saw many flooring companies put their energy into selling product while installation quality
              and customer support received far less attention.
            </p>
            <p>
              In 1999 he founded V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc around a different priority: good materials, careful installation,
              honest guidance, and support that continues after the job is complete. The company is still family owned
              today.
            </p>
            <div className={styles.cta}>
              <ButtonLink href={routes.story} variant="secondary">
                Meet V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
