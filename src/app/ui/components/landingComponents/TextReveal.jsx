import { useRef } from "react";
import { useScroll, motion, useTransform, useSpring } from "framer-motion";

const TextReveal = ({ message }) => {
  const paraRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: paraRef,
    offset: ["start 0.95", "center center"],
  });

  let words = message.split(" ");

  return (
    <section className="font-futura flex h-[105vh] items-center justify-center text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
      <div className="relative">
        <p ref={paraRef} className="z-2 mx-auto flex w-[65vw] flex-wrap justify-center">
          {words.map((word, i) => {
            let start = i / words.length;
            let end = start + 1 / words.length;

            return (
              <Word key={i} range={[start, end]} progress={scrollYProgress}>
                {word}
              </Word>
            );
          })}
        </p>
        <p className="absolute left-0 top-0 mx-auto flex w-[65vw] flex-wrap justify-center">
          {words.map((word, i) => {
            return <Word key={i}>{word}</Word>;
          })}
        </p>
      </div>
    </section>
  );
};

const Word = ({ children, progress, range }) => {
  let opacity;
  if (range) {
    const opacityTransform = useTransform(progress, range, [0, 1]);
    opacity = useSpring(opacityTransform, {
      stiffness: 100,
      damping: 10,
    });
  }

  return (
    <motion.span style={range ? { opacity: opacity } : { opacity: "0.2" }} className="mr-2">
      {children}
    </motion.span>
  );
};

export default TextReveal;
