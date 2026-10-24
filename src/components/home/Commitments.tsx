import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import styles from "./Commitments.module.css";

export const commitments = [
  {
    title: "Honest Guidance",
    body: "We’ll tell you what a material is suited for, where it may not be the right fit, and what installation will involve, so you can decide with the full picture in front of you.",
  },
  {
    title: "Respect for Your Schedule",
    body: "We plan installation dates with you, coordinate crews around occupied homes and active job sites, and let you know promptly if anything needs to change.",
  },
  {
    title: "Competitive Pricing",
    body: "Because we supply materials and install them, we can price the whole job together and walk you through what’s included, so you can compare quotes on equal terms.",
  },
  {
    title: "Support After Installation",
    body: "Our responsibility doesn’t end when the crew packs up. If questions or concerns come up after the work is complete, contact us and we’ll follow up with you.",
  },
];

export function Commitments({
  title = "Why V\u00a0&\u00a0A Flooring",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <Section tone="ivory" labelledBy="why-title">
      <Container>
        <div className={styles.layout}>
          <div className={styles.head}>
            <h2 id="why-title">{title}</h2>
            <p className={styles.intro}>
              The way we work comes down to four commitments we make on every project, large or small.
            </p>
          </div>
          <ul className={styles.list}>
            {commitments.map((c) => (
              <li key={c.title} className={styles.item}>
                <h3 className={styles.title}>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </Container>
    </Section>
  );
}
