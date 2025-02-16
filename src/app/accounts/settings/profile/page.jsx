"use client";

import CustomInput from "../components/CustomInput";
import { useRef, useState } from "react";

export default function Profile() {
  const [inputVal, setInputVal] = useState("");

  const [avatar, setAvatar] = useState(null);

  const avatarEntry = useRef(null);

  function newAvatarEntry() {
    const selectedFile = avatarEntry.current.files[0];
    setAvatar(selectedFile);
    console.log(selectedFile);
  }

  return (
    <main className="flex-1">
      <nav className="sticky top-0 z-50 flex h-[69px] items-center border-b border-blackLight bg-black px-5">
        <h2 className="text-xl font-bold">Profile</h2>
      </nav>

      <section style={{ height: "calc(100vh - 70px)" }} className="scrollbar-thin flex flex-col gap-12 overflow-y-scroll px-5 pt-5">
        <CustomInput title={"Profile Picture"} desc={"Profile Picture that appears on your profile"}>
          <label className="group relative size-32 cursor-pointer overflow-hidden rounded-full bg-blackLight">
            {/* Avatar on hover edit button */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 flex size-32 items-center justify-center bg-black/50 opacity-0 duration-300 group-hover:opacity-100">
              <svg className="stroke-white" width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.173 10.4274L25.573 15.8274M6.6731 29.3274L13.2221 28.0078C13.5697 27.9378 13.889 27.7666 14.1397 27.5157L28.8002 12.8472C29.5031 12.1439 29.5026 11.0039 28.7991 10.3012L25.6935 7.1991C24.9903 6.49669 23.8509 6.49717 23.1483 7.20016L8.48624 21.8702C8.23602 22.1206 8.06517 22.4392 7.99505 22.7861L6.6731 29.3274Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Avatar */}
            {avatar && typeof avatar === "object" && (
              <img
                src={URL.createObjectURL(avatar)}
                alt="Uploaded Cover Page"
                className="absolute left-0 top-0 z-10 size-32 rounded-full"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(avatar))}
              />
            )}
            <input name="avatar" type="file" ref={avatarEntry} className="hidden" onChange={newAvatarEntry} />
          </label>
        </CustomInput>

        <CustomInput title={"Banner"} desc={"Banner that appears on your profile"}>
          <label className="group relative h-36 w-96 cursor-pointer overflow-hidden rounded-xl bg-blackLight">
            {/* Avatar on hover edit button */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black/50 opacity-0 duration-300 group-hover:opacity-100">
              <svg className="stroke-white" width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.173 10.4274L25.573 15.8274M6.6731 29.3274L13.2221 28.0078C13.5697 27.9378 13.889 27.7666 14.1397 27.5157L28.8002 12.8472C29.5031 12.1439 29.5026 11.0039 28.7991 10.3012L25.6935 7.1991C24.9903 6.49669 23.8509 6.49717 23.1483 7.20016L8.48624 21.8702C8.23602 22.1206 8.06517 22.4392 7.99505 22.7861L6.6731 29.3274Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Avatar */}
            {avatar && typeof avatar === "object" && (
              <img
                src={URL.createObjectURL(avatar)}
                alt="Uploaded Cover Page"
                className="absolute left-0 top-0 z-10 size-32 rounded-full"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(avatar))}
              />
            )}
            <input name="avatar" type="file" ref={avatarEntry} className="hidden" onChange={newAvatarEntry} />
          </label>
        </CustomInput>

        <CustomInput
          readOnly
          title={"Username"}
          desc={"Cannot be changed \n (Pay to change)"}
          value={inputVal}
          setValue={setInputVal}
          edit={<p className="p-1 text-sm text-white/50">{"(Pay To Change)"}</p>}
        />

        <CustomInput title={"Display Name"} desc={"Name that appears on your profile"} value={inputVal} setValue={setInputVal} />

        <CustomInput title={"Profession"} desc={"Your current profession"} value={inputVal} setValue={setInputVal} />

        <CustomInput title={"Years of Experience"} desc={"Your years of Experience of this Profession"} value={inputVal} setValue={setInputVal} />

        <CustomInput isTextarea title={"Biography"} desc={"Biography that appears on your profile"} value={inputVal} setValue={setInputVal} />

        <div />
      </section>
    </main>
  );
}
