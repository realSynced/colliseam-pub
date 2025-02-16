"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error?.message);

  if (error?.message && error?.message === "Invalid login credentials") {
    return error?.message;
  }

  revalidatePath("/home", "layout");
  redirect("/home");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });
  console.log("User ID:", user?.id);
  console.log(
    "Error with sign up: " + error?.message,
    "Error code: " + error?.code
  );

  if (error) {
    redirect("/error");
  }

  revalidatePath("/confirmation", "layout");
  redirect(`/confirmation?message=${data.email}`);
}

export async function signInWithGoogle() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    redirect("/error");
  }

  // Redirect to the OAuth URL provided by Supabase
  redirect(data.url);
}

export async function ResetPassword(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/accounts/reset`,
  });
  console.log("Password Reset email sent: ", email);
  // console.log(error?.message);

  if (error) {
    console.error("Error sending password reset email:", error.message);
    return error.message;
  }

  revalidatePath("/confirmation", "layout");
  redirect(`/confirmation?message=${email}`);
}

export async function sendResetPassword(formData: FormData, searchParams: any) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return redirect("/");

  const newPassword = formData.get("reset-password1") as string;
  const urlCode = searchParams.code;
  console.log(urlCode);

  if (urlCode) {
    const { error } = await supabase.auth.exchangeCodeForSession(urlCode);
    if (error) {
      return redirect(
        `/accounts/reset?message=Unable to reset Password. Link expired!`
      );
    }
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) {
    console.error(
      "Error resetting password:",
      error.message,
      "Code:",
      error.code
    );
    return redirect("/error");
  }

  if (data) {
    const { error } = await supabase.auth.signOut();
    revalidatePath("/accounts/login");
    return redirect("/accounts/login");
  }
}
