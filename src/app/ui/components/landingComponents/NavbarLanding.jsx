'use client'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../../../../public/nexusbrand/newLogo.png";
import SpecialButton from "./SpecialButton";

import { useLenis } from "@studio-freight/react-lenis";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const NavbarLanding = () => {
  const lenis = useLenis();

  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    let prevVal = scrollY.getPrevious();
    if (latest > prevVal && latest > 150) {
      setHidden(true);
    } else setHidden(false);
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0, top: 12, x: "-50%" },
        hidden: { y: "-100%", top: 0, x: "-50%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "linear" }}
      className={`fixed left-1/2 top-3 z-[200] -translate-x-1/2 duration-300`}
    >
      <nav className="flex w-[62vw] items-center justify-between rounded-full bg-[#222]/50 p-2 pl-3 shadow-2xl backdrop-blur-lg duration-300 xl:w-[58vw] xl:p-3 xl:pl-5">
        <Image className="h-[30px] w-auto 2xl:h-[35px] 3xl:h-12" src={Logo} alt="logo" />
        <ul className="flex gap-8 text-xs xl:text-base 2xl:text-lg 3xl:text-xl">
          {["Home", "Features", "Testimonial", "About Us", "Contact"].map((link) => (
            <li
              key={link}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                lenis.scrollTo("#" + link.replace(/\s+/g, "").toLowerCase());
              }}
            >
              {link}
            </li>
          ))}
        </ul>
        <Link href="/accounts/signup">
          <SpecialButton>Register</SpecialButton>
        </Link>
      </nav>
    </motion.div>
  );
};

export default NavbarLanding;
