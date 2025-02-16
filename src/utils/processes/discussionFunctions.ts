"use server";
import { createClient } from "@/utils/supabase/server";

export async function userIDtoUsername(userID: string) {
  try {
    const supabase = createClient();
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("username").eq("id", userID).single();
    if (profileError) {
      console.log("Error getting profile data from userIDtoUsername:", profileError.message);
      throw profileError;
    }
    if (!profileError) {
      console.log("Profile username:", profileData.username);
      return profileData.username;
    }
  } catch (error) {
    // @ts-expect-error
    console.log("Error getting profile data:", error.message);
    return false;
  }
}

export async function createDiscussion(projectID: number, discussionName: string, channelID: number, chatID: number, categoryID: number) {
  try {
    const supabase2 = createClient();
    const { data: { user }, error: userError } = await supabase2.auth.getUser();
    if (userError) throw userError;
    const { error } = await supabase2.from("project_discussions").insert([{
      creator_id: user?.id,
      project_id: projectID,
      discussion_name: discussionName,
      channel_id: channelID,
      chat_id: chatID,
      category_id: categoryID
    }]);
    if (error) {
      console.log("Error creating new message table:", error.message);
      throw error;
    }

  } catch (error) {
    // @ts-expect-error
    console.log("Error creating new message table:", error.message);
    return false;
  }
}


export async function usersInDiscussionAvatarUrls(categoryID: number) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("project_discussions").select("chat_relation").eq("category_parent", categoryID).single();
    if (error) {
      console.log("Error getting discussion members (fetching discussion):", error.message);
      throw error;
    }
    // @ts-expect-error
    const { data: data2, error: error2 } = await supabase.from("chat_participants").select("profiles!chat_participants_user_id_fkey(username)").eq("id", data?.chat_relation);
    if (error2) {
      console.log("Error getting discussion members (fetching participants):", error2.message);
      throw error2;
    }
    // Get avatar urls
    // @ts-expect-error
    const avatarUrls = await Promise.all(data2.map(async (participant) => await getAvatarUrlFormatted(participant.profiles.username)));

    return avatarUrls;

  } catch (error) {
    // @ts-expect-error
    console.log("Error getting discussion members:", error.message);
    return false;
  }
}

export async function getAvatarUrlFormatted(username: string) {
  try {
    const supabase = createClient();
    console.log("Gotten Username:", username);
    const { data, error } = await supabase.from("profiles").select("avatar_url").eq("username", username).single();
    if (error) {
      console.log("Error getting avatar url:", error.message);
      throw error;
    }
    if (!error) {
      console.log("Avatar url:", data.avatar_url);
      console.log("Formatted Avatar url:", `https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${data.avatar_url}`);
      return data.avatar_url;
    }
  } catch (error) {
    console.log("Error getting avatar url:", error);
    return false;
  }
}