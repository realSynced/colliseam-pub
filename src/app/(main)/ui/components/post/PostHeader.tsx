"use client";
import Image from "next/image";
import Link from "next/link";
import { headerData } from "./types";
import TimeAgo from "react-timeago";
import { ProfileTooltip, TagTooltip } from "../CustomTooltip";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Modal, ModalContent, useDisclosure, ScrollShadow } from "@nextui-org/react";
import { Share, Edit, Unhappy, Copy, Delete, Report } from "@/app/(main)/ui/components/postIcons";
import { createClient } from "@/utils/supabase/client";
import { usePostUpdate } from "@/app/(main)/utils/globalStates";

export default function PostHeader({
  isSelf,
  username,
  displayName,
  userTitle,
  userSubtitle,
  userBio,
  userFollowers,
  userFollowing,
  userSkills,
  userPoints,
  href = "",
  tags,
  time,
  type,
  profilePicture,
  postID,
  showAllTags,
}: headerData) {
  const { setPostUpdated } = usePostUpdate();
  const deleteModal = useDisclosure();
  const supabase = createClient();
  const deletePost = async () => {
    const { error } = await supabase.rpc("delete_post", { target_post: postID });
    if (error) {
      console.log("Error deleting post: ", error.message);
    }
    setPostUpdated(true);
    deleteModal.onClose();
  };

  return (
    <header className="flex w-full justify-between">
      <div className="flex flex-grow items-center overflow-hidden">
        <ProfileTooltip
          profilePicture={profilePicture}
          isSelf={isSelf}
          displayName={displayName}
          href={href}
          username={username}
          userTitle={userTitle}
          userSubtitle={userSubtitle}
          userBio={userBio}
          userFollowers={userFollowers}
          userFollowing={userFollowing}
          userPoints={userPoints}
          userSkills={userSkills}
        >
          <Image src={profilePicture} alt="UserProfile" width={300} height={300} className="size-12 rounded-full" />
        </ProfileTooltip>

        <div className="ml-2 flex w-3/4 flex-grow flex-col">
          <div className="flex items-center">
            <ProfileTooltip
              profilePicture={profilePicture}
              isSelf={isSelf}
              displayName={displayName}
              href={href}
              username={username}
              userTitle={userTitle}
              userSubtitle={userSubtitle}
              userBio={userBio}
              userFollowers={userFollowers}
              userFollowing={userFollowing}
              userPoints={userPoints}
              userSkills={userSkills}
            >
              <Link href={href} className="text-base font-bold leading-tight hover:underline">
                {displayName}
              </Link>
            </ProfileTooltip>

            <time className="pointer-events-none ml-2 text-xs font-medium opacity-75">
              <TimeAgo minPeriod={5} date={time} />
            </time>
          </div>
          <ScrollShadow className="no-scrollbar flex w-full items-center gap-1" orientation="horizontal" isEnabled={showAllTags} size={80} offset={1}>
            <div className="mt-1 rounded-full bg-primary px-2 py-1 text-xs text-white hover:bg-white hover:text-black">{type}</div>
            {tags &&
              (showAllTags
                ? tags.map((tagName, i) => (
                    <TagTooltip key={i} tagName={tagName}>
                      <Link href={`/explore`} key={i} className="mt-1 rounded-full bg-blackLight px-2 py-1 text-xs hover:bg-white hover:text-black">
                        {tagName}
                      </Link>
                    </TagTooltip>
                  ))
                : tags.slice(0, 4).map((tagName, i) => (
                    <TagTooltip key={i} tagName={tagName}>
                      <Link href={`/explore`} key={i} className="mt-1 rounded-full bg-blackLight px-2 py-1 text-xs hover:bg-white hover:text-black">
                        {tagName}
                      </Link>
                    </TagTooltip>
                  )))}
            {tags && !showAllTags && tags.length > 4 && <div className="mt-1 rounded-full bg-blackLight px-2 py-1 text-xs">+{tags.length - 4}</div>}
            {/* in case there are no tags */}
          </ScrollShadow>
        </div>
      </div>

      <Dropdown
        placement="bottom-end"
        shouldBlockScroll={false}
        classNames={{
          content: "p-0",
        }}
        offset={0}
      >
        <DropdownTrigger>
          <button className="group flex h-9 w-9 flex-shrink-0 -translate-y-2 items-center justify-center self-start rounded-full duration-100 hover:bg-primary/10">
            <BiDotsHorizontalRounded className="h-5 w-5 opacity-75 duration-100 group-hover:fill-primary group-hover:opacity-100" />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          itemClasses={{
            base: "rounded-lg hover:bg-blackLight text-white",
            title: "text-sm font-semibold flex gap-1.5 items-center",
          }}
          classNames={{
            base: "p-0",
            list: "bg-black border border-blackLight rounded-xl overflow-hidden p-2",
          }}
        >
          <DropdownItem textValue="Share">
            <Share />
            Share
          </DropdownItem>
          {isSelf ? (
            <DropdownItem textValue="Edit">
              <Edit />
              Edit
            </DropdownItem>
          ) : (
            <DropdownItem textValue="See Less of This">
              <Unhappy />
              See Less of This
            </DropdownItem>
          )}
          <DropdownItem textValue="Copy Link" onPress={() => navigator.clipboard.writeText(`${window.location.origin}/post/${postID}`)}>
            <Copy />
            Copy Link
          </DropdownItem>
          {isSelf ? (
            <DropdownItem className="text-danger" textValue="Delete" onPress={deleteModal.onOpen}>
              <Delete />
              Delete
            </DropdownItem>
          ) : (
            <DropdownItem className="text-danger" textValue="Report">
              <Report />
              Report
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        aria-label="Delete Post"
        classNames={{
          backdrop: "bg-white/10 backdrop-opacity-10",
        }}
        hideCloseButton
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <div className="mt-12 flex w-96 flex-col gap-5 rounded-xl border border-blackLight bg-black p-5 text-white">
              <div className="flex flex-col items-center gap-5">
                <div className="flex size-16 items-center justify-center rounded-full bg-danger bg-opacity-10">
                  <svg width="35" height="48" viewBox="0 0 35 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.5 8.58088H32.5M13.75 28.4338V16.5221M21.25 28.4338V16.5221M25 36.375H10C7.92893 36.375 6.25 34.5973 6.25 32.4044V10.5662C6.25 9.46973 7.08947 8.58088 8.125 8.58088H26.875C27.9105 8.58088 28.75 9.46973 28.75 10.5662V32.4044C28.75 34.5973 27.0711 36.375 25 36.375ZM13.75 8.58088H21.25C22.2855 8.58088 23.125 7.69204 23.125 6.59559V4.61029C23.125 3.51385 22.2855 2.625 21.25 2.625H13.75C12.7145 2.625 11.875 3.51385 11.875 4.61029V6.59559C11.875 7.69204 12.7145 8.58088 13.75 8.58088Z"
                      stroke="#D6382D"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold">Are you sure?</h2>
                <p className="w-2/3 text-center text-sm font-semibold text-white/75">
                  This post will delete immediately. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2.5 font-semibold">
                <button className="flex w-full justify-center gap-1.5 rounded-full bg-blackLight py-2" onClick={onClose}>
                  Cancel
                </button>
                <button className="flex w-full justify-center gap-1.5 rounded-full bg-danger py-2" onClick={deletePost}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </header>
  );
}
