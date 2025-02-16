import { motion } from "framer-motion";
import { useState } from "react";

const SpecialButton = ({ children, darkBtn = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`button group relative overflow-hidden ${darkBtn ? "bg-blackLight" : "bg-white"}`}
    >
      {/* Cover */}
      <motion.span
        initial={"hidden"}
        animate={!isHovered ? "hidden" : "show"}
        variants={{
          hidden: { scaleY: 0, scaleX: 0.2, borderTopLeftRadius: "999px", borderTopRightRadius: "999px" },
          show: { scaleY: 1.02, scaleX: 1.02, borderTopLeftRadius: "20px", borderTopRightRadius: "20px" },
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`absolute bottom-0 block h-full w-full origin-bottom bg-primary ${darkBtn ? "!bg-white" : ""}`}
      />

      {/* Text */}
      <div className="relative overflow-hidden">
        <motion.span
          animate={isHovered ? "hidden" : "show"}
          variants={{
            show: { y: "0%" },
            hidden: { y: "-100%" },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`flex items-center justify-center gap-2 text-black ${darkBtn ? "!text-white" : ""}`}
        >
          {children}
        </motion.span>

        <motion.span
          animate={!isHovered ? "hidden" : "show"}
          variants={{
            hidden: { y: "100%" },
            show: { y: "0%" },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute left-0 top-0 flex items-center justify-center gap-2 text-white ${darkBtn ? "!text-black" : ""}`}
        >
          {children}
        </motion.span>
      </div>
    </motion.button>
  );
};

export default SpecialButton;
