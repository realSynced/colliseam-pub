"use server"
import { supabase } from "@/utils/supabase/superclient"
// import { createClient } from "@/utils/supabase/server"

export async function getChannelTable(prjName, category) {
    try {
        const { data, error } = await supabase
            .from("project_channels")
            .select("*")
            .eq("identifier", `${prjName}_${category}`)
        if (error) {
            console.log("Error getting channel table:", error.message);
            throw error;
        }
        if(!error) {
            // console.log("Channel table data:", data);
            return data;
        }
    } catch (error) {
        console.log("Error getting channel table:", error.message);
        return false;
    }
}

export async function getAllProjectChannels(prjName) {
    try {
        const { data, error } = await supabase
            .from("project_channels")
            .select("*")
            .eq("project_name", prjName)
        if (error) {
            console.log("Error getting channel table:", error.message);
            throw error;
        }
        if(!error) {
            // console.log("Channel table data:", data);
            return data;
        }
    } catch (error) {
        console.log("Error getting channel table:", error.message);
        return false;
    }
}