import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import {
    ChevronDown,
    ChevronUp,
    MessageCircle,
    MessageSquare,
    Plus,
    ThumbsUp,
    X,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useAutoReveal } from "../hooks/useScrollReveal"

const STREAMS = ["All", "PCM", "PCB", "Commerce", "Arts", "Defence", "General"]

const DEMO_POSTS = [
    { id: 1, stream: "PCM", title: "How to prepare for JEE Advanced in 3 months?", body: "I scored 95 percentile in JEE Mains. What should my strategy be for Advanced?", upvotes: 24, replies: 8, created_at: "2026-02-25T10:00:00Z" },
    { id: 2, stream: "PCB", title: "NEET cutoff for AIIMS 2025?", body: "What was the closing rank for AIIMS Delhi MBBS general category last year?", upvotes: 18, replies: 5, created_at: "2026-02-26T08:00:00Z" },
    { id: 3, stream: "Commerce", title: "CA vs MBA — Which is better for finance?", body: "I'm confused between pursuing CA after 12th or doing B.Com + MBA. Career prospects?", upvotes: 31, replies: 12, created_at: "2026-02-24T12:00:00Z" },
    { id: 4, stream: "General", title: "How to handle exam anxiety??", body: "Every time I sit for a mock test I blank out. Tips?", upvotes: 45, replies: 20, created_at: "2026-02-27T09:00:00Z" },
    { id: 5, stream: "PCM", title: "Best coaching for JEE in online mode?", body: "Comparing Allen, Aakash, Physics Wallah and Unacademy for JEE 2027.", upvotes: 19, replies: 7, created_at: "2026-02-23T15:00:00Z" },
    { id: 6, stream: "Defence", title: "NDA preparation while in 11th?", body: "Is it possible to crack NDA in the first attempt while studying in class 11?", upvotes: 27, replies: 9, created_at: "2026-02-22T11:00:00Z" },
]

const DEMO_REPLIES = {
    1: [
        { id: 1, author: "Mentor", is_mentor: true, body: "Focus on previous year papers from 2015 onwards. Do all IIT chapters — Mechanics, Electrochemistry, Organic Chemistry. Attempt full mock every weekend.", upvotes: 15, created_at: "2026-02-25T12:00:00Z" },
        { id: 2, author: "Anonymous", is_mentor: false, body: "I followed PW JEE Advanced batches. Covered all topics in 60 days!", upvotes: 8, created_at: "2026-02-25T14:00:00Z" },
    ],
    4: [
        { id: 3, author: "Mentor", is_mentor: true, body: "This is extremely common. Practice box breathing (4-4-4-4) before sitting for tests. Also treat every mock as real — same conditions, same time.", upvotes: 32, created_at: "2026-02-27T10:00:00Z" },
    ],
}

export default function DoubtForum() {
    const [stream, setStream] = useState("All")
    const [showPost, setShowPost] = useState(false)
    const [expandedPost, setExpandedPost] = useState(null)
    const [posts, setPosts] = useState(DEMO_POSTS)
    const [localReplies, setLocalReplies] = useState(DEMO_REPLIES)
    const [newPost, setNewPost] = useState({ title: "", body: "", stream: "General" })
    const [newReply, setNewReply] = useState("")
    const [upvoted, setUpvoted] = useState({})
    useAutoReveal()

    const filtered = useMemo(() => stream === "All" ? posts : posts.filter(p => p.stream === stream), [posts, stream])

    function submitPost() {
        if (!newPost.title || !newPost.body) return
        setPosts(prev => [{ id: Date.now(), ...newPost, upvotes: 0, replies: 0, created_at: new Date().toISOString() }, ...prev])
        setNewPost({ title: "", body: "", stream: "General" })
        setShowPost(false)
    }

    function submitReply(postId) {
        if (!newReply.trim()) return
        const reply = { id: Date.now(), author: "You", is_mentor: false, body: newReply, upvotes: 0, created_at: new Date().toISOString() }
        setLocalReplies(prev => ({ ...prev, [postId]: [...(prev[postId] || []), reply] }))
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: p.replies + 1 } : p))
        setNewReply("")
    }

    function toggleUpvote(id, type) {
        setUpvoted(prev => ({ ...prev, [`${type}_${id}`]: !prev[`${type}_${id}`] }))
    }

    return (
        <div className="space-y-10 md:space-y-16">
            {/* ── SEO Meta ── */}
            <Helmet>
                <title>Anonymous Doubt Forum | TAKSHAK — IIT/NEET Peer Support</title>
                <meta name="description" content="Ask your exam preparation doubts anonymously on the TAKSHAK forum. Get answers from top rankers and mentors across PCM, PCB, and other streams." />
            </Helmet>

            {/* ═══ HERO ═══ */}
            <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-600 to-indigo-600 px-8 py-12 text-white md:px-14 md:py-20">
                <div className="orb orb-purple w-44 h-44 -top-12 right-8" />
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
                        <MessageSquare size={40} />
                    </div>
                    <h1 className="text-display text-4xl md:text-6xl">Doubt Forum</h1>
                    <p className="text-body-lg mt-4 text-indigo-100/80 text-base">Ask anonymously. Learn together. No judgment.</p>
                </div>
            </section>

            {/* ═══ FILTERS + POST ═══ */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-1 flex-wrap gap-2">
                    {STREAMS.map(s => (
                        <button key={s} type="button" onClick={() => setStream(s)} className={`pill text-sm ${stream === s ? "pill-primary" : "pill-outline"}`}>
                            {s}
                        </button>
                    ))}
                </div>
                <button type="button" onClick={() => setShowPost(true)} className="pill pill-primary">
                    <Plus size={16} /> Ask Anonymously
                </button>
            </div>

            {/* ═══ POST MODAL ═══ */}
            <AnimatePresence>
                {showPost && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="mx-4 w-full max-w-lg space-y-5 rounded-[28px] bg-white p-8 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-section text-xl text-slate-900">Ask Anonymously</h3>
                                <button type="button" onClick={() => setShowPost(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            </div>
                            <select value={newPost.stream} onChange={e => setNewPost(p => ({ ...p, stream: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                                {STREAMS.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="Your question (clear & specific)" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                            <textarea value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} placeholder="Add details..." rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                            <p className="text-xs text-slate-400">🔒 Your identity is never shared</p>
                            <button type="button" onClick={submitPost} disabled={!newPost.title || !newPost.body} className="pill pill-primary w-full justify-center py-3.5 text-base disabled:opacity-50">Post Question</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ POSTS ═══ */}
            <div className="space-y-5">
                {filtered.map((post, i) => {
                    const replies = localReplies[post.id] || []
                    const isExpanded = expandedPost === post.id
                    const upvoteKey = `post_${post.id}`
                    return (
                        <div key={post.id} className={`reveal reveal-delay-${(i % 4) + 1} card-bb overflow-hidden`}>
                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <button type="button" onClick={() => toggleUpvote(post.id, "post")} className={`rounded-xl p-2 transition ${upvoted[upvoteKey] ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:text-indigo-500"}`}>
                                            <ThumbsUp size={16} />
                                        </button>
                                        <span className="text-sm font-bold text-slate-700">{post.upvotes + (upvoted[upvoteKey] ? 1 : 0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="pill pill-outline text-[10px] py-0.5 px-2.5">{post.stream}</span>
                                            <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString("en-IN")}</span>
                                        </div>
                                        <h3 className="text-card-title text-base md:text-lg text-slate-900">{post.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{post.body}</p>
                                        <button type="button" onClick={() => setExpandedPost(isExpanded ? null : post.id)} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                                            <MessageCircle size={14} /> {replies.length} replies
                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 md:px-8 space-y-3">
                                        {replies.map(r => (
                                            <div key={r.id} className={`rounded-2xl p-4 text-sm ${r.is_mentor ? "card-bb border-indigo-200 bg-indigo-50" : "card-bb"}`}>
                                                <p className="mb-1 text-xs font-bold text-indigo-600">{r.is_mentor ? "✨ Mentor" : "Anonymous"}</p>
                                                <p className="text-slate-700 leading-relaxed">{r.body}</p>
                                            </div>
                                        ))}
                                        <div className="flex gap-2">
                                            <input value={newReply} onChange={e => setNewReply(e.target.value)} placeholder="Add a reply..." className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                                            <button type="button" onClick={() => submitReply(post.id)} className="pill pill-primary py-2.5">Reply</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
