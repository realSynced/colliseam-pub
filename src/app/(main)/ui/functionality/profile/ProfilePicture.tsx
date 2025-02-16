"use client";
import usePresenceStore from "@/lib/store/usePresenceStore";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

import { useState, useEffect, useMemo } from "react";

export default function ProfilePicture() {
  const { isUserOnline, initializePresence } = usePresenceStore();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription: presenceSubscription }, // @ts-expect-error
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const cleanup = await initializePresence(session.user.id);
        return () => cleanup && cleanup();
      }
    });

    return () => {
      presenceSubscription?.unsubscribe();
    };
  }, []);

  return <div></div>;
}
