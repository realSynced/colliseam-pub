"use client";
import { createClient } from "@/utils/supabase/client";
import Post from "@/app/(main)/ui/components/post/Post";
import Loading from "@/app/(main)/ui/components/loading";
import { useEffect, useState } from "react";

export default function Feed({ postIDs, sortBy = "", searchQuery = "" }) {
  const supabase = createClient();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.log("Error fetching user: ", userError.message);
        return;
      }

      const {
        data: [personalPostData],
        error: userDataError,
      } = await supabase.rpc("get_personal_post_ids", {
        target_user: user.id,
        result_limit: 1000,
      });

      console.log(personalPostData);

      const postsUpvoted = personalPostData.posts_upvoted;
      const postsDownvoted = personalPostData.posts_downvoted;
      const postsSaved = personalPostData.posts_saved;

      let orderColumn;
      let orderOptions;

      switch (sortBy) {
        case "Newest":
          orderColumn = "created_at";
          orderOptions = { ascending: false };
          break;
        case "Oldest":
          orderColumn = "created_at";
          orderOptions = { ascending: true };
          break;
        case "Popular":
          orderColumn = "num_upvotes";
          orderOptions = { ascending: false };
          break;
        default:
          orderColumn = "created_at";
          orderOptions = { ascending: false };
          break;
      }

      let query = supabase.from("posts").select(`
        *,
        profiles (id, full_name, username, avatar_url, skills, points, aboutme)
      `);

      if (postIDs) {
        query = query.in("id", postIDs);
      }

      let { data: posts, error } = await query.order(orderColumn, orderOptions).limit(10);
      if (searchQuery) {
        posts = posts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      const postsPromises = posts.map(async (postData) => {
        const authorData = postData.profiles;

        return {
          headerData: {
            isSelf: authorData.id === user.id,
            username: authorData.username,
            displayName: authorData.full_name,
            userTitle: authorData.aboutme.title,
            userSubtitle: authorData.aboutme.subtitle,
            userBio: authorData.aboutme.bio,
            userSkills: authorData.skills,
            userPoints: authorData.points,
            href: `/profile/${authorData.username}`,
            tags: postData.flairs,
            time: postData.created_at,
            type: postData.type,
            profilePicture: `https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${authorData.avatar_url}`,
            postID: postData.id,
          },
          bodyData: {
            title: postData.title,
            content: postData.content,
            images: postData.images ?? [],
            postID: postData.id,
          },
          footerData: {
            voteStat: postData.num_upvotes - postData.num_downvotes,
            initialUpvote: postsUpvoted.includes(postData.id),
            initialDownvote: postsDownvoted?.includes(postData.id),
            initialFavorite: postsSaved.includes(postData.id),
            numberOfComments: postData.num_comments,
            numberOfViews: postData.num_views,
            postID: postData.id,
          },
        };
      });

      const postsData = await Promise.all(postsPromises);
      setPosts(postsData);
    };

    postIDs && fetchPosts();
  }, [postIDs]);

  return (
    <>
      {posts.length > 0 ? (
        <div className="flex w-full flex-col">
          {posts.map((post, index) => (
            <Post key={post.bodyData.postID} {...post} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
