import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/lib/store/user';

export function useUnreadChannelMessages(channelId: string) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();
  const supabase = createClient();

  useEffect(() => {
    if (!user || !channelId) return;

    // Initial fetch
    fetchUnreadCount();

    // Subscribe to new messages and read status changes
    const channel = supabase
      .channel(`channel-messages-${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${channelId}`
        },
        (payload) => {
          // Only count messages from other users
          if (payload.new.sender_id !== user.id) {
            fetchUnreadCount();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_read_status',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, channelId]);

  const fetchUnreadCount = async () => {
    if (!user || !channelId) return;

    // Get all messages in the channel that:
    // 1. Are not from the current user
    // 2. Don't have a read_status entry for the current user
    const { count } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('chat_id', channelId)
      .neq('sender_id', user.id)
      .not('message_read_status', 'cs', `[{"user_id": "${user.id}"}]`);

    setUnreadCount(count || 0);
  };

  return unreadCount;
}
