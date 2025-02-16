"use client";
//@ts-nocheck

import Image from "next/image";
import Google from "../../../../../public/icons/accounts-google.png";
import { signInWithGoogle } from "@/app/login/action";

export default function SignInWithGoogleButton({ className }: { className?: string }) {
  return (
    <button
      className={`${className} flex w-[47%] items-center justify-center gap-3 rounded-full border border-white/25 py-2.5 hover:border-white/50 hover:bg-white/10 ${className}`}
      onClick={async () => {
        try {
          await signInWithGoogle();
        } catch (error) {
          console.error("Failed to sign in with Google:", error);
        }
      }}
    >
      <Image src={Google} className="size-6" alt="Google Logo" />
      Sign In With Google
    </button>
  );
}
