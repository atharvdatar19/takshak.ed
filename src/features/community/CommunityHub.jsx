import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import {
  MessageSquare,
  Users,
  Shield,
  HeartHandshake,
  ArrowRight,
} from "lucide-react"

const HUB_CARDS = [
  {
    to: "/forum",
    icon: MessageSquare,
    label: "Doubt Forum",
    description: "Ask academic doubts anonymously. Get answers from toppers, seniors and mentors. Upvote the best answers.",
    tag: "Ask Anything",
    tagColor: "#6366f1",
    auth: true,
  },
  {
    to: "/pre-freshers",
    icon: Users,
    label: "Campus Connect",
    description: "For freshers joining college — find roommates, connect with batchmates, read campus announcements.",
    tag: "Freshers Corner",
    tagColor: "#10b981",
    auth: true,
  },
  {
    to: "/defence",
    icon: Shield,
    label: "Defence Corner",
    description: "NDA, CDS, AFCAT, SSB prep with verified mentors who have cleared these exams. First session free.",
    tag: "NDA · CDS · SSB",
    tagColor: "#f59e0b",
    auth: false,
  },
  {
    to: "/wellness",
    icon: HeartHandshake,
    label: "Wellness Check-in",
    description: "Track your daily stress and mood. Spot burnout before it derails your preparation.",
    tag: "Mental Health",
    tagColor: "#ec4899",
    auth: true,
  },
]

export default function CommunityHub() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Community — TAKक्षक</title>
      </Helmet>

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[14px] font-bold uppercase tracking-wider"
              style={{ background: "var(--accent-glow)", color: "var(--obsidian-primary)" }}
            >
              <MessageSquare size={10} /> Community
            </span>
          </div>
          <h1 className="text-3xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>
            You Are Not Alone
          </h1>
          <p className="text-base" style={{ color: "var(--obsidian-on-surface-variant)" }}>
            Bhaiya and Didi are always there — connect, ask, share and grow together.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HUB_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.to}
                type="button"
                onClick={() => navigate(card.to)}
                className="group flex flex-col gap-4 rounded-2xl p-6 text-left transition-all duration-200 hover:-translate-y-0.5"
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
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `${card.tagColor}15` }}
                  >
                    <Icon size={24} style={{ color: card.tagColor }} />
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

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
                    {card.label}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                    {card.description}
                  </p>
                </div>

                <div
                  className="flex items-center gap-1 text-[12px] font-bold transition-all group-hover:gap-2"
                  style={{ color: card.tagColor }}
                >
                  Go <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
