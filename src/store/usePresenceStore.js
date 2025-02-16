import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const usePresenceStore = create((set, get) => ({
  onlineUsers: new Set(),
  
  initializePresence: async (userId) => {
    if (!userId) return

    // Set up realtime presence
    const channel = supabase.channel('online-users')
    
    // Join the presence channel
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const onlineIds = new Set(
          Object.values(presenceState)
            .flat()
            .map(presence => presence.user_id)
        )
        set({ onlineUsers: onlineIds })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          })
        }
      })

    // Update presence every 30 seconds
    const interval = setInterval(async () => {
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
      })
    }, 30000)

    // Cleanup function
    return () => {
      clearInterval(interval)
      channel.unsubscribe()
    }
  },

  isUserOnline: (userId) => {
    return get().onlineUsers.has(userId)
  },
}))

export default usePresenceStore
