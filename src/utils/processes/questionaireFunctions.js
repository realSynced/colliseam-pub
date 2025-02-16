"use server";
import { supabase } from "@/utils/supabase/superclient";
import { createClient } from "@/utils/supabase/server";
import { createProjectRequestNotification } from "./notificationFunctions";

export async function submitQuestionaire(projectID, prjName, responses) {
  try {
    const supabase2 = createClient();
    const { data, error: userError } = await supabase2.auth.getUser();
    if (userError) throw userError;
    const { error: error2 } = await supabase.from("project_questionaire_responses").insert([
      {
        questionaire_id: responses.questionaireID,
        user_id: data?.user?.id,
        answers: responses.answers,
        status: "pending",
        project_name: prjName,
        updatedAt: new Date().toISOString(),
      },
    ]);
    if (error2) throw error2;

    console.log("Questionare has been submitted");

    const {
      data: { user },
      error: error4,
    } = await supabase.auth.getUser();
    if (error4) {
      console.log("Error getting user:", error4.message);
      throw error4;
    }
    await updateUserQuestionaireStatus(prjName, user?.id, true, true);
    await createProjectRequestNotification(projectID, user?.id);
    return true;
  } catch (error) {
    console.log("Error submitting questionaire:", error.message);
  }
}

export async function updateUserQuestionaireStatus(prjName, userID, choice = true, pending = false) {
  // choice is true for accepted, false for rejected
  try {
    const supabase2 = createClient();
    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase2.auth.getUser();
    // if (userError) throw userError;
    const chosenStatus = choice === true && pending === true ? "pending" : choice === true && pending === false ? "accepted" : "rejected";

    const { error } = await supabase
      .from("project_questionaire_responses")
      .update([
        {
          status: chosenStatus,
          updatedAt: new Date().toISOString(),
        },
      ])
      .eq("user_id", userID)
      .eq("project_name", prjName);

    if (error) {
      console.log("Error finding if user submitted questionaire:", error.message);
      throw error;
    }
  } catch (error) {
    console.log("Error updating questionaire status:", error.message);
  }
}
