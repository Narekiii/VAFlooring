import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { routes } from "@/content/navigation";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className={styles.wrap} aria-labelledby="nf-title">
      <Container>
        <h1 id="nf-title">We couldn’t find that page.</h1>
        <p className={styles.text}>The link may be out of date, or the page may have moved. These pages are a good place to continue:</p>
        <div className={styles.actions}>
          <ButtonLink href={routes.home}>Go to the homepage</ButtonLink>
          <ButtonLink href={routes.estimate} variant="secondary">
            Request an Estimate
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
