import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import {
  GraduationCap,
  Clock,
  TrendingUp,
  Award,
  GitCompare,
  BarChart3,
  Map,
  ArrowRight,
  Sparkles,
} from "lucide-react"

const HUB_CARDS = [
  {
    to: "/colleges",
    icon: GraduationCap,
    label: "College Directory",
    description: "Browse 500+ colleges with filters for state, type, NIRF rank and application deadlines.",
    tag: "Most Used",
    tagColor: "var(--obsidian-primary)",
    gradient: "from-indigo-500/10 to-violet-500/10",
    border: "rgba(99,102,241,0.2)",
  },
  {
    to: "/timeline",
    icon: Clock,
    label: "Exam Timeline",
    description: "All major exams — JEE, NEET, GATE, CAT, UPSC, CUET — with registration & exam dates.",
    tag: "Live Dates",
    tagColor: "#10b981",
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "rgba(16,185,129,0.2)",
  },
  {
    to: "/cutoff",
    icon: TrendingUp,
    label: "Cutoff Predictor",
    description: "Enter your rank and category to see your chances at top colleges instantly.",
    tag: "Predictive",
    tagColor: "#f59e0b",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "rgba(245,158,11,0.2)",
  },
  {
    to: "/scholarships",
    icon: Award,
    label: "Scholarships",
    description: "Discover merit-based, need-based and state scholarships. Save and track your applications.",
    tag: "Free Money",
    tagColor: "#ec4899",
    gradient: "from-pink-500/10 to-rose-500/10",
    border: "rgba(236,72,153,0.2)",
  },
  {
    to: "/compare",
    icon: GitCompare,
    label: "Compare Colleges",
    description: "Side-by-side comparison of fees, placements, facilities and NIRF rankings.",
    tag: "Make Better Decisions",
    tagColor: "#6366f1",
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "rgba(99,102,241,0.15)",
  },
  {
    to: "/rank-reality",
    icon: BarChart3,
    label: "Rank Reality Check",
    description: "Honest analysis of what your rank can actually get you — no sugar coating.",
    tag: "Reality Check",
    tagColor: "#ef4444",
    gradient: "from-red-500/10 to-rose-500/10",
    border: "rgba(239,68,68,0.2)",
  },
  {
    to: "/plan-b",
    icon: Map,
    label: "Plan B Analyzer",
    description: "Explore alternative paths if your primary plan doesn't work. Always have a backup.",
    tag: "Backup Plan",
    tagColor: "#8b5cf6",
    gradient: "from-purple-500/10 to-violet-500/10",
    border: "rgba(139,92,246,0.2)",
  },
]

export default function DiscoverHub() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Discover — TAKक्षक</title>
      </Helmet>

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[14px] font-bold uppercase tracking-wider"
              style={{ background: "var(--accent-glow)", color: "var(--obsidian-primary)" }}
            >
              <Sparkles size={10} /> Discover
            </span>
          </div>
          <h1 className="text-3xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>
            Find Your Perfect Path
          </h1>
          <p className="text-base" style={{ color: "var(--obsidian-on-surface-variant)" }}>
            Everything you need to research colleges, track exams and predict your chances — in one place.
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
                className="group relative flex flex-col gap-4 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${card.gradient.replace("from-", "").replace(" to-", ", ")})`,
                  border: `1px solid ${card.border}`,
                  background: "var(--obsidian-surface)",
                  boxShadow: "0 1px 3px var(--shadow-glass)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.border
                  e.currentTarget.style.boxShadow = `0 8px 32px var(--shadow-glass), 0 0 0 1px ${card.border}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px var(--shadow-glass)"
                }}
              >
                {/* Icon + tag row */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "var(--accent-glow)" }}
                  >
                    <Icon size={22} style={{ color: card.tagColor }} />
                  </div>
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
