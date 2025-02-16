import type { Editor } from "@tiptap/react";

export default function ToolBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }
  const setBold = () => {
    editor?.chain().focus().toggleBold().run();
  };
  const setItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };
  const setUnderline = () => {
    // From dric: I installed underline
    editor?.chain().focus().toggleUnderline().run();
  };
  const setStrike = () => {
    editor?.chain().focus().toggleStrike().run();
  };
  const setCode = () => {
    editor?.chain().focus().toggleCode().run();
  };

  //TODO: add possibilty to set link input popup
  const setLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  return (
    <div className="flex flex-row items-center gap-x-2">
      <button type="button" className={editor.isActive("bold") ? "text-white" : "text-white/50 hover:text-white"} onClick={setBold}>
        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.25 12.5V20.8333H14.6875C16.9312 20.8333 18.75 18.9679 18.75 16.6667C18.75 14.3655 16.9312 12.5 14.6875 12.5H6.25ZM6.25 12.5H13.4375C15.6812 12.5 17.5 10.6345 17.5 8.33334C17.5 6.03215 15.6812 4.16667 13.4375 4.16667H6.25V12.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button type="button" className={editor.isActive("italic") ? "text-white" : "text-white/50 hover:text-white"} onClick={setItalic}>
        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.9925 19.7917L15.0495 5.20833M10.9925 19.7917H6.771M10.9925 19.7917H15.2139M15.0495 5.20833H10.8281M15.0495 5.20833H19.271"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className={editor.isActive("underline") ? "px-[3px] text-white" : "px-[3px] text-white/50 hover:text-white"}
        onClick={setUnderline}
      >
        <svg width="14" height="14" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.8332 17.8333H1.1665M15.4522 2.35715V8.30953C15.4522 11.5969 12.7872 14.2619 9.49984 14.2619C6.21243 14.2619 3.54746 11.5969 3.54746 8.30953V2.35715M1.76174 1.16667H5.33317M13.6665 1.16667L17.2379 1.16667"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button type="button" className={editor.isActive("strike") ? "text-white" : "text-white/50 hover:text-white"} onClick={setStrike}>
        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.1665 12.5H11.2494L15.3215 12.5M15.3215 12.5C17.9295 12.5 20.0433 14.5987 20.0433 17.1875C20.0433 19.7763 17.929 21.875 15.321 21.875H12.4307C9.57495 21.875 7.1928 19.862 6.64575 17.1875M15.3215 12.5L21.8748 12.5M20.0429 8.98438C20.0429 5.74833 17.4002 3.125 14.1402 3.125H11.2498C8.64183 3.125 6.52762 5.22366 6.52762 7.8125V8.98438"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button type="button" className={editor.isActive("link") ? "text-white" : "text-white/50 hover:text-white"} onClick={setLink}>
        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.68589 10.6151L5.35937 12.9417C4.49048 13.8105 3.99081 14.9928 3.99995 16.2353C4.00908 17.4778 4.49781 18.6673 5.40793 19.5493C6.28989 20.4595 7.47961 20.9482 8.72192 20.9573C9.99257 20.9666 11.1468 20.4951 12.0158 19.6262L14.3423 17.2997M17.314 14.3848L19.6405 12.0583C20.5094 11.1894 21.0091 10.0072 20.9999 8.76468C20.9908 7.52216 20.5021 6.3327 19.5919 5.45069C18.7102 4.56893 17.5207 4.08017 16.2782 4.07104C15.0356 4.06191 13.8532 4.53321 12.9843 5.40213L10.6578 7.72864M8.97192 15.9658L15.9515 8.98625"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button type="button" className={editor.isActive("code") ? "text-white" : "text-white/50 hover:text-white"} onClick={setCode}>
        <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.25 18.4375L13.75 6.5625M6.25 16.5625L2.5 12.8125L6.25 9.0625M18.75 9.0625L22.5 12.8125L18.75 16.5625"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
