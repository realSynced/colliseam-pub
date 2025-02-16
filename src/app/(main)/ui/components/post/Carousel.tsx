"use client";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useState } from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { IconContext } from "react-icons";

export default function Carousel({ images, postID }: { images: string[]; postID: number }) {
  const carretStyleLeft = {
    className: "text-xl text-white",
  };

  let [imageIndex, changeIndex] = useState(1);

  // This function is responsible of changing the index of the displayed image
  // move can either be -1 or + 1
  function carretClicked(move: number) {
    console.log(imageIndex);
    if (imageIndex + move > 0 && imageIndex + move <= images.length) {
      changeIndex(imageIndex + move);
    }
  }

  return (
    <div className="relative h-full w-full pt-2">
      <div className="flex max-h-96 w-full flex-row items-center overflow-hidden rounded-2xl bg-[#000000]">
        {images.map((image, i) => {
          return (
            <img
              key={i}
              src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + image}
              alt="..."
              width="100%"
              style={{
                objectFit: "contain",
                flexShrink: "0",
                flexGrow: "0",
                translate: `${-100 * (imageIndex - 1)}%`,
                transition: "translate 300ms ease-in-out",
              }}
            />
          );
        })}
      </div>
      <button className="absolute left-2 top-[50%] rounded-full bg-[#000000]/50 p-1 hover:bg-[#000000]/75" onClick={() => carretClicked(-1)}>
        <IconContext.Provider value={carretStyleLeft}>
          <PiCaretLeftBold />
        </IconContext.Provider>
      </button>
      <button className="absolute right-2 top-[50%] rounded-full bg-[#000000]/50 p-1 hover:bg-[#000000]/75" onClick={() => carretClicked(+1)}>
        <IconContext.Provider value={carretStyleLeft}>
          <PiCaretRightBold />
        </IconContext.Provider>
      </button>
      <p className="absolute bottom-2 right-2 rounded-xl bg-[#000000]/50 px-2 py-1 text-sm text-white hover:bg-[#000000]/75">
        {imageIndex}/{images.length}
      </p>
    </div>
  );
}
