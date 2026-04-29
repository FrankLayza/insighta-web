import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateCodeChallenge } from "@/lib/pkce";

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store verifier in HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set("code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const redirectUri = `${appUrl}/api/auth/callback`;

  try {
    // Fetch the base GitHub Auth URL from the backend
    const response = await fetch(`${backendUrl}/api/v1/auth/github/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch auth URL from backend");
    }
    
    const { data } = await response.json();

    // Append PKCE challenge
    const authUrl = `${data.url}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Login initialization error:", error);
    return NextResponse.json({ error: "Failed to initialize login" }, { status: 500 });
  }
}
