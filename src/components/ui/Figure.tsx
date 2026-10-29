import Image from "next/image";
import type { SiteImage } from "@/content/images";
import styles from "./Figure.module.css";

type Props = {
  image: SiteImage;
  /** CSS aspect-ratio for the frame, e.g. "4 / 3". */
  ratio?: string;
  /** next/image sizes attribute; describe the rendered width at each breakpoint. */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Override the object-position focal point, e.g. "40% 60%". */
  focus?: string;
  caption?: string;
};

/**
 * Responsive image frame. Illustrative imagery is always labelled so it is never
 * mistaken for photography of completed V & A Flooring Inc projects.
 */
export function Figure({ image, ratio = "4 / 3", sizes, priority, className, focus, caption }: Props) {
  const illustrative = image.kind === "illustrative";
  return (
    <figure className={[styles.figure, className].filter(Boolean).join(" ")}>
      <div className={styles.frame} style={{ aspectRatio: ratio }}>
        <Image
          quality={90}
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className={styles.img}
          style={{ objectPosition: focus ?? image.focus ?? "50% 50%" }}
        />
        {illustrative && <span className={styles.label}>Illustrative rendering</span>}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
