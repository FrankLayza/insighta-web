import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("code_verifier")?.value;

  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/login?error=no_verifier", request.url));
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const redirectUri = `${appUrl}/api/auth/callback`;

  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/github/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.status === "error") {
      console.error("Auth callback error:", result);
      return NextResponse.redirect(new URL(`/login?error=${result.message || "callback_failed"}`, request.url));
    }

    const { access_token, refresh_token, user } = result.data;

    // Set tokens in HttpOnly cookies
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes (matches access token)
    });

    cookieStore.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store user info in a JS-accessible cookie or just HttpOnly
    cookieStore.set("user_info", JSON.stringify(user), {
      httpOnly: false, // Accessible by client for UI
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Clear the code_verifier
    cookieStore.delete("code_verifier");

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Callback processing error:", error);
    return NextResponse.redirect(new URL("/login?error=internal_error", request.url));
  }
}
