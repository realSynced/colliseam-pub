import Image from "next/image";

import CommunitySectionPic from "../../../../../public/images/community.jpg";
import SectionTitle from "./SectionTitle";

import SpecialButton from "./SpecialButton";

const CommunitySec = () => {
  return (
    <section id="features" className="flex h-screen flex-col justify-between overflow-hidden pt-[8vh]">
      <SectionTitle sectionName={"Community"} heading={"Engage with the Community"} subHeading={"Share, Learn & Grow"} />

      <div className="flex items-center justify-between">
        <div className="ml-[5vw] w-2/5">
          <h3 className="font-head text-2xl font-semibold xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl">Join the Conversation</h3>
          <p className="my-8 text-base text-white/75 xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">
            Navigate our feed with ease using a robust tag system. Tags ensure your question and contributions reach the right audience. Whether
            you're seeking advice or sharing knowledge, Colliseam makes it easy.
          </p>
          <SpecialButton>Start Posting</SpecialButton>
        </div>
        <div className="w-2/4 self-end overflow-hidden 2xl:translate-y-8">
          <Image src={CommunitySectionPic} alt="3dlaptop" className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default CommunitySec;
