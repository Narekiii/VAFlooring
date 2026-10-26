import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { credentials } from "@/content/credentials";
import { TextLink } from "@/components/ui/TextLink";
import { routes } from "@/content/navigation";
import { CredentialGallery } from "./CredentialGallery";

type Props = { limit?: number; tone?: "white" | "ivory" | "sand"; id?: string };

/** Licenses, certifications and recognition, shown as photos of the original documents. */
export function Credentials({ limit, tone = "white", id = "credentials-title" }: Props) {
  const items = limit ? credentials.slice(0, limit) : credentials;
  return (
    <Section tone={tone} labelledBy={id}>
      <Container>
        <SectionHead id={id} kicker="Licenses & certifications" title="Licensed, certified and recognized">
          <p>
            V&nbsp;&amp;&nbsp;A Flooring Inc holds California contractor license #866991 and is an EPA Lead-Safe
            Certified Firm. Our installers have also been recognized by Lowe’s for craftsmanship, professionalism and
            dedication. Select a document to view it larger.
          </p>
        </SectionHead>
        <CredentialGallery items={items} headingId={id} />
        {limit && credentials.length > limit && (
          <p style={{ marginTop: "var(--space-6)" }}>
            <TextLink href={`${routes.story}#credentials-title`}>See all certificates and recognition</TextLink>
          </p>
        )}
        <p className="credentials-note">
          Lowe’s, CSLB and EPA marks appear as printed on the original documents and belong to their owners; their
          display does not imply endorsement of this website.
        </p>
      </Container>
    </Section>
  );
}
