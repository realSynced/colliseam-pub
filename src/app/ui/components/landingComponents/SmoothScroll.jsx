"use client";
import { useState, useEffect } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { usePathname } from "next/navigation";

export default function SmoothScroll({ children }) {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  const enableScroll = ["/"];

  useEffect(() => {
    if (enableScroll.includes(pathname)) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pathname]);

  return (
    <>
      {visible === true ? (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
          {children}
        </ReactLenis>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
