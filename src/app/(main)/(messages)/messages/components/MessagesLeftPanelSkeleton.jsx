"use client";
import Link from "next/link";
import Image from "next/image";
import Search from "@/app/(main)/home/components/search";
import { Skeleton } from "@nextui-org/react";
// Icons
import MessagePlus from "../../../../../../public/icons/messages-square_plus.svg";

export default function MessagesLeftPanel() {
  return (
    <>
      <nav className="sticky top-0 z-0 flex h-screen w-96 flex-shrink-0 flex-col items-center border-r border-r-blackLight bg-black text-white">
        <div className="flex w-full flex-col text-white">
          <div className="w-full border-b border-white/10 p-5 pr-5">
            <Search />
          </div>

          <div className="border-b border-white/10 p-5">
            <h1 className="px-3 text-xl font-bold">Friends</h1>
          </div>

          <div className="flex w-full p-5 px-8">
            <h1 className="text-xl font-bold">Messages</h1>
            <button className="ml-auto">
              <Image src={MessagePlus} width={23} height={23} alt="messageIcon" className="ml-auto" />
            </button>
          </div>

          <div className="flex flex-col px-5">
            {/* Filter Messages */}
            <div className="flex gap-2 px-3 pb-5">
              {["All", "Unread", "Groups", "Users"].map((item, i) => (
                <button key={item} className={`rounded-full bg-blackLight px-4 py-2 text-sm font-bold hover:bg-white hover:text-black`}>
                  {item}
                </button>
              ))}
            </div>

            <div className="top-0 flex flex-col space-y-2">
              <div>
                {/* Skeleton for each message */}
                <div className={`flex animate-pulse items-center space-x-3 rounded-xl bg-blackLight p-3 text-white`}>
                  <div className="size-10 rounded-full" />
                  <div className="grid grid-cols-3">
                    <div className="col-span-2 flex flex-col">
                      <h1 className="text-base font-bold"> </h1>
                      <p>{/*Last message sent*/}</p>
                    </div>
                    <div className="col-span-1">{/* Messages unread */}</div>
                  </div>
                </div>
              </div>
              <div>
                {/* Skeleton for each message */}
                <div className={`flex animate-pulse items-center space-x-3 rounded-xl bg-blackLight p-3 text-white`}>
                  <div className="size-10 rounded-full" />
                  <div className="grid grid-cols-3">
                    <div className="col-span-2 flex flex-col">
                      <h1 className="text-base font-bold"> </h1>
                      <p>{/*Last message sent*/}</p>
                    </div>
                    <div className="col-span-1">{/* Messages unread */}</div>
                  </div>
                </div>
              </div>
              <div>
                {/* Skeleton for each message */}
                <div className={`flex animate-pulse items-center space-x-3 rounded-xl bg-blackLight p-3 text-white`}>
                  <div className="size-10 rounded-full" />
                  <div className="grid grid-cols-3">
                    <div className="col-span-2 flex flex-col">
                      <h1 className="text-base font-bold"> </h1>
                      <p>{/*Last message sent*/}</p>
                    </div>
                    <div className="col-span-1">{/* Messages unread */}</div>
                  </div>
                </div>
              </div>
              <div>
                {/* Skeleton for each message */}
                <div className={`flex animate-pulse items-center space-x-3 rounded-xl bg-blackLight p-3 text-white`}>
                  <div className="size-10 rounded-full" />
                  <div className="grid grid-cols-3">
                    <div className="col-span-2 flex flex-col">
                      <h1 className="text-base font-bold"> </h1>
                      <p>{/*Last message sent*/}</p>
                    </div>
                    <div className="col-span-1">{/* Messages unread */}</div>
                  </div>
                </div>
              </div>
              <div>
                {/* Skeleton for each message */}
                <div className={`flex animate-pulse items-center space-x-3 rounded-xl bg-blackLight p-3 text-white`}>
                  <div className="size-10 rounded-full" />
                  <div className="grid grid-cols-3">
                    <div className="col-span-2 flex flex-col">
                      <h1 className="text-base font-bold"> </h1>
                      <p>{/*Last message sent*/}</p>
                    </div>
                    <div className="col-span-1">{/* Messages unread */}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* </div> */}
      </nav>
    </>
  );
}
