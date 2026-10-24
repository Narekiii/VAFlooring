import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { business, telHref } from "@/content/site";
import { footerCompany, footerServices, routes } from "@/content/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  const { phone, email, address, hours, license } = business;
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
              Family-owned Los Angeles flooring company supplying and installing hardwood and laminate flooring for
              homes, ADUs, multifamily communities, hotels and commercial projects.
            </p>
          </div>

          <nav aria-labelledby="footer-services" className={styles.col}>
            <h2 id="footer-services" className={styles.heading}>
              Flooring services
            </h2>
            <ul className={styles.list}>
              {footerServices.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company" className={styles.col}>
            <h2 id="footer-company" className={styles.heading}>
              Company
            </h2>
            <ul className={styles.list}>
              {footerCompany.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h2 className={styles.heading}>Contact</h2>
            <ul className={styles.list}>
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
              <li>
                <Link href={routes.estimate}>Request an Estimate</Link>
              </li>
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
            <p className={styles.note}>Serving {business.serviceArea}, California.</p>
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
