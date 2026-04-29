import { apiFetch } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

// Proxy DELETE /api/v1/profiles/:id → Backend
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const response = await apiFetch(`/api/v1/profiles/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || "Failed to delete profile" },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Profile delete proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Proxy GET /api/v1/profiles/:id → Backend
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const response = await apiFetch(`/api/v1/profiles/${id}`);
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || "Profile not found" },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Profile fetch proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
