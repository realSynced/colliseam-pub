//@ts-nocheck
import { createClient } from "@/utils/supabase/server";

export function checkUserLoggedIn() {
  //check
  const checkSession = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return false;
    }

    if (session) {
      return true;
    } else {
      console.log("No user is logged in.");
      return false;
    }
  };
  return checkSession;
}

// Check if user is a member of the project
export function checkUserProject(projectId: string, userId: string) {
  const checkProject = async (projectId: string, userId: string) => {
    let userIsMember = false;
    const supabase = createClient();
    const { data, error } = await supabase.from("projects").select("user_id").eq("project_id", projectId);
    if (error) {
      console.error("Error getting project:", error);
      return false;
    }

    if (data) {
      data[0].user_id.map((user: string) => {
        if (user === userId) {
          userIsMember = true;
        }
      });
    }
    return userIsMember;
  };
  return checkProject(projectId, userId);
}

export async function getAvatarUrl(userId: string) {
  let avatarurl = "";
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("profiles").select("avatar_url").eq("user_id", userId);
    if (error) {
      console.error("Error getting avatar:", error);
      return false;
    }
    if (data) {
      avatarurl = data[0].avatar_url;
    }
  } catch (error) {
    console.error("Error getting avatar:", error);
    return false;
  }
  return avatarurl;
}
