import { useEffect, useRef } from "react"
import supabase from "../supabaseClient"

/**
 * Subscribe to Supabase Realtime changes on a table.
 * Calls `onData` whenever an INSERT, UPDATE, or DELETE occurs.
 *
 * @param {string} table  – Supabase table name (e.g. "colleges")
 * @param {Function} onData – callback invoked with { eventType, new, old }
 * @param {boolean} [enabled=true]
 */
export function useRealtimeSync(table, onData, enabled = true) {
    const callbackRef = useRef(onData)
    callbackRef.current = onData

    useEffect(() => {
        if (!supabase || !enabled) return

        const channel = supabase
            .channel(`realtime-${table}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table },
                (payload) => {
                    callbackRef.current({
                        eventType: payload.eventType,
                        newRecord: payload.new,
                        oldRecord: payload.old,
                    })
                },
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, enabled])
}
