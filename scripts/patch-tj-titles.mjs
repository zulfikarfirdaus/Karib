// Run: SANITY_API_TOKEN=your_token node scripts/patch-tj-titles.mjs
import { createClient } from "@sanity/client";

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("Set SANITY_API_TOKEN env var. Get one from sanity.io → project → API → Tokens (Editor role).");
  process.exit(1);
}

const client = createClient({
  projectId: "4egiuhgk",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const patches = [
  {
    id: "074898f8-d726-49fc-9de6-595b910402e5",
    judul: "Apakah Anak-Anak Mendapat Taufik dan Hidayah dari Allah?",
  },
  {
    id: "2fc51e5b-991e-480c-95bc-751a38866d8d",
    judul: "Hukum Memakai Plester Obat pada Anggota Wudhu",
  },
  {
    id: "8009aeef-f54b-4d7c-9376-ad95296d0784",
    judul: "Bolehkah Mengqodho Sholat Jumat dengan Sholat Ashar Saat Safar?",
  },
  {
    id: "d5accd6a-e2ec-46bc-a8f0-a1f0f7eb79d7",
    judul: "Hutang Emas Dibayar dengan Emas Merk Berbeda, Bolehkah?",
  },
  {
    id: "f26f4c59-4fb9-4328-a3f2-3343de8239f6",
    judul: "Hukum Kirim Makanan Lewat Aplikasi yang Juga Mengirim Makanan Non-Halal",
  },
];

for (const { id, judul } of patches) {
  await client.patch(id).set({ judul }).commit();
  console.log(`✓ ${judul}`);
}

console.log("\nDone. All titles patched.");
