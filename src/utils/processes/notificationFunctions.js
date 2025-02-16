"use server";
import { supabase } from "@/utils/supabase/superclient";
import { getUsernameByID, getAvatarUrlByUsername } from "./profileFunctions";
import { getProjectNameByID, getProjectOwner } from "./projectFunctions";

export async function createProjectRequestNotification(project_id, user_id) {
  try {
    let ownerID = await getProjectOwner(project_id);
    const username = await getUsernameByID(user_id);
    const projectName = await getProjectNameByID(project_id);
    const avatarUrl = await getAvatarUrlByUsername(username);
    const formattedUrl = "https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/" + avatarUrl;
    const notification = {
      name: username.toString().toUpperCase() + " has requested to join your project:" + projectName.toString().toUpperCase(),
      link: "/project/" + projectName + "/requests",
      image: formattedUrl,
      creator_id: user_id,
      receiver_id: ownerID,
    };

    const { error } = await supabase.from("notifications").insert([notification]);
    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error creating project request notification:", error);
    return false;
  }
}
