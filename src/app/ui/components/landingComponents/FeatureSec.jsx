import Image from "next/image";

import SectionTitle from "./SectionTitle";

import ProjectManagement from "../../../../../public/images/Project-Management.png";
import Clock from "../../../../../public/images/Clock.png";
import Goal from "../../../../../public/images/Goal.png";

const FeatureSec = () => {
  return (
    <section className="flex h-screen flex-col bg-[#151515] pt-[8vh]">
      <SectionTitle sectionName={"Projects"} heading={"Seamless Project Discovery"} subHeading={"Find Your Next Big Project"} />

      <div className="flex flex-grow items-center justify-center">
        <div className="mx-auto grid w-[90vw] grid-cols-3 gap-16 xl:gap-20 2xl:gap-24">
          {[
            {
              title: "Tailored to Your Interests",
              content: "Nexus curates projects that align with your interests, ensuring you always find something that excites you.",
              image: ProjectManagement,
            },
            {
              title: "Flexible Opportunities",
              content: "From small, passion-driven endeavors to large-scale collaborations, Nexus offers projects that suit your needs.",
              image: Goal,
            },
            {
              title: "Get Started Quickly",
              content: "You can quickly browse through available projects, view details, and join the ones that resonate with you.",
              image: Clock,
            },
          ].map(({ title, content, image }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-[#cedeff] xl:size-16 2xl:size-20 3xl:size-28 4xl:size-32">
                <Image src={image} className="w-3/5" alt={title + " Icon"} />
              </div>
              <h1 className="font-head my-4 whitespace-nowrap font-bold text-primary lg:text-xl xl:my-6 xl:text-2xl 2xl:my-8 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
                {title}
              </h1>
              <p className="text-pretty text-base font-semibold leading-normal text-white/75 xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">
                {content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSec;
