import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { Users, GraduationCap, Home, MessageSquare, MapPin, Search, Calendar, Heart, ShieldCheck, CheckCircle2, PackageCheck, Send, Info } from "lucide-react"
import { getRoommateCandidates, getSeniorConnect, getCampusPosts, createCampusPost } from "../services/community"

// --- DEMO DATA ---
const currentUser = { name: "Arjun M.", college: "NIT Trichy", branch: "CSE", home: "Pune, MH" }

const PACKING_LIST = [
    { category: "Documents", items: [{ name: "Original Admit Card", packed: false }, { name: "10th/12th Marksheets", packed: false }, { name: "Medical Certificate", packed: true }, { name: "20 Passport Photos", packed: false }] },
    { category: "Hostel Essentials", items: [{ name: "Mattress/Bedding", packed: false }, { name: "Extension Board", packed: false }, { name: "Bucket & Mug", packed: false }, { name: "Umbrella", packed: true }] },
]

export default function PreFreshers() {
    const [activeTab, setActiveTab] = useState("hub")

    return (
        <div className="mx-auto max-w-6xl animate-fade-in space-y-6">
            <Helmet>
                <title>Pre-Freshers Network | NetraX</title>
                <meta name="description" content="Connect with seniors, find compatible roommates, and prepare for campus life before Day 1." />
                <meta property="og:title" content="Pre-Freshers Network | NetraX" />
                <meta property="og:description" content="Connect with seniors, find compatible roommates, and prepare for campus life before Day 1." />
            </Helmet>

            {/* ── HEADER ── */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-md mb-4 border border-white/10">
                        <ShieldCheck size={16} /> Verified Admit: {currentUser.college}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
                        Pre-Freshers Network
                    </h1>
                    <p className="text-indigo-100 max-w-xl text-lg">
                        Connect with your future batchmates, secure a compatible roommate, and get ground-reality advice from seniors before Day 1.
                    </p>
                </div>
            </div>

            {/* ── TABS ── */}
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-hide md:inline-flex w-full md:w-auto border border-slate-200 shadow-sm">
                {[
                    { id: "hub", icon: Home, label: "Campus Hub" },
                    { id: "roommate", icon: Users, label: "Roommate Finder" },
                    { id: "seniors", icon: GraduationCap, label: "Senior Connect" },
                    { id: "packing", icon: PackageCheck, label: "Packing List" },
                ].map(tab => {
                    const isActive = activeTab === tab.id
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${isActive ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                        >
                            <Icon size={16} className={isActive ? "text-indigo-500" : "text-slate-400"} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* ── CONTENT VIEWS ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "hub" && <CampusHubView />}
                    {activeTab === "roommate" && <RoommateFinderView />}
                    {activeTab === "seniors" && <SeniorConnectView />}
                    {activeTab === "packing" && <PackingListView />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

function CampusHubView() {
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState("")

    useEffect(() => {
        getCampusPosts(currentUser.college).then(setPosts)
    }, [])

    const handlePost = async () => {
        if (!newPost.trim()) return
        await createCampusPost(currentUser.college, newPost)
        setNewPost("")
        getCampusPosts(currentUser.college).then(setPosts) // Refresh
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                {/* Create Post */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shrink-0 text-white font-bold flex items-center justify-center">A</div>
                    <input
                        type="text"
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                        placeholder={`Write a message to ${currentUser.college} batch of 2028...`}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm"
                    />
                    <button onClick={handlePost} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full transition shadow-md">
                        <Send size={18} />
                    </button>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className={`bg-white rounded-3xl p-5 border shadow-sm ${post.pinned ? "border-amber-200 bg-amber-50/30" : "border-slate-200"}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${post.pinned ? 'bg-amber-500' : 'bg-slate-300'}`}>
                                        {post.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                            {post.author}
                                            {post.pinned && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">Pinned Official</span>}
                                        </p>
                                        <p className="text-xs text-slate-500">{post.time}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-700 text-sm md:text-base mb-4 leading-relaxed">{post.content}</p>
                            {!post.pinned && (
                                <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition text-sm font-medium">
                                        <Heart size={16} /> {post.likes || 0}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-500 transition text-sm font-medium">
                                        <MessageSquare size={16} /> {post.comments || 0}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {/* Events Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-indigo-500" /> Upcoming Deadlines
                    </h3>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <div className="bg-indigo-50 rounded-lg p-2 text-center min-w-[50px]">
                                <div className="text-[10px] uppercase font-bold text-indigo-500">Aug</div>
                                <div className="text-lg font-black text-indigo-700 leading-none">12</div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Hostel Fee Payment</p>
                                <p className="text-xs text-slate-500">₹45,000 for Semester 1</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="bg-slate-50 rounded-lg p-2 text-center min-w-[50px] border border-slate-200">
                                <div className="text-[10px] uppercase font-bold text-slate-500">Aug</div>
                                <div className="text-lg font-black text-slate-700 leading-none">18</div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Reporting to Campus</p>
                                <p className="text-xs text-slate-500">Mandatory physical verification</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
                    <h3 className="font-bold mb-4 opacity-90">Your Batch ({currentUser.college})</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-3xl font-black">450+</p>
                            <p className="text-xs text-white/50 uppercase tracking-wider">Students Joined</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-indigo-300">82</p>
                            <p className="text-xs text-white/50 uppercase tracking-wider">From Your State</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RoommateFinderView() {
    const [candidates, setCandidates] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        getRoommateCandidates(currentUser.college).then(setCandidates)
    }, [])

    const filtered = candidates.filter(p => !searchTerm ||
        p.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(p.habits).some(v => typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Find your ideal roommate</p>
                    <p className="text-xs text-slate-500">Matches based on your profile habits</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search by state/hobby..." className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-indigo-400" />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(person => (
                    <div key={person.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-600">
                                    {person.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{person.name}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {person.state}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-[3px] border-emerald-500 text-emerald-600 font-black text-sm relative">
                                {person.match}%
                                <div className="absolute -bottom-5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">Match</div>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <p className="text-sm text-slate-600 italic mb-4">"{person.bio}"</p>

                            <div className="grid grid-cols-2 gap-2 mt-auto mb-5">
                                {person.habits && Object.values(person.habits).map((habit, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 px-2 py-1.5 rounded text-xs font-semibold text-slate-700 flex items-center justify-center">
                                        {habit}
                                    </div>
                                ))}
                            </div>

                            <button className="w-full bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-sm py-2.5 rounded-xl transition-colors shadow-sm mt-auto">
                                View Profile & Connect
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SeniorConnectView() {
    const [seniors, setSeniors] = useState([])

    useEffect(() => {
        getSeniorConnect(currentUser.college).then(setSeniors)
    }, [])

    return (
        <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">Ask a Question Annonymously</h3>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none h-24"
                        placeholder="What's the reality of mess food? Are first-year hostels strict?"
                    ></textarea>
                    <div className="flex justify-between items-center mt-3">
                        <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked />
                            Post anonymously
                        </label>
                        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md transition">Ask Seniors</button>
                    </div>
                </div>

                {/* Q&A Pairs */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                        <p className="font-bold text-slate-900 text-sm mb-3">Q: Is it worth buying an expensive gaming laptop for CSE, or a Mac is better?</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 pl-4 py-3 pr-4 rounded-r-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-indigo-900 text-xs">Aman D. (3rd Year CSE)</span>
                                <span className="text-white bg-indigo-500 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider font-mono">Verified</span>
                            </div>
                            <p className="text-sm text-indigo-900/80">Get a Mac (M1/M2 Air is enough). Gaming laptops are heavy to carry to class and battery dies in 2 hours. Unless you actually do heavy gaming/3D rendering, Mac is the CS student meta here.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-4 space-y-4">
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs pl-2">Top Contributors</h3>
                {seniors.map(senior => (
                    <div key={senior.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-300 transition cursor-pointer group">
                        <div className={`w-12 h-12 rounded-full ${senior.avatar || 'bg-indigo-500'} flex items-center justify-center font-bold text-white text-lg`}>
                            {senior.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{senior.name}</h4>
                                <CheckCircle2 size={14} className="text-blue-500" />
                            </div>
                            <p className="text-xs text-slate-500 mb-1">{senior.year} • ⭐ {senior.rating}</p>
                            <p className="text-[10px] bg-slate-100 text-slate-600 inline-block px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                                Knows: {senior.tags[0]}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PackingListView() {
    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Your Custom Packing List</h3>
                    <p className="text-sm text-slate-500">Curated by seniors of {currentUser.college}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl text-sm border border-emerald-100">
                    2/8 Items Packed (25%)
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {PACKING_LIST.map((category, idx) => (
                    <div key={idx} className="space-y-3">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                            {category.category}
                        </h4>
                        <div className="space-y-2">
                            {category.items.map((item, i) => (
                                <label key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition select-none group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="checkbox" defaultChecked={item.packed} className="peer w-5 h-5 appearance-none border-2 border-slate-300 rounded cursor-pointer checked:bg-emerald-500 checked:border-emerald-500 transition-colors" />
                                        <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                    </div>
                                    <span className={`text-sm font-medium ${item.packed ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                        {item.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Info className="text-amber-500 shrink-0" size={20} />
                <p className="text-sm text-amber-800">
                    <strong>Senior Tip:</strong> Do not buy engineering drawing instruments (ED kit) before coming. Seniors usually sell their old ones for half price during the first week!
                </p>
            </div>
        </div>
    )
}
