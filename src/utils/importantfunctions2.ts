//@ts-nocheck
"use client";
import { createClient } from "./supabase/client";
// Replace spaces with underscores
/**
 * This function takes a string as input and replaces all the spaces in the string with underscores.
 * It first strips any white space from the left and right of the input string, then replaces all spaces in between words or characters with underscores.
 * @param {string} inputString - The string in which spaces are to be replaced.
 * @returns {string} - The input string with spaces replaced by underscores.
 */
export function replaceSpaces(inputString: string) {
  // Strip white space from the left and right
  let strippedString = inputString.trim();
  // Replace spaces in between words or characters with underscores
  let replacedString = strippedString.replace(/\s+/g, "_");
  return replacedString;
}

// Replace underscores with spaces
/**
 * This function takes a string as input and replaces all the underscores in the string with spaces.
 * @param {string} inputString - The string in which underscores are to be replaced.
 * @returns {string} - The input string with underscores replaced by spaces.
 */
export function replaceUnderscores(inputString: string) {
  // Replace underscores with spaces
  let replacedString = inputString.replace(/_/g, " ");
  return replacedString;
}

export function openNotifications(open: boolean) {
  if (open) {
    let openNotifications = open;
    return openNotifications;
  }
  return false;
}

export function getUsername(userId: string) {
  let username = "";
  const getUsername = async ({ userId }: { userId: string }) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("profiles").select("username").eq("id", userId);
      if (error) {
        console.error("Error getting username:", error);
        // return error;
        throw error;
      }
      if (data) {
        return data[0].username;
      }
    } catch (error) {
      console.error("Error getting username:", error);
      return error;
      // return false;
    }
  };
  return getUsername({ userId });
  // return username;
}

export function getAvatarUrl(userId: string) {
  let avatarurl = "";
  const getUrl = async ({ userId }: { userId: string }) => {
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
  };
  getUrl({ userId });
  return avatarurl;
}

export function getPostByID(postID: string) {
  let post = {};
  const getPost = async ({ postID }: { postID: string }) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("posts").select("*").eq("id", parseInt(postID));
      if (error) {
        console.error("Error getting post:", error);
        return false;
      }
      if (data) {
        post = data[0];
      }
    } catch (error) {
      console.error("Error getting post:", error);
      return false;
    }
  };
  getPost({ postID });
  return post;
}

export function createNotification(notification: object) {
  const createNotification = async ({ notification }: { notification: object }) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("notifications").insert([notification]);
      if (error) {
        console.error("Error creating notification:", error);
        return false;
      }
      if (data) {
        return data[0];
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      return false;
    }
  };
  return createNotification({ notification });
}
