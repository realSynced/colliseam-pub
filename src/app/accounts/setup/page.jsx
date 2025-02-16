"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Logo from "../../../../public/nexusbrand/newLogo.png";

import { motion } from "framer-motion";
import { FastAverageColor } from "fast-average-color";
import { toast } from "sonner";
import Filter from "leo-profanity";

import DummyPost from "./DummyPost";

// Profile example
const Profile = {
  username: "",
  fullname: "",
  id: "",
  aboutme: "",
  website: "",
  avatarUrl: "",
  bannerUrl: "",
  points: 0,
  connections: [],
  postIDs: [],
  postsUpvoted: [],
  postsDownvoted: [],
  postsSaved: [],
  skills: "",
  availability: "",
  usersFollowing: [],
  followedBy: [],
  hours: 0,
  dateCreated: "",
};

export default function SetupProfile() {
  const router = useRouter();
  const supabase = createClient();
  const systemPrompt = `You are a profanity checker. Reply with yes or no. If there is any profanity in the text, reply with yes and if not, reply with no. Do not return any mdx formatting. Underscore are fine. All other symbols are a no. Spaces are not fine.`;

  // Initialize profanity filter with English dictionary
  Filter.loadDictionary("en");
  // Add any additional words you want to check for
  Filter.add(["inappropriate", "offensive"]); // Add your custom words

  // Banner and Image background
  const avatarEntry = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [bannerBackground, setBannerBackground] = useState("#222");
  const fac = new FastAverageColor();
  const imgElementRef = useRef(null);

  useEffect(() => {
    if (avatar) {
      fac.getColorAsync(imgElementRef.current).then((color) => {
        setBannerBackground(color.hex);
      });
    }
  }, [avatar]);

  const sideScreenRef = useRef(null);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cutOffMetrics, setCutOffMetrics] = useState({});

  useEffect(() => {
    const calculateAndLogMetrics = () => {
      if (sideScreenRef.current) {
        const rect = sideScreenRef.current.getBoundingClientRect();
        const metrics = {
          topCutOff: Math.max(0, -rect.top),
          bottomCutOff: Math.max(0, rect.bottom - window.innerHeight),
        };

        setCutOffMetrics(metrics);
      }
    };

    calculateAndLogMetrics();
    window.addEventListener("resize", calculateAndLogMetrics);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", calculateAndLogMetrics);
  }, []);

  const [user, setUser] = useState({
    id: "",
    username: "",
    full_name: "",
    avatar_url: "",
    website: "",
    aboutme: {
      bio: "",
      title: "",
      subtitle: "",
    },
    skills: "",
    uemail: "",
    banner_url: "",
    connections: [],
    availability: "",
    dateCreated: new Date(),
  });

  const validateQuestion = async () => {
    setError(null);
    console.log("Validating question number:", questionNumber);

    switch (questionNumber) {
      case 0:
        return true;
      case 1:
        if (user.username === "" || user.fullname === "") {
          setError("Please enter your username and/or your full name");
          console.log("Validation failed: Username cannot be empty");
          return false;
        } else if (user.username.length < 5) {
          setError("Username must be at least 5 characters long");
          console.log("Validation failed: Username must be at least 5 characters long");
          return false;
        } else if (user.username.length > 15) {
          setError("Username must be at most 15 characters long");
          console.log("Validation failed: Username must be at most 15 characters long");
          return false;
        } else if (!/^[a-zA-Z0-9_]*$/.test(user.username)) {
          setError("Username must only contain letters, numbers, or underscores");
          console.log("Validation failed: Username must only contain letters, numbers, and underscores. No spaces.");
          return false;
        } else if (checkUsername() === false) {
          console.log("Validation failed: Username already exists");
          return false;
        } else {
          setError("Checking username...");
          try {
            const isProfane = await checkProfanity(user.username);
            if (isProfane) {
              setError("Username is inappropriate, contains profanity, or has certain symbols that are not allowed. Spaces are not allowed.");
              toast.error("Please choose a username that follows the rules stated in the error. Spaces are not allowed.");
              console.log("Validation failed: Username contains inappropriate content");
              return false;
            }
            setError(null);
            return true;
          } catch (error) {
            console.error("Profanity check error:", error);
            setError("Unable to validate username at this time. Please try again.");
            return false;
          }
        }
        break;
      case 2:
        // if (error !== null) {
        //   setError("Please go back and enter a valid username");
        //   gobackQuestion();
        //   return false;
        // }
        if (user.full_name === "") {
          setError("Full name cannot be empty");
          console.log("Validation failed: Full name cannot be empty");
          return false;
        } else if (user.full_name.length < 5) {
          setError("Full name must be at least 5 characters long");
          console.log("Validation failed: Full name must be at least 5 characters long");
          return false;
        } else if (user.full_name.length > 50) {
          setError("Full name must be at most 50 characters long");
          console.log("Validation failed: Full name must be at most 50 characters long");
          return false;
        }
        break;
      case 3:
        if (!user.aboutme?.title?.trim() || !user.aboutme?.subtitle?.trim()) {
          setError("Please enter your profession and/or years of experience");
          console.log("Validation failed: Please enter your profession and/or years of experience");
          return false;
        }
        break;
      case 4:
        if (user.website === "") {
          setError("It's fine to not have a website.");
          // console.log("Validation failed: Website cannot be empty");
          // return false;
          return true;
        }
        break;
      case 5:
        if (user.aboutme.title === "") {
          setError("Title cannot be empty");
          console.log("Validation failed: Title cannot be empty");
          return false;
        } else if (user.aboutme.title.length < 5) {
          setError("Title must be at least 5 characters long");
          console.log("Validation failed: Title must be at least 5 characters long");
          return false;
        }
        break;
      case 6:
        if (user.aboutme.bio === "") {
          setError("About me cannot be empty");
          console.log("Validation failed: About me cannot be empty");
          return false;
        } else if (user.aboutme.bio.length < 50) {
          setError("About me must be at least 50 characters long");
          console.log("Validation failed: About me must be at least 50 characters long");
          return false;
        } else if (user.aboutme.bio.length > 200) {
          setError("About me must be at most 200 characters long");
          console.log("Validation failed: About me must be at most 200 characters long");
          return false;
        }
        break;
      case 7:
        return true;
      // break;
      default:
        // Handle unexpected question numbers
        console.log("Unexpected question number: ", questionNumber);
        return false;
    }
    console.log("Validate passed");
    return true;
  };

  const checkUsername = async () => {
    const { data, error } = await supabase.from("profiles").select("username").eq("username", user.username);
    if (error) {
      console.log("Error checking username: ", error.message);
      return true;
    }
    if (data.length > 0) {
      setError("Username already exists");
      console.log("Username already exists");
      return false;
    }
  };

  const checkProfanity = async (text) => {
    const response = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        prompt: text,
        config: {
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
          temperature: 0.7,
          top_p: 0.95,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          max_tokens: 4096,
          stop_sequences: ["Human:", "Assistant:"],
          system_prompt: systemPrompt,
        },
        format: false,
      }),
    });
    const data = await response.json();
    console.log("Check profanity:", data?.result);
    return data?.result.toString() === "yes";
  };

  const advanceQuestion = async () => {
    setIsProcessing(true);
    if (!(await validateQuestion())) {
      setIsProcessing(false);
      return;
    }
    if (questionNumber === 5) {
      setIsProcessing(false);
      return;
    }
    // if (questionNumber === 1) {
    //   if (validateQuestion() === false) {
    //     console.log("Validation failed. Not advancing.");
    //     return;
    //   } else {
    //     console.log("Validation passed. Advancing.");
    //     setTimeout(() => {
    //       setQuestionNumber((prev) => prev + 1);
    //     }, 300);
    //   }
    // } else {
    //   if (!validateQuestion()) {
    //     console.log("Validation failed. Not advancing.");
    //     return;
    //   }
    // }
    setQuestionNumber((prev) => prev + 1);
    setIsProcessing(false);
  };

  const gobackQuestion = () => {
    if (questionNumber === 1) return;
    setQuestionNumber((prev) => prev - 1);
  };

  function newAvatarEntry() {
    const selectedFile = avatarEntry.current.files[0];
    setAvatar(selectedFile);
    console.log(selectedFile);
  }

  const createProfile = async () => {
    if (!validateQuestion()) {
      console.log("Validation failed. Not creating profile.");
      setError("Please go back and fix the errors.");
      return;
    }
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.log("Error getting user: ", userError.message);
      return;
    }
    let fileExtension = avatar.name.split(".").pop();
    let filePath = `${data.user.id}-${Math.random()}.${fileExtension}`;
    try {
      const { error: storageError } = await supabase.storage.from("avatars").upload(filePath, avatar);
      if (storageError) {
        console.log("Error uploading avatar: ", storageError.message);
        throw storageError;
      }

      const { error } = await supabase
        .from("profiles")
        .update([
          {
            username: user.username,
            full_name: user.full_name,
            avatar_url: filePath,
            website: user.website,
            aboutme: user.aboutme,
            skills: user.skills.split(","),
            uemail: user.uemail,
            banner_url: user.banner_url,
            connections: user.connections,
            availability: user.availability,
          },
        ])
        .eq("id", data.user.id);
      if (error) {
        console.log("Error creating profile: ", error.message);
      }
      console.log("Profile created: ", data);
      alert("Profile created!");
      router.push(`/profile/${user.username}`);
    } catch (error) {
      console.log("Error creating profile: ", error.message);
    }
  };

  useEffect(() => {
    return () => {
      setAvatar(null);
    };
  }, []);

  return (
    <section className="flex h-screen w-full justify-between overflow-hidden">
      <Image src={Logo} className="absolute left-10 top-10 w-40" alt="nexusLogo" />

      {/* Form - Left side */}
      <div className={`flex h-full w-3/5 flex-col items-center justify-center text-white`}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`relative flex h-2/3 w-1/2 flex-col justify-between rounded-3xl border border-blackLighter p-5 duration-300`}
        >
          <h1 className="text-3xl font-bold 3xl:text-4xl">Welcome{user.username && <span>, {user.username}!</span>}</h1>

          {/* each question is one <article /> */}
          {/* Question 1 -- Username and Display name */}
          <article className={`${questionNumber === 1 ? `visible` : `hidden`} flex h-full flex-col justify-center gap-6`}>
            <div>
              <label htmlFor="name" className="mb-2 block font-bold">
                Display or Full Name
                <sup className="ml-px text-xs text-red-500">*</sup>
              </label>

              <input
                id="name"
                type="text"
                className="w-full rounded-full border border-transparent bg-blackLight px-4 py-2 text-sm font-semibold text-white outline-none duration-300 focus:border-white/50 focus:outline-none"
                onChange={(e) => {
                  setUser({ ...user, full_name: e.target.value });
                }}
                maxLength={20}
              />
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block font-bold">
                Username <span className="ml-2 text-xs text-white/75">Cannot be Changed - max 15 characters.</span>
              </label>

              <input
                id="username"
                type="text"
                className="w-full rounded-full border border-transparent bg-blackLight px-4 py-2 text-sm font-semibold text-white outline-none duration-300 focus:border-white/50 focus:outline-none"
                onChange={(e) => {
                  setUser({ ...user, username: e.target.value });
                }}
                maxLength={15}
              />
            </div>
          </article>

          {/* Question 2 -- Biography */}
          <article className={`${questionNumber === 2 ? `visible` : `hidden`} flex h-full flex-col justify-center gap-6`}>
            <div>
              <label htmlFor="bio" className="mb-2 block font-bold">
                Your Biography <span className="ml-2 text-xs text-white/75">Optional</span>
              </label>

              <textarea
                id="bio"
                type="text"
                className="no-scrollbar w-full resize-none rounded-xl border border-transparent bg-blackLight px-4 py-2 text-white outline-none duration-300 focus:border-white/50"
                rows={5}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    aboutme: {
                      ...prevUser.aboutme,
                      bio: e.target.value,
                    },
                  }))
                }
                maxLength={200}
              />
            </div>
          </article>

          {/* Question 3 -- Profession and Years of Experience */}
          <article className={`${questionNumber === 3 ? `visible` : `hidden`} flex h-full flex-col justify-center gap-6`}>
            <div>
              <label htmlFor="profession" className="mb-2 block font-bold">
                Your Profession <sup className="ml-px text-xs text-red-500">*</sup>
              </label>

              <input
                name="profession"
                type="text"
                className="w-full rounded-full border border-transparent bg-blackLight px-4 py-2 text-sm font-semibold text-white outline-none duration-300 focus:border-white/50 focus:outline-none"
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    aboutme: {
                      ...prevUser.aboutme,
                      title: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="experience" className="mb-2 block font-bold">
                Years Of Experience <sup className="ml-px text-xs text-red-500">*</sup>
              </label>

              <input
                name="experience"
                type="number"
                min="0"
                max="100"
                className="w-full rounded-full border border-transparent bg-blackLight px-4 py-2 text-sm font-semibold text-white outline-none duration-300 focus:border-white/50 focus:outline-none"
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    aboutme: {
                      ...prevUser.aboutme,
                      subtitle: e.target.value ? `${e.target.value} years` : "",
                    },
                  }))
                }
              />
            </div>
          </article>

          {/* Question 4 -- Skills/Tag selecter */}
          <article className={`${questionNumber === 4 ? `visible` : `hidden`} flex h-full flex-col justify-center gap-6`}>
            <div>
              <label htmlFor="skills" className="mb-2 block font-bold">
                Your Skills <span className="ml-2 text-xs text-white/75">Optional - Seperate by comma.</span>
              </label>

              <input
                name="skills"
                type="text"
                className="w-full rounded-full border border-transparent bg-blackLight px-4 py-2 text-sm font-semibold text-white outline-none duration-300 focus:border-white/50 focus:outline-none"
                onChange={(e) => {
                  setUser({ ...user, skills: e.target.value });
                }}
              />
            </div>
          </article>

          {/* Question 5 -- Profile Pic Selector */}
          <article className={`${questionNumber === 5 ? `visible` : `hidden`} flex h-full flex-col justify-center gap-6`}>
            <div className="flex flex-col items-center justify-center gap-4">
              <label className="group relative size-32 cursor-pointer rounded-full bg-blackLight">
                <svg
                  className="absolute left-0 top-0 z-20 size-32 rounded-full bg-black/50 stroke-white p-12 opacity-0 duration-200 group-hover:opacity-100"
                  width="26"
                  height="26"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.173 10.4274L25.573 15.8274M6.6731 29.3274L13.2221 28.0078C13.5697 27.9378 13.889 27.7666 14.1397 27.5157L28.8002 12.8472C29.5031 12.1439 29.5026 11.0039 28.7991 10.3012L25.6935 7.1991C24.9903 6.49669 23.8509 6.49717 23.1483 7.20016L8.48624 21.8702C8.23602 22.1206 8.06517 22.4392 7.99505 22.7861L6.6731 29.3274Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {avatar && typeof avatar === "object" && (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Uploaded Cover Page"
                    className="absolute left-0 top-0 z-10 size-32 rounded-full"
                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(avatar))}
                  />
                )}
                {!avatar && (
                  <img
                    src={"https://placehold.co/200"}
                    alt="Avatar"
                    className="absolute left-0 top-0 z-10 size-32 rounded-full border-[3px] border-black"
                  />
                )}

                <input name="avatar" type="file" ref={avatarEntry} className="hidden" onChange={newAvatarEntry} />
              </label>
              <h1 className="mb-2 font-bold">
                Add Profile Picture <span className="ml-2 text-xs text-white/75">Optional</span>
              </h1>
            </div>
          </article>

          {/* Only one set of buttons and error message instead of buttons and error msg for each question */}
          <p className="absolute bottom-28 h-0 text-sm text-red-500">{error}</p>

          <div className="flex justify-between">
            <button
              disabled={questionNumber === 1 ? true : false}
              onClick={gobackQuestion}
              className="button bg-blackLight duration-200 disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={questionNumber === 5 ? createProfile : advanceQuestion}
              className={`button bg-primary/70 hover:bg-primary ${isProcessing ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={isProcessing}
            >
              {questionNumber === 5 ? "Create Profile" : isProcessing ? "Processing..." : "Next"}
            </button>
          </div>

          {/* Dot Step Indicaters */}
          <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[1, 2, 3, 4, 5].map((index) => (
              <span
                key={index}
                className={`block size-[10px] rounded-full bg-white duration-300 ${index === questionNumber ? "w-6 !bg-primary" : ""}`}
              />
            ))}
          </div>
        </form>
      </div>

      {/* ---------- */}

      {/* ---------- */}

      {/* ---------- */}

      {/* Right side -- Display the information added in the form */}

      <div className="mt-10 h-full w-2/5">
        <motion.main
          ref={sideScreenRef}
          animate={questionNumber === 4 ? "bottom" : "top"}
          variants={{
            bottom: {
              y: cutOffMetrics.bottomCutOff > 5 ? -cutOffMetrics.bottomCutOff - 40 : 0,
            },
            top: {
              y: 0,
            },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-5"
        >
          {/* Top banner and profile sec */}
          <section
            style={{
              background: bannerBackground,
            }}
            className="flex h-72 w-full rounded-l-2xl"
          >
            <div className="flex h-[22.5%] w-full items-center self-end rounded-bl-xl border border-blackLight bg-black px-5 pt-3">
              {avatar && (
                <img
                  ref={imgElementRef}
                  src={URL.createObjectURL(avatar)}
                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(avatar))}
                  alt="Avatar"
                  className="bottom-0 h-32 w-32 self-end rounded-full border-[3px] border-black"
                />
              )}
              {!avatar && (
                <img src={"https://placehold.co/200"} alt="Avatar" className="bottom-0 h-32 w-32 self-end rounded-full border-[3px] border-black" />
              )}

              <div className="ml-4 pb-2">
                <h1 className="text-2xl font-bold text-white">
                  {user.full_name ? user.full_name : <span className="my-1 block h-6 w-40 animate-pulse rounded-xl bg-blackLight" />}
                </h1>
                <h2 className="pb-3 text-sm font-medium text-white opacity-75">
                  {user.username ? "@" + user.username : <span className="block h-5 w-28 animate-pulse rounded-xl bg-blackLight" />}
                </h2>
              </div>
            </div>
          </section>

          <section className="relative flex gap-5 text-white">
            {/* Biocard Section -- Left Side */}
            <div className="flex h-min w-2/3 flex-col gap-5 rounded-2xl border border-blackLight bg-black py-5 pl-5 pr-3.5">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">
                  {user.aboutme.title ? user.aboutme.title : <span className="w-42 block h-8 animate-pulse rounded-xl bg-blackLight" />}
                </h1>
                <p className="text-sm font-semibold opacity-75">
                  {user.aboutme.subtitle ? user.aboutme.subtitle : <span className="mt-1 block h-4 w-28 animate-pulse rounded-xl bg-blackLight" />}
                </p>
              </div>

              <div className="flex gap-4 text-sm">
                <p className="font-semibold text-white">
                  0 <span className="opacity-75">Followers</span>
                </p>
                <p className="font-semibold text-white">
                  0 <span className="opacity-75">Following</span>
                </p>
              </div>

              <div>
                <h2 className="mb-2 font-semibold">Biography</h2>
                <p className="min-h-16 text-sm font-medium opacity-75">
                  {user.aboutme.bio ? user.aboutme.bio : <span className="block h-16 w-full animate-pulse rounded-xl bg-blackLight" />}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">NexPoints</p>
                  <p className="text-sm font-semibold">0</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">Profile Views</p>
                  <p className="text-sm font-semibold">0</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">Reached</p>
                  <p className="text-sm font-semibold">0</p>
                </div>
              </div>

              {/* <div>
                <p className="mb-2 font-semibold">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {["20", "24", "20", "28", "40", "32"].map((size, index) => (
                    <span key={index} className={`w-${size} block h-7 animate-pulse rounded-full bg-blackLight`} />
                  ))}

                  {user?.skills?.map((skill, index) => (
                    <div key={index} className="rounded-full bg-blackLight px-4 py-2 text-sm font-semibold">
                      {skill}
                    </div>
                  ))}
                </div>
              </div> */}

              {/* <time className="mx-auto text-center text-xs font-medium opacity-75">
                {"Joined " +
                  new Date(user.dateCreated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </time> */}
            </div>

            {/* Profile Activity Section -- Right Side */}
            <div className="absolute left-2/3 top-0 ml-5 flex w-full flex-col overflow-hidden rounded-2xl border border-blackLight bg-black">
              <nav className="flex items-center justify-evenly border-b border-blackLight py-5">
                <button className={`h-full w-1/2 text-2xl font-bold text-white`}>Feed</button>
                <button className={`h-full w-1/2 text-2xl font-bold text-white/50`}>Projects</button>
              </nav>

              <nav className="flex items-center justify-around border-b border-blackLight">
                {["Posted", "Upvoted", "Downvoted", "Saved"].map((type, i) => (
                  <button key={type} className={`h-full items-center py-3 font-semibold ${i === 0 ? "border-b-[3px] text-white" : "text-white/50"}`}>
                    {type}
                  </button>
                ))}
              </nav>

              <div className="flex cursor-pointer flex-col gap-3 border-b border-blackLight py-3 text-white duration-200 hover:bg-[#222]/40">
                <DummyPost imgElementRef={imgElementRef} avatar={avatar} user={user} />
                <div className="my-2 w-full border-t border-blackLight" />
                <DummyPost postTitle="I finally found a great Project to work on!!!" imgElementRef={imgElementRef} avatar={avatar} user={user} />
              </div>
            </div>
          </section>
        </motion.main>
      </div>
    </section>
  );
}
