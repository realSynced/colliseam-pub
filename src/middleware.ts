import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuthMiddleware } from "./middleware/adminAuth";
import { updateSession } from "@/utils/supabase/middleware";

import { createClient } from "@/utils/supabase/server";

const protectedRoutes = ["/home", "/accounts/settings", "/accounts/logout"];

async function checkUserLoggedIn(): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error);
    return false;
  }

  return !!data.user;
}

function isMobileDevice(userAgent: string): boolean {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

export async function middleware(request: NextRequest) {
  console.log("Middleware running for path:", request.nextUrl.pathname);

  // Add global headers at the start
  let headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  headers.set("x-current-searchparams", request.nextUrl.searchParams as any);
  // console.log("Headers set in middleware:", {
  //     path: headers.get("x-current-path"),
  //     searchParams: headers.get("x-current-searchparams")
  // });

  console.log("Current Path", request.nextUrl.pathname);

  // Skip middleware for static files and images
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes("/api/") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    return adminAuthMiddleware(request);
  }

  // Mobile device redirection
  const userAgent = request.headers.get("user-agent") || "";
  if (
    isMobileDevice(userAgent) &&
    !pathname.startsWith("/under-construction")
  ) {
    return NextResponse.redirect(new URL("/under-construction", request.url));
  }

  const supabase = createClient();
  let userLoggedIn = await checkUserLoggedIn();
  let username: string | null = null;
  let userInProject: boolean = false;

  const isProtectedRoute = protectedRoutes.some((route) => {
    const routeRegex = new RegExp(`^${route.replace(/:[^/]+/g, "([^/]+)")}$`);
    return routeRegex.test(pathname);
  });

  // Get user data
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("username, aboutme")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Error getting user:", userError);
      return NextResponse.error();
    }
    username = userData.username;
  }

  // Protected route checks
  if (isProtectedRoute && !userLoggedIn) {
    return NextResponse.redirect(new URL("/accounts/login", request.url));
  }

  if (pathname.includes("/project/")) {
    const projectName = pathname.split("/project/")[1]?.split("/")[0];
    console.log("Project name (middleware): ", projectName);

    // Only check membership for protected project routes (not the main project page)
    const isProtectedProjectRoute =
      pathname.split(`/project/${projectName}/`)[1] !== undefined;

    if (projectName && user && isProtectedProjectRoute) {
      const { data: memberData } = await supabase
        .from("project_members")
        .select("user_id")
        .eq("project_name", projectName)
        .eq("user_id", user.id)
        .single();
      console.log("Member data (middleware): ", memberData);
      userInProject = !!memberData;

      if (!userInProject) {
        // Redirect to main project page if trying to access protected routes
        return NextResponse.redirect(
          new URL(`/project/${projectName}`, request.url)
        );
      }
    }
  }

  // Route-specific redirections
  if (pathname === "/" && userLoggedIn) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (userLoggedIn && pathname === "/accounts/login") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!userLoggedIn && pathname === "/accounts/login") {
    return NextResponse.next();
  }

  if (userLoggedIn && pathname === "/accounts/signup") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (
    userLoggedIn &&
    !username?.toString().includes("user0") &&
    pathname === "/accounts/setup"
  ) {
    return NextResponse.redirect(new URL(`/profile/${username}`, request.url));
  }

  if (
    userLoggedIn &&
    username?.toString().includes("user0") &&
    pathname.startsWith("/home")
  ) {
    return NextResponse.redirect(new URL("/accounts/setup", request.url));
  }

  if (userLoggedIn && pathname === "/accounts/logout") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!userLoggedIn && pathname.startsWith("/messages")) {
    return NextResponse.redirect(new URL("/accounts/login", request.url));
  }

  // Add headers to the response
  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  // Copy headers to the response
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return await updateSession(request), response;
}

export const config = {
  matcher: [
    "/(api|trpc)(.*)",
    "/seamai/:path*",
    // Admin routes
    "/admin/:path*",
    // Auth routes
    "/accounts/:path*",
    // Protected routes
    "/home/:path*",
    "/project/:path*",
    "/messages/:path*",
    "/profile/:path*",
    // Root route
    "/",
  ],
};
