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

function block(text) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "normal",
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text, marks: [] }],
    markDefs: [],
  };
}

function heading(text) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "h3",
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text, marks: [] }],
    markDefs: [],
  };
}

const bio = [
  block(
    "Ustadz Muhammad Ibrahim Saleh, Lc. adalah seorang pendakwah Islam, penulis, dan pakar fikih muamalah asal Indonesia. Beliau dikenal luas karena kontribusinya dalam memberikan edukasi literasi keuangan syariah, khususnya yang dirancang untuk anak-anak dan keluarga."
  ),
  heading("Edukator Fikih Muamalah"),
  block(
    "Ustadz Muhammad Ibrahim Saleh aktif mengajar dan menyampaikan kajian keislaman yang berfokus pada bab muamalah (interaksi sosial-ekonomi). Beliau sering membahas topik seputar bahaya riba, transaksi jual-beli syariah, serta pengelolaan harta yang halal dan berkah."
  ),
  heading("Karya Tulis"),
  block(
    "Bersama Tim Sekolah Muamalah Indonesia, beliau telah menulis serial buku edukasi Islam populer untuk anak-anak:"
  ),
  {
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: "Muamalah untuk Anak: Mengenal Buruknya Harta Haram", marks: [] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: "Muamalah untuk Anak: Riba yang Dianggap Biasa", marks: [] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: "Muamalah untuk Anak: Jual Beli yang Terlarang", marks: [] }],
    markDefs: [],
  },
  heading("Media Pembelajaran"),
  block(
    "Selain buku fisik, materi-materi kajian dan edukasi dari beliau juga aktif dibagikan melalui platform digital dan media sosial komunitas keislaman."
  ),
];

async function run() {
  await client.createOrReplace({
    _type: "profilUstadz",
    _id: "profil-ustadz-singleton",
    nama: "Muhammad Ibrahim Saleh",
    gelar: "Lc.",
    bio,
    pendidikan: [],
    tautanSosial: [],
  });

  console.log("✓ Profil Ustadz seeded.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
