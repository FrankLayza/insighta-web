import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3110").replace(/\/$/, "");
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const redirectUri = `${appUrl}/api/auth/callback`;

  // Redirect directly to the backend's OAuth initiator which handles state and PKCE
  const authUrl = `${backendUrl}/api/v1/auth/github?redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  return NextResponse.redirect(authUrl);
}
