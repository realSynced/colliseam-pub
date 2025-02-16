//@ts-nocheck
"use client";
import { useEffect, useRef, useState, useContext } from "react";
import type { TagsContextValue, AvailableTag } from "./types";
import { TagsContext } from "./Contexts";
import { createClient } from "@/utils/supabase/client";

import styles from "@/app/ui/styles.module.css";

export default function TagsMenu({ setDisplayMenu }: { setDisplayMenu: Function }) {
  const { postTags, setPostTags } = useContext<TagsContextValue>(TagsContext);
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const tagsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTags() {
      const supabase = createClient();
      // make sm with error
      const { data, error } = await supabase
        .from("tags")
        .select("name, num_posts")
        .ilike("name", `%${searchQuery}%`)
        .not("name", "in", `(${postTags.toString()})`)
        .limit(10);
      await setAvailableTags(data ?? []);
    }
    fetchTags();
  }, [searchQuery]);

  useEffect(() => {
    function clikedOutside(e: any) {
      if (tagsMenuRef.current && !tagsMenuRef.current.contains(e.target)) {
        setDisplayMenu(false);
      }
    }
    document.addEventListener("mousedown", clikedOutside);
    return () => {
      document.removeEventListener("mousedown", clikedOutside);
    };
  }, [tagsMenuRef]);

  return (
    <div
      ref={tagsMenuRef}
      className={`${styles.scroll} fixed z-10 mt-16 flex max-h-60 w-[39.5rem] flex-col overflow-y-hidden rounded-2xl border border-white/10 bg-black px-5 pt-5 text-white hover:overflow-y-auto`}
    >
      <input
        type="text"
        value={searchQuery}
        placeholder="Search tag"
        className="mb-5 rounded-full border border-blackLight bg-blackLight px-4 py-2 placeholder:text-white/50 focus:border focus:border-white/50 focus:outline-none"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {availableTags.map((tag, tagIndex) => {
        return (
          <button
            key={tagIndex}
            type="button"
            className="w-full rounded-xl px-3 py-1.5 text-left hover:bg-blackLight"
            onClick={() => {
              if (!postTags.includes(tag.name) && postTags.length < 5) {
                setPostTags([...postTags, tag.name]);
                setDisplayMenu(false);
              }
            }}
          >
            <h1 className="font-semibold text-white">{tag.name}</h1>
            <p className="text-sm font-semibold opacity-75">{tag.num_posts + (tag.num_posts > 1 ? " posts" : " post")}</p>
          </button>
        );
      })}
    </div>
  );
}
