import { cookies } from "next/headers";

/**
 * Reads the current user's session info from cookies (server-side only).
 * Returns null if not authenticated.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const userInfoRaw = cookieStore.get("user_info")?.value;

  if (!accessToken || !userInfoRaw) return null;

  try {
    const user = JSON.parse(userInfoRaw) as {
      id: string;
      name: string;
      role: "ADMIN" | "ANALYST";
    };
    return { user, accessToken };
  } catch {
    return null;
  }
}

/**
 * Returns true if the current session belongs to an ADMIN user.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user?.role === "ADMIN";
}

/**
 * Returns true if the user is authenticated (any role).
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
