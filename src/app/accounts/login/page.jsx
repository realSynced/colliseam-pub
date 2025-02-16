"use client";
import { useState, useRef, useEffect } from "react";

import { login, ResetPassword } from "@/app/login/action";
import { accountExists } from "@/utils/supabase/checks/functs";
import Link from "next/link";

import Image from "next/image";
import NexusLogoWebp from "../../../../public/nexusbrand/newLogo.png";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import SignInWithGithubButton from "./components/SignInWithGithubButton";
import SignInWithGoogleButton from "./components/SignInWithGoogleButton";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [reset, setReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [resetError, setResetError] = useState({
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State to track if the login process is ongoing
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    
    if (email === "") {
      setResetError({ email: "Enter Email in the field!" });
      setTimeout(() => setResetError({ email: "" }), 2000);
      return;
    }

    const exists = await accountExists(email);
    if (!exists) {
      setResetError({ email: "Account does not exist." });
      setTimeout(() => setResetError({ email: "" }), 3000);
      return;
    }
    setResetEmail(email);
    setShowConfirmationPopup(true);
  };

  const confirmReset = async (confirm) => {
    setShowConfirmationPopup(false);
    if (confirm) {
      setReset(true);
      setIsResetting(true);
      await ResetPassword(resetEmail);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true); // Disable login button

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    let validationErrors = {
      email: "",
      password: "",
    };

    const accExists = async () => {
      const exists = await accountExists(email);
      if (exists === true) {
        return true;
      } else {
        return false;
      }
    };

    if (email === "") {
      validationErrors.email = "Please fill in this field.";
    } else if ((await accExists()) === false) {
      validationErrors.email = "Account does not exist.";
    }

    if (password === "") {
      validationErrors.password = "Please fill in this field.";
    }

    let afterLogin = await login(formData);

    if (afterLogin !== undefined) {
      validationErrors.password = "Password is incorrect. Please try again.";
    }

    setError(validationErrors);

    if (validationErrors.email === "" && validationErrors.password === "") {
      await login(formData);
    } else {
      setIsLoggingIn(false); // Re-enable login button if there's an error
    }
  };

  // Gradient Stuff
  const interBubbleRef = useRef(null);

  useEffect(() => {
    const interBubble = interBubbleRef.current;
    if (!interBubble) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      if (interBubble) interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(move);
    }

    const handleMouseMove = (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    move();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="flex h-screen overflow-hidden text-white">
      <section className="h-full w-[42%] p-[1vw]">
        <article className="gradient-bg h-full overflow-hidden rounded-3xl p-[2vw]">
          <h1 className="font-head font-extraBold relative z-10 mb-4 text-6xl leading-snug text-black">
            Login and Resume <br />
            Your Journey!
          </h1>
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>
          <div className="gradients-container">
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
            <div className="interactive" ref={interBubbleRef}></div>
          </div>
        </article>
      </section>

      <section className="relative flex h-full flex-1 items-center justify-center bg-black">
        <nav className="absolute left-0 top-0 flex w-full items-center justify-between p-[2vw]">
          <Link href="/" className="flex items-center gap-2 font-bold">
            {/* <FaChevronLeft />*/}
            <svg width="16" height="16" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-white">
              <path d="M8.66667 16L2 9M2 9L8.66667 2M2 9H18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>{" "}
            Back
          </Link>
          <Image src={NexusLogoWebp} width={150} alt="Nexus Logo" />
        </nav>

        <div className="mx-auto w-[60%]">
          <div className="mb-10 w-full font-semibold">
            <h1 className="font-head mb-2 text-5xl font-bold">Welcome</h1>
            <p className="opacity-90">
              Don't have an account?{" "}
              <Link href="/accounts/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            {resetError.email && (
              <p className="text-sm text-red-500 mt-1">{resetError.email}</p>
            )}
            {error && (
              <label className="text-sm font-medium text-red-500">
                {error.username} {error.password}
              </label>
            )}

            <div className="group relative mb-6">
              <input
                placeholder="Email"
                type="email"
                name="email"
                className="w-full rounded-full border border-blackLight bg-blackLight px-5 py-2.5 outline-none duration-300 placeholder:text-white/50 focus:border-white/50"
              />
            </div>

            <div className="group mb-4">
              <div className="relative">
                <IoEyeOutline
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`${showPassword ? "" : "pointer-events-none opacity-0"} absolute right-4 top-1/2 size-8 -translate-y-1/2 cursor-pointer p-[.3rem] duration-300`}
                />
                <IoEyeOffOutline
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`${showPassword ? "pointer-events-none opacity-0" : ""} absolute right-4 top-1/2 size-8 -translate-y-1/2 cursor-pointer p-[.3rem] duration-300`}
                />
                <input
                  placeholder="Password"
                  type={`${showPassword ? "text" : "password"}`}
                  name="password"
                  className="w-full rounded-full border border-blackLight bg-blackLight px-5 py-2.5 outline-none duration-300 placeholder:text-white/50 focus:border-white/50"
                />
              </div>
              <button 
                type="button"
                className="w-full text-right text-xs text-primary"
                onClick={handleResetPassword}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer justify-center rounded-full bg-primary py-2.5 font-semibold hover:bg-primaryHover"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging In..." : "Login"}
            </button>

            {showConfirmationPopup && (
            <div className="relative my-6 flex w-full justify-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="bg-black-600 text-white text-sm p-6 rounded-xl border border-[#2F2F2F] w-full max-w-lg"
                >
                <p>Are you sure you want to reset your password?</p>
                <div className="mt-2 flex gap-2 justify-end">
                  <button
                    onClick={() => confirmReset(true)}
                    className="bg-gray-500 px-3 py-2 rounded bg-opacity-50 hover:bg-green-500"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => confirmReset(false)}
                    className="bg-gray-500 px-3 py-2 rounded bg-opacity-50 hover:bg-opacity-75"
                  >
                    No
                  </button>
                  </div>
                  </motion.div>
              </div>
          )}

            {
              (isLoggingIn || isResetting) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-55">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )
            }

          </form>

          <div className="relative my-6 flex w-full justify-center">
            <div className="absolute top-1/2 h-[1px] w-full -translate-y-1/2 bg-white/25"></div>
            <h1 className="font-head z-10 bg-black px-5 text-base font-semibold leading-none text-white/50">OR</h1>
          </div>

          <article className="flex w-full justify-between text-base font-semibold">
            <SignInWithGoogleButton/>
            <SignInWithGithubButton/>
          </article>
        </div>
      </section>
    </main>
  );
}
