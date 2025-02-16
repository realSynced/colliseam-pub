import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { EmojiIcon } from "./MessagesIcons";
import { motion, AnimatePresence } from "framer-motion";

const EmojiPicker = ({ inputRef, emojiSize = 24, emojiButtonSize = 36, showPicker, setShowPicker, newMessage, setNewMessage }) => {
  function addEmojiToInput(emoji) {
    if (inputRef && inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart ?? newMessage.message.length;
      const end = input.selectionEnd ?? newMessage.message.length;
      const text = newMessage.message;

      // Insert the emoji at the cursor position
      const updatedText = text.slice(0, start) + emoji.native + text.slice(end);

      // Update the state with the new message
      setNewMessage((prevMessages) => ({
        ...prevMessages,
        message: updatedText,
      }));

      // Set the cursor position after the newly added emoji
      input.focus();
      input.setSelectionRange(start + emoji.native.length, start + emoji.native.length);
    } else {
      // If input is not focused, add emoji at the end
      setNewMessage((prevMessages) => ({
        ...prevMessages,
        message: prevMessages.message + emoji.native,
      }));
    }
  }

  const variants = {
    hidden: { opacity: 0, y: 20 }, // Fade up
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }, // Fade down
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={`box-content rounded-full p-1 hover:bg-blackLighter hover:opacity-100 ${showPicker ? "opacity-100" : "opacity-75"}`}
      >
        <EmojiIcon />
      </button>
      <AnimatePresence>
        {showPicker && (
          <motion.div
            className="absolute bottom-0 right-8"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.1, ease: "easeInOut" }} // Quick transition
          >
            <Picker
              onClickOutside={() => setShowPicker(false)}
              emojiButtonSize={emojiButtonSize}
              emojiSize={emojiSize}
              previewPosition={"none"}
              data={data}
              onEmojiSelect={(emoji) => addEmojiToInput(emoji)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiPicker;
