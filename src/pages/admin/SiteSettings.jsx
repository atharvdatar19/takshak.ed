import { useCallback, useEffect, useState } from "react"
import {
    Save, CheckCircle2, Globe, Mail, MessageSquare,
    ToggleLeft, ToggleRight, Shield, Search,
} from "lucide-react"
import { getSiteContent, updateSiteContent } from "../../services/siteContent"

export default function SiteSettings() {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        const data = await getSiteContent("siteSettings")
        setSettings(data)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    async function handleSave() {
        setSaving(true)
        await updateSiteContent("siteSettings", settings)
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    function update(path, value) {
        setSettings(prev => {
            const copy = JSON.parse(JSON.stringify(prev))
            const keys = path.split(".")
            let obj = copy
            for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
            obj[keys[keys.length - 1]] = value
            return copy
        })
    }

    if (loading || !settings) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
                ))}
            </div>
        )
    }

    const toggles = settings.featureToggles || {}

    return (
        <div className="space-y-6">
            {/* ── Brand Settings ── */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Globe size={16} className="text-indigo-600" /> Brand & Identity
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Platform Name</label>
                        <input value={settings.brandName} onChange={e => update("brandName", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Tagline</label>
                        <input value={settings.tagline} onChange={e => update("tagline", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                    </div>
                </div>
            </section>

            {/* ── Contact ── */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Mail size={16} className="text-emerald-600" /> Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Support Email</label>
                        <input value={settings.supportEmail} onChange={e => update("supportEmail", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">WhatsApp Number</label>
                        <input value={settings.whatsappNumber} onChange={e => update("whatsappNumber", e.target.value)}
                            placeholder="+91 XXXXXXXXXX"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                    </div>
                </div>
            </section>

            {/* ── Feature Toggles ── */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Shield size={16} className="text-amber-600" /> Feature Toggles
                </h3>
                <p className="text-xs text-slate-500">Enable or disable platform features without code changes.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        { key: "chatbot", label: "AI Chatbot (Medha)", desc: "Smart assistant for student queries" },
                        { key: "wellness", label: "Wellness Check-in", desc: "Stress & mental health tracking" },
                        { key: "skillMatcher", label: "AI Skill Matcher", desc: "Income path matching engine" },
                        { key: "defenceAspirants", label: "Defence Aspirants", desc: "NDA/CDS/SSB preparation hub" },
                    ].map(feature => (
                        <button
                            key={feature.key}
                            onClick={() => update(`featureToggles.${feature.key}`, !toggles[feature.key])}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${toggles[feature.key]
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-slate-200 bg-slate-50"
                                }`}
                        >
                            {toggles[feature.key]
                                ? <ToggleRight size={20} className="text-emerald-600 shrink-0" />
                                : <ToggleLeft size={20} className="text-slate-400 shrink-0" />
                            }
                            <div>
                                <p className="text-xs font-semibold text-slate-800">{feature.label}</p>
                                <p className="text-[10px] text-slate-500">{feature.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── SEO Defaults ── */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Search size={16} className="text-violet-600" /> SEO Defaults
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Default Page Title</label>
                        <input value={settings.seo?.defaultTitle || ""} onChange={e => update("seo.defaultTitle", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Default Meta Description</label>
                        <textarea value={settings.seo?.defaultDescription || ""} onChange={e => update("seo.defaultDescription", e.target.value)} rows={2}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">OG Image URL</label>
                        <input value={settings.seo?.ogImageUrl || ""} onChange={e => update("seo.ogImageUrl", e.target.value)}
                            placeholder="https://example.com/og-image.jpg"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                    </div>
                </div>
            </section>

            {/* ── Save Button ── */}
            <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 -mx-4 px-4 py-3 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition ${saved
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                        }`}
                >
                    {saved ? <><CheckCircle2 size={15} /> All Settings Saved!</> : <><Save size={15} /> {saving ? "Saving..." : "Save All Settings"}</>}
                </button>
            </div>
        </div>
    )
}
