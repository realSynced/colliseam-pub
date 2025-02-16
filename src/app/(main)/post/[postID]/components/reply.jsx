"use client";
import { createClient } from "@/utils/supabase/client";
import { Textarea } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import { useReplyUpdate } from "@/app/(main)/utils/globalStates";
import Image from "next/image";

export default function ReplyField({ postID, avatarUrl, parentID = null, className = "px-5 py-4 border-y border-blackLight", onCancel = () => {} }) {
  const { replyUpdated, setReplyUpdated } = useReplyUpdate();
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");

    const { error } = await supabase.rpc("write_new_comment", {
      content: content,
      post_id: postID,
      parent: parentID,
    });

    if (error) {
      console.error("Error writing comment: ", error.message);
      return;
    }

    setReplyUpdated(true);
    onCancel();

    e.target.reset();
  };
  return (
    <form className={twMerge("flex flex-col gap-2 text-sm", className)} onSubmit={handleSubmit}>
      <div className="flex w-full gap-2">
        <Image
          src={`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${avatarUrl}`}
          alt="Avatar"
          className="h-10 rounded-full"
          width={40}
          height={40}
        />
        <Textarea
          name="content"
          placeholder="Write a reply..."
          className="w-full flex-grow self-center rounded-3xl border border-transparent bg-blackLight focus-within:border-[#ffffff50] focus-within:outline-none"
          minRows={1}
          classNames={{
            input: "no-scrollbar",
          }}
        />
      </div>
      <div className="flex w-full justify-end gap-2 font-semibold">
        <button className="rounded-full bg-blackLight px-4 py-2" type="reset" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="rounded-full bg-primary px-4 py-2">
          Reply
        </button>
      </div>
    </form>
  );
}
