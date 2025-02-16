"use client";
import styles from "@/app/ui/styles.module.css";
// Icons
import { BiPlus } from "react-icons/bi";
import { MdOutlineGifBox } from "react-icons/md";

// Components
import MessagesNav from "./MessagesNav";

export default function MessagesSkeleton() {
    const params = { username: "username" };
    const recipientInfo = { username: "username", aboutme: { title: "title" } };

    return (
        <div className="sticky top-0 grid h-screen grid-rows-[auto_1fr_auto]">
            {/* Navbar */}
            <MessagesNav params={params} recipientInfo={recipientInfo} />

            {/* Chat Section */}
            <section className={`row-start-2 mt-5 flex flex-shrink flex-col gap-2 overflow-y-auto px-5 pb-5 pr-[14px] ${styles.scroll}`}>
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`${i === 0 && "mt-auto"} flex items-center gap-2 ${i % 2 === 0 ? "justify-end" : ""} animate-pulse`}>
                        <div className="mr-2 h-8 w-8 rounded-full bg-blackLighter" />
                        <p className="w-[70%] rounded-lg bg-blackLighter p-2 text-white/80">Messages are loading...</p>
                    </div>
                ))}
            </section>

            {/* Input Section */}
            <section style={{ borderRadius: "25px" }} className="mx-5 mb-5 flex items-start border border-black bg-blackLight px-2 py-[6px]">
                <div className="flex gap-2">
                    <button>
                        <BiPlus className="box-content h-[24px] w-[24px] rounded-full p-1 text-white opacity-75 hover:bg-blackLighter hover:opacity-100" />
                    </button>
                    <div className="mr-1 w-[2px] rounded-full bg-white/10"></div>
                </div>

                <textarea
                    rows={1}
                    className={`max-h-[288px] w-full resize-none bg-blackLight px-3 py-1 text-white placeholder:text-white/50 focus:outline-none disabled:cursor-not-allowed ${styles.scroll}`}
                    placeholder="Message..."
                />

                <div className="flex gap-2">
                    <div className="mx-1 w-[2px] rounded-full bg-white/10"></div>
                    <button>
                        <MdOutlineGifBox className="box-content h-[24px] w-[24px] rounded-full p-1 text-white opacity-75 hover:bg-blackLighter hover:opacity-100" />
                    </button>
                </div>
            </section>
        </div>
    );
}
