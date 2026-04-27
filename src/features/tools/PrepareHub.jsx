import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import {
  Youtube,
  Layers,
  CalendarCheck,
  FileCheck,
  ShoppingBag,
  Lightbulb,
  HeartPulse,
  ArrowRight,
  Zap,
} from "lucide-react"

const HUB_CARDS = [
  {
    to: "/resources",
    icon: Youtube,
    label: "Resource Hub",
    description: "Curated playlists from PW, Vedantu, Khan Academy and 50+ educators for JEE, NEET & more.",
    tag: "Free Resources",
    tagColor: "#ef4444",
    auth: false,
  },
  {
    to: "/bridge",
    icon: Layers,
    label: "Bridge Courses",
    description: "Learn Python, Excel, communication, financial literacy — skills your college won't teach.",
    tag: "Skill Up",
    tagColor: "#6366f1",
    auth: true,
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    label: "Study Planner",
    description: "Set goals, log study sessions, track subject-wise hours and visualise your progress.",
    tag: "Stay on Track",
    tagColor: "#10b981",
    auth: true,
  },
  {
    to: "/documents",
    icon: FileCheck,
    label: "Document Checklist",
    description: "Never miss a document. Track Aadhaar, marksheets, certificates college-by-college.",
    tag: "Admission Ready",
    tagColor: "#f59e0b",
    auth: true,
  },
  {
    to: "/marketplace",
    icon: ShoppingBag,
    label: "Buy/Sell Materials",
    description: "Buy verified JEE/NEET modules, books and notes from seniors at fraction of the price.",
    tag: "Save Money",
    tagColor: "#8b5cf6",
    auth: true,
  },
  {
    to: "/skill-matcher",
    icon: Lightbulb,
    label: "AI Skill Matcher",
    description: "Tell us your skills and interests — get matched with income paths and career options.",
    tag: "AI Powered",
    tagColor: "#06b6d4",
    auth: true,
  },
  {
    to: "/wellness",
    icon: HeartPulse,
    label: "Wellness Check-in",
    description: "Log daily stress and mood. Spot burnout patterns before they derail your preparation.",
    tag: "Mental Health",
    tagColor: "#ec4899",
    auth: true,
  },
]

export default function PrepareHub() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Prepare — TAKक्षक</title>
      </Helmet>

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
              style={{ background: "var(--accent-glow)", color: "var(--obsidian-primary)" }}
            >
              <Zap size={10} /> Prepare
            </span>
          </div>
          <h1 className="text-3xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>
            Build Your Edge
          </h1>
          <p className="text-base" style={{ color: "var(--obsidian-on-surface-variant)" }}>
            All your preparation tools in one place — study, learn, track and stay healthy.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HUB_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.to}
                type="button"
                onClick={() => navigate(card.to)}
                className="group relative flex flex-col gap-4 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--obsidian-surface)",
                  border: "1px solid var(--obsidian-outline-variant)",
                  boxShadow: "0 1px 3px var(--shadow-glass)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 32px var(--shadow-glass), 0 0 0 1px ${card.tagColor}30`
                  e.currentTarget.style.borderColor = `${card.tagColor}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px var(--shadow-glass)"
                  e.currentTarget.style.borderColor = "var(--obsidian-outline-variant)"
                }}
              >
                {/* Icon + auth badge row */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${card.tagColor}15` }}
                  >
                    <Icon size={22} style={{ color: card.tagColor }} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: `${card.tagColor}15`,
                        color: card.tagColor,
                        border: `1px solid ${card.tagColor}30`,
                      }}
                    >
                      {card.tag}
                    </span>
                    {card.auth && (
                      <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                        Login required
                      </span>
                    )}
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-[15px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
                    {card.label}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                    {card.description}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="flex items-center gap-1 text-[12px] font-bold transition-all group-hover:gap-2"
                  style={{ color: card.tagColor }}
                >
                  Open <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
