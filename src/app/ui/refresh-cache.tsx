"use client";
import { useInterval } from "interval-hooks";
import { useEffect, useState } from "react";
export default function RefreshCache({ check, recurr = false }: { check: () => Promise<void>; recurr?: boolean }) {
  //   const [shouldRun, setShouldRun] = useState(true);
  //   useEffect(() => {
  //     if (recurr === false) {
  //       const onFocus = () => check();
  //       window.addEventListener("focus", onFocus);
  //       return () => window.removeEventListener("focus", onFocus);
  //     } else {
  //       const onFocus = () => setShouldRun(true);
  //       const onBlur = () => setShouldRun(false);

  //       window.addEventListener("focus", onFocus);
  //       window.addEventListener("blur", onBlur);

  //       return () => {
  //         window.removeEventListener("focus", onFocus);
  //         window.removeEventListener("blur", onBlur);
  //       };
  //     }
  //   });
  //   useInterval(check, shouldRun === true && recurr === true ? 1000 : null);

  return null;
}
