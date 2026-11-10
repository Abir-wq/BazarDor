// Public status only: no credentials are exposed by this endpoint.
import { NextResponse } from "next/server";

export async function GET() {
  const google = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const github = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  return NextResponse.json({ google, github }, {
    headers: { "Cache-Control": "no-store" },
  });
}
