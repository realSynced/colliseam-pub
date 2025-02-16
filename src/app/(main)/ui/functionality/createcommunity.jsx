"use client";

import React, { useState, useRef } from "react";
// import { createCommunity } from "./serverSideFunctions";
import { useVisibility } from "@/app/(main)/ui/statemanagement/VisibilityContext";
import { createClient } from "@/utils/supabase/client";

export default function CreateCommunity() {
  const { changeVisibility } = useVisibility();
  const [community, setCommunity] = useState({
    name: "",
    description: "",
    website: "",
  });
  const iconRef = useRef(null);
  const bannerRef = useRef(null);

  const handleCreate = async () => {
    const supabase = createClient();
    const { data: communityData, error } = await supabase.from("communities").insert([community]).select("*").single();
    if (error) {
      console.log("Error creating community");
      console.error(error);
    }
    console.log(communityData);

    if (communityData && communityData.id) {
      // todo upload icon and banner
      const icon = iconRef.current.files[0];
      const banner = bannerRef.current.files[0];
      if (icon) {
        const fileExt = icon.name.split(".").pop();
        const { data: iconData, error: iconError } = await supabase.storage.from("community_icon").upload(`${communityData.id}.${fileExt}`, icon);
        if (iconError) {
          console.log("Error uploading icon");
          console.error(iconError);
        } else {
          const { data: updatedCommunity, error: updateError } = await supabase
            .from("communities")
            .update({ icon_image: `${communityData.id}.${fileExt}` })
            .eq("id", communityData.id)
            .single();
        }
        console.log(iconData);
      }
      if (banner) {
        const fileExt = banner.name.split(".").pop();
        const { data: bannerData, error: bannerError } = await supabase.storage.from("banner").upload(`${communityData.id}.${fileExt}`, banner);
        if (bannerError) {
          console.log("Error uploading banner");
          console.error(bannerError);
        } else {
          const { data: updatedCommunity, error: updateError } = await supabase
            .from("communities")
            .update({ banner_image: `${communityData.id}.${fileExt}` })
            .eq("id", communityData.id)
            .single();
        }
        console.log(bannerData);
      }
    }

    changeVisibility("");
  };

  const handleChange = (e) => {
    setCommunity({
      ...community,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed w-lvw h-lvh flex items-center justify-center bg-[#00000050] z-50 top-0 left-0">
      <div className="h-11/12 w-full md:w-7/12">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="flex flex-col items-center bg-white w-4/5 h-3/4 p-4 rounded-3xl text-black">
            <div className="flex justify-start w-full font-bold text-base mb-2">Create Community</div>
            <div className="flex flex-col space-y-6 justify-start w-full text-base mb-4">
              <input
                type="text"
                name="name"
                value={community.name}
                onChange={handleChange}
                placeholder="Community Name"
                className="w-full h-10 bg-gray rounded-full p-2 text-black font-normal"
              />
              <textarea
                name="description"
                value={community.description}
                onChange={handleChange}
                placeholder="Community Description"
                className="resize-none w-full h-full rounded-3xl p-2 bg-gray text-black font-normal"
              />
              <div className="flex space-x-4 w-full justify-start mb-4 items-center">
                <h2 className="text-base">Icon</h2>
                <input
                  type="file"
                  ref={iconRef}
                  name="icon"
                  accept="image/png, image/jpeg, image/jpg"
                  className="w-full h-10 bg-gray rounded-full p-2 text-black font-normal leading-none"
                />
                <h2 className="text-base">Banner</h2>
                <input
                  type="file"
                  name="banner"
                  ref={bannerRef}
                  accept="image/png, image/jpeg, image/jpg"
                  className="w-full h-10 bg-gray rounded-full p-2 text-black font-normal leading-none"
                />
              </div>
              <input
                type="text"
                name="website"
                value={community.website}
                onChange={handleChange}
                placeholder="Community Website"
                className="w-full h-10 bg-gray rounded-full p-2 text-black font-normal"
              />
            </div>
            <div className="flex w-full ">
              <div className="flex space-x-2 mr-auto ">
                <button
                  className="text-black text-sm font-semibold rounded-full py-2 px-4
                                border border-black border-opacity-50
                            "
                  onClick={() => changeVisibility("")}
                >
                  Cancel
                </button>{" "}
              </div>
              <div className="flex space-x-2 ml-auto ">
                <button
                  className="text-black text-sm font-semibold rounded-full py-2 px-4
                                border border-black border-opacity-50
                            "
                >
                  Save Draft
                </button>
                <button className="bg-primary text-white text-sm font-semibold rounded-full py-2 px-4" onClick={handleCreate}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
