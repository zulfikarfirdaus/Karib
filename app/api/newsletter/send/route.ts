import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { resend, FROM } from "@/lib/resend";

export async function POST(request: Request) {
  // Simple auth check via secret header
  const authHeader = request.headers.get("x-newsletter-secret");
  if (authHeader !== process.env.NEWSLETTER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject, htmlContent, previewText } = await request.json();

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: "subject dan htmlContent wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("email")
      .eq("confirmed", true);

    if (error) throw error;
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: "Tidak ada subscriber aktif.", sent: 0 });
    }

    const emails = subscribers.map((s: { email: string }) => s.email);

    // Resend supports batch send up to 100 at a time
    const chunkSize = 100;
    let totalSent = 0;

    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);
      const batch = chunk.map((to: string) => ({
        from: FROM,
        to,
        subject,
        html: htmlContent,
        headers: { "X-Preview-Text": previewText ?? "" },
      }));

      await resend.batch.send(batch);
      totalSent += chunk.length;
    }

    return NextResponse.json({ message: "Newsletter berhasil dikirim.", sent: totalSent });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengirim newsletter." }, { status: 500 });
  }
}
