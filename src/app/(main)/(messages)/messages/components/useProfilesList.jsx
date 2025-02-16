"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useProfilesList({ fetchDelay = 0 } = {}) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10; // Number of items per page, adjust as necessary

  const loadProfiles = async (currentOffset) => {
    try {
      setIsLoading(true);

      if (currentOffset > 0) {
        // Delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, fetchDelay));
      }

      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error(userError);
        throw userError;
      }

      // First get all chat IDs where the current user is a participant
      const { data: userChats, error: userChatsError } = await supabase
        .from("chat_participants")
        .select(`
          chat_id,
          chats!inner(type)
        `)
        .eq("user_id", user.id)
        .eq("chats.type", "direct_message");

      if (userChatsError) {
        console.error("Error fetching user chats:", userChatsError);
        throw userChatsError;
      }

      // Then get all other participants from these chats
      const chatIds = userChats?.map(chat => chat.chat_id) || [];
      const { data: otherParticipants, error: participantsError } = await supabase
        .from("chat_participants")
        .select("user_id")
        .in("chat_id", chatIds)
        .neq("user_id", user.id);

      if (participantsError) {
        console.error("Error fetching other participants:", participantsError);
        throw participantsError;
      }

      // Extract unique user IDs that we're already chatting with
      const existingUserIds = new Set(
        otherParticipants?.map(p => p.user_id) || []
      );

      // console.log("[useProfilesList] Existing chat user IDs:", Array.from(existingUserIds));

      // Now fetch profiles excluding the current user and existing chat participants
      let query = supabase
        .from("profiles")
        .select("id, username, aboutme, avatar_url")
        .neq("id", user.id);  // Exclude current user

      // Only add the additional filter if there are existing chat users
      if (existingUserIds.size > 0) {
        query = query.not("id", "in", `(${Array.from(existingUserIds).join(",")})`);
      }

      const { data: profileData, error: profileError } = await query.range(currentOffset, currentOffset + limit - 1);

      if (profileError) {
        console.error(profileError);
        throw profileError;
      }

      // Filter out profiles with username 'NULL'
      let filteredData = profileData.filter(profile => profile.username !== "NULL");

      // Append new results to existing ones, ensuring no duplicates
      setItems((prevItems) => [...prevItems, ...filteredData.filter((item) => !prevItems.some((prevItem) => prevItem.id === item.id))]);

      // Check if there are more profiles to fetch (excluding existing chat participants)
      let countQuery = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .neq("id", user.id);

      if (existingUserIds.size > 0) {
        countQuery = countQuery.not("id", "in", `(${Array.from(existingUserIds).join(",")})`);
      }

      const { count } = await countQuery;

      if (count !== null) {
        setHasMore(currentOffset + limit < count);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("There was an error with the fetch operation:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles(offset);
  }, [offset]);

  const onLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore,
  };
}
