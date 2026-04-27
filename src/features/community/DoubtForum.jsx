import { useEffect, useMemo, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import {
  ArrowUp, ChevronDown, ChevronUp, Loader2, MessageCircle,
  MessageSquare, Plus, Send, X, CheckCircle2, Filter,
} from "lucide-react"
import { useAuth } from "@auth/AuthContext"
import {
  getForumPosts, getPostReplies, createPost, createReply,
  votePost, voteReply, markReplyAccepted, getForumCategories,
} from "@database/services/forum"

// ── Demo data (shown when not connected) ─────────────────────────────────────
const DEMO_POSTS = [
  { id: 1, category: "JEE", title: "How to prepare for JEE Advanced in 3 months?", body: "I scored 95 percentile in JEE Mains. What should my strategy be for Advanced?", upvote_count: 24, reply_count: 2, created_at: "2026-02-25T10:00:00Z", user_email: "anon" },
  { id: 2, category: "NEET", title: "NEET cutoff for AIIMS 2025?", body: "What was the closing rank for AIIMS Delhi MBBS general category last year?", upvote_count: 18, reply_count: 5, created_at: "2026-02-26T08:00:00Z", user_email: "anon" },
  { id: 3, category: "General", title: "How to handle exam anxiety?", body: "Every time I sit for a mock test I blank out. Any tips that actually work?", upvote_count: 45, reply_count: 3, created_at: "2026-02-27T09:00:00Z", user_email: "anon" },
  { id: 4, category: "CAT", title: "CA vs MBA — which is better for finance?", body: "Confused between CA after 12th or B.Com + MBA. Which has better career prospects?", upvote_count: 31, reply_count: 12, created_at: "2026-02-24T12:00:00Z", user_email: "anon" },
]

const DEMO_REPLIES = {
  1: [
    { id: 1, body: "Focus on PYQs from 2015+. Cover all IIT chapters — Mechanics, Electrochemistry, Organic Chem. Attempt one full mock every weekend.", upvote_count: 15, is_accepted: true, user_email: "mentor@takshak.in", created_at: "2026-02-25T12:00:00Z", users: { name: "Mentor" } },
    { id: 2, body: "I followed PW JEE Advanced batches. Covered all topics in 60 days!", upvote_count: 8, is_accepted: false, user_email: "anon", created_at: "2026-02-25T14:00:00Z", users: { name: "Anonymous" } },
  ],
  3: [
    { id: 3, body: "Practice box breathing (4-4-4-4) before every test. Treat every mock as the real exam — same conditions, same time block.", upvote_count: 32, is_accepted: true, user_email: "mentor@takshak.in", created_at: "2026-02-27T10:00:00Z", users: { name: "Mentor" } },
  ],
}

// ── Time formatting ───────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ── Ask Modal ─────────────────────────────────────────────────────────────────
function AskModal({ categories, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", body: "", category: "General" })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    if (!form.title.trim() || !form.body.trim()) return
    setSaving(true)
    await onSubmit(form)
    setSaving(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl p-6 space-y-4"
        style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--obsidian-on-surface)" }}>Ask Anonymously</h3>
            <p className="text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>🔒 Your identity is never shared</p>
          </div>
          <button type="button" onClick={onClose} style={{ color: "var(--obsidian-on-surface-variant)" }}><X size={18} /></button>
        </div>

        <select
          value={form.category}
          onChange={e => set("category", e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          value={form.title}
          onChange={e => set("title", e.target.value)}
          placeholder="Your question (be clear and specific)"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
        />

        <textarea
          value={form.body}
          onChange={e => set("body", e.target.value)}
          placeholder="Add more context..."
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
        />

        <button
          type="button"
          onClick={submit}
          disabled={!form.title.trim() || !form.body.trim() || saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Post Question
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Reply section ─────────────────────────────────────────────────────────────
function ReplySection({ postId, userEmail, isDemo, ownsPost }) {
  const [replies, setReplies] = useState(null)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [upvoted, setUpvoted] = useState({})

  useEffect(() => {
    if (isDemo) { setReplies(DEMO_REPLIES[postId] || []); return }
    getPostReplies(postId).then(setReplies)
  }, [postId, isDemo])

  async function sendReply() {
    if (!text.trim() || !userEmail) return
    setSending(true)
    if (isDemo) {
      const r = { id: Date.now(), body: text, upvote_count: 0, is_accepted: false, user_email: userEmail, created_at: new Date().toISOString(), users: { name: "You" } }
      setReplies(p => [...(p || []), r])
    } else {
      const { data } = await createReply({ userEmail, postId, body: text })
      if (data) setReplies(p => [...(p || []), data])
    }
    setText("")
    setSending(false)
  }

  async function toggleUpvoteReply(replyId) {
    setUpvoted(p => ({ ...p, [replyId]: !p[replyId] }))
    if (!isDemo && userEmail) await voteReply(userEmail, replyId, "up")
  }

  async function acceptReply(replyId) {
    if (!ownsPost || isDemo) return
    await markReplyAccepted(replyId, postId, userEmail)
    setReplies(p => p?.map(r => ({ ...r, is_accepted: r.id === replyId })))
  }

  if (!replies) return <div className="py-4 text-center"><Loader2 size={16} className="animate-spin inline" style={{ color: "var(--obsidian-primary)" }} /></div>

  const isMentor = (email) => email?.includes("mentor") || email?.includes("takshak")

  return (
    <div className="space-y-3">
      {/* Replies */}
      {replies.length === 0 && (
        <p className="text-[13px] text-center py-2" style={{ color: "var(--obsidian-on-surface-variant)" }}>No replies yet. Be the first!</p>
      )}
      {replies.map(r => (
        <div
          key={r.id}
          className="rounded-xl p-3.5 space-y-2"
          style={{
            background: r.is_accepted ? "rgba(16,185,129,0.08)" : "var(--accent-glow)",
            border: `1px solid ${r.is_accepted ? "rgba(16,185,129,0.25)" : "var(--obsidian-outline-variant)"}`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {r.is_accepted && <CheckCircle2 size={13} style={{ color: "#10b981" }} />}
              <span
                className="text-[11px] font-bold"
                style={{ color: isMentor(r.user_email) ? "var(--obsidian-primary)" : "var(--obsidian-on-surface-variant)" }}
              >
                {isMentor(r.user_email) ? "✨ Mentor" : (r.users?.name || "Anonymous")}
              </span>
              {r.is_accepted && <span className="text-[10px] font-bold" style={{ color: "#10b981" }}>Accepted Answer</span>}
            </div>
            <span className="text-[10px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>{timeAgo(r.created_at)}</span>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--obsidian-on-surface)" }}>{r.body}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleUpvoteReply(r.id)}
              className="flex items-center gap-1 text-[11px] font-semibold transition"
              style={{ color: upvoted[r.id] ? "var(--obsidian-primary)" : "var(--obsidian-on-surface-variant)" }}
            >
              <ArrowUp size={12} /> {r.upvote_count + (upvoted[r.id] ? 1 : 0)}
            </button>
            {ownsPost && !r.is_accepted && (
              <button type="button" onClick={() => acceptReply(r.id)} className="text-[11px] font-semibold" style={{ color: "#10b981" }}>
                ✓ Accept
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Reply input */}
      {userEmail ? (
        <div className="flex gap-2 pt-1">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply() } }}
            placeholder="Reply anonymously..."
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
          />
          <button
            type="button"
            onClick={sendReply}
            disabled={!text.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
            style={{ background: "var(--obsidian-primary)", color: "#fff" }}
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      ) : (
        <p className="text-[12px] text-center" style={{ color: "var(--obsidian-on-surface-variant)" }}>
          <a href="/login" className="font-bold underline" style={{ color: "var(--obsidian-primary)" }}>Sign in</a> to reply
        </p>
      )}
    </div>
  )
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, userEmail, isDemo }) {
  const [expanded, setExpanded] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  const ownsPost = userEmail === post.user_email

  async function toggleUpvote() {
    setUpvoted(p => !p)
    if (!isDemo && userEmail) await votePost(userEmail, post.id, "up")
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
    >
      <div className="flex gap-4 p-5">
        {/* Upvote column */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <button
            type="button"
            onClick={toggleUpvote}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition"
            style={{
              background: upvoted ? "var(--accent-glow)" : "transparent",
              color: upvoted ? "var(--obsidian-primary)" : "var(--obsidian-on-surface-variant)",
              border: `1px solid ${upvoted ? "var(--obsidian-primary)" : "var(--obsidian-outline-variant)"}`,
            }}
          >
            <ArrowUp size={14} />
          </button>
          <span className="text-[13px] font-bold" style={{ color: upvoted ? "var(--obsidian-primary)" : "var(--obsidian-on-surface)" }}>
            {post.upvote_count + (upvoted ? 1 : 0)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "var(--accent-glow)", color: "var(--obsidian-primary)", border: "1px solid var(--obsidian-primary)" + "30" }}
            >
              {post.category}
            </span>
            <span className="text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>{timeAgo(post.created_at)}</span>
          </div>

          <h3 className="text-[15px] font-bold leading-snug" style={{ color: "var(--obsidian-on-surface)" }}>{post.title}</h3>
          <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: "var(--obsidian-on-surface-variant)" }}>{post.body}</p>

          <button
            type="button"
            onClick={() => setExpanded(p => !p)}
            className="flex items-center gap-1.5 text-[12px] font-bold transition"
            style={{ color: "var(--obsidian-primary)" }}
          >
            <MessageCircle size={13} />
            {post.reply_count || 0} {(post.reply_count || 0) === 1 ? "reply" : "replies"}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Replies drawer */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 pt-3"
              style={{ borderTop: "1px solid var(--obsidian-outline-variant)", background: "var(--accent-glow)" }}
            >
              <ReplySection postId={post.id} userEmail={userEmail} isDemo={isDemo} ownsPost={ownsPost} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { id: "latest",     label: "Latest"     },
  { id: "popular",    label: "Popular"    },
  { id: "unanswered", label: "Unanswered" },
]

export default function DoubtForum() {
  const { user } = useAuth?.() || {}
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState(["General", "JEE", "NEET", "UPSC", "CAT", "GATE", "CUET", "Defence", "College Life"])
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("latest")
  const [loading, setLoading] = useState(true)
  const [showAsk, setShowAsk] = useState(false)
  const isDemo = !user

  const load = useCallback(async () => {
    setLoading(true)
    if (isDemo) {
      setPosts(DEMO_POSTS)
      setLoading(false)
      return
    }
    const [postsData, cats] = await Promise.all([
      getForumPosts({ category: category === "All" ? undefined : category, sortBy: sort }),
      getForumCategories(),
    ])
    setPosts(postsData)
    setCategories(cats)
    setLoading(false)
  }, [category, sort, isDemo])

  useEffect(() => { load() }, [load])

  async function handlePost(form) {
    if (isDemo) {
      const p = { id: Date.now(), ...form, upvote_count: 0, reply_count: 0, created_at: new Date().toISOString(), user_email: "anon" }
      setPosts(prev => [p, ...prev])
      return
    }
    const { data } = await createPost({ userEmail: user.email, ...form })
    if (data) setPosts(prev => [data, ...prev])
  }

  const filtered = useMemo(() => {
    if (category === "All") return posts
    return posts.filter(p => p.category === category)
  }, [posts, category])

  return (
    <>
      <Helmet>
        <title>Doubt Forum — TAKSHAK</title>
        <meta name="description" content="Ask your exam preparation doubts anonymously. Get answers from toppers, seniors and mentors." />
      </Helmet>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={18} style={{ color: "var(--obsidian-primary)" }} />
              <h1 className="text-xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>Doubt Forum</h1>
            </div>
            <p className="text-sm" style={{ color: "var(--obsidian-on-surface-variant)" }}>
              Ask anything anonymously — no judgment, no identity.
              {isDemo && <span className="ml-1 font-semibold" style={{ color: "#f59e0b" }}>Sign in to post.</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAsk(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
          >
            <Plus size={15} /> Ask
          </button>
        </div>

        {/* ── Filter bar ── */}
        <div className="space-y-3">
          {/* Category pills — scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", ...categories].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition"
                style={
                  category === c
                    ? { background: "var(--obsidian-primary)", color: "#fff" }
                    : { background: "var(--accent-glow)", color: "var(--obsidian-on-surface-variant)", border: "1px solid var(--obsidian-outline-variant)" }
                }
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter size={13} style={{ color: "var(--obsidian-on-surface-variant)" }} />
            {SORT_OPTIONS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                className="rounded-lg px-3 py-1 text-[12px] font-semibold transition"
                style={
                  sort === s.id
                    ? { background: "var(--accent-glow)", color: "var(--obsidian-primary)", border: "1px solid var(--obsidian-primary)" + "40" }
                    : { color: "var(--obsidian-on-surface-variant)" }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Posts ── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin" style={{ color: "var(--obsidian-primary)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl py-16 text-center" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" style={{ color: "var(--obsidian-on-surface)" }} />
            <p className="font-semibold" style={{ color: "var(--obsidian-on-surface)" }}>No posts yet</p>
            <p className="mt-1 text-sm" style={{ color: "var(--obsidian-on-surface-variant)" }}>Be the first to ask a question!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(post => (
              <PostCard key={post.id} post={post} userEmail={user?.email} isDemo={isDemo} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAsk && <AskModal categories={categories} onClose={() => setShowAsk(false)} onSubmit={handlePost} />}
      </AnimatePresence>
    </>
  )
}
