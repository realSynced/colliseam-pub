import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import SpecialButton from "./SpecialButton";

const HeroText = () => {
  return (
    <header className="pointer-events-none relative flex min-h-[90vh] select-none items-center justify-center">
      <div className="relative mt-24 flex w-[60%] flex-col items-center text-center">
        <h1 className="font-head whitespace-nowrap text-5xl font-extrabold leading-tight xl:text-6xl 2xl:text-7xl 3xl:text-8xl">
          A Place Where<span className="gra-blueToCyan"> Developers</span>
          <br /> and <span className="gra-blueToCyan">Designers</span> Unite
        </h1>
        <p className="my-10 text-lg font-semibold text-white/75 xl:text-xl 2xl:text-2xl 3xl:text-4xl">
          Find Projects, Share Knowledge, and <br /> Get Answers to Your Questions
        </p>
        <Link href="/accounts/login" className="pointer-events-auto">
          <SpecialButton>
            Get Started <BiArrowBack className="size-4 rotate-180 stroke-1" />
          </SpecialButton>
        </Link>
      </div>
    </header>
  );
};

export default HeroText;
