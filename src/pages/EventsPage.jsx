import { useState, useEffect, useRef, useCallback } from "react"
import WaveBackground from "@components/ui/WaveBackground"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Calendar, MapPin, Clock, Users, ExternalLink, ArrowRight,
  Instagram, ChevronDown, GraduationCap, Play, Sparkles, Shield,
} from "lucide-react"

/* ─── FAQ data ───────────────────────────────────────────── */
const FAQS = [
  {
    q: "Are TAKक्षक seminars free to attend?",
    a: "Yes — our seminars are completely free for all students. We believe guidance from seniors who've been there shouldn't have a price tag.",
  },
  {
    q: "How do I get notified about the next event?",
    a: "Follow @takshak.ed on Instagram. Every new event is announced there first, along with registration details.",
  },
  {
    q: "Who are the mentors at TAKक्षक seminars?",
    a: "Our mentors are people who recently cracked competitive exams — NDA, JEE, NEET, UPSC. They remember exactly what it takes and share guidance that's honest and practical.",
  },
  {
    q: "Can I watch the recording of this webinar?",
    a: "Yes! The full recording of our NDA webinar is available on this page. Scroll down to the recording section.",
  },
  {
    q: "Will TAKक्षक host more seminars?",
    a: "Absolutely. Our first webinar was just the beginning. Many more sessions across different streams are planned. Follow us to stay updated.",
  },
]

/* ─── cursor spotlight ───────────────────────────────────── */
function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 })
  useEffect(() => {
    const fn = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", fn)
    return () => window.removeEventListener("mousemove", fn)
  }, [])
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-500"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(245,158,11,0.05), transparent 50%)`,
      }}
    />
  )
}

/* ─── Instagram post card (reliable, no iframe) ──────────── */
function InstagramCard({ url, label, caption, date }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
    >
      {label && (
        <p
          className="text-[11px] font-semibold uppercase tracking-widest text-white/30"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {label}
        </p>
      )}

      {/* Instagram header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shrink-0">
          <Instagram size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            @takshak.ed
          </p>
          <p className="text-[11px] text-white/35" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{date}</p>
        </div>
        <ExternalLink size={14} className="ml-auto text-white/25 group-hover:text-white/50 transition-colors" />
      </div>

      {/* caption */}
      <p
        className="text-[14px] text-white/65 leading-relaxed"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {caption}
      </p>

      {/* view CTA */}
      <span
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-pink-400 group-hover:text-pink-300 transition-colors"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Instagram size={12} />
        View post on Instagram
      </span>
    </a>
  )
}

/* ─── FAQ accordion item ─────────────────────────────────── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="border border-white/[0.07] rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span
          className="text-[15px] font-semibold text-white/90 leading-snug"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {q}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-amber-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p
              className="px-6 pb-5 text-[14px] text-white/55 leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── JSON-LD schemas ────────────────────────────────────── */
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "TAKक्षक NDA Prep Webinar — Strategy, Doubts & Real Guidance",
  "startDate": "2026-03-31T18:00:00+05:30",
  "endDate": "2026-03-31T20:00:00+05:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://takshak.ed/events",
  },
  "description": "A free 2-hour online webinar for NDA aspirants — covering last-minute topics, prep strategies, and honest guidance from seniors who have cleared the NDA exam.",
  "organizer": {
    "@type": "Organization",
    "name": "TAKक्षक",
    "url": "https://takshak.ed",
    "sameAs": ["https://www.instagram.com/takshak.ed/"],
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "NDA aspirants and defence exam students in India",
  },
  "isAccessibleForFree": true,
  "inLanguage": ["hi", "en"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://takshak.ed" },
    { "@type": "ListItem", "position": 2, "name": "Mentors", "item": "https://takshak.ed/mentors" },
    { "@type": "ListItem", "position": 3, "name": "Events & Seminars", "item": "https://takshak.ed/events" },
  ],
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "TAKक्षक",
  "alternateName": "Takshak",
  "url": "https://takshak.ed",
  "description": "India's peer-mentor platform connecting competitive exam aspirants with toppers and alumni from IIT, AIIMS, IIM, NDA and other premier institutions.",
  "sameAs": ["https://www.instagram.com/takshak.ed/"],
  "address": { "@type": "PostalAddress", "addressCountry": "IN" },
  "areaServed": "India",
  "foundingDate": "2024",
}

/* ─── page ───────────────────────────────────────────────── */
export default function EventsPage() {
  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>TAKक्षक Events — NDA Prep Webinar | Free Guidance for Defence Aspirants</title>
        <meta
          name="description"
          content="TAKक्षक hosted its first free NDA prep webinar on March 31, 2026 — 2 hours of honest guidance on last-minute strategy, doubts, and insights from seniors who've cleared NDA. Watch the recording."
        />
        <meta
          name="keywords"
          content="NDA prep webinar free, NDA seminar online, defence exam guidance, NDA strategy session, takshak nda webinar, NDA last minute tips, free NDA coaching session India"
        />
        <link rel="canonical" href="https://takshak.ed/events" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="TAKक्षक" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TAKक्षक Events — Free NDA Prep Webinar" />
        <meta
          property="og:description"
          content="Our first free webinar for NDA aspirants — 2 hours of real guidance from seniors. Watch the full recording."
        />
        <meta property="og:url" content="https://takshak.ed/events" />
        <meta property="og:site_name" content="TAKक्षक" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@takshak_ed" />
        <meta name="twitter:title" content="TAKक्षक Events — Free NDA Prep Webinar" />
        <meta
          name="twitter:description"
          content="Our first free webinar for NDA aspirants — last-minute strategy, doubts, and real talk from seniors who've been there."
        />

        {/* GEO */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        <meta name="content-language" content="en-IN" />
        <meta httpEquiv="content-language" content="en-IN" />

        {/* AEO */}
        <meta name="category" content="Education, Events, Defence Exams" />
        <meta name="coverage" content="India" />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="relative min-h-screen bg-[#07080f] text-white overflow-hidden">
        <WaveBackground />
        <CursorSpotlight />

        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="relative z-10 pt-20 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-[13px] font-medium text-amber-300"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Shield size={14} />
              Events &amp; Seminars · TAKक्षक
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              Small steps.{" "}
              <span className="italic bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Meaningful impact.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-xl mx-auto text-[16px] sm:text-[17px] text-white/50 leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              This is where it started — an honest conversation between seniors
              who cleared NDA and students who are on that path.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <a
                href="#recording"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[14px] font-semibold shadow-lg shadow-amber-500/25 hover:scale-[1.03] transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Play size={15} />
                Watch Recording
              </a>
              <Link
                to="/mentors"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/[0.12] text-white/60 text-[14px] font-semibold hover:border-white/25 hover:text-white transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Meet the mentors
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── BREADCRUMB ──────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="relative z-10 max-w-6xl mx-auto px-4 pb-6">
          <ol
            className="flex items-center gap-2 text-[12px] text-white/25"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <li><Link to="/" className="hover:text-white/50 transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/mentors" className="hover:text-white/50 transition-colors">Mentors</Link></li>
            <li>/</li>
            <li className="text-white/45">Events &amp; Seminars</li>
          </ol>
        </nav>

        {/* ── EVENT CARD ──────────────────────────────────────── */}
        <section className="relative z-10 py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] to-transparent overflow-hidden"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_60%)] pointer-events-none" />

              <div className="relative p-8 md:p-10 space-y-6">
                {/* badge */}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-400"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <Shield size={10} />
                    Defence · NDA
                  </span>
                  <span
                    className="text-[11px] px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-white/35"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Our first seminar
                  </span>
                </div>

                {/* title */}
                <h2
                  className="text-[26px] sm:text-[30px] font-bold text-white leading-snug"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  NDA Prep Webinar — Strategy, Doubts &amp; Real Guidance
                </h2>

                {/* description */}
                <p
                  className="text-[15px] text-white/55 leading-relaxed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Last-minute topics. Prep tricks that actually work. Real guidance from seniors
                  who've been there — not a lecture, a conversation. We covered everything
                  an NDA aspirant needs to hear from someone who's already crossed the finish line.
                </p>

                {/* meta chips */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Calendar, text: "March 31, 2026" },
                    { icon: Clock,    text: "6 – 8 PM IST" },
                    { icon: MapPin,   text: "Online" },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="inline-flex items-center gap-1.5 text-[13px] text-white/50 px-3 py-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <Icon size={13} className="text-amber-400/70" />
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── INSTAGRAM POSTS ─────────────────────────────────── */}
        <section className="relative z-10 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                From our Instagram
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[14px] text-white/40"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                The announcement that started it all, and how it went.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <InstagramCard
                  url="https://www.instagram.com/p/DWa003kCCv4/"
                  label="The announcement"
                  date="March 2026"
                  caption="Last-minute topics? Prep tricks that actually work? Real guidance from seniors who've been there? Join us for a free NDA prep webinar — no lectures, just honest conversation. 🎖️ #nda #ndaexam #freewebinar"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <InstagramCard
                  url="https://www.instagram.com/p/DWl9N7kiBuY/"
                  label="After the seminar"
                  date="April 1, 2026"
                  caption="Grateful, humbled, and more driven than ever. Our NDA webinar turned out to be an incredible experience. The guidance shared by our mentors truly resonated with the students. This is just the beginning. — Team Takshak 🙏 #nda #webinar #education"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── RECORDING ───────────────────────────────────────── */}
        <section id="recording" className="relative z-10 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Watch the full session
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[14px] text-white/40"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                2 hours of honest NDA guidance — watch it at your own pace.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-black shadow-2xl"
              style={{ aspectRatio: "16/9" }}
            >
              <iframe
                src="https://drive.google.com/file/d/1efvj6hCC3WTveahkVp6AE6yyBc40HGx5/preview"
                title="TAKक्षक NDA Prep Webinar — March 31, 2026"
                className="absolute inset-0 w-full h-full"
                allow="autoplay"
                allowFullScreen
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex justify-center"
            >
              <a
                href="https://drive.google.com/file/d/1efvj6hCC3WTveahkVp6AE6yyBc40HGx5/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] text-white/35 hover:text-white/60 transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <ExternalLink size={13} />
                Open in Google Drive
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── POST-EVENT QUOTE ─────────────────────────────────── */}
        <section className="relative z-10 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8 md:p-10 text-center space-y-4"
            >
              <div className="text-4xl text-amber-400/40 font-serif leading-none select-none">"</div>
              <p
                className="text-[17px] sm:text-[19px] text-white/80 leading-relaxed italic"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Grateful, humbled, and more driven than ever. The guidance shared by our mentors
                truly resonated with the students, and the positive feedback we received means
                everything to us.
              </p>
              <p
                className="text-[13px] text-white/35 font-medium"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                — Team TAKक्षक, April 1, 2026
              </p>
            </motion.blockquote>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section id="faq" className="relative z-10 py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Questions
              </motion.h2>
            </div>
            <div className="space-y-2">
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── FOLLOW CTA ──────────────────────────────────────── */}
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-8 md:p-12 text-center space-y-6 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />

              <div className="relative">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/25 mb-5">
                  <Instagram size={24} className="text-white" />
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  More sessions are coming
                </h2>
                <p
                  className="text-[15px] text-white/50 max-w-md mx-auto leading-relaxed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Follow @takshak.ed on Instagram to be the first to know about the next event.
                </p>
              </div>

              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://www.instagram.com/takshak.ed/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-[14px] font-semibold shadow-lg hover:scale-[1.03] transition-all duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Instagram size={16} />
                  Follow @takshak.ed
                  <ExternalLink size={12} className="opacity-70" />
                </a>
                <Link
                  to="/mentors"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/[0.10] text-white/55 text-[14px] font-medium hover:text-white hover:border-white/20 transition-all duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Browse mentors
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="h-16" />
      </div>
    </>
  )
}
