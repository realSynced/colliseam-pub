"use server";
import { supabase } from "@/utils/supabase/superclient";

export async function getUsernameByID(userID) {
    try {
        const { data: profileData, error: profileError } = await supabase.from("profiles").select("username").eq("id", userID).single();
        if (profileError) {
            console.log("Error getting profile data from userIDtoUsername:", profileError.message);
            throw profileError;
        }
        if (!profileError) {
            console.log("Profile username:", profileData.username);
            console.log("Username from profile data:", profileData.username);
            return profileData.username;
        }
    } catch (error) {
        console.log("Error getting profile data:", error.message);
        return false;
    }
}

export async function getAvatarUrlByUsername(username) {
    /**
     *
     * @param {string} username
     * @returns {string} avatar_url
     * @description This function takes a username as a parameter and returns the avatar_url associated with the username.
     */

    try {
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
        console.log("Error getting avatar url:", error.message);
        return false;
    }
}

export async function getUserIDByUsername(username) {
    try {
        const { data: profileData, error: profileError } = await supabase.from("profiles").select("id").eq("username", username).single();
        if (profileError) {
            console.log("Error getting profile data from userIDtoUsername:", profileError.message);
            throw profileError;
        }
        if (!profileError) {
            console.log("Profile username:", profileData.username);
            console.log("Username from profile data:", profileData.username);
            return profileData.id;
        }
    } catch (error) {
        console.log("Error getting profile data:", error.message);
        return false;
    }
}
