"use client";
import type { headerData, footerData, bodyData } from "./types";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import PostBody from "./PostBody";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function Post({
  headerData,
  footerData,
  bodyData,
  styleOverrides,
}: {
  headerData: headerData;
  footerData: footerData;
  bodyData: bodyData;
  styleOverrides?: string;
}) {
  const styles = styleOverrides || "";
  const router = useRouter();
  const handlePostClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const targetElement = e.target as Element;

    if (targetElement.closest("button") || targetElement.closest("a") || !targetElement.closest(".post-container")) {
      return;
    }

    const zIndex = window.getComputedStyle(targetElement).zIndex;
    if (zIndex && parseInt(zIndex, 10) > 5) {
      return;
    }

    router.push(`/post/${footerData.postID}`);
  };

  return (
    <div
      className={twMerge(
        "post-container flex cursor-pointer flex-col gap-3 border-b border-blackLight px-5 py-3 text-white duration-200 hover:bg-[#222]/40",
        styles,
      )}
      onClick={handlePostClick}
    >
      <PostHeader {...headerData} />
      <PostBody {...bodyData} />
      <PostFooter {...footerData} />
    </div>
  );
}
