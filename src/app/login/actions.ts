
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "admin@stylecanvas.com";
const ADMIN_PASSWORD = "admin123"; // In a real app, use hashed passwords and a database
const AUTH_COOKIE_NAME = "auth_token";
const AUTH_TOKEN_VALUE = "secret-hardcoded-stylecanvas-auth-token"; // In a real app, this would be a JWT or session ID
const ADMIN_EMAIL_COOKIE_NAME = "admin_email";

type LoginState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Simulate database check
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax" as const, // Ensure correct type for sameSite
    };

    cookies().set(AUTH_COOKIE_NAME, AUTH_TOKEN_VALUE, cookieOptions);
    cookies().set(ADMIN_EMAIL_COOKIE_NAME, email, cookieOptions);
    
    redirect("/admin");
    // This line might not be reached if redirect occurs.
    // return { success: true }; 
  } else {
    return { error: "Invalid email or password." };
  }
}

export async function logoutUser() {
  cookies().delete(AUTH_COOKIE_NAME);
  cookies().delete(ADMIN_EMAIL_COOKIE_NAME);
  redirect("/login");
}

