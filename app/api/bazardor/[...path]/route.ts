import { NextRequest, NextResponse } from "next/server";

// This server-side proxy avoids exposing cross-origin problems to the browser.
// Try the three URLs listed in the official Bazar Dor assignment README.
const sources = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  // Only allow the endpoints used in the assignment (no arbitrary proxy URLs).
  const valid = (path.length === 1 && ["products", "categories"].includes(path[0]))
    || (path.length === 2 && path[0] === "products" && /^[a-zA-Z0-9_-]+$/.test(path[1]))
    || (path.length === 2 && path[0] === "categories" && /^[a-zA-Z0-9_-]+$/.test(path[1]));
  if (!valid) return NextResponse.json({ message: "Invalid API path" }, { status: 404 });

  // The category filter is a value, never a complete URL.
  const category = _request.nextUrl.searchParams.get("category");
  if (category && !/^[a-zA-Z0-9_-]{1,48}$/.test(category)) {
    return NextResponse.json({ message: "Invalid category" }, { status: 400 });
  }

  for (const source of sources) {
    try {
      const url = `${source}/${path.map(encodeURIComponent).join("/")}${category ? `?category=${encodeURIComponent(category)}` : ""}`;
      const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(9000) });
      if (!response.ok) continue;
      const json = await response.json();
      return NextResponse.json(json, { headers: { "Cache-Control": "no-store" } });
    } catch {
      // If this API host is down, try the next official URL.
    }
  }
  return NextResponse.json({ message: "All product API servers are unavailable" }, { status: 502 });
}
