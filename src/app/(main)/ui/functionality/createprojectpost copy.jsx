"use client";
import { createClient } from "@/utils/supabase/client";
import { FiPaperclip } from "react-icons/fi";
import { BiX } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

export default function CreateProjectPost({ onClose, projectID }) {
  const filesEntry = useRef(null);
  const [files, changeFiles] = useState([]);
  const [chosenTags, changeTags] = useState([]);

  const supabase = createClient();

  let availableTags = useAsyncList({
    async load({ signal, filterText }) {
      const { data: tags, error } = await supabase.from("tags").select("name").ilike("name", `%${filterText}%`).limit(5);

      if (error) {
        console.error("Error fetching tags: ", error.message);
        return [];
      }

      return { items: tags };
    },
  });

  function newFileEntry() {
    const newFilesList = [...files, ...filesEntry.current.files];
    changeFiles(() => newFilesList);
  }

  function deleteFile(name) {
    changeFiles(files.filter((file) => file.name !== name));
  }

  useEffect(() => {
    return () => {
      changeFiles([]);
    };
  }, []);

  async function post() {
    const postContent = document.getElementById("bodyInput").value;
    const postTitle = document.getElementById("titleInput").value;
    const postFiles = files;
    const imageNames = postFiles.map((file) => file.name);

    if (chosenTags.length < 2 || chosenTags.length > 10) {
      console.error("Error: Tags must be between 2 and 10");
      return;
    }

    const { data: newPostID, error: createPostError } = await supabase.rpc("write_new_project_post", {
      title: postTitle,
      content: postContent,
      images: imageNames,
      tags: chosenTags,
      project_id: projectID
    });

    if (createPostError) {
      console.error("Error creating post: ", createPostError.message);
      return;
    }

    if (postFiles.length > 0) {
      for (let file of postFiles) {
        const { error: fileError } = await supabase.storage.from("posts").upload(`${newPostID}/${file.name}`, file);

        if (fileError) {
          console.error("Error uploading file: ", fileError.message);
          return;
        }
      }
    }

    onClose();
  }

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="no-scrollbar overflow-y-auto overflow-x-hidden rounded-3xl bg-[#161616] p-6 text-white">
      <h1 className="flex justify-between text-lg font-bold xl:text-xl 2xl:text-2xl">
        Create Project Post <span className="text-sm opacity-75">Drafts</span>
      </h1>
      {/* <h2 className="my-4 w-fit rounded-full bg-primary px-4 py-2 text-sm font-bold">Type Of Post</h2> */}

      <div>
        <label className="mb-1 text-xs font-bold xl:text-sm 2xl:text-base" htmlFor="tagInput">
          Add Tags <span className="text-xs font-semibold opacity-75">Minimum 2, Maximum 10</span>
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newTag = document.getElementById("tagInput").value;
            if (newTag.trim() === "") return;
            if (chosenTags.length >= 10) return;
            changeTags([...chosenTags, newTag]);
            document.getElementById("tagInput").value = "";
          }}
          className="flex h-10 w-full items-center overflow-hidden rounded-full border border-transparent bg-blackLight p-2 focus-within:border-[#ffffff50] focus-within:outline-none"
        >
          <Autocomplete
            placeholder="Type Here"
            aria-label="Tag Input"
            id="tagInput"
            className="flex-grow bg-blackLight font-normal text-white placeholder-white/75 outline-none"
            isLoading={availableTags.isLoading}
            inputValue={availableTags.filterText}
            onInputChange={availableTags.setFilterText}
            items={availableTags.items}
            disabledKeys={chosenTags}
            scrollShadowProps={{ isEnabled: false }}
            listboxProps={{ className: "bg-blackLighter rounded-lg no-scrollbar", variant: "flat", color: "primary" }}
          >
            {(item) => {
              return (
                <AutocompleteItem key={item.name} className="text-white">
                  {item.name}
                </AutocompleteItem>
              );
            }}
          </Autocomplete>
          <button type="submit" className="h-full rounded-full bg-blackLighter px-4 text-sm font-semibold text-white">
            Add
          </button>
        </form>
        <ul className="mt-2 flex flex-wrap gap-2">
          {chosenTags.length === 0 ? (
            <p className="text-xs font-semibold opacity-75">No tags added yet</p>
          ) : (
            chosenTags.map((tag, tagIndex) => {
              return (
                <li key={tagIndex} className="flex flex-row rounded-full bg-black px-2 py-1">
                  <p className="text-sm font-medium">{tag}</p>
                  <button onClick={() => changeTags(chosenTags.filter((chosenTag) => chosenTag !== tag))}>
                    <BiX className="ml-1 text-lg text-white" />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <div className="my-3">
        <label className="mb-1 text-xs font-bold xl:text-sm 2xl:text-base" htmlFor="titleInput">
          Title
        </label>
        <input
          type="text"
          placeholder="Type Here"
          id="titleInput"
          className="h-10 w-full rounded-full border border-transparent bg-blackLight p-2 pl-4 font-normal text-white placeholder-[#ffffff77] focus:border-[#ffffff50] focus:outline-none"
        />
      </div>

      <div className="my-3">
        <label className="mb-1 flex justify-between text-xs font-bold xl:text-sm 2xl:text-base" htmlFor="bodyInput">
          Body <span className="font-medium opacity-50">0/200</span>
        </label>

        <article style={isFocused ? { borderColor: "#ffffff50" } : {}} className="rounded-3xl border border-transparent bg-blackLight p-3 px-4">
          {/* ToolBar */}
          <nav className="mb-2 flex h-7 items-center gap-3 text-xl text-[#ffffff77]">
            <label className="group cursor-pointer">
              <FiPaperclip className="duration-200 hover:scale-110 group-hover:text-white" />
              <input type="file" multiple ref={filesEntry} className="hidden" onChange={newFileEntry} />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            {/* Divider */}
            <span className="h-full w-[1.5px] bg-white/75"></span>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            {/* Divider */}
            <span className="h-full w-[1.5px] bg-white/75"></span>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
            <label>
              <FiPaperclip className="duration-200 hover:scale-110 hover:text-white" />
            </label>
          </nav>

          {/* Current files uploaded */}
          <ul className="flex w-full flex-row flex-wrap gap-1">
            {files.map((file, fileIndex) => {
              return (
                <li key={fileIndex} className="flex flex-row rounded-full bg-black px-2 py-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <button onClick={() => deleteFile(file.name)}>
                    <BiX className="ml-1 text-lg text-white" />
                  </button>
                </li>
              );
            })}
          </ul>

          <textarea
            id="bodyInput"
            cols="30"
            rows="6"
            placeholder="Type Here"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="scrollbar-none w-full resize-none border border-transparent bg-blackLight text-white placeholder-white/75focus:outline-none"
          />
        </article>
      </div>

      <div className="flex w-full">
        <div className="mr-auto flex space-x-2">
          <button onClick={onClose} className="rounded-full bg-blackLight px-4 py-2 text-sm font-semibold text-white">
            Cancel
          </button>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="rounded-full bg-blackLight px-4 py-2 text-sm font-semibold text-white opacity-75">Save Draft</button>
          <button onClick={() => post()} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold opacity-75">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
