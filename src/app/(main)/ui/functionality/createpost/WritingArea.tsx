//@ts-nocheck
"use client";
import { EditorContent } from "@tiptap/react";
import Gallery from "./Gallery";
import { AreaContext } from "./Contexts";
import { useEffect, useState, useContext } from "react";
import { useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ToolBar from "./ToolBar";
import type { AreaContextValue } from "./types";

const EXTENSIONS = [
  Document,
  Paragraph,
  Text,
  Bold,
  Code,
  Link,
  Italic,
  Strike,
  Placeholder.configure({
    placeholder: "Write Something...",
  }),
  Underline,
];

export default function WritingArea({ id }: { id: string }) {
  const { areaDispatch, areas } = useContext<AreaContextValue>(AreaContext);

  const editor = useEditor({
    extensions: EXTENSIONS,
    editorProps: {
      attributes: {
        class: "bg-transparent outline-0 text-white resize-none",
      },
    },
    onUpdate({ editor }) {
      areaDispatch({ type: "UPDATE_TEXT", id: id, text: editor.getJSON(), rawtext: editor.getText() });
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  // fix type here
  const fileHandler = (e: any) => {
    const newFiles: File[] = Object.values(e.currentTarget.files);
    setFiles([...files, ...newFiles]);
    e.currentTarget.value = "";
  };

  useEffect(() => {
    if (files.length > 0) {
      if (areas.at(-1)?.id === id) {
        areaDispatch({ type: "ADD_AREA", id: id });
      }
    }
    if (files.length == 0) {
      const AreaId = id;
      const AreaIndex = areas.findIndex((item: any) => item.id === AreaId);
      if (AreaIndex + 1 != areas.length) {
        const incomingText = areas[AreaIndex + 1].text;
        editor?.commands.insertContent(incomingText);
        areaDispatch({ type: "DELETE_NEXT_AREA", id: id });
      }
    }
    areaDispatch({ type: "UPDATE_FILES", id: id, files: files });
  }, [files]);

  return (
    <div className="flex flex-col gap-y-3">
      {/* TODO: add focus here instead of empty*/}
      {!editor?.isEmpty && <ToolBar editor={editor} />}
      <EditorContent editor={editor} />
      {files.length > 0 && <Gallery files={files} setFiles={setFiles} />}
      <label className="flex w-32 cursor-pointer flex-row items-center gap-x-2 stroke-primary text-primary hover:stroke-primaryHover hover:text-primaryHover">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
          <path
            d="M6.45536 21.8065L15.8914 12.9256L20.3318 17.3661M6.45536 21.8065H17.5565C19.3958 21.8065 20.8869 20.3155 20.8869 18.4762V12.9256M6.45536 21.8065C4.61605 21.8065 3.125 20.3155 3.125 18.4762V7.37501C3.125 5.5357 4.61605 4.04465 6.45536 4.04465H13.6711M19.7768 9.40478L19.7768 6.26489M19.7768 6.26489L19.7768 3.125M19.7768 6.26489L16.6369 6.26489M19.7768 6.26489L22.9167 6.26489M9.78571 9.04019C9.78571 9.95984 9.04019 10.7054 8.12053 10.7054C7.20088 10.7054 6.45536 9.95984 6.45536 9.04019C6.45536 8.12053 7.20088 7.37501 8.12053 7.37501C9.04019 7.37501 9.78571 8.12053 9.78571 9.04019Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm font-medium">{files.length ? "Add more" : "Add"}</p>
        <input type="file" className="hidden" onChange={fileHandler} multiple />
      </label>
    </div>
  );
}
