"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidenav() {
  const pathname = usePathname();

  const links = {
    "User Settings": [
      {
        name: "My Account",
        href: "/accounts/settings/myaccount",
        disabled: false,
      },
      {
        name: "Profile",
        href: "/accounts/settings/profile",
        disabled: false,
      },
    ],
    "App Settings": [
      {
        name: "Appearance",
        href: "/accounts/settings/appearance",
        disabled: true,
      },
      {
        name: "Accessibility",
        href: "/accounts/settings/accessibility",
        disabled: true,
      },
      {
        name: "Language",
        href: "/accounts/settings/language",
        disabled: true,
      },
    ],
    "Privacy & Activity": [
      {
        name: "Data",
        href: "/accounts/settings/data",
        disabled: true,
      },
      {
        name: "Activity Privacy",
        href: "/accounts/settings/activityprivacy",
        disabled: true,
      },
    ],
  };

  return (
    <aside className="w-80 border-r border-blackLight">
      <nav className="border-b border-blackLight p-5">
        <Link href="/">
          <button className="flex items-center gap-2 pl-3 text-lg font-bold">
            <svg width="16" height="16" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-white">
              <path d="M8.66667 16L2 9M2 9L8.66667 2M2 9H18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </Link>
      </nav>

      <div className="p-5">
        {Object.keys(links).map((category) => (
          <div key={category} className="mb-7">
            <h3 className="mb-2 px-3 text-sm font-semibold text-white/75">{category}</h3>

            <div className="flex flex-col gap-2">
              {links[category].map((link) => {
                const isActive = pathname === link.href;

                return link.disabled ? (
                  <div
                    key={link.name}
                    className={`block w-full cursor-not-allowed rounded-xl p-3 text-base font-bold duration-200 ${isActive ? "bg-[#2b2b2b]" : "hover:bg-blackLight"}`}
                  >
                    {link.name} {/* Disabled look */}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    disabled={link.disabled}
                    href={link.href}
                    className={`block w-full rounded-xl p-3 text-base font-bold duration-200 ${link.disabled ? "cursor-not-allowed" : ""} ${isActive ? "bg-[#2b2b2b]" : "hover:bg-blackLight"}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <form action="/auth/signout" method="post" className="text-danger">
          <button className="flex w-full items-center gap-2 rounded-xl p-3 font-bold duration-200 hover:bg-blackLight" type="submit">
            <svg width="23" height="22" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 stroke-danger">
              <path
                d="M13.3909 5.8001V3.7001C13.3909 3.14314 13.1591 2.609 12.7465 2.21517C12.334 1.82135 11.7744 1.6001 11.191 1.6001H3.49139C2.90794 1.6001 2.34839 1.82135 1.93584 2.21517C1.52328 2.609 1.2915 3.14314 1.2915 3.7001V16.3001C1.2915 16.8571 1.52328 17.3912 1.93584 17.785C2.34839 18.1788 2.90794 18.4001 3.49139 18.4001H11.191C11.7744 18.4001 12.334 18.1788 12.7465 17.785C13.1591 17.3912 13.3909 16.8571 13.3909 16.3001V14.2001M6.79122 10.0001H19.9905M19.9905 10.0001L16.6907 6.8501M19.9905 10.0001L16.6907 13.1501"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
