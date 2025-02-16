import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const useChatStore = create((set, get) => ({
  typingUsers: new Map(), // Map of chat_id -> Set of typing user_ids
  unreadCounts: new Map(), // Map of chat_id -> number of unread messages
  channels: new Map(), // Store channel instances
  
  setTyping: (chatId, userId, isTyping) => {
    set(state => {
      const newTypingUsers = new Map(state.typingUsers)
      let chatTyping = newTypingUsers.get(chatId) || new Set()
      
      if (isTyping) {
        chatTyping.add(userId)
      } else {
        chatTyping.delete(userId)
      }
      
      if (chatTyping.size === 0) {
        newTypingUsers.delete(chatId)
      } else {
        newTypingUsers.set(chatId, chatTyping)
      }
      
      return { typingUsers: newTypingUsers }
    })
  },

  initializeTypingChannel: (chatId, currentUserId) => {
    const existingChannel = get().channels.get(chatId)
    if (existingChannel) {
      return () => existingChannel.unsubscribe()
    }

    const channel = supabase.channel(`typing:${chatId}`)
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const typingUsers = new Set()
        
        Object.values(presenceState).flat().forEach(presence => {
          if (presence.isTyping && presence.user_id !== currentUserId) {
            typingUsers.add(presence.user_id)
          }
        })
        
        set(state => {
          const newTypingUsers = new Map(state.typingUsers)
          if (typingUsers.size > 0) {
            newTypingUsers.set(chatId, typingUsers)
          } else {
            newTypingUsers.delete(chatId)
          }
          return { typingUsers: newTypingUsers }
        })
      })
      .subscribe()

    // Store the channel instance
    set(state => ({
      channels: new Map(state.channels).set(chatId, channel)
    }))

    return () => {
      channel.unsubscribe()
      set(state => {
        const newChannels = new Map(state.channels)
        newChannels.delete(chatId)
        return { channels: newChannels }
      })
    }
  },

  updateTypingStatus: async (chatId, userId, isTyping) => {
    let channel = get().channels.get(chatId)
    
    if (!channel) {
      channel = supabase.channel(`typing:${chatId}`)
      await channel.subscribe()
      set(state => ({
        channels: new Map(state.channels).set(chatId, channel)
      }))
    }

    await channel.track({
      user_id: userId,
      isTyping
    })
  },

  incrementUnread: (chatId) => {
    set(state => {
      const newUnreadCounts = new Map(state.unreadCounts)
      const currentCount = newUnreadCounts.get(chatId) || 0
      newUnreadCounts.set(chatId, currentCount + 1)
      return { unreadCounts: newUnreadCounts }
    })
  },

  clearUnread: (chatId) => {
    set(state => {
      const newUnreadCounts = new Map(state.unreadCounts)
      newUnreadCounts.delete(chatId)
      return { unreadCounts: newUnreadCounts }
    })
  },

  getTypingUsers: (chatId) => {
    return get().typingUsers.get(chatId) || new Set()
  },

  getUnreadCount: (chatId) => {
    return get().unreadCounts.get(chatId) || 0
  }
}))

export default useChatStore
