import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, AnimatePresence, useMotionValue } from "framer-motion";
import Image from "next/image";

import Slide1 from "../../../../../public/images/slide1.webp";
import Slide2 from "../../../../../public/images/slide2.webp";
import Slide3 from "../../../../../public/images/slide3.webp";
import Slide4 from "../../../../../public/images/slide1.webp";
import Slide5 from "../../../../../public/images/slide2.webp";

import Home from "../../../../../public/icons/home-home.svg";
import HomeFilled from "../../../../../public/icons/home-homeFilled.svg";
import Globe from "../../../../../public/icons/home-explore.svg";
import GlobeFilled from "../../../../../public/icons/home-exploreFilled.svg";
import Project from "../../../../../public/icons/home-Project.svg";
import ProjectFilled from "../../../../../public/icons/home-ProjectFilled.svg";
import Messages from "../../../../../public/icons/home-messages.svg";
import MessagesFilled from "../../../../../public/icons/home-messagesFilled.svg";
import Bell from "../../../../../public/icons/home-bell.svg";
import BellFilled from "../../../../../public/icons/home-bellFilled.svg";

const images = [Slide1, Slide2, Slide3, Slide4, Slide5];

const icons = {
  Home: { default: Home, filled: HomeFilled, text: "Home" },
  Explore: { default: Globe, filled: GlobeFilled, text: "Explore" },
  Project: { default: Project, filled: ProjectFilled, text: "Project" },
  Messages: { default: Messages, filled: MessagesFilled, text: "Messages" },
  Notification: { default: Bell, filled: BellFilled, text: "Notification" },
};

let timeBeforeSlideChange = 5500;

const SlideshowSec = () => {
  const slideShowContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: slideShowContainerRef, offset: ["start 80%", "end end"] });
  const width = useTransform(scrollYProgress, [0, 1], ["60%", "90%"]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const elapsedTime = useMotionValue(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
      elapsedTime.set(0);
    }, timeBeforeSlideChange);

    const timeInterval = setInterval(() => {
      elapsedTime.set(elapsedTime.get() + 100);
    }, 100);

    setIntervalId(slideInterval);

    return () => {
      clearInterval(slideInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const timerWidth = useTransform(elapsedTime, [0, timeBeforeSlideChange], ["0%", "100%"]);

  const handleButtonClick = (index) => {
    if (isTransitioning || index === currentSlideIndex) return;

    setIsTransitioning(true);
    setCurrentSlideIndex(index);
    if (intervalId) {
      clearInterval(intervalId);
    }
    elapsedTime.set(0);

    const newIntervalId = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
      elapsedTime.set(0);
    }, timeBeforeSlideChange);
    setIntervalId(newIntervalId);
  };

  return (
    <section className="min-h-screen">
      <motion.div
        ref={slideShowContainerRef}
        style={{ width: width }}
        className="relative mx-auto h-[85vh] w-[70%] overflow-hidden rounded-3xl bg-blackLight ease-out"
      >
        {/* Timer Slider */}
        <div className="absolute bottom-4 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-xl bg-blackLight xl:h-2 xl:w-36 2xl:w-40">
          <motion.span style={{ width: timerWidth }} className="block h-full rounded-xl bg-primary duration-100" />
        </div>

        <AnimatePresence initial={false}>
          {images.map(
            (image, index) =>
              index === currentSlideIndex && (
                <motion.div
                  key={index}
                  initial={{ height: "0%", scale: 1.25 }}
                  animate={{ height: "100%", scale: 1 }}
                  exit={{ scale: 1.25, y: "-20vh" }}
                  transition={{ duration: 0.8, ease: [0.79, 0.14, 0.15, 0.86] }}
                  className="absolute bottom-0 left-0 z-10 w-full overflow-hidden"
                  onAnimationComplete={() => setIsTransitioning(false)} // Set transition to false after animation completes
                >
                  <Image src={image} className="h-full w-full object-cover object-left-top" alt={`SlideshowPic-${index}`} />
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </motion.div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-center gap-6 text-white 2xl:mt-8 2xl:gap-8 4xl:mt-12">
        {Object.entries(icons).map(([key, { default: iconDefault, filled: iconFilled, text }], index) => (
          <button
            key={key}
            onClick={() => handleButtonClick(index)}
            className={`button slideBtn flex items-center gap-2 bg-blackLight 2xl:gap-3 4xl:gap-4 ${index === currentSlideIndex ? "active" : ""}`}
            disabled={isTransitioning || index === currentSlideIndex}
          >
            <Image
              src={index === currentSlideIndex ? iconFilled : iconDefault}
              alt={`${key} Icon`}
              className="size-5 xl:size-6 2xl:size-7 3xl:size-9 4xl:size-11"
            />
            <h2 className="text-xs xl:text-sm 2xl:text-lg 3xl:text-2xl">{text}</h2>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SlideshowSec;
