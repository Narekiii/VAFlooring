import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Faq } from "@/content/services";
import { faqJsonLd } from "@/lib/structured-data";
import styles from "./FaqSection.module.css";

/** Visible FAQ (native <details>) plus matching FAQPage structured data. */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  intro,
  tone = "white",
  id = "faq-title",
}: {
  faqs: Faq[];
  title?: string;
  intro?: string;
  tone?: "white" | "ivory" | "sand";
  id?: string;
}) {
  return (
    <Section tone={tone} labelledBy={id}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.head}>
            <p className="kicker">FAQ</p>
            <h2 id={id}>{title}</h2>
            {intro && <p className={styles.intro}>{intro}</p>}
          </div>
          <div className={styles.list}>
            {faqs.map((f, i) => (
              <details key={f.q} className={styles.item} open={i === 0}>
                <summary className={styles.q}>
                  <h3 className={styles.qText}>{f.q}</h3>
                  <span className={styles.icon} aria-hidden="true" />
                </summary>
                <p className={styles.a}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
      <JsonLd data={faqJsonLd(faqs)} />
    </Section>
  );
}
