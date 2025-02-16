"use client";
import Image from "next/image";
import Link from "next/link";
import LinesEllipsis from "react-lines-ellipsis";
import TimeAgo from "react-timeago";

export default function ProjectItem({ title, description, link, source, date }) {
  return (
    <Link className="mr-1.5 flex w-full items-center gap-4 rounded-xl px-3 py-3 hover:bg-blackLight" href={link}>
      <div className="flex h-[4rem] w-[4rem] shrink-0 rounded-full bg-blackLight">
        <Image
          src={`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/projects/${encodeURIComponent(title)}/avatar.png`}
          alt=""
          width={80}
          height={80}
          className="rounded-full border-none object-cover"
        />
      </div>

      <div className="flex flex-col">
        <h1 className={`text-base font-semibold leading-tight`}>{title}</h1>
        <div className={`text-xs opacity-75`} suppressHydrationWarning>
          {/* {description} */}
          <LinesEllipsis text={description} maxLine="3" ellipsis="..." trimRight basedOn="letters" />
          {/* <br /> */}
          <TimeAgo minPeriod={5} className={`text-xs`} date={date} />
          {}
        </div>
      </div>
    </Link>
  );
}
