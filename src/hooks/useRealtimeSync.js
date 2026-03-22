import { useEffect } from 'react'
import supabase from '../supabaseClient'

export function useRealtimeSync(tableName, setData) {
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          setData((currentData) => {
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
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tableName, setData])
}
