import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui/Button";
import { estimateCta, primaryNav, routes } from "@/content/navigation";
import { business, telHref } from "@/content/site";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.utility} data-surface="dark">
        <div className={styles.utilityInner}>
          <p>
            {business.license ? `CSLB Lic. #${business.license.number}` : `Family owned since ${business.founded}`}
            {business.bondedInsured && (
              <>
                <span className={styles.sep} aria-hidden="true" />
                Bonded &amp; Insured
              </>
            )}
            <span className={styles.sep} aria-hidden="true" />
            <span className={styles.utilityMore}>Serving Los Angeles, Orange &amp; Ventura Counties since {business.founded}</span>
          </p>
          {business.phone && (
            <a href={telHref(business.phone)} className={styles.utilityPhone}>
              Call {business.phone}
            </a>
          )}
        </div>
      </div>
      <div className={styles.bar}>
        <div className={styles.inner}>
          <Link href={routes.home} className={styles.brand} aria-label="V & A Flooring home">
            <Logo layout="horizontal" tone="navy" title="" className={styles.logo} />
          </Link>
          <nav aria-label="Primary" className={styles.nav}>
            <DesktopNav items={primaryNav} />
            <Link href={estimateCta.href} className={`${buttonClass("primary")} ${styles.cta}`}>
              {estimateCta.label}
            </Link>
          </nav>
          <MobileMenu items={primaryNav} cta={estimateCta} />
        </div>
      </div>
    </header>
  );
}
