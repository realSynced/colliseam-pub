"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

import ProfileDropdown from "@/app/ui/components/ProfileDropdown";
import AvatarPic from "@/app/accounts/settings/components/AvatarPic";

const supabase = createClient();

export default function LoggedIn({ user, uid }) {
  const [visibility, setVisibility] = useState({
    profiledropdown: false,
    learn: false,
    jobs: false,
    tools: false,
    creators: false,
  });

  const [userInfo, setUserInfo] = useState({
    avatarUrl: "",
    username: "",
    userId: "",
  });

  const getUserInfo = async () => {
    try {
      const { data, error, status } = await supabase.from("profiles").select("username, avatar_url").eq("id", user?.id).single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserInfo({
          avatarUrl: data?.avatar_url,
          username: data?.username,
          userId: user?.id,
        });
        console.log("User ID is: " + user?.id);
      }
    } catch (error) {
      console.log("Error loading user data! " + error.message);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  let hideTimeout;

  const handlePRFLVisibility = () => {
    clearTimeout(hideTimeout);
    setVisibility((prevState) => ({
      ...prevState,
      profiledropdown: true,
    }));
    console.log("Profile dropdown visibility: " + visibility.profiledropdown);
  };

  const handlePRFLVisibilityLeave = () => {
    hideTimeout = setTimeout(() => {
      setVisibility((prevState) => ({
        ...prevState,
        profiledropdown: false,
      }));
    }, 500); // Adjust delay as needed
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative" onMouseEnter={handlePRFLVisibility} onMouseLeave={handlePRFLVisibilityLeave}>
        <div className="flex items-center">
          <button className="w-12 rounded-full transition-all duration-100 ease-in-out hover:scale-105">
            <AvatarPic
              uid={uid ?? null}
              url={"/" + userInfo.avatarUrl ?? "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
              size={49}
            />
          </button>
        </div>
        <ProfileDropdown visibility={visibility.profiledropdown} avatarUrl={userInfo.avatarUrl} uuid={uid} username={userInfo.username} />
      </div>
    </div>
  );
}
