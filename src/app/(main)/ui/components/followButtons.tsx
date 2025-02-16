//@ts-nocheck
"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function UserFollowButton({
  targetUsername,
  initialIsFollowing,
  initialIsFollowed,
  reload,
  classNames,
}: {
  targetUsername: string;
  initialIsFollowing: boolean;
  initialIsFollowed: boolean;
  reload?: boolean;
  classNames?: {
    base?: string;
    follow?: string;
    followed?: string;
  };
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const supabase = createClient();

  useEffect(() => {
    if (reload) {
      checkFollow();
    }
  }, [reload]);

  async function handleFollow() {
    setIsLoading(true);
    const { data, error } = await supabase.rpc("toggle_follow", { target_username: targetUsername });
    if (error) console.error(error);

    setIsLoading(false);
    setIsFollowing(data);
  }

  async function checkFollow() {
    const { data, error } = await supabase.rpc("is_following", { target_username: targetUsername });
    if (error) console.error(error);

    setIsFollowing(data);
  }

  const mergedClassNames = {
    base: twMerge("flex items-center rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-75", classNames?.base ?? ""),
    follow: twMerge("bg-white text-black border-white hover:bg-primary hover:border-primary hover:text-white", classNames?.follow ?? ""),
    followed: twMerge("bg-inherit text-white border-white/50 hover:border-danger/50 hover:text-danger", classNames?.followed ?? ""),
  };

  return (
    <button
      className={isFollowing ? twMerge(mergedClassNames.base, mergedClassNames.followed) : twMerge(mergedClassNames.base, mergedClassNames.follow)}
      onClick={handleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
    >
      {isFollowing && isHovered ? "Unfollow" : isFollowing ? "Following" : initialIsFollowed ? "Follow back" : "Follow"}
    </button>
  );
}

export function TagFollowButton({
  targetTag,
  initialIsFollowing,
  classNames,
}: {
  targetTag: string;
  initialIsFollowing: boolean;
  classNames?: {
    base?: string;
    follow?: string;
    followed?: string;
  };
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const supabase = createClient();

  async function handleFollow() {
    setIsLoading(true);
    const { data, error } = await supabase.rpc("toggle_tag_follow", { target_tag: targetTag });
    if (error) console.error(error);

    setIsHovered(false);
    setIsLoading(false);
    setIsFollowing(data);
  }

  const mergedClassNames = {
    base: twMerge("flex items-center justify-center rounded-full border px-4 py-2 text-sm font-bold", classNames?.base ?? ""),
    follow: twMerge(
      "bg-white text-black justify-center border-white hover:bg-primary hover:border-primary hover:text-white",
      classNames?.follow ?? "",
    ),
    followed: twMerge(
      "bg-inherit text-white w-[100px] justify-center border-white/50 hover:border-danger/50 hover:text-danger",
      classNames?.followed ?? "",
    ),
  };

  return (
    <button
      className={isFollowing ? twMerge(mergedClassNames.base, mergedClassNames.followed) : twMerge(mergedClassNames.base, mergedClassNames.follow)}
      onClick={handleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
    >
      {isFollowing && isHovered ? "Unfollow" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
