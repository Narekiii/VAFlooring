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
          <Link href={routes.home} className={styles.brand} aria-label="V & A Flooring Inc home">
            <Logo layout="horizontal" tone="navy" title="" className={styles.logo} />
          </Link>
          <nav aria-label="Primary" className={styles.nav}>
            <DesktopNav items={primaryNav} />
            <Link href={estimateCta.href} className={`${buttonClass("primary")} ${styles.cta}`}>
              {estimateCta.label}
            </Link>
          </nav>
          <div className={styles.mobileActions}>
            {business.phone && (
              <a href={telHref(business.phone)} className={styles.mobileCall}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                </svg>
                <span className={styles.callLabel}>Call</span>
                <span className="visually-hidden"> {business.phone}</span>
              </a>
            )}
            <MobileMenu items={primaryNav} cta={estimateCta} />
          </div>
        </div>
      </div>
    </header>
  );
}
