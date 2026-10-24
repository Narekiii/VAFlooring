import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { routes } from "@/content/navigation";
import { business, telHref } from "@/content/site";
import styles from "./InquiryCta.module.css";

type Props = {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function InquiryCta({
  title = "Let’s Talk About Your Project.",
  body = "Tell us what you’re planning, whether it’s a single room, a new ADU, or a multifamily or commercial project. There’s no obligation. We’ll follow up to talk through the scope, materials and timing, and what we need to prepare an estimate.",
  ctaLabel = "Request an Estimate",
  ctaHref = routes.estimate,
}: Props) {
  return (
    <Section tone="navy" labelledBy="inquiry-title">
      <Container>
        <div className={styles.grid}>
          <h2 id="inquiry-title" className={styles.title}>
            {title}
          </h2>
          <div>
            <p className={styles.body}>{body}</p>
            <div className={styles.actions}>
              <ButtonLink href={ctaHref} variant="light">
                {ctaLabel}
              </ButtonLink>
              {business.phone && (
                <a className={styles.phone} href={telHref(business.phone)}>
                  Or call {business.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
