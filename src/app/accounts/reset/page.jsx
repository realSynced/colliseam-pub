'use client'

import { useEffect, useRef, useState } from "react";
import { sendResetPassword } from "@/app/login/action";
import Link from "next/link";
import Image from "next/image";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import NexusLogoWebp from "../../../../public/nexusbrand/newLogo.png";
import { FaLock, FaLockOpen } from "react-icons/fa";

export default function ResetPage({ searchParams }) {
    const [error, setError] = useState({
      newPassword: "",
      confirmNewPassword: "",
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isResettingIn, setIsResettingIn] = useState(false); // State to track if the login process is ongoing

    useEffect(() => {
      console.log("Search params: ", searchParams);
    }, []);

    function containsNumbersAndUppercase(str) {
      let containsNumber = false;
      let containsUppercase = false;
  
      for (let i = 0; i < str.length; i++) {
        if (!isNaN(str[i]) && str[i] !== " ") {
          containsNumber = true;
        }
        if (str[i] === str[i].toUpperCase() && isNaN(str[i])) {
          containsUppercase = true;
        }
        if (containsNumber && containsUppercase) {
          return true;
        }
      }
      return false;
    }

    // const sendResetPassword = async () => {
    // };
    

    const handleReset = async (e) => {
        e.preventDefault();
        setIsResettingIn(true);
        
        const formData = new FormData(e.target);
        const newPassword = formData.get("reset-password1");
        const confirmNewPassword = formData.get("reset-password2");

        let validationErrors = {
          newPassword: "",
          confirmNewPassword: "",
        };
        
        if (newPassword === "") {
          validationErrors.newPassword = "Please fill in the new password";
        } else if (confirmNewPassword === "") {
          validationErrors.confirmNewPassword = "Please confirm your password";
        } else if (newPassword != confirmNewPassword) {
          validationErrors.confirmNewPassword = "Passwords do not match";
        } else if (newPassword.length < 8) {
          validationErrors.newPassword = "Password must be at least 8 characters";
        } else if (!containsNumbersAndUppercase(newPassword)) {
          validationErrors.newPassword = "Password must contain at least one number and one uppercase letter";
        }

        setError(validationErrors);

        if (validationErrors.newPassword === "" && validationErrors.confirmNewPassword === "") {
          console.log("No errors, proceed with reset");
          try {
            await sendResetPassword(formData, searchParams);
          } catch (err) {
            console.error("Error during password reset:", err);
          }
        } 
        else {  
          setIsResettingIn(false);
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
            <h1 className="font-head mb-2 text-5xl font-bold">Reset Your Password</h1>
            <p className="opacity-90">
              Return to {" "}
              <Link href="/accounts/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>

          <form className="w-full" onSubmit={handleReset}>
            {searchParams && (
              <label className="text-sm font-medium text-red-500">
                {searchParams.message}
              </label>
            )}
            {error && (
              <label className="text-sm font-medium text-red-500">
                {error.newPassword} {error.confirmNewPassword}
              </label>
            )}

            <div className="group relative mb-6">
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
                placeholder="New Password"
                type={`${showPassword ? "text" : "password"}`}
                name="reset-password1"
                className="w-full rounded-full border border-blackLight bg-blackLight px-5 py-2.5 outline-none duration-300 placeholder:text-white/50 focus:border-white/50"
              />
              </div>
            </div>

            <div className="group relative mb-6">
              <input
                placeholder="Confirm New Password"
                type={`${showPassword ? "text" : "password"}`}
                name="reset-password2"
                className="w-full rounded-full border border-blackLight bg-blackLight px-5 py-2.5 outline-none duration-300 placeholder:text-white/50 focus:border-white/50"
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer justify-center rounded-full bg-primary py-2.5 font-semibold hover:bg-primaryHover"
              disabled={isResettingIn}
            >
              {isResettingIn ? 
                (<span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>Resetting Password  <FaLock /></span>)
              : 
                (<span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>Reset Password &emsp; <FaLockOpen /></span>) 
              }
            </button>

            {
              (isResettingIn ) && (
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
          </div>
        </section>
        <section className="h-full w-[42%] p-[1vw]">
        <article className="gradient-bg h-full overflow-hidden rounded-3xl p-[2vw]">
          <h1 className="font-head font-extraBold relative z-10 mb-4 text-6xl leading-snug text-black">
          Lost your key?<br />
            Let’s make a shinier one!
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
    </main>
  )
}