import { apiFetch } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await apiFetch("/api/v1/profiles/export");
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to export profiles" }, { status: response.status });
    }

    const blob = await response.blob();
    
    return new Response(blob, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=profiles_export.csv",
      },
    });
  } catch (error) {
    console.error("Export proxy error:", error);
    return NextResponse.json({ error: "Internal server error during export" }, { status: 500 });
  }
}
