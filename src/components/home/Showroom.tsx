import Image from "next/image";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { images, type SiteImage } from "@/content/images";
import { business, directionsHref, hoursLines, telHref } from "@/content/site";
import styles from "./Showroom.module.css";

const gallery: { image: SiteImage; caption: string }[] = [
  { image: images.storefront, caption: "10945 Pendleton St, Sun Valley" },
  { image: images.showroomSelection, caption: "Selection area" },
  { image: images.designCenter, caption: "Design center" },
  { image: images.showroomHardwood, caption: "Hardwood" },
  { image: images.showroomTile, caption: "Tile & stone-look" },
  { image: images.warehouse, caption: "Warehouse stock" },
];

/** Real photography of the showroom, design center and warehouse. */
export function Showroom() {
  const { address, phone } = business;
  const maps = directionsHref();
  const hours = hoursLines();
  return (
    <Section tone="navy" labelledBy="showroom-title">
      <Container>
        <div className={styles.head}>
          <div>
            <p className="kicker">Showroom &amp; design center</p>
            <h2 id="showroom-title" className={styles.title}>
              See and compare flooring in person in Sun&nbsp;Valley
            </h2>
          </div>
          <div className={styles.body}>
            <p>
              Our showroom and design center hold hardwood, laminate, luxury vinyl plank, carpet and tile samples side
              by side, and our warehouse keeps flooring, cushion and moldings on hand for the crews who install them.
              Bring your plans or room measurements and we’ll help you narrow the choices.
            </p>
            {address && (
              <address className={styles.address}>
                {address.streetAddress}, {address.addressLocality}, {address.addressRegion} {address.postalCode}
              </address>
            )}
            {hours.length > 0 && <p className={styles.hours}>Showroom hours: {hours.join(" · ")}</p>}
            <div className={styles.actions}>
              {maps && (
                <a href={maps} className={buttonClass("light")} target="_blank" rel="noopener noreferrer">
                  Get Directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
                </a>
              )}
              {phone && (
                <a href={telHref(phone)} className={buttonClass("outline-light")}>
                  Call {phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <ul className={styles.gallery}>
          {gallery.map(({ image, caption }, i) => (
            <li key={caption} className={i === 0 ? styles.lead : undefined}>
              <figure className={styles.figure}>
                <div className={styles.frame}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    placeholder="blur"
                    sizes={i === 0 ? "(min-width: 64rem) 42rem, 100vw" : "(min-width: 64rem) 20rem, 50vw"}
                    className={styles.img}
                    style={{ objectPosition: image.focus ?? "50% 50%" }}
                  />
                </div>
                <figcaption className={styles.caption}>{caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
