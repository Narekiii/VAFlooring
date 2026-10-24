import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { business, telHref } from "@/content/site";
import { estimateCta, footerNav, routes } from "@/content/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  const { phone, email, address, hours, license } = business;
  const hasContact = Boolean(phone || email || address);
  return (
    <footer className={styles.footer} data-surface="dark">
      <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href={routes.home} aria-label="V & A Flooring home" className={styles.logoLink}>
            <Logo layout="stacked" tone="reverse" title="" className={styles.logo} />
          </Link>
          <p className={styles.brandLine}>{business.brandLine}</p>
          <p className={styles.summary}>
            Flooring materials and installation for homes, ADUs, multifamily communities, hospitality properties and
            commercial spaces in {business.serviceArea}.
          </p>
        </div>

        <nav aria-label="Footer" className={styles.col}>
          <h2 className={styles.heading}>Explore</h2>
          <ul className={styles.list}>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Start a project</h2>
          <ul className={styles.list}>
            <li>
              <Link href={estimateCta.href}>{estimateCta.label}</Link>
            </li>
            {phone && (
              <li>
                <a href={telHref(phone)}>{phone}</a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
          </ul>
          {address && (
            <address className={styles.address}>
              {address.streetAddress}
              <br />
              {address.addressLocality}, {address.addressRegion} {address.postalCode}
            </address>
          )}
          {hours && hours.length > 0 && (
            <ul className={styles.hours}>
              {hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          {!hasContact && <p className={styles.note}>Serving {business.serviceArea}.</p>}
        </div>
      </div>

      <div className={styles.base}>
        <p>
          © {year} {business.name}. All rights reserved.
        </p>
        {license && <p>{license}</p>}
      </div>
      </div>
    </footer>
  );
}
