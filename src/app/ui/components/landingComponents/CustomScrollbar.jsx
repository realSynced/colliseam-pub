import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const CustomScrollbar = () => {
  const { scrollYProgress } = useScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  const [hideScrollbar, setHideScrollbar] = useState(false);

  // Transform the scroll progress to the top position of the thumb
  const thumbTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const thumbTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  useEffect(() => {
    let hideTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      setHideScrollbar(false);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      hideTimeout = setTimeout(() => {
        setHideScrollbar(true);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <motion.div
      className="fixed right-3 top-1/2 z-[999] h-[35vh] w-1 -translate-y-1/2 rounded-lg bg-blackLight xl:w-2 2xl:right-4 3xl:right-5 3xl:w-3 4xl:w-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: hideScrollbar ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="absolute left-0 h-8 w-full rounded-lg bg-primary ease-out xl:h-12 2xl:h-16 3xl:h-20 4xl:h-24"
        style={{ top: thumbTop, translateY: thumbTranslate }}
      />
    </motion.div>
  );
};

export default CustomScrollbar;
