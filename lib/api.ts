import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3110";

/**
 * Server-side API fetch wrapper that automatically includes auth tokens.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized (token expired)
  if (response.status === 401) {
    // Note: In a real app, you would attempt a refresh here or 
    // let the middleware handle it for page loads.
    console.warn("API 401: Unauthorized");
  }

  return response;
}
