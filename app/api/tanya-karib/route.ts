import { NextResponse } from "next/server";
import { previewClient } from "@/sanity/lib/client";

export async function POST(request: Request) {
  try {
    const { nama, nomorTelepon, pertanyaan } = await request.json();

    if (!nama || typeof nama !== "string" || nama.trim().length < 2) {
      return NextResponse.json({ error: "Nama terlalu pendek." }, { status: 400 });
    }

    if (!pertanyaan || typeof pertanyaan !== "string" || pertanyaan.trim().length < 10) {
      return NextResponse.json({ error: "Pertanyaan terlalu pendek." }, { status: 400 });
    }

    if (pertanyaan.trim().length > 1000) {
      return NextResponse.json({ error: "Pertanyaan terlalu panjang (maks 1000 karakter)." }, { status: 400 });
    }

    await previewClient.create({
      _type: "pertanyaanMasuk",
      nama: nama.trim(),
      ...(nomorTelepon?.trim() && { nomorTelepon: nomorTelepon.trim() }),
      pertanyaan: pertanyaan.trim(),
      status: "baru",
      tanggalMasuk: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Pertanyaan berhasil dikirim." });
  } catch (err) {
    console.error("[tanya-karib]", err);
    return NextResponse.json({ error: "Gagal mengirim. Coba lagi." }, { status: 500 });
  }
}
