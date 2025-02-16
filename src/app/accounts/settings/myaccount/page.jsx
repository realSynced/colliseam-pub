"use client";

import CustomInput from "../components/CustomInput";
import { useState } from "react";

export default function MyAccount() {
  const [inputVal, setInputVal] = useState("");

  return (
    <main className="flex-1">
      <nav className="sticky top-0 z-50 flex h-[69px] items-center border-b border-blackLight bg-black px-5">
        <h2 className="text-xl font-bold">Profile</h2>
      </nav>

      <section style={{ height: "calc(100vh - 70px)" }} className="scrollbar-thin flex flex-col gap-12 overflow-y-scroll px-5 pt-5">
        <CustomInput
          readOnly
          title={"Username"}
          desc={"Cannot be changed \n (Pay to change)"}
          value={inputVal}
          setValue={setInputVal}
          edit={<p className="p-1 text-sm text-white/50">{"(Pay To Change)"}</p>}
        />

        <CustomInput title={"Display Name"} desc={"Name that appears on your profile"} value={inputVal} setValue={setInputVal} />

        <CustomInput type="number" title={"Phone No."} desc={"Your phone number"} value={inputVal} setValue={setInputVal} />

        <div />
      </section>
    </main>
  );
}
