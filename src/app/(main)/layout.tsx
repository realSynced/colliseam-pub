import { createClient } from "@/utils/supabase/server";
import React from "react";
import LeftPanel from "./ui/components/leftpanel";
import InitUser from "@/lib/store/InitUser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colliseam",
  description: "Colliseam | Home",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id!)
    .single();

  try {
    console.log("Username is: " + data?.username);
    if (error) {
      throw error;
    }

    if (user) {
      console.log("User id is: " + user?.id);
      console.log("User avatar url is: " + data?.avatar_url);
    }
  } catch (error) {
    console.log("Error loading user data! " + (error as Error).message);
  }

  return (
    <VisibilityProvider>
      <GlobalStateProvider>
        <div className="relative flex md:flex md:flex-row">
          <LeftPanel
            uuid={user?.id}
            avatarUrl={data?.avatar_url}
            username={data?.username}
            fullName={data?.full_name}
          />
          {children}
          <Toaster position="top-center" />
          {/* @ts-expect-error */}
          <InitUser user={user as User} profile={data} />
          <LoginModal isSignedIn={!!user} />
        </div>
      </GlobalStateProvider>
    </VisibilityProvider>
  );
}
