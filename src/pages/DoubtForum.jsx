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

    const filtered = useMemo(() => {
        if (stream === "All") return posts
        return posts.filter(p => p.stream === stream)
    }, [posts, stream])

    function submitPost() {
        if (!newPost.title || !newPost.body) return
        setPosts(prev => [{
            id: Date.now(),
            ...newPost,
            upvotes: 0,
            replies: 0,
            created_at: new Date().toISOString(),
        }, ...prev])
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
        const key = `${type}_${id}`
        setUpvoted(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-center text-white shadow-xl md:p-10"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <MessageSquare size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Doubt Forum</h1>
                <p className="mt-3 text-lg text-white/80">Ask anonymously. Learn together. No judgment.</p>
            </motion.section>

            {/* Top Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-1 flex-wrap gap-2">
                    {STREAMS.map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStream(s)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${stream === s ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setShowPost(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow"
                >
                    <Plus size={16} /> Ask Anonymously
                </button>
            </div>

            {/* Post Modal */}
            <AnimatePresence>
                {showPost && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="mx-4 w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Ask Anonymously</h3>
                                <button type="button" onClick={() => setShowPost(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                            </div>
                            <select value={newPost.stream} onChange={e => setNewPost(p => ({ ...p, stream: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                                {STREAMS.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="Your question (clear & specific)" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                            <textarea value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} placeholder="Add details..." rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                            <p className="text-xs text-slate-400">🔒 Your identity will not be shared with other students</p>
                            <button type="button" onClick={submitPost} disabled={!newPost.title || !newPost.body} className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50">Post Question</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Posts */}
            <div className="space-y-4">
                {filtered.map((post, i) => {
                    const replies = localReplies[post.id] || []
                    const isExpanded = expandedPost === post.id
                    const upvoteKey = `post_${post.id}`
                    return (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="scroll-3d-card overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-card"
                        >
                            <div className="p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center gap-1">
                                        <button type="button" onClick={() => toggleUpvote(post.id, "post")} className={`rounded-lg p-1 transition ${upvoted[upvoteKey] ? "text-indigo-600" : "text-slate-400 hover:text-indigo-500"}`}>
                                            <ThumbsUp size={15} />
                                        </button>
                                        <span className="text-xs font-bold text-slate-700">{post.upvotes + (upvoted[upvoteKey] ? 1 : 0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">{post.stream}</span>
                                            <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString("en-IN")}</span>
                                        </div>
                                        <h3 className="font-semibold text-slate-900">{post.title}</h3>
                                        <p className="mt-1 text-sm text-slate-600">{post.body}</p>
                                        <button type="button" onClick={() => setExpandedPost(isExpanded ? null : post.id)} className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                                            <MessageCircle size={12} /> {replies.length} replies
                                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
                                        {replies.map(r => (
                                            <div key={r.id} className={`rounded-2xl p-3 text-sm ${r.is_mentor ? "border border-indigo-200 bg-indigo-50" : "bg-white border border-slate-200"}`}>
                                                <p className="mb-1 text-xs font-semibold text-indigo-700">{r.is_mentor ? "✨ Mentor" : "Anonymous"}</p>
                                                <p className="text-slate-700">{r.body}</p>
                                            </div>
                                        ))}
                                        <div className="flex gap-2">
                                            <input value={newReply} onChange={e => setNewReply(e.target.value)} placeholder="Add a reply..." className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                                            <button type="button" onClick={() => submitReply(post.id)} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Reply</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.article>
                    )
                })}
            </div>
        </div>
    )
}
