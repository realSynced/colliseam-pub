"use server";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export async function createChat(participants : string[], type = "direct_message", project_id?: number, channel_id?: number, discussion_parent?: number) {
  try {
    const supabase = createClient();
    
    // Sort participants to ensure consistent ordering
    const sortedParticipants = [...participants].sort();
    
    // First get all chats for the first participant
    const { data: firstUserChats, error: firstUserError } = await supabase
      .from("chat_participants")
      .select(`
        chat_id,
        chats!inner(id, type)
      `)
      .eq("user_id", sortedParticipants[0])
      .eq("chats.type", type);

    if (firstUserError) {
      throw firstUserError;
    }

    // Then check if the second participant is in any of these chats
    const chatIds = firstUserChats?.map(chat => chat.chat_id) || [];
    if (chatIds.length > 0) {
      const { data: existingChat, error: searchError } = await supabase
        .from("chat_participants")
        .select(`
          chat_id,
          chats!inner(id)
        `)
        .eq("user_id", sortedParticipants[1])
        .in("chat_id", chatIds)
        .single();

      if (searchError && searchError.code !== "PGRST116") { // PGRST116 is "not found" error
        throw searchError;
      }

      if (existingChat) {
        console.log("Found existing chat:", existingChat.chats.id);
        return existingChat.chats.id;
      }
    }

    // If no existing chat, create a new one
    console.log("Type:", type);
    // @ts-expect-error
    const { data, error } = await supabase.from("chats").insert([
      {
        participants: sortedParticipants,
        type: type,
        project_id: project_id,
        channel_id: channel_id,
        discussion_parent: discussion_parent
      }
    ]).select().single();

    console.log("Type2:", data?.type);

    if (error) {
      throw error;
    }

    // Create chat participants entries
    for (const participantId of sortedParticipants) {
      const { error: chatError } = await supabase.from("chat_participants").insert([
        {
          user_id: participantId,
          chat_id: data?.id,
        }
      ]);
      if (chatError) {
        throw chatError;
      }
    }

    console.log("Chat created:", data);
    console.log("Chat ID:", data?.id);
    // return data?.id;
    return Response.json({ id: data?.id });

    
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
}