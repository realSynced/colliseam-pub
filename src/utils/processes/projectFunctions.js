"use server";
import { supabase } from "@/utils/supabase/superclient";
import { createClient } from "@/utils/supabase/server";
import { getUsernameByID, getUserIDByUsername } from "./profileFunctions";
import { updateUserQuestionaireStatus } from "./questionaireFunctions";

export async function getListMembers(prjName) {
  try {
    const { data, error } = await supabase.from("project_members").select("user_id").eq("project_name", prjName);
    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error getting project members(getListMembers):", error.message);
    return false;
  }
}

export async function getFullMembersList(prjName) {
  try {
    const { data, error } = await supabase.from("project_members").select("user_id, role").eq("project_name", prjName);

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error getting project members (getFullMembersList):", error.message);
  }
}

// Is this even used? If so, I'm deleting the projects members column so use the project_members table instead - Don

// export async function getMemberRoles(prjName, userID) {
//     try {
//         const { data, error } = await supabase.from("projects").select("members").eq("name", prjName).single();

//         if (error) throw error;

//         if (userID) {
//             console.log("getMemberRoles:", data.members[userID].role);
//             return data.members[userID].role;
//         }
//     } catch (error) {
//         console.log("Error getting project members from project.members(getMemberRoles):", error.message);
//     }
// }

export async function getProjectNameByID(prjID) {
  try {
    const { data, error } = await supabase.from("projects").select("name").eq("id", prjID).single();
    if (error) {
      console.log("Error getting project name (getProjectNameByID):", error.message);
      throw error;
    }
    return data.name;
  } catch (error) {
    console.log("Error getting project name(getProjectNameByID):", error.message);
    return false;
  }
}

export async function getProjectIDByName(prjName) {
  try {
    const { data, error } = await supabase.from("projects").select("id").eq("name", prjName).single();
    if (error) {
      console.log("Error getting project ID (getProjectIDByName):", error.message);
      throw error;
    }
    return data.id;
  } catch (error) {
    console.log("Error getting project ID(getProjectIDByName):", error.message);
    return false;
  }
}

export async function getProjectOwner(prjName) {
  try {
    const { data, error } = await supabase.from("projects").select("owner").eq("name", prjName).single();
    if (error) {
      console.log("Error getting project owner (getProjectOwner):", error.message);
      throw error;
    }
    return data.owner;
  } catch (error) {
    console.log("Error getting project owner(getProjectOwner):", error.message);
    return false;
  }
}

// Interactive actions

export async function addProjectMember(prjName, prjID, userID, role) {
  try {
    const supabase2 = createClient();
    let projectID = prjID ? prjID : await getProjectIDByName(prjName);
    const { error } = await supabase2.from("project_members").insert([
      {
        user_id: userID,
        project_id: projectID,
        role: role,
        project_name: prjName,
      },
    ]);

    if (error) {
      throw error;
    }

    console.log("Member added successfully");
    return true;
  } catch (error) {
    console.log("Error adding user to project (addProjectMember):", error.message);
  }
}

export async function acceptRequest(prjName, userID) {
  try {
    await addProjectMember(prjName, null, userID, "member");
    await updateUserQuestionaireStatus(prjName, userID, true, false);
    console.log("Member accepted successfully");

    return true;
  } catch (error) {
    console.log("Error adding user to project (acceptRequest):", error.message);
  }
}

export async function declineRequest(prjName, userID) {
  try {
    const supabase2 = createClient();

    await updateUserQuestionaireStatus(prjName, userID, false, true);
    return true;
  } catch (error) {
    console.log("Error getting project members (declineRequest):", error.message);
    return false;
  }
}

export async function kickMember(prjName, username) {
  try {
    const supabase2 = createClient();
    const userID = await getUserIDByUsername(username);
    const { error } = await supabase2.from("project_members").delete().eq("user_id", userID).eq("project_name", prjName);
    if (error) throw error;
    console.log("Member kicked successfully");
    return true;
  } catch (error) {
    console.log("Error getting project members (kickMember):", error.message);
    return false;
  }
}

export async function banMember(prjName, userID) {
  try {
    const supabase2 = createClient();
    const { data, error } = await supabase2.from("projects").select("bannedUsers").eq("name", prjName).single();
    if (error) {
      console.log("Error getting project members (banMember):", error.message);
      throw error;
    }
    const username = await getUsernameByID(userID);
    let bannedObject = {
      id: userID,
      username: username,
      createdAt: new Date().toISOString(),
    };
    let bannedUsers = data.bannedUsers || [];
    bannedUsers.push(bannedObject);
    const { error: error2 } = await supabase.from("projects").update({ bannedUsers: bannedUsers }).eq("name", prjName);
    if (error2) throw error2;
    await kickMember(prjName, username);
    console.log("Member banned successfully");
    return true;
  } catch (error) {
    console.log("Error getting project members (banMember):", error.message);
    return false;
  }
}
