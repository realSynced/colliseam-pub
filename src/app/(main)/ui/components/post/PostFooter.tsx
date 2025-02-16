"use client";
import type { footerData } from "./types";
import { useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { Upvote, Downvote, Comment, Stats, Bookmark } from "@/app/(main)/ui/components/postIcons";

export default function PostFooter({
  voteStat,
  initialUpvote,
  initialDownvote,
  initialFavorite,
  numberOfComments,
  numberOfViews,
  postID,
}: footerData) {
  const [upvoteState, setUpvote] = useState(initialUpvote);
  const [downvoteState, setDownvote] = useState(initialDownvote);
  const [bookmarkState, setBookmark] = useState(initialFavorite);

  const [voteCount, setVoteCount] = useState(voteStat);

  const supabase = createClient();

  async function registerUpvote() {
    const { data, error } = await supabase.rpc("toggle_post_vote", {
      target_post: postID,
      is_upvote: true,
    });

    console.log(data);

    if (error) {
      console.error(error);
      return;
    }

    let delta = 0;
    if (downvoteState) {
      delta = 2;
    } else {
      delta = upvoteState ? -1 : 1;
    }

    setUpvote(!upvoteState);
    setDownvote(false);
    setVoteCount(voteCount + delta);
  }

  async function registerDownvote() {
    const { data, error } = await supabase.rpc("toggle_post_vote", {
      target_post: postID,
      is_upvote: false,
    });

    console.log(data);

    if (error) {
      console.error(error);
      return;
    }

    let delta = 0;
    if (upvoteState) {
      delta = -2;
    } else {
      delta = downvoteState ? 1 : -1;
    }

    setDownvote(!downvoteState);
    setUpvote(false);
    setVoteCount(voteCount + delta);
  }

  async function registerBookmark() {
    const { error } = await supabase.rpc("toggle_post_save", {
      post_id: postID,
    });

    if (error) {
      console.error("error toggling save: " + error.message);
      return;
    }

    setBookmark(!bookmarkState);
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex">
        {/* VOTING GROUP */}
        <div className="flex items-center">
          {/* UPVOTE */}
          <button
            onClick={registerUpvote}
            className="group flex h-9 w-9 items-center justify-center rounded-full duration-100 hover:bg-primary/10 hover:opacity-100"
          >
            <Upvote upvoteState={upvoteState} />
          </button>
          {/* STATS */}
          <data className="mx-0.5 text-white/75 duration-100 hover:opacity-100 group-hover:text-primary">{voteCount}</data>
          {/* DOWNVOTE */}
          <button
            onClick={registerDownvote}
            className="group flex h-9 w-9 items-center justify-center rounded-full text-xl duration-100 hover:bg-danger/10 hover:opacity-100"
          >
            <Downvote downvoteState={downvoteState} />
          </button>
        </div>

        {/* COMMENT BUTTON */}
        <div className="group ml-3 flex items-center gap-1 rounded-full px-3 duration-100 hover:bg-primary/10">
          <Comment />
          <data className="flex items-center text-white/75 duration-100 group-hover:text-primary">{numberOfComments}</data>
        </div>

        {/* VIEWS STATS */}
        <div className="group ml-3 flex items-center gap-[0.1rem] rounded-full px-3 duration-100 hover:bg-primary/10">
          <Stats />
          <data className="ml-1 text-white/75 duration-100 group-hover:text-primary">{numberOfViews}</data>
        </div>
      </div>

      {/* BOOKMARK BUTTON */}
      <button onClick={registerBookmark} className="group flex h-9 w-9 items-center justify-center rounded-full duration-100 hover:bg-primary/10">
        <Bookmark bookmarkState={bookmarkState} />
      </button>
    </div>
  );
}
