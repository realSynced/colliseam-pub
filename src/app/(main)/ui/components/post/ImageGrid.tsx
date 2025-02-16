import { truncate } from "fs";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
export default function ImageGrid({ images, postID }: { images: string[] | StaticImport[]; postID: number }) {
  return (
    <>
      {images.length === 1 && (
        <div className="relative mt-4 h-96 w-full">
          <Image
            fill
            sizes="100%"
            src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + images[0]}
            alt="Post Image"
            className="rounded-2xl object-cover"
          />
        </div>
      )}
      {images.length === 2 && (
        <div className="mt-4 grid h-96 grid-cols-2 gap-[0.1rem] overflow-hidden rounded-2xl">
          <div className="relative h-full w-full">
            <Image
              fill
              sizes="100%"
              src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + images[0]}
              alt="Post Image"
              className="object-cover"
            />
          </div>
          <div className="relative h-full w-full">
            <Image
              fill
              sizes="100%"
              src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + images[1]}
              alt="Post Image"
              className="object-cover"
            />
          </div>
        </div>
      )}
      {images.length === 3 && (
        <div className="relative mt-4 grid grid-cols-2 gap-[0.1rem] overflow-hidden rounded-2xl">
          <div className="relative h-96 w-full">
            <Image
              fill
              sizes="100%"
              src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + images[0]}
              alt="Post Image"
              className="object-cover"
            />
          </div>
          <div className="relative grid h-96 grid-rows-2 gap-[0.1rem]">
            <div className="relative h-full w-full">
              <Image
                fill
                sizes="100%"
                src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + images[1]}
                alt="Post Image"
                className="object-cover"
              />
            </div>
            <div className="relative h-full w-full">
              <Image
                fill
                sizes="100%"
                src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + images[2]}
                alt="Post Image"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
      {images.length >= 4 && (
        <div className="mt-4 grid grid-cols-2 gap-[0.1rem] overflow-hidden rounded-2xl">
          {images.slice(0, 4).map((image, index) => {
            return (
              <div className="relative h-48 w-full">
                <Image
                  fill
                  sizes="100%"
                  key={index}
                  src={"https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/posts/" + postID + "/" + image}
                  alt="Post Image"
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
