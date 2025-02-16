"use client";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useRef } from "react";
import { useUser, useProfile, ProfileState } from "./user";

export default function InitUser({ user, profile }: { user: User | undefined; profile: ProfileState }) {
  const initState = useRef(false);
  useEffect(() => {
    if (!initState.current) {
      useUser.setState({ user });
      //@ts-expect-error
      useProfile.setState({ profile });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  return <></>;
}
