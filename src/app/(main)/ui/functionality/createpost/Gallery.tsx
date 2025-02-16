"use client";

import { useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";
import { motion, useDragControls } from "framer-motion";

export default function Gallery({ files, setFiles }: { files: File[]; setFiles: Function }) {
  const fileHandler = (name: string) => {
    setFiles(files.filter((file) => file.name !== name));
  };

  const controls = useDragControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  // Calculate drag constraints dynamically when files state changes or on mount
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const contentWidth = contentRef.current?.scrollWidth || 0;

  useEffect(() => {
    const calculateConstraints = () => {
      if (contentWidth > containerWidth)
        setConstraints({
          left: -(contentWidth - containerWidth),
          right: 0,
        });
      else
        setConstraints({
          left: 0,
          right: 0,
        });
    };

    console.log(contentWidth, containerWidth, contentWidth - containerWidth);

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", calculateConstraints);
    };
  }, [contentWidth, containerWidth]);

  function startDrag(event: any) {
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
    controls.start(event);
  }

  return (
    <div
      ref={containerRef}
      style={{ touchAction: "none" }}
      className="no-scrollbar relative mb-2 flex cursor-grab gap-x-2 overflow-x-hidden"
      onPointerDown={startDrag}
      onPointerUp={() => {
        if (containerRef.current) containerRef.current.style.cursor = "grab";
      }}
    >
      <motion.div
        ref={contentRef}
        style={{ touchAction: "none" }}
        className="flex gap-x-2"
        drag="x"
        dragControls={controls}
        dragConstraints={constraints}
      >
        {files.map((file, index) => {
          return (
            <div key={index} className="pointer-events-none relative mt-3 w-fit flex-none">
              <img src={URL.createObjectURL(file)} alt={`picture ${index}`} className="h-60 w-auto rounded-2xl" />
              <button
                type="button"
                onClick={() => fileHandler(file.name)}
                className="pointer-events-auto absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#222222] p-1 text-xl"
              >
                <BsX />
              </button>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
