import { motion } from "framer-motion"
import { useState } from "react"
import { Plus, Pencil, Trash2, Save, X, ExternalLink, Youtube, BookOpen, ChevronDown } from "lucide-react"

const DEMO_EDUCATORS = [
    {
        id: "e1", name: "Alakh Pandey (Physics Wallah)", tagline: "The OG free JEE/NEET educator",
        subject: "Physics", exam_focus: ["JEE", "NEET"], platform: "YouTube",
        language: ["Hindi"], level: "All Levels", is_famous: true,
        curator_note: "Best free Physics for both JEE and NEET. Start with mechanics playlist.",
        primary_link: "https://youtube.com/@PhysicsWallah", upvotes: 1200,
        playlist_links: [
            { title: "Complete Mechanics", url: "https://youtube.com/playlist?list=abc" },
            { title: "Electrostatics One-Shot", url: "https://youtube.com/playlist?list=def" },
        ],
    },
    {
        id: "e2", name: "Unacademy Atoms", tagline: "Top faculty for Chemistry",
        subject: "Chemistry", exam_focus: ["JEE"], platform: "Unacademy",
        language: ["Hindi", "English"], level: "Advanced", is_famous: true,
        curator_note: "Best for Organic Chemistry named reactions and mechanisms.",
        primary_link: "https://unacademy.com/atoms", upvotes: 680,
        playlist_links: [{ title: "Organic Complete", url: "https://unacademy.com/course/org" }],
    },
]

const EMPTY_FORM = {
    name: "", tagline: "", subject: "", exam_focus: [], platform: "YouTube",
    language: [], level: "All Levels", is_famous: false,
    curator_note: "", primary_link: "", playlist_links: [],
}

export default function AdminEducators() {
    const [educators, setEducators] = useState(DEMO_EDUCATORS)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [showForm, setShowForm] = useState(false)

    const startEdit = (edu) => {
        setForm({ ...edu })
        setEditingId(edu.id)
        setShowForm(true)
    }

    const startNew = () => {
        setForm({ ...EMPTY_FORM, id: `e${Date.now()}` })
        setEditingId(null)
        setShowForm(true)
    }

    const handleSave = () => {
        if (editingId) {
            setEducators(prev => prev.map(e => e.id === editingId ? { ...form } : e))
        } else {
            setEducators(prev => [...prev, form])
        }
        setShowForm(false)
        setEditingId(null)
    }

    const handleDelete = (id) => {
        setEducators(prev => prev.filter(e => e.id !== id))
    }

    const addPlaylist = () => {
        setForm(f => ({ ...f, playlist_links: [...f.playlist_links, { title: "", url: "" }] }))
    }

    const updatePlaylist = (idx, field, val) => {
        setForm(f => ({
            ...f,
            playlist_links: f.playlist_links.map((p, i) => i === idx ? { ...p, [field]: val } : p)
        }))
    }

    const removePlaylist = (idx) => {
        setForm(f => ({ ...f, playlist_links: f.playlist_links.filter((_, i) => i !== idx) }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Educator CMS</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the curated educator directory.</p>
                </div>
                <button onClick={startNew}
                    className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 text-xs font-bold hover:bg-indigo-500/20 transition flex items-center gap-2"
                >
                    <Plus size={14} /> Add Educator
                </button>
            </div>

            {/* Editor Form */}
            {showForm && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-indigo-500/20 bg-[#111120] p-5 space-y-4"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-white">{editingId ? "Edit Educator" : "New Educator"}</h2>
                        <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[#1f1f35] text-slate-400"><X size={16} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormInput label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                        <FormInput label="Tagline" value={form.tagline} onChange={v => setForm(f => ({ ...f, tagline: v }))} />
                        <FormInput label="Subject" value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} />
                        <FormInput label="Primary Link" value={form.primary_link} onChange={v => setForm(f => ({ ...f, primary_link: v }))} />
                        <FormSelect label="Platform" value={form.platform} options={["YouTube", "Telegram", "Website", "Unacademy", "PW", "Other"]}
                            onChange={v => setForm(f => ({ ...f, platform: v }))} />
                        <FormSelect label="Level" value={form.level} options={["Beginner", "Intermediate", "Advanced", "All Levels"]}
                            onChange={v => setForm(f => ({ ...f, level: v }))} />
                        <FormInput label="Exams (comma-separated)" value={(form.exam_focus || []).join(", ")}
                            onChange={v => setForm(f => ({ ...f, exam_focus: v.split(",").map(s => s.trim()).filter(Boolean) }))} />
                        <FormInput label="Languages (comma-separated)" value={(form.language || []).join(", ")}
                            onChange={v => setForm(f => ({ ...f, language: v.split(",").map(s => s.trim()).filter(Boolean) }))} />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Curator Note</label>
                        <textarea value={form.curator_note} onChange={e => setForm(f => ({ ...f, curator_note: e.target.value }))}
                            className="w-full rounded-xl border border-[#1f1f35] bg-[#0d0e1a] p-3 text-xs text-slate-300 outline-none resize-none h-16 focus:border-indigo-500 transition placeholder:text-slate-600"
                        />
                    </div>

                    {/* Playlist JSON Editor */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Playlist Links</label>
                            <button onClick={addPlaylist} className="text-[10px] text-indigo-400 font-bold hover:underline">+ Add Link</button>
                        </div>
                        <div className="space-y-2">
                            {(form.playlist_links || []).map((pl, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input value={pl.title} onChange={e => updatePlaylist(idx, "title", e.target.value)}
                                        placeholder="Title" className="flex-1 rounded-lg border border-[#1f1f35] bg-[#0d0e1a] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500" />
                                    <input value={pl.url} onChange={e => updatePlaylist(idx, "url", e.target.value)}
                                        placeholder="URL" className="flex-[2] rounded-lg border border-[#1f1f35] bg-[#0d0e1a] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500" />
                                    <button onClick={() => removePlaylist(idx)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                            <input type="checkbox" checked={form.is_famous} onChange={e => setForm(f => ({ ...f, is_famous: e.target.checked }))}
                                className="accent-indigo-500" />
                            Mark as Famous
                        </label>
                    </div>

                    <button onClick={handleSave}
                        className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-2.5 text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-2"
                    >
                        <Save size={14} /> {editingId ? "Update" : "Create"} Educator
                    </button>
                </motion.div>
            )}

            {/* Educator Table */}
            <div className="rounded-2xl border border-[#1f1f35] bg-[#111120] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#1f1f35]">
                            <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Educator</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Subject</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Platform</th>
                            <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Playlists</th>
                            <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Upvotes</th>
                            <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {educators.map((edu, i) => (
                            <tr key={edu.id} className={`border-b border-[#1f1f35]/50 ${i % 2 === 0 ? "bg-[#0d0e1a]" : ""} hover:bg-[#161830] transition`}>
                                <td className="px-5 py-3">
                                    <p className="text-xs font-semibold text-white">{edu.name}</p>
                                    <p className="text-[10px] text-slate-500">{edu.tagline}</p>
                                </td>
                                <td className="px-5 py-3 text-xs text-slate-400">{edu.subject}</td>
                                <td className="px-5 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        {edu.platform}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-xs text-slate-500">{(edu.playlist_links || []).length} links</td>
                                <td className="px-5 py-3 text-xs text-right font-bold text-amber-400">{edu.upvotes}</td>
                                <td className="px-5 py-3 text-right">
                                    <div className="flex items-center gap-1 justify-end">
                                        <button onClick={() => startEdit(edu)} className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 transition">
                                            <Pencil size={13} />
                                        </button>
                                        <button onClick={() => handleDelete(edu.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition">
                                            <Trash2 size={13} />
                                        </button>
                                        <a href={edu.primary_link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-500 hover:text-slate-300 transition">
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function FormInput({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">{label}</label>
            <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full rounded-xl border border-[#1f1f35] bg-[#0d0e1a] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
            />
        </div>
    )
}

function FormSelect({ label, value, options, onChange }) {
    return (
        <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border border-[#1f1f35] bg-[#0d0e1a] px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 transition appearance-none"
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}
