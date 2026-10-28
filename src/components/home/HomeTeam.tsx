import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { images } from "@/content/images";
import { facts } from "@/content/site";
import styles from "./HomeSections.module.css";

/** Full-width photo of the installation team. */
export function HomeTeam() {
  const img = images.team;
  return (
    <section className={styles.team} aria-labelledby="team-band-title">
      <div className={styles.teamMedia}>
        <Image src={img.src} alt={img.alt} fill sizes="100vw" placeholder="blur" className={styles.teamImg} style={{ objectPosition: "50% 0%" }} />
      </div>
      <div className={styles.teamCaption} data-surface="dark">
        <Container>
          <p className="kicker">Our installation team</p>
          <h2 id="team-band-title" className={styles.teamTitle}>
            {facts.installationCrewsLong}, one accountable company
          </h2>
        </Container>
      </div>
    </section>
  );
}
