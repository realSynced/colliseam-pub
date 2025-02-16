"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

export function useMessaging({ tableName, userId, channelName }) {
  const supabase = createClient();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const connectionSpeedRef = useRef(500);
  const lastFetchTimeRef = useRef(Date.now());

  const adjustFetchInterval = (fetchDuration) => {
    const newInterval = Math.min(Math.max(fetchDuration * 2, 500), 2000);
    connectionSpeedRef.current = newInterval;
  };

  const fetchMessages = async () => {
    const fetchStart = Date.now();
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      const groupedMessages = [];
      let currentGroup = [];

      data.forEach((message, index) => {
        const prevMessage = data[index - 1];
        const timeDifference = prevMessage 
          ? new Date(message.created_at) - new Date(prevMessage.created_at) 
          : 0;
        const isDifferentSender = !prevMessage || message.user_id !== prevMessage.user_id;
        const isTimeGapExceeded = timeDifference > 300000;

        if (isDifferentSender || isTimeGapExceeded) {
          if (currentGroup.length > 0) {
            groupedMessages.push(currentGroup);
          }
          currentGroup = [message];
        } else {
          currentGroup.push(message);
        }

        if (index === data.length - 1 && currentGroup.length > 0) {
          groupedMessages.push(currentGroup);
        }
      });

      const fetchDuration = Date.now() - fetchStart;
      adjustFetchInterval(fetchDuration);

      setMessages(groupedMessages);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async (content) => {
    try {
      const { error } = await supabase.from(tableName).insert([
        {
          content,
          user_id: userId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (err) {
      setError(err.message);
      console.error("Error sending message:", err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .match({ id: messageId, user_id: userId });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
      console.error("Error deleting message:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    let channel;

    const initialize = async () => {
      try {
        await fetchMessages();
        if (!mounted) return;

        channel = supabase
          .channel(channelName)
          .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: tableName,
          }, () => {
            if (mounted) {
              fetchMessages();
            }
          })
          .subscribe();

        intervalRef.current = setInterval(() => {
          if (mounted && Date.now() - lastFetchTimeRef.current >= connectionSpeedRef.current) {
            lastFetchTimeRef.current = Date.now();
            fetchMessages();
          }
        }, 100);

      } catch (err) {
        if (mounted) {
          setError(err.message);
          console.error("Error initializing messaging:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tableName, channelName]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
  };
}
