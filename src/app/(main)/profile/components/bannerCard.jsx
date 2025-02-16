"use client";
import Loading from "../../ui/components/loading";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FastAverageColor } from "fast-average-color";
import { Follow, Portfolio, Message, Edit } from "../../ui/components/profileIcons";
import { UserFollowButton } from "../../ui/components/followButtons";
import { FaCheck } from "react-icons/fa6";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useFollowUpdate } from "@/app/(main)/utils/globalStates";

export default function BannerCard({ bannerUrl, username, fullname, avatarUrl, initialFollowing, isFollowedBy, isSelf }) {
  const supabase = createClient();
  const fac = new FastAverageColor();
  const router = useRouter();

  const [bannerBackground, setBannerBackground] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const { followUpdated, setFollowUpdated } = useFollowUpdate();
  // const [dmCreated, setDmCreated] = useState(true);

  useEffect(() => {
    if (followUpdated) {
      setFollowUpdated(false);
    }
  }, [followUpdated]);

  useEffect(() => {
    if (!bannerUrl) {
      fac.getColorAsync(avatarUrl).then((color) => {
        setBannerBackground(color.hex);
      });
    } else {
      setBannerBackground(`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/banners/${bannerUrl}`);
    }
  }, [bannerUrl, avatarUrl]);

  const checkDMCreated = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    try {
      // person you're trying to message is the recipient
      // user who is recieving the message is the recipient

      const { data: profileData, error: profileError } = await supabase.from("profiles").select("id").eq("username", username);
      const { data, error } = await supabase.from("active_messages").select("*").eq("recipient_id", profileData[0].id);

      if (error) throw error;
      if (profileError) throw profileError;

      if (data.length > 0) {
        disableBtn();
        router.push(`/messages/u/${username}`);
      } else {
        goToCreateMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function goToCreateMessages() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    try {
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("id").eq("username", username);
      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from("messages_list")
        .insert([
          {
            id: user.id,
            recipient_id: profileData[0].id,
            blocked: false,
          },
        ])
        .select();
      if (error) throw error;

      const { data: data2, error: error2 } = await supabase
        .from("messages_list")
        .insert([
          {
            id: profileData[0].id,
            recipient_id: user.id,
            blocked: false,
          },
        ])
        .select();

      if (error2) throw error2;

      disableBtn();
      router.push(`/messages/u/${username}`);
    } catch (error) {
      console.log(error);
    }
  }

  const disableBtn = () => {
    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 3000);
  };

  return (
    <section
      style={{
        background: bannerBackground && bannerBackground.startsWith("http") ? `url(${bannerBackground})` : bannerBackground,
      }}
      className="flex h-80 w-full rounded-2xl"
    >
      {!bannerBackground ? (
        <Loading />
      ) : (
        <div className="flex h-[22.5%] w-full items-center self-end rounded-b-2xl border border-blackLight bg-black px-5 pt-3">
          <img src={avatarUrl} alt="Avatar" className="bottom-0 h-32 w-32 self-end rounded-full border-[3px] border-black" />
          <div className="ml-4 pb-2">
            <h1 className="text-2xl font-bold text-white">{fullname}</h1>
            <h2 className="pb-3 text-sm font-medium text-white opacity-75">@{username}</h2>
          </div>
          <div className="ml-auto flex pb-3">
            {isSelf ? (
              <button
                onClick={() => router.push("/profile/edit")}
                className="mr-2 flex items-center rounded-full border border-white/50 px-4 py-2 text-sm font-bold text-white hover:bg-white hover:text-black"
              >
                {/* <Edit size="1.5em" className="mr-1" /> */}
                Edit Profile
              </button>
            ) : (
              <UserFollowButton
                targetUsername={username}
                initialIsFollowing={initialFollowing}
                initialIsFollowed={isFollowedBy}
                reload={followUpdated}
                classNames={{
                  base: "mr-2",
                }}
              />
            )}
            <button
              onClick={checkDMCreated}
              className={`${disableButton ? `disabled` : `enabled`} mr-2 flex items-center justify-center rounded-full border border-white/50 p-2 font-bold text-white hover:bg-white hover:text-black`}
            >
              <Message size="1.25em" />
            </button>

            <button className="mr-2 flex items-center justify-center rounded-full border border-white/50 p-2 font-bold text-white hover:bg-white hover:text-black">
              <IoEllipsisHorizontal size="1.25em" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
