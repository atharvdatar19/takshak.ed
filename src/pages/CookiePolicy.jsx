import LegalLayout, { Section, P, Ul, ContactBlock } from "./LegalLayout"

const TABLE_ROWS = [
  { name: "takshak_auth_token",   type: "Essential",  purpose: "Firebase authentication session token",                    duration: "Session" },
  { name: "takshak_cookie_consent", type: "Essential", purpose: "Stores your cookie consent preference",                   duration: "1 year"  },
  { name: "takshak_theme",        type: "Functional", purpose: "Remembers your light/dark mode preference",                duration: "1 year"  },
  { name: "takshak_cmd_recent",   type: "Functional", purpose: "Stores recently visited pages for command palette",        duration: "30 days" },
  { name: "_ga, _ga_*",          type: "Analytics",  purpose: "Google Analytics — anonymised usage statistics",           duration: "2 years" },
  { name: "sb-access-token",     type: "Essential",  purpose: "Supabase session token for database access",               duration: "Session" },
]

export default function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="April 27, 2025">
      <Section title="1. What Are Cookies?">
        <P>
          Cookies are small text files placed on your device when you visit a website. They help the website remember your actions and preferences over time, so you don't have to re-enter them each visit. Cookies may be "session" cookies (deleted when you close your browser) or "persistent" cookies (stored for a set period).
        </P>
      </Section>

      <Section title="2. How TAKक्षक Uses Cookies">
        <P>We use cookies for four purposes:</P>
        <Ul items={[
          "Essential cookies — required for core functionality such as login sessions and security. These cannot be disabled.",
          "Functional cookies — remember your preferences (theme, recent pages) to improve your experience.",
          "Analytics cookies — help us understand how features are used so we can improve the platform. These are anonymised and do not identify you personally.",
          "No advertising cookies — TAKक्षक does not use third-party advertising or tracking cookies for ad targeting.",
        ]} />
      </Section>

      <Section title="3. Cookies We Use">
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-[14px] border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {["Cookie Name", "Type", "Purpose", "Duration"].map(h => (
                  <th key={h} className="text-left text-[9px] font-black uppercase tracking-wider text-slate-500 pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {TABLE_ROWS.map(r => (
                <tr key={r.name}>
                  <td className="py-2.5 pr-4 font-mono text-indigo-300 text-[10px]">{r.name}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border ${
                      r.type === "Essential"  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/15" :
                      r.type === "Functional" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/15"
                    }`}>{r.type}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">{r.purpose}</td>
                  <td className="py-2.5 text-slate-500">{r.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="4. Managing Your Cookie Preferences">
        <P>
          When you first visit TAKक्षक, a cookie consent banner will appear. You can:
        </P>
        <Ul items={[
          "Accept All — enable all cookies including analytics.",
          "Essential Only — accept only cookies required for the platform to function.",
          "Withdraw consent at any time by clearing your browser cookies or clicking 'Manage Cookies' in the footer.",
        ]} />
        <P>
          You can also manage cookies directly through your browser settings. Note that disabling essential cookies will prevent login and core features from working.
        </P>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-[12px] text-slate-400 mt-2">
          <p className="text-white font-semibold mb-2 text-[14px]">Browser cookie guides:</p>
          <div className="grid grid-cols-2 gap-1 text-[14px]">
            {[
              ["Chrome", "https://support.google.com/chrome/answer/95647"],
              ["Firefox", "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"],
              ["Safari", "https://support.apple.com/en-in/guide/safari/sfri11471/mac"],
              ["Edge", "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge"],
            ].map(([browser, url]) => (
              <a key={browser} href={url} target="_blank" rel="noopener noreferrer"
                className="text-indigo-400 hover:underline">{browser} →</a>
            ))}
          </div>
        </div>
      </Section>

      <Section title="5. Third-Party Cookies">
        <Ul items={[
          "Google Analytics — we use GA4 with IP anonymisation enabled. Google may set _ga and _ga_* cookies. You can opt out via Google's opt-out browser add-on.",
          "Firebase (Google) — sets session cookies for authentication. Required for login.",
          "Razorpay — may set session cookies during the payment flow. These are essential and governed by Razorpay's Cookie Policy.",
        ]} />
      </Section>

      <Section title="6. Do Not Track">
        <P>
          Some browsers transmit a "Do Not Track" signal. TAKक्षक respects this signal and will not activate optional analytics cookies if DNT is enabled in your browser.
        </P>
      </Section>

      <Section title="7. Updates to This Policy">
        <P>
          We may update this Cookie Policy to reflect changes in the cookies we use or applicable regulations. Updates will be posted on this page with a revised "Last Updated" date. Continued use of TAKक्षक constitutes acceptance of the updated policy.
        </P>
      </Section>

      <ContactBlock />
    </LegalLayout>
  )
}
