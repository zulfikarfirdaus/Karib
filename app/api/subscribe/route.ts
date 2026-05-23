import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { resend, FROM } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, confirmed")
      .eq("email", email)
      .single();

    if (existing?.confirmed) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar." },
        { status: 409 }
      );
    }

    if (existing && !existing.confirmed) {
      // Resend confirmation
      await sendConfirmation(email);
      return NextResponse.json({ message: "Email konfirmasi telah dikirim ulang." });
    }

    // Insert new subscriber
    const { error } = await supabase
      .from("subscribers")
      .insert({ email, confirmed: false });

    if (error) throw error;

    await sendConfirmation(email);
    return NextResponse.json({ message: "Berhasil! Cek email Anda untuk konfirmasi." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mendaftar. Coba lagi." }, { status: 500 });
  }
}

async function sendConfirmation(email: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const confirmUrl = `${siteUrl}/api/subscribe/confirm?email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Konfirmasi langganan newsletter Ustadzi",
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; background: #FAF8F3;">
        <h2 style="font-family: sans-serif; font-size: 22px; font-weight: 700; color: #1C1C1C; margin: 0 0 16px;">
          Assalamu'alaikum,
        </h2>
        <p style="color: #6B6560; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
          Terima kasih telah mendaftar newsletter Ustadzi. Klik tombol di bawah untuk mengkonfirmasi email Anda.
        </p>
        <a href="${confirmUrl}" style="display: inline-block; background: #C97E2A; color: white; font-family: sans-serif; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Konfirmasi Email
        </a>
        <p style="color: #9A9490; font-size: 12px; margin-top: 24px; line-height: 1.6;">
          Jika Anda tidak merasa mendaftar, abaikan email ini.
        </p>
      </div>
    `,
  });
}
