import Image from "next/image";
import Link from "next/link";

import Logo from "../../../../../public/nexusbrand/newLogo.png";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import SpecialButton from "./SpecialButton";

const sections = [
  {
    title: "Contact",
    items: ["Sansevarino 95, Trento (TN)", "0123456789", "info@nexdev.org"],
    isLink: false,
  },
  {
    title: "Career",
    items: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "UI/UX Designer"],
    isLink: false,
  },
  {
    title: "Legal",
    items: ["Privacy Policy", "Terms of Service", "Terms of Use"],
    isLink: true,
  },
];

function Footer() {
  return (
    <>
      <footer id="contact" className="m-6 mb-0 rounded-[2rem] border border-white/10 bg-[#151515]">
        <div className="mx-auto flex w-[90vw] justify-between gap-32 py-10 xl:py-16">
          <div className="flex w-2/5 flex-col gap-8">
            <Image src={Logo} className="w-36 xl:w-40 2xl:w-44 3xl:w-52 4xl:w-60" alt="Colliseam Logo in Footer" />
            <p className="text-sm font-normal text-white/75 lg:text-base xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl">
              Colliseam is a platform that connects designers and developers to collaborate on innovative projects and grow together.
            </p>
            <Link href="/accounts/login">
              <SpecialButton>Contact Us</SpecialButton>
            </Link>
          </div>

          {
            <div className="flex w-1/2 flex-1 justify-between">
              {sections.map((section, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <h1 className="text-sm font-semibold text-white lg:text-base 2xl:text-lg 3xl:text-2xl 4xl:text-3xl">{section.title}</h1>
                  {section.items.map((item, i) =>
                    section.isLink ? (
                      <Link
                        key={i}
                        href={`/${item.toLowerCase().replace(/\s+/g, "")}`}
                        className="w-fit text-left text-[8px] font-normal text-white/50 transition-all ease-in-out hover:text-white/75 lg:text-xs 2xl:text-base 3xl:text-xl 4xl:text-2xl"
                      >
                        {item}
                      </Link>
                    ) : (
                      <button
                        key={i}
                        className="w-fit text-left text-[8px] font-normal text-white/50 transition-all ease-in-out hover:text-white/75 lg:text-xs 2xl:text-base 3xl:text-xl 4xl:text-2xl"
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              ))}
            </div>
          }
        </div>

        <div className="w-full border-t border-white/10"></div>

        <div className="mx-auto flex w-[90vw] items-center justify-between py-2 xl:py-4">
          <h2 className="font-semibold text-white lg:text-[10px] xl:text-xs 2xl:text-sm 3xl:text-xl 4xl:text-2xl">
            © 2025 Colliseam. All Rights Reserved.
          </h2>
          <div className="flex gap-4 xl:gap-8">
            {[FaFacebookF, FaLinkedinIn, FaTwitter].map((Icon, i) => (
              <div key={i} className="rounded-full border border-white/30 p-2 text-xs xl:p-3 xl:text-base 2xl:text-xl 3xl:text-3xl 4xl:text-4xl">
                <Icon />
              </div>
            ))}
          </div>
        </div>
      </footer>
      <div className="h-6"></div>
    </>
  );
}

export default Footer;
