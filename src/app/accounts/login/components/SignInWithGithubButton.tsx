"use client";

import { FaGithub, FaChevronLeft } from "react-icons/fa";
import { signInWithGithub } from "@/app/login/action";

export default function SignInWithGithubButton({ className }: { className?: string }) {
  return (
    <button
      className={`${className} flex w-[47%] items-center justify-center gap-3 rounded-full border border-white/25 py-2.5 hover:border-white/50 hover:bg-white/10`}
      onClick={() => {
        signInWithGithub();
      }}
    >
      <FaGithub className="size-6" /> Sign In With Github
    </button>
  );
}
