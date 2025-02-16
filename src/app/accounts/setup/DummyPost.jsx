import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Upvote, Downvote, Comment, Stats, Bookmark } from "@/app/(main)/ui/components/postIcons";

import Image from "next/image";

const DummyPost = ({ postTitle = "A New Member Joined Nexus!! Look out for great project opportunities", imgElementRef, avatar, user }) => {
  return (
    <div className="px-5">
      <header className="flex w-full justify-between">
        <div className="flex flex-grow items-center overflow-hidden">
          {avatar && (
            <img
              ref={imgElementRef}
              src={URL.createObjectURL(avatar)}
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(avatar))}
              alt="User Profile"
              className="size-12 rounded-full"
            />
          )}
          {!avatar && <img src={"https://placehold.co/200"} alt="User Profile" className="size-12 rounded-full" />}

          <div className="ml-2 flex w-3/4 flex-grow items-center">
            <h2 className="text-base font-bold leading-tight">{user?.full_name ? user?.full_name : "User9050"}</h2>
            <time className="pointer-events-none ml-2 text-xs font-medium opacity-75">Now</time>
          </div>
        </div>

        <button className="group flex h-9 w-9 flex-shrink-0 -translate-y-2 items-center justify-center self-start rounded-full duration-100 hover:bg-primary/10">
          <BiDotsHorizontalRounded className="h-5 w-5 opacity-75 duration-100 group-hover:fill-primary group-hover:opacity-100" />
        </button>
      </header>

      {/* Post Body */}
      <h2 className={`mb-2 mt-4 font-semibold`}>{postTitle}</h2>
      <Image
        src="https://www.pluralsight.com/content/pluralsight/en/blog/software-development/10-/10-steps-to-clean-code/jcr:content/main/column_control_83590/column-parsys-2/image_627334375/image-res.img.1ec7bf17-5208-428a-ad89-3b74727b140a.png"
        width={600}
        height={600}
        className="h-auto w-full rounded-xl"
        alt="postBodyImage"
      />

      {/* Post Footer */}
      <div className="flex w-full items-center justify-between">
        <div className="flex">
          {/* VOTING GROUP */}
          <div className="flex items-center">
            {/* UPVOTE */}
            <button className="group flex h-9 w-9 items-center justify-center rounded-full duration-100 hover:bg-primary/10 hover:opacity-100">
              <Upvote upvoteState={false} />
            </button>
            {/* STATS */}
            <data className="mx-0.5 text-white/75 duration-100 hover:opacity-100 group-hover:text-primary">3k</data>
            {/* DOWNVOTE */}
            <button className="group flex h-9 w-9 items-center justify-center rounded-full text-xl duration-100 hover:bg-danger/10 hover:opacity-100">
              <Downvote downvoteState={false} />
            </button>
          </div>

          {/* COMMENT BUTTON */}
          <div className="group ml-3 flex items-center gap-1 rounded-full px-3 duration-100 hover:bg-primary/10">
            <Comment />
            <data className="flex items-center text-white/75 duration-100 group-hover:text-primary">20</data>
          </div>

          {/* VIEWS STATS */}
          <div className="group ml-3 flex items-center gap-[0.1rem] rounded-full px-3 duration-100 hover:bg-primary/10">
            <Stats />
            <data className="ml-1 text-white/75 duration-100 group-hover:text-primary">23.2k</data>
          </div>
        </div>

        {/* BOOKMARK BUTTON */}
        <button className="group flex h-9 w-9 items-center justify-center rounded-full duration-100 hover:bg-primary/10">
          <Bookmark bookmarkState={false} />
        </button>
      </div>
    </div>
  );
};

export default DummyPost;
