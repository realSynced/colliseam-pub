"use client";

import { createClient } from "@/utils/supabase/client";

import { useState, useEffect } from "react";

import Image from "next/image";
import Tag from "@/app/ui/components/Tag";
import LinesEllipsis from "react-lines-ellipsis";
import { useRouter } from "next/navigation";

export default function ProjectCard({
  name,
  owner,
  description,
  userMembers,
  tags,
  thumbnail_url,
  budget,
}: {
  name: string;
  owner: { id: string; username: string; avatar_url: string };
  description: string;
  userMembers: any[];
  tags: string[];
  thumbnail_url: string;
  budget: number;
}) {
  if (description.length >= 130) {
    description = description.slice(0, 130) + "...";
  }

  const supabase = createClient();
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/project/${name}`)}
      className="select-none overflow-hidden rounded-xl border border-blackLight hover:cursor-pointer hover:bg-blackLight/40"
    >
      <div>
        {thumbnail_url && (
          <Image
            src={`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/projects/${name}/${thumbnail_url}`}
            alt={name}
            width={400}
            height={220}
            className="h-[180px] w-full object-cover object-center"
          />
        )}
        {!thumbnail_url && (
          <div className="shimmer h-40 w-full bg-blackLight">
            <p className="p-5 text-center text-white">No Thumbnail</p>
          </div>
        )}
      </div>

      <div className="p-5">
        <h1 className="text-xl font-bold text-white">{name}</h1>
        <p className="text-base text-white/75">{owner.username}</p>
        <div className="py-3 text-sm text-white/75">
          <LinesEllipsis text={description} maxLine="3" ellipsis="..." trimRight basedOn="letters" />
        </div>
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag, index) => <Tag key={index} backgroundColor="blackLight" textColor="white" name={tag} link={"/"} className={""} />)}
        </div>
      </div>
    </div>
  );
}
