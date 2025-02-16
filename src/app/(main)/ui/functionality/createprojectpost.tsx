//@ts-nocheck
"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState, useReducer } from "react";
import { usePostUpdate } from "@/app/(main)/utils/globalStates";
import { AreaContext, TagsContext } from "@/app/(main)/ui/functionality/createpost/Contexts";
import Header from "@/app/(main)/ui/functionality/createpost/Header";
import WritingArea from "@/app/(main)/ui/functionality/createpost/WritingArea";
import { v4 as uuidv4 } from "uuid";
import type { Area, AreaContextValue, HeaderData, PostEntries, TagsContextValue } from "@/app/(main)/ui/functionality/createpost/types";
import { useUser } from "@/lib/store/user";

import { Modal, ModalContent } from "@nextui-org/react";
import { toast } from "sonner";
export default function createPost({ closeCreatePost, projectID }: { closeCreatePost: Function; projectID: any }) {
  const createPostRef = useRef<HTMLFormElement | null>(null);

  function handleConfirmationModal() {
    if (areas[0].rawtext.length > 0 || postTags.length > 0 || titleRef.current?.value || postType) {
      setIsConfirmationOpen(true);
    } else {
      closeCreatePost();
    }
  }

  const [profilePicture, setProfilePicture] = useState<string>("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postType, setPostType] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [submitable, setSubmitable] = useState<boolean>(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const { postUpdated, setPostUpdated } = usePostUpdate();
  const initialId = uuidv4();
  const { user } = useUser();

  const typesData = ["Critique Help", "Discussion", "General", "Tips & Tricks", "Meme", "News", "Poll", "Question", "Update"];

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  async function rateLimit() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("posts").select("created_at").eq("author", user.id).limit(1).single();
      if (error) {
        throw error;
      }
      const timeNow = new Date();
      const timeThen = new Date(data.created_at);
      const timeDifference = timeNow.getTime() - timeThen.getTime();
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      if (minutesDifference < 1) {
        toast.error("You have already posted recently. Please wait before posting again.");
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error rate limiting (createPost): " + (error as Error).message);
    }
  }

  // maye fix the any: need to remove the "?"
  function areaReducer(state: Area[], action: any): Area[] {
    switch (action.type) {
      case "UPDATE_TEXT":
        return state.map((item: Area) => {
          if (item.id === action.id) {
            return {
              id: item.id,
              content: item.content,
              // type + undefined
              text: action.text,
              rawtext: action.rawtext,
              files: item.files,
            };
          } else {
            return item;
          }
        });
      case "UPDATE_FILES":
        return state.map((item: Area) => {
          if (item.id === action.id) {
            return {
              id: item.id,
              content: item.content,
              text: item.text,
              rawtext: item.rawtext,
              files: action.files,
            };
          } else {
            return item;
          }
        });
      case "ADD_AREA":
        const id = uuidv4();
        const area: Area = {
          id: id,
          content: <WritingArea id={id} />,
          text: null,
          rawtext: "",
          files: [],
        };
        return [...state, area];

      case "DELETE_NEXT_AREA":
        const AreaIndex = state.findIndex((item: Area) => item.id === action.id);
        const newState = state.filter((_, index: number) => index != AreaIndex + 1);
        return newState;
    }
    throw new Error("Unknown action: " + action.type);
  }

  const [areas, areaDispatch] = useReducer(areaReducer, [
    {
      id: initialId,
      content: <WritingArea id={initialId} />,
      text: null,
      rawtext: "",
      files: [],
    },
  ]);

  const areaContextValue: AreaContextValue = {
    areaDispatch: areaDispatch,
    areas: areas,
  };

  const tagsContextValue: TagsContextValue = {
    postTags: postTags,
    setPostTags: setPostTags,
  };

  const headerData: HeaderData = {
    username: username,
    time: "",
    profilePicture: profilePicture,
    postTypes: typesData,
    postType: postType,
    setPostType: setPostType,
  };

  function verifyData(): Boolean {
    //TODO: return more detailed issue
    console.log("Verify data called");
    const hasConsecutiveCharacters = (text) => /(.)\1{5,}/.test(text); // checks for consecutive characters.
    if (postType === "") {
      setSubmitable(false);
      toast("Select a post type", { duration: 5000, position: "top-center" });
      return false;
    } else if (titleRef.current?.value === "") {
      setSubmitable(false);
      toast("Enter a title", { duration: 5000, position: "top-center" });
      return false;
    } else if (hasConsecutiveCharacters(titleRef.current?.value)) {
      setSubmitable(false);
      toast("You cannot have more than 5 consecutive characters in your title.", { duration: 5000, position: "top-center" });
      return false;
    } else if (areas[0].rawtext.length < 20) {
      setSubmitable(false);
      toast("Content too short", { duration: 5000, position: "top-center" });
      return false;
    } else if (hasConsecutiveCharacters(areas[0].rawtext)) {
      setSubmitable(false);
      toast("Consecutive characters detected in content", { duration: 5000, position: "top-center" });
      return false;
    } else if (areas[0].files.length > 5) {
      setSubmitable(false);
      toast("Max images or files reached: Remove some files. The max is 5.", { duration: 5000, position: "top-center" });
      return false;
    } else if (postTags.length > 10) {
      setSubmitable(false);
      toast("Max tags reached: Remove some tags", { duration: 5000, position: "top-center" });
      return false;
    } else if (!rateLimit()) {
      setSubmitable(false);
      toast("Please wait before posting again.");
      return false;
    }

    setSubmitable(true);
    return true;
  }

  useEffect(() => {
    verifyData();
  }, [postTags, postType]);

  function fetchEntries(): PostEntries {
    // future update: more precise type than object[] rich and raw
    let richContent: Object[] = [];
    let rawContent: string[] = [];
    let files: File[] = [];
    areas.forEach((area) => {
      richContent.push({ type: "text", content: area.text });
      rawContent.push(area.rawtext);
      if (area.files.length > 0) {
        const areaFilesNames = area.files.map((file) => file.name);
        richContent.push({ type: "files", content: areaFilesNames });
        files = files.concat(area.files);
      }
    });
    return {
      title: titleRef.current?.value ?? null,
      type: postType,
      tags: postTags,
      files: files,
      richContent: richContent,
      rawContent: rawContent.toString(),
    };
  }

  async function submitPost() {
    const supabase = createClient();
    const post = fetchEntries();
    if (!verifyData()) return;

    // Inserting the data in supa without using the pl/pgsql function
    // feel free to change this later on if necessary

    if (user) {
      // const { data: postId, error: postError } = await supabase.rpc("write_new_post", {
      //   title: post.title,
      //   type: post.type,
      //   // rawcontent: post.rawContent,
      //   content: post.richContent,
      //   tags: post.tags,
      //   images: post.files.map((file) => file.name),
      // });

      const { data: newPostID, error: createPostError } = await supabase.rpc("write_new_project_post", {
        title: post.title,
        type: post.type,
        content: post.rawContent,
        images: post.files.map((file) => file.name),
        tags: post.tags,
        project_id: projectID,
      });

      if (createPostError) {
        throw new Error("Could not post: " + createPostError.message);
      }

      // Integrate this in the rpc
      const { error: contentErorr } = await supabase.from("posts").update({ content: post.rawContent }).eq("id", postId);

      if (post.files.length > 0) {
        for (let file of post.files) {
          console.log(file.name);
          const { error } = await supabase.storage.from("posts").upload(`${postId}/${file.name}`, file);
          if (error) {
            console.error("Could not store file" + error.message);
          }
        }
      }

      setPostUpdated(true);

      closeCreatePost();
    }
  }

  async function fetchProfileData() {
    const supabase = createClient();
    if (user) {
      const userId = user.id;
      const { data: profile, error } = await supabase.from("profiles").select("username, avatar_url").eq("id", userId).single();
      if (!error) {
        const {
          data: { publicUrl },
        } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
        setProfilePicture(publicUrl);
        setUsername(profile.username);
      }
    }
  }

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <form
      ref={createPostRef}
      className="no-scrollbar flex w-full flex-col overflow-x-hidden rounded-2xl border border-white/10 bg-black p-5 text-white"
    >
      <TagsContext.Provider value={tagsContextValue}>
        <Header {...headerData} />
      </TagsContext.Provider>
      <div className="flex flex-col gap-y-2 pt-5 font-normal">
        <textarea
          rows={1}
          ref={titleRef}
          placeholder="Title"
          maxLength={100}
          className="resize-none bg-transparent text-base font-semibold text-white outline-0 placeholder:text-white/50"
        />
        <AreaContext.Provider value={areaContextValue}>
          {areas?.map((area: any, index: number) => {
            return <div key={index}>{area.content}</div>;
          })}
        </AreaContext.Provider>
      </div>
      <div className="mt-5 flex flex-row justify-between">
        <button
          type="button"
          onClick={handleConfirmationModal}
          className="rounded-full bg-blackLight px-4 py-2 text-sm font-bold hover:bg-white hover:text-black"
        >
          Cancel
        </button>

        <Modal
          isOpen={isConfirmationOpen}
          aria-label="Delete Post"
          classNames={{
            backdrop: "bg-black/50",
          }}
          hideCloseButton
          size="sm"
        >
          <ModalContent>
            <div className="mt-12 flex w-96 flex-col gap-5 rounded-xl border border-blackLight bg-black p-5 text-white">
              <div className="flex flex-col items-center gap-5">
                <div className="flex size-16 items-center justify-center rounded-full bg-danger bg-opacity-15">
                  <svg className="stroke-danger" width="35" height="48" viewBox="0 0 35 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.5 8.58088H32.5M13.75 28.4338V16.5221M21.25 28.4338V16.5221M25 36.375H10C7.92893 36.375 6.25 34.5973 6.25 32.4044V10.5662C6.25 9.46973 7.08947 8.58088 8.125 8.58088H26.875C27.9105 8.58088 28.75 9.46973 28.75 10.5662V32.4044C28.75 34.5973 27.0711 36.375 25 36.375ZM13.75 8.58088H21.25C22.2855 8.58088 23.125 7.69204 23.125 6.59559V4.61029C23.125 3.51385 22.2855 2.625 21.25 2.625H13.75C12.7145 2.625 11.875 3.51385 11.875 4.61029V6.59559C11.875 7.69204 12.7145 8.58088 13.75 8.58088Z"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold">Are you sure?</h2>
                <p className="w-2/3 text-center text-sm font-semibold text-white/75">
                  The draft will delete immediately. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2.5 font-semibold">
                <button
                  className="flex w-full justify-center gap-1.5 rounded-full bg-blackLight py-2 hover:bg-white hover:text-black"
                  onClick={() => setIsConfirmationOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsConfirmationOpen(false);
                    closeCreatePost();
                  }}
                  className="flex w-full justify-center gap-1.5 rounded-full bg-danger py-2 hover:bg-dangerHover"
                >
                  Discard
                </button>
              </div>
            </div>
          </ModalContent>
        </Modal>

        <button
          type="button"
          disabled={!submitable}
          onClick={() => submitPost()}
          className={"rounded-full px-4 py-2 text-sm font-bold " + (submitable ? "bg-primary text-white" : "bg-primary/50 text-white/50")}
        >
          Post
        </button>
      </div>
    </form>
  );
}
