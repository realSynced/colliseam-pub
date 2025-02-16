//@ts-nocheck
"use client";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { MdPhotoLibrary } from "react-icons/md";
import { IconContext } from "react-icons";
import Image from "next/image";

export default function MiniThumbnail({ image, length }: { image: string | StaticImport; length: number }) {
  const iconStyle = {
    className: "text-lg",
  };
  return (
    <div className="relative">
      <div className="relative h-[5.5rem] w-full">
        <Image
          fill
          src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + image}
          alt="..."
          className="rounded-xl object-cover"
        />
      </div>
      {length > 1 && (
        <div className="absolute bottom-1 right-1 flex flex-row rounded-xl bg-black px-2 py-1 text-white">
          <p className="mr-1 text-sm">{length}</p>
          <IconContext.Provider value={iconStyle}>
            <MdPhotoLibrary />
          </IconContext.Provider>
        </div>
      )}
    </div>
  );
}
