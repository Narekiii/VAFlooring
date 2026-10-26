import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { InquiryCta } from "@/components/home/InquiryCta";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { publishedServices, serviceAreas, serviceHref } from "@/content/services";
import { business, directionsHref, hoursLines, licenseLine, regionLine, telHref } from "@/content/site";
import { FaqSection } from "@/components/home/FaqSection";
import { buttonClass } from "@/components/ui/Button";
import type { Faq } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const description =
  "Flooring installation across Los Angeles, Orange and Ventura counties, from Sun Valley, Burbank and Glendale to Santa Clarita, Irvine and Thousand Oaks.";

export const metadata = pageMetadata({
  title: "Flooring Contractor: LA, Orange & Ventura",
  description,
  path: routes.serviceAreas,
  image: images.storefront,
});

export default function ServiceAreasPage() {
  const a = business.address;
  const hours = hoursLines();
  const directions = directionsHref();
  const faqs: Faq[] = [
    {
      q: "Which areas does V & A Flooring Inc serve?",
      a: `We supply and install flooring across ${regionLine}, California. Our showroom is in Sun Valley, and we regularly work throughout the San Fernando Valley, Burbank, Glendale, Pasadena and Santa Clarita, as well as Orange and Ventura counties.`,
    },
    {
      q: "My city isn’t listed. Can you still help?",
      a: "Very likely. The lists on this page include many, but not all, of the communities we serve. If your project is in Los Angeles, Orange or Ventura county, send us the city or ZIP code and we’ll confirm.",
    },
    {
      q: "Do you handle both homes and commercial projects in these areas?",
      a: `Yes. We install flooring for home renovations and ADUs as well as multifamily, hospitality and commercial projects, with more than 20 installation crews.${business.license ? ` All work is performed under California ${licenseLine(business.license)}.` : ""}`,
    },
    ...(a
      ? [
          {
            q: "Can I see flooring samples before choosing?",
            a: `Yes. Our showroom at ${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode} has hardwood, laminate, luxury vinyl plank, carpet and tile samples side by side${hours.length ? ` (${hours.join("; ")})` : ""}.`,
          },
        ]
      : []),
  ];
  return (
    <>
      <PageHero
        description={description}
        kicker="Service areas"
        title="Flooring Installation in Los Angeles, Orange & Ventura Counties"
        image={images.storefront}
        crumbs={[{ name: "Service Areas", href: routes.serviceAreas }]}
        actions={
          <>
            <ButtonLink href={routes.estimate} variant="light">
              Request an Estimate
            </ButtonLink>
            {business.phone && (
              <a className={styles.call} href={telHref(business.phone)}>
                Call {business.phone}
              </a>
            )}
          </>
        }
      >
        <p>
          V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc is based in Sun Valley, in the San Fernando Valley, and supplies and installs
          flooring for homes, ADUs, apartment communities, hotels and commercial projects across Los Angeles, Orange and
          Ventura counties.
        </p>
      </PageHero>

      <Section tone="white" labelledBy="areas-title">
        <Container>
          <SectionHead id="areas-title" kicker="Where we work" title="Cities and communities we serve">
            <p>
              The list below includes many of the communities we serve. If your project is in Los Angeles, Orange or
              Ventura county and your city isn’t listed, ask us.
            </p>
          </SectionHead>
          <div className={styles.counties}>
            {serviceAreas.map((c) => (
              <section key={c.county} className={styles.county} aria-labelledby={`c-${c.county.split(" ")[0]}`}>
                <h3 id={`c-${c.county.split(" ")[0]}`}>Flooring installation in {c.county}</h3>
                <p className={styles.countyIntro}>{c.intro}</p>
                <ul className={styles.places}>
                  {c.places.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ivory" labelledBy="svc-title">
        <Container>
          <SectionHead id="svc-title" kicker="Services" title="Flooring we install throughout the region" />
          <ul className={styles.services}>
            {publishedServices.map((s) => (
              <li key={s.slug}>
                <Link href={serviceHref(s)}>{s.name}</Link>
                <p>{s.cardText}</p>
              </li>
            ))}
            <li>
              <Link href={routes.residential}>Residential Flooring</Link>
              <p>Home renovations, single rooms and ADUs.</p>
            </li>
            <li>
              <Link href={routes.commercial}>Commercial &amp; Multifamily Flooring</Link>
              <p>Apartment communities, hotels and commercial projects with 20+ installation crews.</p>
            </li>
          </ul>
        </Container>
      </Section>

      {a && (
        <Section tone="sand" compact labelledBy="loc-title">
          <Container>
            <div className={styles.location}>
              <div>
                <h2 id="loc-title">Visit our Sun Valley showroom</h2>
                {hours.length > 0 && <p className={styles.locHours}>{hours.join(" · ")}</p>}
                {directions && (
                  <a href={directions} className={buttonClass("primary")} target="_blank" rel="noopener noreferrer">
                    Get Directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
                  </a>
                )}
              </div>
              <address>
                <strong>{business.name}</strong>
                <br />
                {a.streetAddress}
                <br />
                {a.addressLocality}, {a.addressRegion} {a.postalCode}
                {business.phone && (
                  <>
                    <br />
                    <a href={telHref(business.phone)}>{business.phone}</a>
                  </>
                )}
              </address>
            </div>
          </Container>
        </Section>
      )}

      <FaqSection faqs={faqs} tone="white" id="areas-faq-title" title="Service area FAQ" intro="Where we work and how to check whether we cover your project." />

      <InquiryCta />
    </>
  );
}
