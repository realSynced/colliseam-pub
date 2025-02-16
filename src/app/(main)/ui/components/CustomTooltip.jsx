import Image from "next/image";
import Link from "next/link";
import LinesEllipsis from "react-lines-ellipsis";
import Spinner from "@/app/(main)/ui/components/spinner";
import { Message } from "./profileIcons";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Tooltip } from "@nextui-org/react";
import { useFollowUpdate } from "@/app/(main)/utils/globalStates";

import logo from "../../../../../public/nexusbrand/iconTransparentbg.svg";

export function ProfileTooltip({
  children,
  openDelay = 500,
  closeDelay = 200,
  profilePicture,
  isSelf,
  displayName,
  href,
  username,
  userTitle,
  userSubtitle,
  userBio,
  userFollowers,
  userFollowing,
  userPoints,
  userSkills,
}) {
  const [isFollowedBySelf, setIsFollowedBySelf] = useState(false);
  const [isFollowingSelf, setIsFollowingSelf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowHovered, setIsFollowHovered] = useState(false);
  const [numFollowers, setNumFollowers] = useState(userFollowers || 0);
  const [numFollowing, setNumFollowing] = useState(userFollowing || 0);
  const { followUpdated, setFollowUpdated } = useFollowUpdate();
  const supabase = createClient();

  async function checkFollowing() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: targetUserData, error: targetUserError } = await supabase.from("profiles").select("id").eq("username", username).single();

    const { data: selfFollowers, error: selfFollowersError } = await supabase
      .from("user_follows")
      .select(
        `
        follower_id,
        profiles!user_follows_follower_id_fkey (username)
        `,
      )
      .eq("followed_id", user.id);
    const { data: selfFollowing, error: selfFollowingError } = await supabase
      .from("user_follows")
      .select(
        `
      followed_id,
      profiles!user_follows_followed_id_fkey (username)
      `,
      )
      .eq("follower_id", user.id);

    if (selfFollowersError || selfFollowingError) {
      console.error(selfFollowersError || selfFollowingError);
      return;
    }

    const { count: numFollowers } = await supabase
      .from("user_follows")
      .select("follower_id", { count: "estimated", head: true })
      .eq("followed_id", targetUserData.id);

    const { count: numFollowing } = await supabase
      .from("user_follows")
      .select("followed_id", { count: "estimated", head: true })
      .eq("follower_id", targetUserData.id);

    setNumFollowers(numFollowers);
    setNumFollowing(numFollowing);

    if (isSelf) {
      setLoading(false);
      return;
    }

    setIsFollowedBySelf(selfFollowing.some((followed) => followed.profiles.username === username));
    setIsFollowingSelf(selfFollowers.some((follower) => follower.profiles.username === username));
    setLoading(false);
  }

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      checkFollowing();
    }
  };

  const handleFollow = async () => {
    setLoading(true);
    setFollowUpdated(true);
    const { data, error } = await supabase.rpc("toggle_follow", {
      target_username: username,
    });
    if (error) {
      console.error(error);
      return;
    }
    setIsFollowedBySelf(data);

    if (data) {
      setNumFollowers(numFollowers + 1);
    } else {
      setNumFollowers(numFollowers - 1);
    }

    setLoading(false);
  };

  return (
    <>
      <Tooltip
        delay={openDelay}
        closeDelay={closeDelay}
        placement="bottom-start"
        onOpenChange={handleOpenChange}
        content={
          <main className="w-96 -translate-x-3 rounded-xl border-[1px] border-blackLight bg-black p-5 text-white shadow-2xl">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src={profilePicture} alt="UserProfile" width={300} height={300} className="size-12 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Link href={href} className="text-base font-bold leading-tight">
                    {displayName}
                  </Link>
                  <Link href={href} className="text-sm font-medium leading-tight opacity-75">
                    @{username}
                  </Link>
                </div>
              </div>
              <div className="flex gap-1">
                {!isSelf &&
                  (loading ? (
                    <div className="rounded-full border border-white bg-none p-2">
                      <Spinner className="flex size-4 items-center" />
                    </div>
                  ) : isFollowedBySelf ? (
                    <button
                      className={`flex w-[100px] items-center justify-center rounded-full border px-4 py-2 text-sm font-bold text-white ${isFollowHovered ? "hover:border-danger/50 hover:text-danger" : "border-white/50"}`}
                      onClick={handleFollow}
                      onMouseEnter={() => setIsFollowHovered(true)}
                      onMouseLeave={() => setIsFollowHovered(false)}
                    >
                      {isFollowHovered ? "Unfollow" : "Following"}
                    </button>
                  ) : (
                    <button
                      className="flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:bg-primary hover:text-white"
                      onClick={handleFollow}
                    >
                      {isFollowingSelf ? "Follow Back" : "Follow"}
                    </button>
                  ))}
              </div>
            </nav>

            <div className="mt-3">
              <h1 className="textbase font-bold leading-snug">{userTitle}</h1>
              <h2 className="text-sm font-semibold opacity-75">{userSubtitle}</h2>

              <div className="mt-3 text-sm font-medium">
                <LinesEllipsis text={userBio} maxLine="3" ellipsis="..." trimRight basedOn="letters" />
              </div>

              <ol className="mt-3 flex flex-wrap items-center gap-2">
                {userSkills.map((tagName, i) => (
                  <li key={i} className="rounded-full bg-blackLight px-2 py-1 text-xs">
                    {tagName}
                  </li>
                ))}
              </ol>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <p>
                  <strong>{loading ? "..." : numFollowers}</strong> <span className="opacity-75">Followers</span>
                </p>
                <p>
                  <strong>{loading ? "..." : numFollowing}</strong> <span className="opacity-75">Following</span>
                </p>

                <p className="ml-auto flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm">
                  <Image src={logo} className="size-5" alt="nexus logo" /> <strong>{userPoints}</strong>
                </p>
              </div>
            </div>
          </main>
        }
      >
        {children}
      </Tooltip>
    </>
  );
}

export function TagTooltip({ children, openDelay = 500, closeDelay = 200, tagName }) {
  const supabase = createClient();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchTag() {
    const { data, error } = await supabase.from("tags").select("*").eq("name", tagName).single();
    if (error) {
      console.error(error);
      return;
    }
    setTag(data);
    setLoading(false);
  }

  const handleOpenChange = (isOpen) => {
    if (isOpen && loading) {
      fetchTag();
    }
  };

  return tag && !loading ? (
    <Tooltip
      delay={openDelay}
      closeDelay={closeDelay}
      placement="bottom-start"
      onOpenChange={handleOpenChange}
      content={
        <main className="w-96 -translate-x-3 rounded-xl border border-blackLight bg-black p-5 text-white shadow-2xl">
          <Link href={`/tag/${tag.slug}`} className="flex items-center justify-between text-2xl font-bold">
            <h1>{tagName}</h1>
          </Link>

          <div className="mt-3 text-sm font-medium">
            <LinesEllipsis text={tag.description} maxLine="3" ellipsis="..." trimRight basedOn="letters" />
            <div className="mt-3 flex items-center gap-2 text-sm">
              <p>
                <strong>{tag.num_followers}</strong> <span className="opacity-75">Followers</span>
              </p>
              <p>
                <strong>{tag.num_posts}</strong> <span className="opacity-75">Posts</span>
              </p>
              <p className="ml-auto opacity-75">Improve Tag Info</p>
            </div>
            <button className="mt-3 w-full rounded-full bg-white py-2 text-center text-sm font-bold text-black hover:bg-primary hover:text-white">
              Follow
            </button>
          </div>
        </main>
      }
    >
      {children}
    </Tooltip>
  ) : (
    <Tooltip
      delay={openDelay}
      closeDelay={closeDelay}
      placement="bottom-start"
      onOpenChange={handleOpenChange}
      content={
        <main className="w-96 -translate-x-3 rounded-xl border border-blackLight bg-black p-5 text-white shadow-2xl">
          <nav className="flex items-center justify-between text-2xl font-bold">
            <h1>{tagName}</h1>
          </nav>

          <div className="mt-3 text-sm font-medium">
            <p className="opacity-75">Loading...</p>
          </div>
        </main>
      }
    >
      {children}
    </Tooltip>
  );
}
