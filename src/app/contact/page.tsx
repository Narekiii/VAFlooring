import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { CompanyFacts } from "@/components/company/CompanyFacts";
import { FaqSection } from "@/components/home/FaqSection";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { serviceAreas, type Faq } from "@/content/services";
import {
  addressLine,
  business,
  directionsHref,
  facts,
  hoursLines,
  licenseLine,
  mapEmbedSrc,
  regionLine,
  telHref,
} from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const description =
  "Contact V & A Flooring Inc: call (818) 843-4773 or visit our flooring showroom at 10945 Pendleton St, Sun Valley, CA. Serving LA, Orange and Ventura counties.";

export const metadata = pageMetadata({
  title: "Contact Us: Flooring Showroom in Sun Valley",
  description,
  path: routes.contact,
  image: images.storefront,
});

export default function ContactPage() {
  const { phone, email } = business;
  const address = addressLine();
  const hours = hoursLines();
  const directions = directionsHref();
  const embed = mapEmbedSrc();

  const faqs: Faq[] = [
    ...(address
      ? [{ q: "Where is V & A Flooring Inc located?", a: `Our flooring showroom and design center are at ${address}, in Sun Valley in the San Fernando Valley area of Los Angeles. We serve projects across ${regionLine}.` }]
      : []),
    ...(hours.length
      ? [{ q: "What are your showroom hours?", a: `${hours.join(". ")}. Call ahead if you’d like to talk through a specific project when you visit.` }]
      : []),
    {
      q: "How do I get a flooring estimate?",
      a: `Use the estimate request form${phone ? ` or call ${phone}` : ""}. Tell us the project’s city, the rooms or approximate area, the flooring you’re considering and your timing, and we’ll follow up to discuss scope, materials and scheduling.`,
    },
    {
      q: "Which areas do you serve?",
      a: `${regionLine}, California, including ${serviceAreas.flatMap((a) => a.places.slice(0, 4)).join(", ")} and many nearby communities.`,
    },
    ...(business.license
      ? [{ q: "Is V & A Flooring Inc licensed and insured?", a: `Yes. We hold California ${licenseLine(business.license)}${business.bondedInsured ? " and are bonded and insured" : ""}.${business.epaLeadSafe ? ` We are also an EPA Lead-Safe Certified Firm (${business.epaLeadSafe}).` : ""}` }]
      : []),
    {
      q: "Do you work with general contractors and architects?",
      a: `Yes. We supply and install flooring for multifamily, hospitality and commercial projects, with ${facts.installationCrewsLong.toLowerCase()}. Send drawings, finish schedules and specifications through the estimate form and we’ll review the flooring scope with you.`,
    },
  ];

  return (
    <>
      <PageHero
        kicker="Contact"
        title={"Contact V\u00a0&\u00a0A Flooring\u00a0Inc"}
        subtitle="Call, visit our Sun Valley showroom or send us a message."
        image={images.storefront}
        crumbs={[{ name: "Contact", href: routes.contact }]}
        pageType="ContactPage"
        description={description}
        actions={
          <>
            {phone && (
              <a href={telHref(phone)} className={buttonClass("light")}>
                Call {phone}
              </a>
            )}
            {directions && (
              <a href={directions} className={buttonClass("outline-light")} target="_blank" rel="noopener noreferrer">
                Get Directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
              </a>
            )}
          </>
        }
      >
        <p>
          {phone && (
            <>
              Call <a href={telHref(phone)}>{phone}</a>
              {address ? " or visit our flooring showroom at " : "."}
            </>
          )}
          {address && <>{address}.</>}
          {hours.length > 0 && <> Showroom hours: {hours.join(", ")}.</>}
        </p>
      </PageHero>

      <Section tone="white" labelledBy="ways-title">
        <Container>
          <h2 id="ways-title" className="visually-hidden">
            Ways to reach us
          </h2>
          <ul className={styles.cards}>
            {phone && (
              <li className={styles.card}>
                <h3>Call us</h3>
                <p className={styles.big}>
                  <a href={telHref(phone)}>{phone}</a>
                </p>
                <p>The fastest way to ask a question or check on a project.</p>
              </li>
            )}
            {address && (
              <li className={styles.card}>
                <h3>Visit the showroom</h3>
                <address className={styles.addr}>
                  {business.address!.streetAddress}
                  <br />
                  {business.address!.addressLocality}, {business.address!.addressRegion} {business.address!.postalCode}
                </address>
                {directions && (
                  <a href={directions} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
                    Get directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
                  </a>
                )}
              </li>
            )}
            {email && (
              <li className={styles.card}>
                <h3>Email</h3>
                <p className={styles.big}>
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </li>
            )}
            <li className={styles.card}>
              <h3>Request an estimate</h3>
              <p>Tell us about the rooms or areas, the approximate size and your timing.</p>
              <Link href={routes.estimate} className={styles.cardLink}>
                Start an estimate request
              </Link>
            </li>
            <li className={styles.card}>
              <h3>Contractors &amp; architects</h3>
              <p>Bids for multifamily, hospitality and commercial flooring, from drawings and specifications.</p>
              <Link href={routes.commercial} className={styles.cardLink}>
                Commercial &amp; multifamily flooring
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <Section tone="sand" labelledBy="message-title">
        <Container>
          <div className={styles.layout}>
            <div className={styles.formCol}>
              <p className="kicker">Send a message</p>
              <h2 id="message-title">Ask us a question</h2>
              <p className={styles.lede}>We read every message and reply by email or phone.</p>
              <ContactForm />
            </div>
            <aside className={styles.aside} aria-labelledby="hours-title">
              {hours.length > 0 && (
                <>
                  <h2 id="hours-title" className={styles.asideTitle}>
                    Showroom hours
                  </h2>
                  <ul className={styles.hours}>
                    {hours.map((h) => {
                      const [days, time] = h.split(": ");
                      return (
                        <li key={h}>
                          <span>{days}</span>
                          <span>{time}</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              {!hours.length && (
                <h2 id="hours-title" className={styles.asideTitle}>
                  Visit us
                </h2>
              )}
              {address && <p className={styles.asideAddr}>{address}</p>}
              <p className={styles.small}>
                Family owned since {business.founded}. Serving {regionLine}.
              </p>
              <ButtonLink href={routes.estimate} variant="secondary">
                Request an Estimate
              </ButtonLink>
            </aside>
          </div>
        </Container>
      </Section>

      {embed && address && (
        <Section tone="white" labelledBy="map-title">
          <Container>
            <div className={styles.mapGrid}>
              <div>
                <p className="kicker">Location</p>
                <h2 id="map-title">Find our Sun Valley showroom</h2>
                <p className={styles.lede}>
                  Our showroom, design center and warehouse are in one building at {address}, in the northeast San
                  Fernando Valley. See hardwood, laminate, vinyl plank, carpet and tile samples side by side.
                </p>
                {directions && (
                  <a href={directions} className={buttonClass("primary")} target="_blank" rel="noopener noreferrer">
                    Get Directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
                  </a>
                )}
              </div>
              <div className={styles.map}>
                {/* Shown until (or if) the embedded map loads. */}
                <p className={styles.mapFallback}>
                  {address}
                  {directions && (
                    <a href={directions} target="_blank" rel="noopener noreferrer">
                      Open in Google Maps<span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  )}
                </p>
                <iframe
                  title={`Map showing ${business.name} at ${address}`}
                  src={embed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section tone="ivory" labelledBy="facts-title">
        <Container>
          <CompanyFacts headingId="facts-title" />
        </Container>
      </Section>

      <FaqSection faqs={faqs} tone="white" id="contact-faq-title" title="Contact and visit FAQ" intro="Quick answers about reaching us, visiting the showroom and starting a project." />
    </>
  );
}
