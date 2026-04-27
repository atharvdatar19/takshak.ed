import { useEffect, useCallback } from 'react'
import supabase from '@database/supabaseClient'

/**
 * useRealtimeSync - Subscribe to Supabase realtime changes
 *
 * @param {string} tableName - Table to subscribe to
 * @param {Function} handler - Either a state setter (for array manipulation)
 *                             or a plain callback (for re-fetching data)
 * @param {boolean} [refetchMode=false] - If true, handler is called with no args on any change
 */
export function useRealtimeSync(tableName, handler, refetchMode) {
  // Auto-detect mode: if handler is not a state setter, treat as refetch callback
  const isRefetch = refetchMode !== false

  const stableHandler = useCallback(handler, [])

  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel(`public:${tableName}:${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          if (isRefetch) {
            // Simple mode: just call the handler to trigger a re-fetch
            stableHandler()
          } else {
            // Array manipulation mode (legacy)
            stableHandler((currentData) => {
              if (!currentData || !Array.isArray(currentData)) return currentData

              switch (payload.eventType) {
                case 'INSERT':
                  return [...currentData, payload.new]
                case 'UPDATE':
                  return currentData.map((item) =>
                    item.id === payload.new.id ? { ...item, ...payload.new } : item
                  )
                case 'DELETE':
                  return currentData.filter((item) => item.id !== payload.old.id)
                default:
                  return currentData
              }
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tableName, stableHandler, isRefetch])
}
