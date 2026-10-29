import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { images, type SiteImage } from "@/content/images";
import { routes } from "@/content/navigation";
import styles from "./Hero.module.css";

export function Hero() {
  const img: SiteImage = images.showroomAisle;
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Image
          quality={90}
          src={img.src}
          alt={img.alt}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className={styles.img}
          style={{ objectPosition: img.focus ?? "50% 50%" }}
        />
        {img.kind === "illustrative" && <span className={styles.label}>Illustrative rendering</span>}
      </div>
      <div className={styles.wrap}>
        <div className={styles.panel} data-surface="dark">
          <p className="kicker">Flooring store &amp; installation · Los Angeles · Since 1999</p>
          <h1 id="hero-title" className={styles.title}>
            Hardwood &amp; Laminate Flooring Installation in Los&nbsp;Angeles
          </h1>
          <p className={styles.tagline}>Flooring Expertise. Family Accountability. Since 1999.</p>
          <p className={styles.lede}>
            Quality flooring materials and professional installation for home renovations, ADUs, multifamily
            communities, hospitality properties, and commercial spaces throughout Los Angeles, Orange and Ventura counties.
          </p>
          <div className={styles.actions}>
            <ButtonLink href={routes.estimate}>Request an Estimate</ButtonLink>
            <ButtonLink href={routes.products} variant="outline-light">
              Explore Products
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
