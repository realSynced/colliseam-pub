"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Upvote, Downvote, Stats, Bookmark, Reply } from "@/app/(main)/ui/components/postIcons";
import TimeAgo from "react-timeago";
import ReplyField from "./reply";

import { ProfileTooltip } from "@/app/(main)/ui/components/CustomTooltip";

export default function Comment({ comment, userAvatar }) {
  const supabase = createClient();
  const [replying, setReplying] = useState(false);
  const [voteState, setVoteState] = useState(comment.userVote);
  const [bookmarkState, setBookmarkState] = useState(comment.bookmarkState);
  const [voteStat, setVoteStat] = useState(comment.voteStat);

  async function registerVote(vote) {
    const { error } = await supabase.rpc("toggle_comment_vote", {
      target_comment: comment.id,
      is_upvote: vote === "up",
    });

    if (error) {
      console.log("Error toggling vote: ", error.message);
      return;
    }

    if (vote === "up" && voteState === "up") {
      setVoteState(null);
      setVoteStat(voteStat - 1);
    }
    if (vote === "up" && voteState === "down") {
      setVoteState("up");
      setVoteStat(voteStat + 2);
    }
    if (vote === "up" && voteState === null) {
      setVoteState("up");
      setVoteStat(voteStat + 1);
    }
    if (vote === "down" && voteState === "down") {
      setVoteState(null);
      setVoteStat(voteStat + 1);
    }
    if (vote === "down" && voteState === "up") {
      setVoteState("down");
      setVoteStat(voteStat - 2);
    }
    if (vote === "down" && voteState === null) {
      setVoteState("down");
      setVoteStat(voteStat - 1);
    }
  }

  async function registerBookmark() {
    const { error } = await supabase.rpc("toggle_comment_save", {
      comment_id: comment.id,
    });

    if (error) {
      console.log("Error toggling bookmark: ", error.message);
      return;
    }

    if (bookmarkState) {
      setBookmarkState(false);
    } else {
      setBookmarkState(true);
    }
  }

  return (
    <div className="flex w-full gap-2.5 pt-3">
      <div className="relative h-10 w-10 flex-shrink-0">
        <ProfileTooltip
          profilePicture={comment.authorAvatar}
          displayName={comment.authorFullName}
          href={`/profile/${comment.authorName}`}
          username={comment.authorName}
          userTitle={comment.authorTitle}
          userSubtitle={comment.authorSubtitle}
          userBio={comment.authorBio}
          userPoints={comment.authorPoints}
          userSkills={comment.authorSkills}
        >
          <Image src={comment.authorAvatar} layout="fill" className="rounded-full" alt="userAvatar" />
        </ProfileTooltip>
      </div>
      <div className="h-flex flex-grow flex-col">
        <div className="mb-1 flex items-center">
          <ProfileTooltip
            profilePicture={comment.authorAvatar}
            displayName={comment.authorFullName}
            href={`/profile/${comment.authorName}`}
            username={comment.authorName}
            userTitle={comment.authorTitle}
            userSubtitle={comment.authorSubtitle}
            userBio={comment.authorBio}
            userPoints={comment.authorPoints}
            userSkills={comment.authorSkills}
          >
            <Link href={`/profile/${comment.authorName}`} className="text-base font-bold leading-none">
              {comment.authorFullName}
            </Link>
          </ProfileTooltip>
          <time className="ml-2 text-xs leading-none opacity-75" suppressHydrationWarning>
            <TimeAgo date={comment.createdAt} minPeriod={5} />
          </time>
        </div>
        <p className="break-words break-all text-sm font-normal">{comment.content}</p>
        <div className="flex items-center gap-1 py-1 opacity-75">
          <button className="flex h-7 w-7 items-center justify-center rounded-full" onClick={() => registerVote("up")}>
            <Upvote upvoteState={voteState === "up"} />
          </button>
          <data value={comment.voteStat}>{voteStat}</data>
          <button className="flex h-7 w-7 items-center justify-center rounded-full" onClick={() => registerVote("down")}>
            <Downvote downvoteState={voteState === "down"} />
          </button>
          {!replying && (
            <button onClick={() => setReplying(!replying)} className="ml-2 flex h-7 items-center justify-center rounded-full">
              <Reply />
              <span className="ml-1 text-sm">Reply</span>
            </button>
          )}
          <button className="ml-auto flex h-7 w-7 items-center justify-center rounded-full" onClick={registerBookmark}>
            <Bookmark bookmarkState={bookmarkState} />
          </button>
        </div>
        {replying && (
          <ReplyField postID={comment.postID} avatarUrl={userAvatar} parentID={comment.id} className="mt-2" onCancel={() => setReplying(false)} />
        )}
        {comment.children.map((child) => (
          <Comment key={child.id} comment={child} userAvatar={userAvatar} />
        ))}
      </div>
    </div>
  );
}
