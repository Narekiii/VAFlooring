import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui/Button";
import { estimateCta, primaryNav, routes } from "@/content/navigation";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={routes.home} className={styles.brand} aria-label="V & A Flooring home">
          <Logo layout="horizontal" tone="navy" title="" className={styles.logo} />
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          <NavLinks items={primaryNav} className={styles.links} linkClassName={styles.link} />
          <Link href={estimateCta.href} className={`${buttonClass("primary")} ${styles.cta}`}>
            {estimateCta.label}
          </Link>
        </nav>
        <MobileMenu items={primaryNav} cta={estimateCta} />
      </div>
    </header>
  );
}
