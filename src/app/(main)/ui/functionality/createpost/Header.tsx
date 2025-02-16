"use client";
import type { HeaderData, TagsContextValue } from "./types";
import { TagsContext } from "./Contexts";
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import TagsMenu from "./TagsMenu";
import Image from "next/image";

export default function Header({ username, time, profilePicture, postTypes, postType, setPostType }: HeaderData) {
  const [displayTypes, setDisplayTypes] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const { postTags, setPostTags } = useContext<TagsContextValue>(TagsContext);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Function to handle clicks outside the dropdown
  const handleClickOutside = (e: any) => {
    console.log("RUNNNING");

    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDisplayTypes(false);
    }
  };

  useEffect(() => {
    if (displayTypes) {
      // Add event listener to handle clicks outside when dropdown is open
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Clean up the event listener when dropdown is closed
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayTypes]);

  return (
    <div className="relative flex w-full">
      <Image src={profilePicture} width={50} height={50} alt="pfp" className="size-12 flex-none rounded-full object-cover" />

      <div className="ml-2 flex w-auto flex-col">
        <div className="flex items-center">
          <h1 className="text-base font-bold leading-tight">{username}</h1>
          <time className="ml-2 text-sm text-white/50">{time}</time>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              type="button"
              className="mt-1 flex items-center rounded-full bg-primary px-2 py-1 text-xs"
              onClick={() => setDisplayTypes(!displayTypes)}
            >
              {postType === "" ? (
                <>
                  Type of post
                  <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 size-3">
                    <path d="M1 1.43896L5.50073 5.56097L10 1.43896" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              ) : (
                postType
              )}
            </button>
            {displayTypes && (
              <div ref={dropdownRef} className="fixed z-10 mt-2 w-40 gap-2 rounded-xl border border-white/10 bg-black p-2 text-white">
                {postTypes.map((typeName, typeIndex) => {
                  return (
                    <button
                      key={typeIndex}
                      type="button"
                      className="w-full text-nowrap rounded-lg px-2 py-1.5 text-left text-sm font-semibold hover:bg-blackLight"
                      onClick={() => {
                        setPostType(typeName);
                        setDisplayTypes(false);
                      }}
                    >
                      {typeName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {postTags.map((tagName, tagIndex) => {
            return (
              <div key={tagIndex} className="mt-1 rounded-full bg-blackLight px-2 py-1 text-xs flex items-center">
                {tagName}
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => {
                    setPostTags(postTags.filter((item) => item != tagName));
                  }}
                >
                  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3 rotate-45">
                    <path d="M6.0002 1.7L6.0002 11.3M10.8002 6.5L1.2002 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            );
          })}

          <button
            type="button"
            className="mt-1 flex items-center rounded-full bg-blackLight px-2 py-1 text-xs"
            onClick={() => setDisplayMenu(!displayMenu)}
          >
            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3">
              <path d="M6.0002 1.7L6.0002 11.3M10.8002 6.5L1.2002 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="ml-2">Add tag</p>
          </button>
          {postTags.length < 1 && <p className="mt-1 text-xs text-white/75">Maximum 5 tags</p>}
        </div>
      </div>
      {displayMenu && <TagsMenu setDisplayMenu={setDisplayMenu} />}
    </div>
  );
}
