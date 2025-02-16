"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import BannerCard from "./components/bannerCard";
import CharacterCounter from "@/app/ui/components/CharacterCounter";
import { HiPlusSmall } from "react-icons/hi2";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
  const supabase = createClient();
  const confirmModal = useDisclosure();

  const avatarEntry = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState(null);
  const [newProfileInfo, setNewProfileInfo] = useState({
    full_name: "",
    aboutme: {
      bio: "",
      title: "",
      subtitle: "",
    },
  });
  const [errors, setErrors] = useState({
    full_name: "",
    bio: "",
    subtitle: "",
    avatar: "",
  });

  function newAvatarEntry() {
    const selectedFile = avatarEntry.current.files[0];
    setAvatar(selectedFile);
    console.log(selectedFile);
  }

  const validateProfileInfo = () => {
    let isValid = true;
    let validationErrors = {
      full_name: "",
      bio: "",
      subtitle: "",
      avatar: "",
    };

    if (newProfileInfo.avatar === null) {
      validationErrors.avatar = "Avatar cannot be empty.";
      console.log("Avatar cannot be empty.");
      isValid = false;
    }

    if (newProfileInfo.full_name === "") {
      validationErrors.full_name = "Full name cannot be empty.";
      console.log("Full name cannot be empty.");
      isValid = false;
    } else if (newProfileInfo.full_name.length < 4) {
      validationErrors.full_name = "Full name cannot be less than 4 characters.";
      console.log("Full name cannot be more than 50 characters.");
      isValid = false;
    } else if (newProfileInfo.full_name.length > 50) {
      validationErrors.full_name = "Full name must cannot be more than 50 characters.";
      console.log("Full name must be at least 4 characters.");
      isValid = false;
    }

    if (newProfileInfo.aboutme.title === "") {
      validationErrors.title = "Title cannot be empty.";
      console.log("Title cannot be empty.");
      isValid = false;
    } else if (newProfileInfo.aboutme.title.length < 5) {
      validationErrors.title = "Title cannot be less than 5 characters.";
      console.log("Title cannot be more than 50 characters.");
      isValid = false;
    } else if (newProfileInfo.aboutme.title.length > 50) {
      validationErrors.title = "Title must cannot be more than 50 characters.";
      console.log("Title must be at least 5 characters.");
      isValid = false;
    }

    if (newProfileInfo.aboutme.bio === "") {
      validationErrors.bio = "Bio cannot be empty.";
      console.log("Bio cannot be empty.");
      isValid = false;
    } else if (newProfileInfo.aboutme.bio.length < 50) {
      validationErrors.bio = "Bio cannot be less than 50 characters.";
      console.log("Bio cannot be more than 500 characters.");
      isValid = false;
    } else if (newProfileInfo.aboutme.bio.length > 200) {
      validationErrors.bio = "Bio must cannot be more than 200 characters.";
      console.log("Bio must be at least 50 characters.");
      isValid = false;
    }

    if (newProfileInfo.aboutme.subtitle === "") {
      validationErrors.subtitle = "Subtitle cannot be empty.";
      console.log("Subtitle cannot be empty.");
      isValid = false;
    } else if (newProfileInfo.aboutme.subtitle.length < 5) {
      validationErrors.subtitle = "Subtitle cannot be less than 5 characters.";
      console.log("Subtitle cannot be more than 50 characters.");
      isValid = false;
    } else if (newProfileInfo.aboutme.subtitle.length > 50) {
      validationErrors.subtitle = "Subtitle must cannot be more than 50 characters.";
      console.log("Subtitle must be at least 5 characters.");
      isValid = false;
    }
    setErrors(validationErrors);
    return isValid;
  };

  const getProfileInfo = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.log("Error fetching user info: ", userError.message);
        throw userError;
      }

      const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id);

      if (profileError) throw profileError;

      if (!profileData || profileData.length === 0) {
        throw new Error("No profile data found.");
      }
      setAvatarUrl(`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${profileData[0].avatar_url}`);
      setBannerUrl(profileData[0].banner_url);
      setNewProfileInfo({
        full_name: profileData[0].full_name,
        aboutme: {
          bio: profileData[0].aboutme.bio,
          title: profileData[0].aboutme.title,
          subtitle: profileData[0].aboutme.subtitle,
        },
      });
    } catch (error) {
      console.log("Error fetching profile info: ", error.message);
    }
  };

  const updateProfile = async () => {
    if (!validateProfileInfo()) {
      console.log("Profile info is not valid.");
      return;
    }
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.log("Error fetching user info: ", userError.message);
        throw userError;
      }

      console.log("User: ", user); // Check if user is populated correctly

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update([
          {
            // newProfileInfo
            full_name: newProfileInfo.full_name,
            aboutme: newProfileInfo.aboutme,
          },
        ])
        .eq("id", user.id)
        .select("*");

      if (profileError) throw profileError;

      if (avatar) {
        const { error: storageDeleteError } = await supabase.storage.from("avatars").remove([`${profileData[0].avatar__url}`]);
        if (storageDeleteError) {
          console.log("Error deleting avatar: ", storageDeleteError.message);
          throw storageDeleteError;
        }

        let fileExtension = avatar.name.split(".").pop();
        let filePath = `${user.id}-${Math.random()}.${fileExtension}`;
        const { error: storageError } = await supabase.storage.from("avatars").upload(filePath, avatar);
        if (storageError) {
          console.log("Error uploading avatar: ", storageError.message);
          throw storageError;
        }
      }

      confirmModal.onOpen();
      router.refresh();
      console.log("Profile data updated successfully: ", profileData);
    } catch (error) {
      console.log("Error fetching profile info: ", error);
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);
  return (
    <>
      <div className="flex h-full w-full grow flex-col items-center overflow-y-auto">
        <BannerCard bannerUrl={bannerUrl} avatarUrl={avatarUrl} />
        <div className="top-28 flex h-full w-1/3 -translate-y-36 flex-col rounded-3xl border border-blackLighter bg-black p-8">
          <div className="flex w-full flex-col items-center text-white">
            <h1 className="text-lg font-bold">Edit Your Profile</h1>
            {!avatar && <Image src={avatarUrl} alt="avatar" width={100} height={100} className="mt-2 size-32 rounded-full" />}
            {avatar && <Image src={URL.createObjectURL(avatar)} alt="avatar" width={100} height={100} className="size-32 rounded-full" />}
            <label className="group inset-0 flex h-24 w-32 cursor-pointer items-center justify-center p-2">
              <div className="z-50 flex items-center justify-center rounded-full bg-primary p-1 transition-colors duration-300 ease-in-out hover:bg-blackLighter">
                <HiPlusSmall className="text-3xl text-white" />
              </div>
              <input name="avatar" type="file" ref={avatarEntry} className="hidden" onChange={newAvatarEntry} />
            </label>
            <p className="text-sm text-red-500">{errors.avatar}</p>

            <h1 className="mr-auto mt-4 text-base font-medium">Name</h1>
            <p className="mr-auto text-sm text-red-500">{errors.full_name}</p>
            <input
              type="text"
              value={newProfileInfo.full_name}
              className="h-10 w-full rounded-3xl border border-transparent bg-blackLight p-4"
              onChange={(e) =>
                setNewProfileInfo((prevProfileInfo) => ({
                  ...prevProfileInfo,
                  full_name: e.target.value,
                }))
              }
              maxLength={50}
            />
            <CharacterCounter value={newProfileInfo.full_name} maxLength={50} size={`sm`} textColor={`gray2`} className={`ml-auto`} />

            <h1 className="mr-auto mt-4 text-base font-medium">Position/Title</h1>
            <p className="mr-auto text-sm text-red-500">{errors.title}</p>
            <input
              type="text"
              value={newProfileInfo.aboutme.title}
              className="h-10 w-full rounded-3xl border border-transparent bg-blackLight p-4 focus:outline-none"
              onChange={(e) =>
                setNewProfileInfo((prevProfileInfo) => ({
                  ...prevProfileInfo,
                  aboutme: {
                    ...prevProfileInfo.aboutme,
                    title: e.target.value,
                  },
                }))
              }
              maxLength={50}
            />
            <CharacterCounter value={newProfileInfo.aboutme.title} maxLength={50} size={`sm`} textColor={`gray2`} className={`ml-auto`} />

            <h1 className="mr-auto mt-4 text-base font-medium">Position/Title Description</h1>
            <p className="mr-auto text-sm text-red-500">{errors.subtitle}</p>
            <input
              type="text"
              value={newProfileInfo.aboutme.subtitle}
              className="h-10 w-full rounded-3xl border border-transparent bg-blackLight p-4 focus:outline-none"
              onChange={(e) =>
                setNewProfileInfo((prevProfileInfo) => ({
                  ...prevProfileInfo,
                  aboutme: {
                    ...prevProfileInfo.aboutme,
                    subtitle: e.target.value,
                  },
                }))
              }
              maxLength={50}
            />
            <CharacterCounter value={newProfileInfo.aboutme.subtitle} maxLength={50} size={`sm`} textColor={`gray2`} className={`ml-auto`} />

            <h1 className="mr-auto mt-4 text-base font-medium">About me</h1>
            <p className="mr-auto text-sm text-red-500">{errors.bio}</p>
            <textarea
              type="text"
              rows={5}
              value={newProfileInfo.aboutme.bio}
              className="no-scrollbar w-full resize-none rounded-xl border-blackLighter bg-blackLight p-2 text-white outline-none"
              onChange={(e) =>
                setNewProfileInfo((prevProfileInfo) => ({
                  ...prevProfileInfo,
                  aboutme: {
                    ...prevProfileInfo.aboutme,
                    bio: e.target.value,
                  },
                }))
              }
              maxLength={200}
            />
            <CharacterCounter value={newProfileInfo.aboutme.bio} maxLength={200} size={`sm`} textColor={`gray2`} className={`mb-10 ml-auto`} />
            <button
              onClick={updateProfile}
              className="absolute bottom-0 mb-4 flex h-10 w-1/3 items-center justify-center rounded-full bg-white/90 px-5 py-4 text-base font-bold text-black hover:bg-white/60"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onOpenChange={confirmModal.onOpenChange}
        aria-label="Delete Post"
        classNames={{
          backdrop: "bg-white/10 backdrop-opacity-10",
        }}
        hideCloseButton
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <div className="mt-12 flex w-96 flex-col gap-5 rounded-xl border border-blackLight bg-black p-5 text-white">
              <div className="flex flex-col items-center gap-5">
                <h2 className="text-xl font-bold">Confirmation</h2>
                <p className="w-2/3 text-center text-sm font-semibold text-white/75">Your Profile has been successfully updated!</p>
              </div>
              <div className="flex gap-2.5 font-semibold">
                <button className="flex w-full justify-center gap-1.5 rounded-full bg-blue-700 py-2" onClick={confirmModal.onClose}>
                  Okay!
                </button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
