import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  const supabase = createClient();
  
  // Check if a code is provided (Google / Githuyb OAuth flow)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code:", error.message);
      return NextResponse.redirect(`${origin}/error`);
    }
  }

  // Ensure the user is logged in (covers both OAuth and email/password)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log("Callback called. User: " + user);

  if (user) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    // Redirect based on environment
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If no user session is found
  return NextResponse.redirect(`${origin}/accounts/login`);
}
