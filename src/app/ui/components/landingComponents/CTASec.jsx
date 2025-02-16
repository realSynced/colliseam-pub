import { useLenis } from "@studio-freight/react-lenis";

import Link from "next/link";
import SpecialButton from "./SpecialButton";
import { FaArrowUp } from "react-icons/fa";

const CTASec = () => {
  const lenis = useLenis();

  return (
    <section className="mx-auto flex h-screen flex-col items-center justify-center gap-8 xl:gap-12 2xl:gap-16">
      <h1 className="font-head whitespace-nowrap text-center text-3xl font-extrabold leading-tight xl:text-4xl 2xl:text-5xl 3xl:text-7xl 4xl:text-8xl">
        Why Wait? Join Nexus <span className="gra-blueToCyan">Today!</span>
      </h1>

      <p className="text-pretty text-center text-xl text-white/75 xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
        Nexus isn’t just another platform—it’s the key to unlocking your creative <br />
        potential and turning ideas into reality.
      </p>

      <div className="flex justify-center gap-4 font-bold">
        <Link href="/accounts/login">
          <SpecialButton>Join Now</SpecialButton>
        </Link>
        <div onClick={() => lenis.scrollTo(0)}>
          <SpecialButton darkBtn>Back To Top <FaArrowUp/> </SpecialButton>
        </div>
      </div>
    </section>
  );
};

export default CTASec;
