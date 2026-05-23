import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!email) {
    return NextResponse.redirect(`${siteUrl}/?confirm=error`);
  }

  const supabase = createServiceClient();
  await supabase
    .from("subscribers")
    .update({ confirmed: true })
    .eq("email", email);

  return NextResponse.redirect(`${siteUrl}/?confirm=success`);
}
