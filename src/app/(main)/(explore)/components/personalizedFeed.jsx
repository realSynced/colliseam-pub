"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { DotPulseSpinner } from "@/app/(main)/ui/components/spinner";
import { usePostUpdate } from "@/app/(main)/utils/globalStates";
import Post from "../../ui/components/post/Post";

export default function PersonalizedFeed({
  searchQuery = "",
  sortBy = "created_at",
  sortDirection = "next",
  includesAllTags = [],
  includesAnyTags = [],
  includesAllPosts = null,
  project = null,
  viewMode = "Big",
  initialLimit = 10,
  styleOverrides = "",
}) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursorOldest, setCursorOldest] = useState(null);
  const [cursorNewest, setCursorNewest] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { postUpdated, setPostUpdated } = usePostUpdate();

  const observerRef = useRef();
  const sentinelRef = useRef(null);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    console.log("fetching data");
    setLoading(true);

    const uid = (await supabase.auth.getUser()).data.user.id;

    // Fetch tags data
    let { data: includeAllTagsData, error: includeAllTagsError } = await supabase.from("tags").select("name").in("slug", includesAllTags);
    if (includeAllTagsError) {
      console.error(includeAllTagsError);
      setLoading(false);
      return;
    }

    if (!includeAllTagsData) includeAllTagsData = [];

    // Fetch posts data using cursor
    const { data, error } = await supabase.rpc("get_posts", {
      search_query: searchQuery,
      includes_all_tags: includeAllTagsData.map((tag) => tag.name),
      includes_all_posts: includesAllPosts,
      sort_by: sortBy,
      cursor_oldest: cursorOldest,
      cursor_newest: cursorNewest,
      project_id: project,
      direction: sortDirection,
      result_limit: initialLimit,
    });

    console.log(data);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Fetch user data for upvotes, downvotes, saved posts
    const {
      data: [userData],
      error: userDataError,
    } = await supabase.rpc("get_personal_post_ids", {
      target_user: uid,
      result_limit: 1000,
    });

    if (data.length === 0) {
      setHasMore(false);
    } else {
      if (!cursorNewest || data[0].date_created > cursorNewest) setCursorNewest(data[0].date_created);
      setCursorOldest(data[data.length - 1].date_created);
      setFeed((prevFeed) => [...prevFeed, ...translateData(data, userData)]);
    }

    setLoading(false);
  }, [supabase, searchQuery, sortBy, cursorOldest, includesAllTags, cursorNewest, includesAllPosts, initialLimit, project, sortDirection]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchData();
        }
      },
      { threshold: 1.0 },
    );

    observerRef.current = observer;

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchData, hasMore, loading]);

  useEffect(() => {
    if (postUpdated) {
      setFeed([]);
      setCursorOldest(null);
      setCursorNewest(null);
      setHasMore(true);
      setPostUpdated(false);
    }
  }, [
    postUpdated,
    sortDirection,
    sortBy,
    JSON.stringify(includesAllTags),
    JSON.stringify(includesAnyTags),
    JSON.stringify(includesAllPosts),
    project,
    searchQuery,
    setPostUpdated,
  ]);

  const translateData = (data, userData) => {
    return data.map((item) => {
      return {
        headerData: {
          isSelf: item.is_self,
          username: item.username,
          displayName: item.display_name,
          userTitle: item.user_about.title || "",
          userSubtitle: item.user_about.subtitle || "",
          userBio: item.user_about.bio || "",
          userFollowers: item.user_followers,
          userFollowing: item.user_following,
          userSkills: item.user_skills,
          userPoints: item.user_points,
          href: `/profile/${item.username}`,
          tags: item.tags,
          time: item.date_created,
          type: item.type,
          profilePicture: `https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${item.profile_picture}`,
          postID: item.post_id,
        },

        bodyData: {
          title: item.title,
          content: item.content,
          images: item.images,
          displayMode: item.display_mode,
          postID: item.post_id,
        },

        footerData: {
          voteStat: item.vote_stat,
          initialUpvote: userData?.posts_upvoted?.includes(item.post_id) ?? false,
          initialDownvote: userData?.posts_downvoted?.includes(item.post_id) ?? false,
          initialFavorite: userData.posts_saved.includes(item.post_id),
          numberOfComments: item.number_of_comments.toString(),
          numberOfViews: item.number_of_views.toString(),
          postID: item.post_id,
        },
      };
    });
  };

  return (
    <div className={`flex w-full flex-col`}>
      {feed.map((post) => (
        <Post
          key={post.bodyData.postID}
          headerData={post.headerData}
          bodyData={post.bodyData}
          footerData={post.footerData}
          styleOverrides={styleOverrides}
        />
      ))}
      <div ref={sentinelRef} className="w-full">
        {hasMore ? (
          <DotPulseSpinner className="flex h-12 w-full items-center justify-center" />
        ) : (
          <h1 className="w-full py-5 text-center text-2xl font-semibold text-white">No more posts to load</h1>
        )}
      </div>
    </div>
  );
}
