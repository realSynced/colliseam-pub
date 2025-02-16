//@ts-nocheck
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

import LeftPanel from "@/app/(main)/ui/components/leftpanel";
import SideNav from "@/app/accounts/settings/components/Sidenav";
import { GlobalStateProvider } from "@/app/(main)/ui/statemanagement/GlobalContext";
import Sidenav from "@/app/accounts/settings/components/Sidenav";

export const metadata: Metadata = {
  title: "Nexus | Settings",
  description:
    "A home for developers, market for recruiters. Whether you're a beginner, or senior level developer, you can find your place here at Nexus.",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const userInfo = {
    email: "",
    username: "",
    userId: "",
    avatarUrl: "",
  };

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const { data, error, status } = await supabase.from("profiles").select(`username, avatar_url, full_name`).eq("id", user?.id).single();

  try {
    console.log("Username is: " + data?.username);
    if (error && status !== 406) {
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
    <GlobalStateProvider>
      <div className="relative text-white md:flex md:flex-row">
        <LeftPanel uuid={user?.id} avatarUrl={data?.avatar_url} username={data?.username} fullName={data?.full_name} />

        <div className="flex flex-1">
          <Sidenav />
          {children}
        </div>
      </div>
    </GlobalStateProvider>
  );
}
