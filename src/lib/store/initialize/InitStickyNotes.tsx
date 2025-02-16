"use client";

import { useStickyNotes, StickyNote } from "../stickynotes";
import React, { useEffect, useRef } from "react";

export default function InitStickyNotes({ StickyNotes }: { StickyNotes: StickyNote[] }) {
  const initState = useRef(false);
  useEffect(() => {
    if (!initState.current) {
      useStickyNotes.setState({ notes: StickyNotes });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  return <></>;
}
