"use client";
import type { bodyData } from "./types";
import Carousel from "./Carousel";
import ImageGrid from "./ImageGrid";
import MiniThumbnail from "./MiniThumbnail";

export default function PostBody({ title, content, images, displayMode = "Big", postID, showEntirePost }: bodyData) {
  const numberOfImages = images.length;
  const firstImage = postID + "/" + images[0];

  const miniThumbnailData = {
    image: firstImage,
    length: numberOfImages,
  };

  const formattedContent =
    content &&
    content.split("\n").map((line, index) => (
      <p key={index} className="mt-1 text-base font-normal opacity-100">
        {line}
      </p>
    ));

  switch (displayMode) {
    case "Compact":
      return (
        <div className="grid grid-cols-4">
          <div className="col-start-1 col-end-4 mr-4 overflow-x-clip">
            <h2 className={`font-semibold ${showEntirePost ? "break-words" : "truncate"}`}>{title}</h2>
            {formattedContent}
          </div>
          <div className="col-start-4 col-end-5">{images.length > 0 && <MiniThumbnail {...miniThumbnailData} />}</div>
        </div>
      );

    case "Big":
      return (
        <div className="flex flex-col">
          <h2 className={`font-semibold ${showEntirePost ? "break-words" : "truncate"}`}>{title}</h2>
          {formattedContent}
          {images.length > 4 ? <Carousel images={images} postID={postID} /> : <ImageGrid images={images} postID={postID} />}
        </div>
      );
  }
}
