"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import SignInWithGithubButton from "@/app/accounts/login/components/SignInWithGithubButton";
import SignInWithGoogleButton from "@/app/accounts/login/components/SignInWithGoogleButton";

export default function LoginModal({ isSignedIn }: { isSignedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setOpen(!isSignedIn);
  }, [isSignedIn]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSignedIn) {
        toast.error("Login to view this content");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSignedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setOpen(false);
      router.refresh();
      location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/accounts/signup");
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen} placement="center" backdrop="blur" hideCloseButton isDismissable={isSignedIn}>
      <ModalContent className="rounded-3xl border border-blackLighter bg-black text-white">
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="font-head text-3xl font-bold text-white">Welcome</h1>
          <p className="text-sm opacity-90">
            Don't have an account?{" "}
            <button onClick={handleSignUp} className="text-primary hover:underline">
              Sign Up
            </button>
          </p>
        </ModalHeader>
        <ModalBody className="py-4">
          <form onSubmit={handleLogin} className="flex flex-col gap-1">
            <div className="group relative mb-6">
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-full border border-blackLight bg-blackLight px-5 py-2.5 outline-none duration-300 placeholder:text-white/50 focus:border-white/50"
              />
            </div>

            <div className="group mb-4">
              <div className="relative">
                <IoEyeOutline
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`${
                    showPassword ? "" : "pointer-events-none opacity-0"
                  } absolute right-4 top-1/2 size-8 -translate-y-1/2 cursor-pointer p-[.3rem] duration-300`}
                />
                <IoEyeOffOutline
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`${
                    showPassword ? "pointer-events-none opacity-0" : ""
                  } absolute right-4 top-1/2 size-8 -translate-y-1/2 cursor-pointer p-[.3rem] duration-300`}
                />
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-full border border-blackLight bg-blackLight px-5 py-2.5 outline-none duration-300 placeholder:text-white/50 focus:border-white/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer justify-center rounded-full bg-primary py-2.5 font-semibold hover:bg-primaryHover disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
            <div className="flex w-full items-center space-x-4">
              <SignInWithGoogleButton className="w-[47%] scale-90 px-2" />
              <SignInWithGithubButton className="w-[47%] scale-90 px-2" />
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
