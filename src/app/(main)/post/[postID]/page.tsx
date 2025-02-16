//@ts-nocheck
import RightPanel from "@/app/(main)/home/components/rightpanel";
import ReplyField from "./components/reply";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Post from "@/app/(main)/ui/components/post/Post";
import CommentSection from "./components/commentSection";

export default async function PostPage({ params }: { params: { postID: string } }) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.log("Error fetching user");
    return;
  }

  const { data, error } = await supabase.from("profiles").select(`avatar_url`).eq("id", user?.id).single();
  const {
    data: [postData],
    error: postError,
  } = await supabase.rpc("get_post", { post_id: parseInt(params.postID) });
  if (postError) {
    console.log("Error fetching post data: ", postError.message);
    return null;
  }

  let { data: initialProfileData, error: profileError } = await supabase
    .from("profiles")
    .select("comments_saved, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: commentsVoted } = await supabase.from("votes_comment").select("comment_id, increment").eq("user_id", user.id);

  if (!commentsVoted) {
    console.log("Error fetching comments voted data");
    return null;
  }

  const { commentsUpvoted, commentsDownvoted } = {
    commentsUpvoted: commentsVoted.filter((comment) => comment.increment === 1).map((comment) => comment.comment_id),
    commentsDownvoted: commentsVoted.filter((comment) => comment.increment === -1).map((comment) => comment.comment_id),
  };

  const profileData = {
    ...initialProfileData,
    comments_upvoted: commentsUpvoted,
    comments_downvoted: commentsDownvoted,
  };

  if (profileError) {
    console.log("Error fetching profile data: ", profileError.message);
    return null;
  }

  const post = {
    headerData: {
      isSelf: postData.is_self,
      username: postData.username,
      displayName: postData.display_name,
      userTitle: postData.user_about.title || "",
      userSubtitle: postData.user_about.subtitle || "",
      userBio: postData.user_about.bio || "",
      userFollowers: postData.user_followers,
      userFollowing: postData.user_following,
      userSkills: postData.user_skills,
      userPoints: postData.user_points,
      href: `/profile/${postData.username}`,
      tags: postData.tags,
      time: postData.date_created,
      type: postData.type,
      profilePicture: `https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${postData.profile_picture}`,
      postID: parseInt(params.postID),
    },

    bodyData: {
      title: postData.title,
      content: postData.content,
      images: postData.images,
      displayMode: postData.display_mode,
      postID: parseInt(params.postID),
      showEntirePost: true,
    },

    footerData: {
      voteStat: postData.vote_stat,
      initialUpvote: postData.is_upvoted,
      initialDownvote: postData.is_downvoted,
      initialFavorite: postData.is_saved,
      numberOfComments: postData.number_of_comments.toString(),
      numberOfViews: postData.number_of_views.toString(),
      postID: parseInt(params.postID),
    },
  };

  return (
    <div className="flex flex-grow justify-center text-white">
      <div className="w-full max-w-[750px] border-blackLight pb-3 md:w-4/5 md:border-x">
        <Link className="sticky top-0 z-20 flex w-full items-center border-b border-blackLight bg-black p-5" href="/home">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-full stroke-white duration-300"
          >
            <path d="M8.66667 16L2 9M2 9L8.66667 2M2 9H18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="ml-2 inline-block text-lg font-bold">Back to feed</p>
        </Link>
        <Post
          headerData={post.headerData}
          bodyData={post.bodyData}
          footerData={post.footerData}
          styleOverrides="cursor-default border-none hover:bg-black px-5"
        />
        <ReplyField postID={parseInt(params.postID)} avatarUrl={data?.avatar_url} />
        <CommentSection postID={parseInt(params.postID)} profileData={profileData} />
      </div>
      <div className="w-96">
        <RightPanel />
      </div>
    </div>
  );
}
