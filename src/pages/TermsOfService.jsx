import LegalLayout, { Section, P, Ul, ContactBlock } from "./LegalLayout"

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="April 27, 2025">
      <Section title="1. Acceptance of Terms">
        <P>
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and Takshak ("Platform", "we", "us") governing your access to and use of the Takshak website and services. By registering, accessing, or using Takshak, you confirm that you are at least 13 years of age and agree to be bound by these Terms.
        </P>
        <P>
          If you are under 18, you represent that your parent or guardian is aware of your use of the platform. If you do not agree to these Terms, do not use Takshak.
        </P>
      </Section>

      <Section title="2. Description of Services">
        <P>Takshak provides the following services ("Services"):</P>
        <Ul items={[
          "College discovery, cutoff prediction, and rank analysis tools for Indian entrance exams (JEE, NEET, CUET, MHT-CET, etc.).",
          "Scholarship discovery and application tracking.",
          "Study planning, resource hub, bridge courses, and document checklists.",
          "1:1 mentor session booking with verified student mentors via Google Meet.",
          "Community forum for academic doubt-solving, pre-freshers connect, and wellness check-ins.",
          "A peer marketplace for buying and selling study materials.",
        ]} />
        <P>
          Takshak is an educational guidance platform. We do not guarantee admission to any college, a specific exam score, or scholarship award.
        </P>
      </Section>

      <Section title="3. User Accounts">
        <Ul items={[
          "You must provide accurate, current, and complete information during registration.",
          "You are responsible for maintaining the confidentiality of your account credentials.",
          "You must notify us immediately at takshak.info@gmail.com if you suspect unauthorised access to your account.",
          "Each user may maintain only one account. Duplicate accounts may be suspended.",
          "Accounts are non-transferable.",
        ]} />
      </Section>

      <Section title="4. Mentor Sessions — Booking, Payments & Refunds">
        <Ul items={[
          "Mentor sessions are booked and paid for through Takshak. Payments are processed by Razorpay and are subject to Razorpay's terms.",
          "Mentors are independent service providers, not employees of Takshak.",
          "The first 10 minutes of a first session with any mentor are free, where offered.",
          "Cancellations made more than 24 hours before the scheduled session are eligible for a full refund.",
          "Cancellations within 24 hours of the session are non-refundable unless the mentor cancels.",
          "Takshak charges a platform commission on each completed session. This is deducted before mentor payout.",
          "Disputes between students and mentors must be raised within 48 hours of the session via takshak.info@gmail.com.",
        ]} />
      </Section>

      <Section title="5. Acceptable Use">
        <P>You agree not to:</P>
        <Ul items={[
          "Use Takshak for any unlawful purpose or in violation of any Indian law, including the IT Act 2000.",
          "Post false, misleading, defamatory, obscene, or harmful content in the forum or community.",
          "Harass, bully, or abuse other users or mentors.",
          "Attempt to access other users' accounts, the admin panel, or backend systems without authorisation.",
          "Scrape, crawl, or harvest data from Takshak without prior written permission.",
          "Use the platform to advertise third-party services, coaching institutes, or competitors.",
          "Impersonate another person, mentor, or Takshak staff member.",
          "Upload malware, viruses, or any code designed to disrupt platform functionality.",
        ]} />
      </Section>

      <Section title="6. Content & Intellectual Property">
        <P>
          All platform content including text, graphics, UI design, logos, and code is the intellectual property of Takshak and protected under the Copyright Act, 1957. You may not reproduce, distribute, or create derivative works without explicit written permission.
        </P>
        <P>
          By posting content (forum posts, community updates, marketplace listings), you grant Takshak a non-exclusive, royalty-free licence to display and distribute that content on the platform. You retain ownership of your content.
        </P>
      </Section>

      <Section title="7. Marketplace">
        <P>
          The peer marketplace allows students to list study materials for sale. Takshak acts only as a facilitating platform and is not a party to any transaction between buyers and sellers. We make no warranties regarding the quality, accuracy, or legality of listed items. Users transact at their own risk.
        </P>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <P>
          Takshak is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses. Cutoff predictions and rank analysis are estimates based on historical data and are not guarantees of admission.
        </P>
      </Section>

      <Section title="9. Limitation of Liability">
        <P>
          To the maximum extent permitted by applicable Indian law, Takshak and its founders shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of data, admission opportunities, or revenue. Our total aggregate liability shall not exceed the amount you paid us in the 3 months preceding the claim.
        </P>
      </Section>

      <Section title="10. Termination">
        <P>
          We reserve the right to suspend or permanently terminate accounts that violate these Terms, without prior notice in cases of serious violation. You may delete your account at any time from account settings. Termination does not affect any rights or obligations accrued prior to termination.
        </P>
      </Section>

      <Section title="11. Governing Law & Dispute Resolution">
        <P>
          These Terms are governed by the laws of India. Any disputes shall first be attempted to be resolved through mutual negotiation. If unresolved, disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
        </P>
      </Section>

      <Section title="12. Changes to Terms">
        <P>
          We may modify these Terms at any time. Material changes will be communicated via email and/or an in-app notice at least 7 days before taking effect. Continued use of Takshak after the effective date constitutes your acceptance of the revised Terms.
        </P>
      </Section>

      <ContactBlock />
    </LegalLayout>
  )
}
