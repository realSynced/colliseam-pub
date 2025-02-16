"use client";

// Next/React
import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import Image from "next/image";

// Components/Sections/Functions
import NavbarLanding from "./ui/components/landingComponents/NavbarLanding";
import HeroText from "./ui/components/landingComponents/HeroText";
import FloatingShapes from "./ui/components/landingComponents/FloatingShapes";
import SlideshowSec from "./ui/components/landingComponents/SlideshowSec";
import CommunitySec from "./ui/components/landingComponents/CommunitySec";
import FeatureSec from "./ui/components/landingComponents/FeatureSec";
import CTASec from "./ui/components/landingComponents/CTASec";
import TextReveal from "./ui/components/landingComponents/TextReveal";
import Footer from "./ui/components/landingComponents/Footer";
import CustomScrollbar from "./ui/components/landingComponents/CustomScrollbar";
import SectionTitle from "./ui/components/landingComponents/SectionTitle";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

// Images/Icons
import { BiPlus, BiArrowBack } from "react-icons/bi";

import Chat from "../../public/icons/landing-chat.svg";
import Workflow from "../../public/icons/landing-workflow.svg";
import Sync from "../../public/icons/landing-sync.svg";

import CollaboratePic from "../../public/images/community.jpg";
import UserDefaultPic from "../../public/images/default-jobs.jpg";
import AboutUsPic from "../../public/images/AboutUsPic.png";

// Animations/Libraries
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Loader } from "@react-three/drei";

import useEmblaCarousel from "embla-carousel-react";
import SmoothScroll from "@/app/ui/components/landingComponents/SmoothScroll";

export default function Home() {
  //embla Slider
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  useEffect(() => {
    document.body.classList.add("no-scrollbar");
  }, []);

  const [isActive, setIsActive] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const previousState = useRef(isActive);
  const headingRef = useRef(null);

  useEffect(() => {
    if (previousState.current === true && isActive === false) {
      setShowContent(true);
    }
    previousState.current = isActive;
  }, [isActive]);

  return (
    <SmoothScroll>
      <Leva hidden collapsed={true} flat={true} />
      <CustomScrollbar />

      {/* Transition Cover */}
      {!showContent && (
        <div className="fixed left-0 top-0 z-[500] flex h-screen w-full items-center justify-center bg-black">
          <h1 ref={headingRef} className="font-head text-5xl text-white">
            Loading 0%
          </h1>
        </div>
      )}

      <main className="font-futura relative bg-black text-white">
        <div id="home" className="absolute left-0 top-0 h-screen w-full">
          <Canvas camera={{ position: [0, 0, 2.5], fov: 35 }}>
            <Suspense fallback={null}>
              <FloatingShapes />
            </Suspense>
          </Canvas>
        </div>
        <Loader
          dataInterpolation={(p) => `Loading ${Math.round(p)}%`}
          initialState={(active) => {
            setIsActive(active);
          }}
          dataStyles={{ fontFamily: "Blinker", fontSize: "3rem", marginTop: "0px" }}
          barStyles={{ position: "fixed", height: "10px", top: "0px", left: "0px", width: "100vw" }}
          innerStyles={{
            height: "100vh",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            background: "#111",
          }}
          containerStyles={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            background: "#111",
          }}
        />

        <NavbarLanding />
        <HeroText />

        {/* Slideshow */}
        <SlideshowSec />

        <TextReveal
          message={`Imagine a place where creativity meets technology, where finding the perfect project partner is just a few clicks away. Colliseam is that place-a platform built for designers and developers who are passionate about bringing ideas to life.`}
        />

        <CommunitySec />
        <FeatureSec />

        {/* Collaborate Section */}
        <section className="flex h-screen flex-col justify-between pt-[8vh]">
          <SectionTitle sectionName={"Collaborate"} heading={"Collaborate with Ease"} subHeading={"Work Together, Smarter"} />

          <div className="flex w-[95vw] items-center justify-between">
            <div className="flex w-1/2 flex-col justify-center self-end overflow-hidden">
              <Image src={CollaboratePic} alt="collabSectionPic" className="w-full" />
            </div>

            <div className="w-[45%]">
              <h1 className="font-futura mb-10 text-lg text-white/90 xl:text-xl 2xl:mb-12 2xl:text-2xl 3xl:mb-16 3xl:text-3xl 4xl:mb-24 4xl:text-4xl">
                Once you find the perfect project, it's time to get to work-and Nexus makes collaboration effortless
              </h1>

              <Accordion className="p-0" variant="splitted">
                {[
                  {
                    title: "Organize Your Workflow",
                    content: `Our dashboard is designed to keep your project on track. Assign tasks, set deadlines, and monitor progress with a system that’s as flexible as it is powerful. No more missed deadlines or unclear responsibilities—everyone knows exactly what they need to do.`,
                    image: Workflow,
                  },
                  {
                    title: "Real-Time Communication",
                    content: `Nexus includes an integrated chat system that allows you to communicate with your team members instantly. Share ideas, ask questions, and collaborate without the hassle of switching between multiple platforms.`,
                    image: Chat,
                  },
                  {
                    title: "Stay in Sync",
                    content: `With all project details in one place, you’ll always be in the loop. Whether you’re managing a project or contributing to one, Nexus keeps everyone aligned and working towards a common goal.`,
                    image: Sync,
                  },
                ].map(({ title, content, image }) => (
                  <AccordionItem
                    key={title}
                    aria-label={title}
                    title={title}
                    indicator={<BiPlus className="size-5 rotate-180 xl:size-6 2xl:size-7 3xl:size-8 4xl:size-9" />}
                    startContent={<Image src={image} className="size-6 xl:size-7 2xl:size-8 3xl:size-9 4xl:size-10" alt={`${title}'s icon`} />}
                    className="my-2 rounded-xl border border-white/10 bg-[#151515] py-3 text-xs xl:text-sm 2xl:text-lg 3xl:text-xl 4xl:text-4xl"
                    classNames={{
                      content: "p-0 pt-3 opacity-80",
                      trigger: "p-0",
                      heading: "xl:text-base text-sm 2xl:text-lg 3xl:text-2xl 4xl:text-3xl",
                      indicator: "data-[open=true]:rotate-45  duration-300 rtl:data-[open=true]:rotate-45",
                    }}
                  >
                    {content}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section id="testimonial" className="flex h-screen flex-col items-center justify-center bg-[#151515]">
          <SectionTitle sectionName={"Testimonial"} heading={"What Our Users Say"} subHeading={"Join Thousands Who Trust Nexus"} />

          <div className="mx-auto flex w-[90vw] items-center justify-center">
            <button className="embla__prev rounded-full bg-blackLight p-4" onClick={scrollPrev}>
              <BiArrowBack className="size-4 xl:size-5 2xl:size-7 3xl:size-10 4xl:size-12" />
            </button>

            <main className="flex w-full flex-col items-center gap-8">
              <div
                className="embla flex w-full cursor-grab pt-12"
                onPointerUp={(e) => e.target.classList.remove("!cursor-grabbing")}
                onPointerDown={(e) => e.target.classList.add("!cursor-grabbing")}
                ref={emblaRef}
              >
                <div className="embla__container">
                  {[
                    {
                      message: `Nexus made it so much easier to find the right projects and collaborate effectively. The project discovery feature connected me with the perfect developer for my skills. The integrated dashboard and chat system kept everything organized, making collaboration smooth and efficient.`,
                      image: UserDefaultPic,
                      name: "Sarah L.",
                      job: "UX Designer",
                    },
                    {
                      message: `As a developer, Nexus helped me quickly find talented designers to collaborate with. The dashboard made task management straightforward, and the chat feature ensured we stayed aligned throughout the project. Nexus has streamlined the way I work with others.`,
                      image: UserDefaultPic,
                      name: "John M.",
                      job: "Full-Stack Developer",
                    },
                    {
                      message: `The Nexus community is incredibly supportive. Whenever I have coding issues or need advice, I can easily find help through the feed and tagging system. Nexus has not only been a tool but also a network where I’ve learned and grown as a developer.`,
                      image: UserDefaultPic,
                      name: "Emily R.",
                      job: "Front-End Developer",
                    },
                    {
                      message: `Nexus offers everything I need for successful project management in one place. From finding collaborators to staying organized, the platform is seamless. The dashboard keeps my projects on track, and the chat function is ideal for quick updates. Nexus has significantly improved my workflow.`,
                      image: UserDefaultPic,
                      name: "Michael T.",
                      job: "Graphic Designer",
                    },
                  ].map(({ message, image, name, job }, i) => (
                    <div key={i} className="embla__slide flex select-none flex-col items-center gap-8">
                      <p className="relative w-[60vw] text-center text-lg font-semibold leading-relaxed xl:text-xl 2xl:text-2xl 3xl:text-3xl">
                        {message}
                        <span className="absolute -left-12 -top-10 block h-full rotate-[16deg] text-7xl font-extrabold text-primary 2xl:-left-16 2xl:-top-16 2xl:text-[100px]">
                          "
                        </span>
                        <span className="absolute -bottom-10 -right-12 block h-full rotate-[16deg] text-7xl font-extrabold text-primary 2xl:-bottom-16 2xl:-right-16 2xl:text-[100px]">
                          "
                        </span>
                      </p>

                      <div className="flex items-center gap-3">
                        <Image src={image} className="size-12 rounded-full 2xl:size-14 3xl:size-20 4xl:size-24" alt={`${name}'s avatar`} />
                        <div className="flex flex-col gap-0">
                          <h2 className="text-base font-medium leading-snug xl:text-lg 2xl:text-xl 3xl:text-3xl 4xl:text-4xl">{name}</h2>
                          <p className="text-sm font-semibold text-white/70 2xl:text-base 3xl:text-xl 4xl:text-2xl">{job}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 2xl:gap-3 3xl:gap-4">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={`size-2 rounded-full duration-300 xl:size-[10px] 2xl:size-3 3xl:size-4 4xl:size-5 ${selectedIndex === index ? "w-3 bg-primary 2xl:w-6 3xl:w-8 4xl:w-12" : "bg-white"}`}
                  />
                ))}
              </div>
            </main>

            <button className="embla__next rounded-full bg-blackLight p-4" onClick={scrollNext}>
              <BiArrowBack className="size-4 rotate-180 xl:size-5 2xl:size-7 3xl:size-10 4xl:size-12" />
            </button>
          </div>
        </section>

        {/* About Us Section */}
        <section id="aboutus" className="flex h-screen flex-col justify-between bg-black pt-[8vh]">
          <SectionTitle sectionName={"About Us"} heading={"Discover the Vision Behind Nexus"} subHeading={"Our Values"} />

          <div className="flex w-full">
            <div className="min-h-96 w-2/6">
              <Accordion variant="splitted" className="h-full place-content-between">
                {[
                  {
                    title: `Collaboration`,
                    message: `We believe in the power of working together. By connecting designers and developers, Nexus fosters collaboration that leads to innovative and impactful projects.`,
                  },
                  {
                    title: `Innovation`,
                    message: `We encourage creativity and forward-thinking. Nexus is a platform where new ideas are born and nurtured, pushing the boundaries of what’s possible.`,
                  },
                  {
                    title: `Community`,
                    message: `Our strength lies in our community. We are committed to building an inclusive and supportive environment where everyone can contribute, learn, and grow together.`,
                  },
                ].map(({ title, message }, i) => (
                  <AccordionItem
                    key={title}
                    aria-label={`Accordion ${i}`}
                    indicator={<BiPlus className="size-5 xl:size-6" />}
                    title={title}
                    className={`${i === 1 ? "!place-self-center" : ""} my-1 w-fit max-w-64 place-self-end rounded-xl border border-white/10 bg-[#151515] py-3 text-xs text-white duration-300 xl:text-sm 2xl:text-lg 3xl:text-xl 4xl:text-4xl`}
                    classNames={{
                      content: "p-0 pt-3 opacity-80",
                      trigger: "p-0",
                      heading: "xl:text-base text-sm 2xl:text-lg 3xl:text-2xl 4xl:text-3xl",
                      indicator: "data-[open=true]:rotate-45  duration-300 rtl:data-[open=true]:rotate-45",
                    }}
                  >
                    {message}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="flex min-h-96 w-2/6 flex-col place-content-center">
              <Image
                draggable="false"
                src={AboutUsPic}
                alt="about us pic"
                width={"18rem"}
                height={"18rem"}
                className="pointer-events-none select-none place-self-center"
              />
            </div>

            <div className="min-h-96 w-2/6">
              <Accordion variant="splitted" className="h-full place-content-between">
                {[
                  {
                    title: `Learning`,
                    message: `We prioritize continuous learning and development. Nexus offers opportunities for both seasoned professionals and those just starting out to expand their skills and knowledge through real-world projects.`,
                  },
                  {
                    title: `Integrity`,
                    message: `We operate with transparency and honesty. At Nexus, we are committed to creating a trustworthy platform where users can collaborate with confidence.`,
                  },
                  {
                    title: `Excellence`,
                    message: `We strive for excellence in everything we do. From the quality of our platform to the success of the projects completed, we are dedicated to achieving the highest standards.`,
                  },
                ].map(({ title, message }, i) => (
                  <AccordionItem
                    key={title}
                    aria-label={`Accordion ${i}`}
                    indicator={<BiPlus className="size-5 2xl:size-6" />}
                    title={title}
                    className={`${i === 1 ? "place-self-center" : ""} my-1 w-fit max-w-64 rounded-xl border border-white/10 bg-[#151515] py-3 text-xs text-white duration-300 xl:text-sm 2xl:text-lg 3xl:text-xl 4xl:text-4xl`}
                    classNames={{
                      content: "p-0 pt-3 opacity-80",
                      trigger: "p-0",
                      heading: "xl:text-base text-sm 2xl:text-lg 3xl:text-2xl 4xl:text-3xl",
                      indicator: "data-[open=true]:rotate-45  duration-300 rtl:data-[open=true]:rotate-45",
                    }}
                  >
                    {message}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <TextReveal
          message={`Behind Nexus is a team of developers, designers, who are passionate about creating a platform that truly serves its users. We’re here to support you every step of the way, whether you’re looking for your next project, seeking advice, or ready to collaborate with others.`}
        />

        <CTASec />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

const useDotButton = (emblaApi) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback(
    (index) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

const DotButton = (props) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};
