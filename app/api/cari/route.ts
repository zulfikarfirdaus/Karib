
import { NextResponse } from "next/server";
import { safeFetch } from "@/sanity/lib/client";
import { searchQuery } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ artikels: [], nasihats: [] });
  }

  const results = await safeFetch(searchQuery, { q: `${q}*` });
  return NextResponse.json(results ?? { artikels: [], nasihats: [] });
}
