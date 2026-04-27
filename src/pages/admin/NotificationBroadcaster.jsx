import { useCallback, useEffect, useState } from "react"
import { Megaphone, Send } from "lucide-react"
import { adminGetUsers, adminBroadcastNotification } from "../../services/admin"

export default function NotificationBroadcaster() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [sending, setSending] = useState(false)

    const [message, setMessage] = useState("")
    const [type, setType] = useState("info")
    const [target, setTarget] = useState("all")
    const [targetStream, setTargetStream] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const result = await adminGetUsers()
            setUsers(result.records)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    function getTargetUserIds() {
        if (target === "all") return users.map(u => u.id)
        if (target === "premium") return users.filter(u => u.is_premium).map(u => u.id)
        if (target === "stream") return users.filter(u => u.stream === targetStream).map(u => u.id)
        return []
    }

    async function handleSend() {
        const ids = getTargetUserIds()
        if (ids.length === 0) {
            setError("No users match the selected target.")
            return
        }
        if (!message.trim()) {
            setError("Message cannot be empty.")
            return
        }

        setSending(true)
        setError("")
        setSuccess("")

        try {
            await adminBroadcastNotification(ids, message.trim(), type)
            setSuccess(`Notification sent to ${ids.length} user${ids.length !== 1 ? "s" : ""}.`)
            setMessage("")
        } catch (err) {
            setError(err.message)
        } finally {
            setSending(false)
        }
    }

    const recipientCount = getTargetUserIds().length

    return (
        <div className="space-y-5">
            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
            )}
            {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{success}</div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                    <Megaphone size={16} className="text-indigo-600" />
                    Compose Notification
                </h3>

                <div className="space-y-4">
                    {/* Message */}
                    <label>
                        <span className="mb-1 block text-xs font-medium text-slate-600">Message</span>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Type your notification message..."
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        />
                    </label>

                    {/* Type & Target */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <label>
                            <span className="mb-1 block text-xs font-medium text-slate-600">Type</span>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="info">ℹ️ Info</option>
                                <option value="alert">🚨 Alert</option>
                                <option value="deadline">⏰ Deadline</option>
                                <option value="promo">🎉 Promo</option>
                            </select>
                        </label>

                        <label>
                            <span className="mb-1 block text-xs font-medium text-slate-600">Send To</span>
                            <select
                                value={target}
                                onChange={e => setTarget(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="all">All Users</option>
                                <option value="premium">Premium Only</option>
                                <option value="stream">By Stream</option>
                            </select>
                        </label>

                        {target === "stream" && (
                            <label>
                                <span className="mb-1 block text-xs font-medium text-slate-600">Stream</span>
                                <select
                                    value={targetStream}
                                    onChange={e => setTargetStream(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                >
                                    <option value="">Select stream</option>
                                    <option value="PCM">PCM</option>
                                    <option value="PCB">PCB</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Defence">Defence</option>
                                </select>
                            </label>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-slate-500">
                            {loading ? "Loading users..." : `${recipientCount} recipient${recipientCount !== 1 ? "s" : ""}`}
                        </p>
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={sending || !message.trim() || recipientCount === 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                        >
                            <Send size={14} />
                            {sending ? "Sending..." : "Broadcast"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
