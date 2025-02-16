"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { SortBy } from "@/app/(main)/ui/components/miscIcons";
import { useReplyUpdate } from "@/app/(main)/utils/globalStates";
import Comment from "./comment";

export default function CommentSection({ postID, profileData }) {
  const [comments, setComments] = useState([]);
  const [numComments, setNumComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Top"]));
  const sortBy = useMemo(() => Array.from(selectedKeys)[0], [selectedKeys]);
  const { replyUpdated, setReplyUpdated } = useReplyUpdate();

  useEffect(() => {
    if (!postID) return;
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      try {
        let orderColumn = "created_at";
        let ascending = false;

        switch (sortBy) {
          case "Newest":
            orderColumn = "created_at";
            ascending = false;
            break;
          case "Oldest":
            orderColumn = "created_at";
            ascending = true;
            break;
          case "Top":
            orderColumn = "num_upvotes";
            ascending = false;
            break;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const { data: commentData, error: commentError } = await supabase
          .from("comments")
          .select(
            `
            *,
            profiles (username, full_name, avatar_url, skills, points, aboutme)
          `,
          )
          .eq("post_id", postID)
          .order(orderColumn, { ascending });

        if (commentError) throw commentError;

        setNumComments(commentData.length);

        const commentsWithDetails = commentData
          .filter((comment) => comment.parent_id === null)
          .map((comment) => getCommentData(comment, commentData));
        setComments(commentsWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setReplyUpdated(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [postID, sortBy, replyUpdated]);

  if (error) return <div>Error loading comments: {error}</div>;

  function getCommentData(commentRow, commentData) {
    const authorData = commentRow.profiles;

    return {
      id: commentRow.id,
      postID: commentRow.post_id,
      content: commentRow.content,
      authorName: authorData.username,
      authorFullName: authorData.full_name,
      authorAvatar: `https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${authorData.avatar_url}`,
      authorTitle: authorData.aboutme.title,
      authorSubtitle: authorData.aboutme.subtitle,
      authorBio: authorData.aboutme.bio,
      authorSkills: authorData.skills,
      authorPoints: authorData.points,
      voteStat: commentRow.num_upvotes - commentRow.num_downvotes,
      bookmarkState: profileData.comments_saved.includes(commentRow.id),
      userVote: profileData.comments_upvoted.includes(commentRow.id) ? "up" : profileData.comments_downvoted.includes(commentRow.id) ? "down" : null,
      children: commentData.filter((comment) => commentRow.children.includes(comment.id)).map((comment) => getCommentData(comment, commentData)),
      depth: commentRow.node_depth,
      createdAt: commentRow.created_at,
    };
  }

  return (
    <div className="flex flex-col px-5 py-4">
      <div className="flex w-full justify-between py-2">
        <h2 className="text-xl font-bold">{numComments} Comments</h2>
        <Dropdown>
          <DropdownTrigger>
            <button className="flex items-center gap-1.5 font-semibold">
              <SortBy />
              <span>{sortBy}</span>
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort Comments"
            classNames={{
              list: "bg-black border border-blackLight rounded-2xl overflow-hidden p-2",
            }}
            itemClasses={{
              base: "text-white hover:bg-blackLight py-1 px-3 rounded-xl",
            }}
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="Top">Top</DropdownItem>
            <DropdownItem key="Newest">Newest</DropdownItem>
            <DropdownItem key="Oldest">Oldest</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="flex flex-col">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} userAvatar={profileData.avatar_url} />
        ))}
      </div>
    </div>
  );
}
