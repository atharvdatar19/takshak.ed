import LegalLayout, { Section, P, Ul, ContactBlock } from "./LegalLayout"

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="April 27, 2025">
      <Section title="1. Overview">
        <P>
          Takshak ("we", "our", "us") is committed to protecting the privacy of students, mentors, and visitors who use our platform at takshak.ed. This Privacy Policy explains what personal data we collect, why we collect it, how it is used, and your rights under the Digital Personal Data Protection Act, 2023 (DPDP Act) and other applicable Indian laws.
        </P>
        <P>
          By using Takshak, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the platform.
        </P>
      </Section>

      <Section title="2. Information We Collect">
        <P>We collect the following categories of personal data:</P>
        <Ul items={[
          "Account information: name, email address, phone number (optional), and profile photo when you register.",
          "Academic information: exam preferences, rank/score, target colleges, stream, and study goals that you voluntarily provide.",
          "Usage data: pages visited, features used, session duration, device type, browser, and IP address (collected automatically).",
          "Communication data: messages sent in the Doubt Forum, community posts, and support emails.",
          "Transaction data: payment details processed via Razorpay for mentor sessions (we do not store card numbers; Razorpay handles PCI-DSS compliance).",
          "Mentor application data: college ID, LinkedIn URL, bio, and session rates submitted by mentor applicants.",
        ]} />
      </Section>

      <Section title="3. How We Use Your Data">
        <Ul items={[
          "To create and manage your Takshak account and provide personalised features.",
          "To match you with relevant mentors, colleges, scholarships, and exam resources.",
          "To process mentor session bookings and payments via Razorpay.",
          "To send transactional emails (session confirmations, deadline alerts, OTPs) — never marketing without consent.",
          "To improve platform features through anonymised, aggregated analytics.",
          "To detect and prevent fraud, abuse, and security threats.",
          "To comply with legal obligations under Indian law.",
        ]} />
      </Section>

      <Section title="4. Legal Basis for Processing">
        <P>
          Under the DPDP Act 2023, we process your data on the following legal bases:
        </P>
        <Ul items={[
          "Consent — for optional features like marketing preferences and cookie analytics.",
          "Contract performance — to deliver services you have subscribed to or booked.",
          "Legitimate interests — for fraud prevention, platform security, and improving our services.",
          "Legal obligation — to comply with applicable Indian laws and regulatory requirements.",
        ]} />
      </Section>

      <Section title="5. Data Sharing">
        <P>We do not sell your personal data. We share data only with:</P>
        <Ul items={[
          "Mentors — your name and session topic are shared with the mentor you book.",
          "Razorpay — for processing payments; governed by Razorpay's Privacy Policy.",
          "Supabase & Firebase — cloud infrastructure providers under data processing agreements.",
          "Vercel — hosting provider; processes server logs under their DPA.",
          "Law enforcement — if required by a valid court order or statutory obligation under Indian law.",
        ]} />
      </Section>

      <Section title="6. Cookies">
        <P>
          We use essential cookies required for authentication and platform functionality, and optional analytics cookies to understand usage patterns. You can manage your cookie preferences at any time via our{" "}
          <a href="/cookies" className="text-indigo-400 hover:underline">Cookie Policy</a> page or the cookie banner.
        </P>
      </Section>

      <Section title="7. Data Retention">
        <Ul items={[
          "Active account data: retained as long as your account is active.",
          "Deleted account data: permanently purged within 30 days of deletion request.",
          "Transaction records: retained for 7 years as required under Indian tax law.",
          "Forum posts and community content: may be retained in anonymised form for platform integrity.",
        ]} />
      </Section>

      <Section title="8. Your Rights (DPDP Act 2023)">
        <P>As a data principal under the DPDP Act, you have the right to:</P>
        <Ul items={[
          "Access — request a copy of personal data we hold about you.",
          "Correction — request correction of inaccurate or incomplete data.",
          "Erasure — request deletion of your data (subject to legal retention requirements).",
          "Grievance redressal — raise a complaint with our Grievance Officer within 48 business hours of response.",
          "Withdraw consent — at any time for consent-based processing, without affecting prior lawful processing.",
          "Nominate — designate another person to exercise your rights in case of incapacity.",
        ]} />
        <P>To exercise any right, email us at <a href="mailto:takshak.info@gmail.com" className="text-indigo-400 hover:underline">takshak.info@gmail.com</a>. We will respond within 72 hours.</P>
      </Section>

      <Section title="9. Children's Privacy">
        <P>
          Takshak is designed for students aged 15 and above. Students under 18 should use the platform with parental awareness. We do not knowingly collect data from children under 13. If we discover such data, it will be promptly deleted.
        </P>
      </Section>

      <Section title="10. Security">
        <P>
          We implement industry-standard security measures including TLS encryption in transit, row-level security in our Supabase database, Firebase Authentication with JWT tokens, and regular security reviews. However, no system is 100% secure and we encourage you to use a strong, unique password.
        </P>
      </Section>

      <Section title="11. Changes to This Policy">
        <P>
          We may update this Privacy Policy periodically. Material changes will be notified via email or a prominent in-app notice at least 7 days before taking effect. Continued use after the effective date constitutes acceptance.
        </P>
      </Section>

      <Section title="12. Grievance Officer">
        <P>In accordance with the Information Technology Act, 2000 and DPDP Act, 2023, our Grievance Officer is:</P>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-[12px] text-slate-400 space-y-1 mt-2">
          <p><span className="text-white font-semibold">Name:</span> Atharv Datar</p>
          <p><span className="text-white font-semibold">Organisation:</span> Takshak</p>
          <p><span className="text-white font-semibold">Email:</span> <a href="mailto:takshak.info@gmail.com" className="text-indigo-400 hover:underline">takshak.info@gmail.com</a></p>
          <p><span className="text-white font-semibold">Response time:</span> Within 48 business hours</p>
        </div>
      </Section>

      <ContactBlock />
    </LegalLayout>
  )
}
