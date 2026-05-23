import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

await client.createOrReplace({
  _type: "artikel",
  _id: "artikel-adab-ilmu",
  judul: "Adab Menuntut Ilmu: Pondasi Sebelum Memulai",
  slug: { _type: "slug", current: "adab-menuntut-ilmu-pondasi-sebelum-memulai" },
  ringkasan:
    "Para ulama salaf selalu mendahulukan adab sebelum ilmu. Tanpa adab yang benar, ilmu bisa menjadi fitnah bagi pemiliknya dan orang-orang di sekitarnya.",
  kategori: { _type: "reference", _ref: "kategori-akhlak" },
  tanggalTerbit: "2025-05-20T08:00:00.000Z",
  isi: [
    {
      _type: "block",
      _key: "b1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "Imam Malik rahimahullah berkata kepada seorang pemuda Quraisy: 'Pelajarilah adab sebelum engkau mempelajari ilmu.' Nasihat singkat ini mengandung hikmah yang sangat dalam bagi para penuntut ilmu di setiap zaman.",
        },
      ],
    },
    {
      _type: "block",
      _key: "b2",
      style: "h2",
      children: [{ _type: "span", _key: "s2", text: "Adab kepada Allah" }],
    },
    {
      _type: "block",
      _key: "b3",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s3",
          text: "Adab yang paling utama adalah ikhlas dalam menuntut ilmu — hanya mengharap ridha Allah, bukan pujian manusia atau keuntungan duniawi. Ilmu yang dituntut dengan niat yang lurus akan menjadi cahaya yang menerangi jalan kehidupan.",
        },
      ],
    },
    {
      _type: "block",
      _key: "b4",
      style: "h2",
      children: [{ _type: "span", _key: "s4", text: "Adab kepada Guru" }],
    },
    {
      _type: "block",
      _key: "b5",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s5",
          text: "Menghormati guru adalah syarat mendapatkan keberkahan ilmu. Imam Syafi'i pernah berkata bahwa ia membalik halaman kitab dengan lembut agar gurunya tidak mendengar suara kertas, sebagai bentuk rasa hormat.",
        },
      ],
    },
  ],
  tags: ["akhlak", "adab", "ilmu", "thalabul-ilmi"],
});

console.log("✓ Artikel 'Adab Menuntut Ilmu' berhasil ditambahkan.");
