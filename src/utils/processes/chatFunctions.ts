import { createClient } from "@/utils/supabase/server";

export async function createChat({ type }: { participants: string[], type: string }) {
    try {

    } catch (error) {
     console.log("Error creating chat:", error)   
    }
}

export async function addChatMember(chatID: number, userID: string, type: string) {
    try {
        const supabase = createClient();
        const { error } = await supabase.from("chat_participants").insert([
            {
                chat_id: chatID,
                user_id: userID,
                type: type
            }
        ]);
        if (error) {
            throw error;
        }
        console.log("Chat member added");
        return true
    } catch (error) {
        // @ts-expect-error
     console.log("Error adding chat member:", error.message)   
    }
}