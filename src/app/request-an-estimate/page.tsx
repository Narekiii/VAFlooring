import { Figure } from "@/components/ui/Figure";
import { images } from "@/content/images";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { EstimateForm } from "@/components/contact/EstimateForm";
import { routes } from "@/content/navigation";
import { business, facts, regionLine, telHref, hoursLines } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const description =
  "Request an estimate for hardwood, laminate, LVP, carpet or tile flooring in Los Angeles, Orange or Ventura counties. We follow up to discuss scope and timing.";

export const metadata = pageMetadata({
  title: "Request a Flooring Estimate in Los Angeles",
  description,
  path: routes.estimate,
  image: images.storefront,
});

const next = [
  { title: "We review your request", body: "We read through the details you send so the first conversation is useful." },
  {
    title: "We contact you",
    body: "We’ll reach out to talk through the scope, the materials you’re considering and the timing you have in mind.",
  },
  {
    title: "We prepare your estimate",
    body: "We’ll let you know what we need to price the work accurately, such as measurements, drawings or specifications.",
  },
];

export default function EstimatePage() {
  const { phone, email, address } = business;
  const hours = hoursLines();
  return (
    <>
      <PageHero
        description={description}
        kicker="Contact"
        title="Request a Flooring Estimate"
        subtitle="Let’s talk about your project."
        crumbs={[{ name: "Request an Estimate", href: routes.estimate }]}
      >
        <p>
          Share a few details and we’ll follow up to discuss what you have in mind. There’s no obligation, and you
          don’t need every answer yet.
        </p>
      </PageHero>

      <Section tone="sand" compact>
        <Container>
          <div className={styles.layout}>
            <div className={styles.formCol}>
              <h2 className="visually-hidden">Project details</h2>
              <EstimateForm />
            </div>
            <aside className={styles.aside} aria-labelledby="next-steps">
              <h2 id="next-steps" className={styles.asideTitle}>
                What happens next
              </h2>
              <ol className={styles.steps}>
                {next.map((s) => (
                  <li key={s.title}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>

              {(phone || email || address || hours.length > 0) && (
                <div className={styles.contact}>
                  <h2 className={styles.asideTitle}>Contact V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc</h2>
                  <ul className={styles.contactList}>
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
                    <Figure
                      image={images.storefront}
                      ratio="16 / 9"
                      sizes="(min-width: 64rem) 22rem, 100vw"
                      caption="Our showroom and design center in Sun Valley."
                      className={styles.storefront}
                    />
                  )}
                  {address && (
                    <address className={styles.address}>
                      {address.streetAddress}
                      <br />
                      {address.addressLocality}, {address.addressRegion} {address.postalCode}
                    </address>
                  )}
                  {hours.length > 0 && (
                    <ul className={styles.hours}>
                      {hours.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <p className={styles.small}>
                Family owned since {business.founded}, with {facts.installationCrewsLong.toLowerCase()} serving{" "}
                {regionLine}.
              </p>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
