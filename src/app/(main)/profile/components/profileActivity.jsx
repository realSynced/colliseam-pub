"use client";

import { useState, useEffect } from "react";
import Feed from "@/app/(main)/profile/functionality/feed";
import PersonalizedFeed from "../../(explore)/components/personalizedFeed";

export default function ProfileActivity({ userInfo }) {
  const [viewingPosts, setViewingPosts] = useState(true);
  const [whichPosts, setWhichPosts] = useState("Posted");
  const [postIDs, setPostIDs] = useState(userInfo.postIDs);

  useEffect(() => {
    switch (whichPosts) {
      case "Posted":
        setPostIDs(userInfo.postIDs);
        break;
      case "Upvoted":
        setPostIDs(userInfo.postsUpvoted);
        break;
      case "Downvoted":
        setPostIDs(userInfo.postsDownvoted);
        break;
      case "Saved":
        setPostIDs(userInfo.postsSaved);
        break;
      default:
        setPostIDs(userInfo.postIDs);
        break;
    }
  }, [whichPosts, userInfo]);

  const postTypes = ["Posted", "Upvoted", "Downvoted", "Saved"];

  return (
    <div className="mb-auto flex w-[750px] flex-col overflow-hidden rounded-2xl border border-blackLight bg-black">
      <nav className="flex items-center justify-evenly border-b border-blackLight py-5">
        <button className={`h-full w-1/2 text-2xl font-bold ${viewingPosts ? "text-white" : "text-white/50"}`} onClick={() => setViewingPosts(true)}>
          Feed
        </button>
        <button
          className={`h-full w-1/2 text-2xl font-bold ${!viewingPosts ? "text-white" : "text-white/50"}`}
          onClick={() => setViewingPosts(false)}
        >
          Projects
        </button>
      </nav>
      {viewingPosts ? (
        <>
          <nav className="flex items-center justify-around border-b border-blackLight">
            {postTypes.map((type) => (
              <button
                key={type}
                className={`h-full items-center py-3 font-semibold ${whichPosts === type ? "border-b-[3px] text-white" : "text-white/50"}`}
                onClick={() => setWhichPosts(type)}
              >
                {type}
              </button>
            ))}
          </nav>
          {postIDs.length > 0 && <PersonalizedFeed includesAllPosts={postIDs} key={whichPosts} />}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
