import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { business, directionsHref, hoursLines, licenseLine, regionLine, telHref } from "@/content/site";
import { footerCompany, footerProducts, footerServices, routes } from "@/content/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  const { phone, email, address, license } = business;
  const hours = hoursLines(true);
  const directions = directionsHref();
  return (
    <footer className={styles.footer} data-surface="dark">
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <Link href={routes.home} aria-label="V & A Flooring Inc home" className={styles.logoLink}>
              <Logo layout="stacked" tone="reverse" title="" className={styles.logo} />
            </Link>
            <p className={styles.brandLine}>{business.brandLine}</p>
            <p className={styles.summary}>
              Family-owned flooring store and installer in Sun Valley, selling and installing hardwood, laminate, vinyl
              plank, carpet and tile flooring for homes, ADUs, multifamily communities, hotels and commercial projects.
            </p>
          </div>

          <nav aria-labelledby="footer-products" className={styles.col}>
            <h2 id="footer-products" className={styles.heading}>
              Products
            </h2>
            <ul className={styles.list}>
              {footerProducts.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services" className={styles.col}>
            <h2 id="footer-services" className={styles.heading}>
              Installation
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
            {directions && (
              <a href={directions} className={styles.directions} target="_blank" rel="noopener noreferrer">
                Get directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
              </a>
            )}
            {hours.length > 0 && (
              <ul className={styles.hours}>
                {hours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <p className={styles.note}>Serving {regionLine}.</p>
          </div>
        </div>

        <div className={styles.base}>
          <p>
            © {year} {business.name}. All rights reserved.
          </p>
          {license && (
            <p>
              {licenseLine(license)}
              {business.bondedInsured && " · Bonded & Insured"}
              {business.epaLeadSafe && " · EPA Lead-Safe Certified Firm"}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
