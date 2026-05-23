import { createClient } from "@sanity/client";
import { createReadStream } from "fs";
import { readFile } from "fs/promises";
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

async function main() {
  const pdfPath = "/Users/admin/Downloads/Fikih Qurban.pdf";

  console.log("Uploading Fikih Qurban.pdf to Sanity...");
  const pdfBuffer = await readFile(pdfPath);
  const asset = await client.assets.upload("file", pdfBuffer, {
    filename: "fikih-qurban.pdf",
    contentType: "application/pdf",
  });
  console.log("✓ PDF uploaded:", asset._id);

  console.log("Creating Fikih Qurban article...");
  await client.createOrReplace({
    _type: "artikel",
    _id: "artikel-fikih-qurban",
    judul: "Fikih Qurban: Panduan Lengkap Ibadah Kurban",
    slug: { _type: "slug", current: "fikih-qurban-panduan-lengkap" },
    ringkasan:
      "Panduan lengkap fikih qurban — mulai dari definisi, hukum, syarat hewan, waktu penyembelihan, hingga amalan utama di 10 hari pertama Dzulhijjah. Dilengkapi dengan peta konsep (mindmap) untuk memudahkan pemahaman.",
    kategori: { _type: "reference", _ref: "kategori-fiqih" },
    tanggalTerbit: "2025-05-10T08:00:00.000Z",
    tags: ["qurban", "fiqih", "dzulhijjah", "ibadah"],
    filePdf: {
      _type: "file",
      asset: { _type: "reference", _ref: asset._id },
    },
    isi: [
      {
        _type: "block",
        _key: "intro1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "intro1s",
            text: "Di atas adalah peta konsep (mindmap) fikih qurban yang merangkum keseluruhan pembahasan secara visual. Unduh dan simpan sebagai referensi cepat. Artikel ini menguraikan setiap poin secara lebih rinci.",
          },
        ],
      },
      {
        _type: "callout",
        _key: "call0",
        jenis: "tip",
        judul: "Cara menggunakan peta konsep ini",
        isi: "Baca peta konsep di atas terlebih dahulu untuk mendapatkan gambaran besar. Kemudian baca artikel ini untuk penjelasan mendalam setiap poin. Anda juga bisa mengunduh PDF-nya sebagai catatan ringkas.",
      },
      {
        _type: "block",
        _key: "h1a",
        style: "h1",
        children: [{ _type: "span", _key: "h1as", text: "Definisi Qurban" }],
      },
      {
        _type: "block",
        _key: "def1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "def1s",
            text: "Qurban secara bahasa berasal dari kata ",
          },
          { _type: "span", _key: "def1s2", text: "qaruba", marks: ["em"] },
          {
            _type: "span",
            _key: "def1s3",
            text: " yang berarti dekat. Ia juga disebut ",
          },
          { _type: "span", _key: "def1s4", text: "udhiyah", marks: ["em"] },
          {
            _type: "span",
            _key: "def1s5",
            text: " atau ",
          },
          { _type: "span", _key: "def1s6", text: "dhahiyah", marks: ["em"] },
          {
            _type: "span",
            _key: "def1s7",
            text: " — dinamakan demikian karena dilakukan saat waktu Dhuha setelah shalat Ied.",
          },
        ],
      },
      {
        _type: "block",
        _key: "def2",
        style: "blockquote",
        children: [
          {
            _type: "span",
            _key: "def2s",
            text: "Segala yang disembelih pada hari Nahr (10 Dzulhijjah) dan hari-hari Tasyriq (11, 12, 13 Dzulhijjah) dengan niat taqarrub kepada Allah.",
          },
        ],
      },
      {
        _type: "block",
        _key: "def3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "def3s",
            text: "(Definisi secara istilah)",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2a",
        style: "h2",
        children: [{ _type: "span", _key: "h2as", text: "Hukum Qurban" }],
      },
      {
        _type: "block",
        _key: "huk1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "huk1s",
            text: "Para ulama berbeda pendapat dalam masalah hukum qurban. Berikut ringkasannya:",
          },
        ],
      },
      {
        _type: "block",
        _key: "li1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li1s1",
            text: "Wajib ",
          },
          {
            _type: "span",
            _key: "li1s2",
            text: "bagi yang mampu",
            marks: ["strong"],
          },
          {
            _type: "span",
            _key: "li1s3",
            text: " — pendapat Hanafiyah dan Ibnu Taimiyyah",
          },
        ],
      },
      {
        _type: "block",
        _key: "li2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li2s1",
            text: "Sunnah Muakkadah ",
          },
          {
            _type: "span",
            _key: "li2s2",
            text: "makruh ditinggalkan bagi yang mampu",
            marks: ["em"],
          },
          {
            _type: "span",
            _key: "li2s3",
            text: " — pendapat Hanabilah",
          },
        ],
      },
      {
        _type: "block",
        _key: "li3",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li3s1",
            text: "Sunnah, tidak makruh ditinggalkan — pendapat Syafi'iyah dan Malikiyah",
          },
        ],
      },
      {
        _type: "pullQuote",
        _key: "pq1",
        teks: "Tidak ada amalan yang lebih dicintai Allah pada hari Nahr melebihi menumpahkan darah (qurban). Sesungguhnya hewan qurban itu akan datang pada hari kiamat dengan tanduk, bulu, dan kukunya.",
        atribusi: "— HR. Tirmidzi, dihasankan oleh Syaikh Al-Albani",
      },
      {
        _type: "block",
        _key: "h2b",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "h2bs",
            text: "Syarat Hewan Qurban",
          },
        ],
      },
      {
        _type: "block",
        _key: "h3a",
        style: "h3",
        children: [{ _type: "span", _key: "h3as", text: "Jenis Hewan" }],
      },
      {
        _type: "block",
        _key: "jen1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "jen1s",
            text: "Qurban hanya sah dengan hewan ternak (bahimatul an'am): unta, sapi/kerbau, dan kambing/domba. Dari segi keutamaan: unta lebih afdhal, kemudian sapi, kemudian domba.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h3b",
        style: "h3",
        children: [{ _type: "span", _key: "h3bs", text: "Syarat Usia" }],
      },
      {
        _type: "codeBlock",
        _key: "usia1",
        bahasa: "Usia Minimal Hewan Qurban",
        kode: `Unta   : 5 tahun (masuk tahun ke-6)
Sapi   : 2 tahun (masuk tahun ke-3)
Kambing: 1 tahun (masuk tahun ke-2)
Domba  : 6 bulan — jika tidak ada yang lebih tua (Syafi'iyah: cukup 6 bulan jika terlihat seperti domba 1 tahun)`,
      },
      {
        _type: "block",
        _key: "h3c",
        style: "h3",
        children: [{ _type: "span", _key: "h3cs", text: "Aib yang Melarang" }],
      },
      {
        _type: "callout",
        _key: "call2",
        jenis: "peringatan",
        judul: "Empat aib yang disepakati tidak sah:",
        isi: "1. Buta sebelah yang jelas\n2. Sakit yang jelas\n3. Pincang yang jelas\n4. Sangat kurus hingga tidak ada sumsum tulangnya",
      },
      {
        _type: "callout",
        _key: "call3",
        jenis: "info",
        judul: "Aib yang masih diperdebatkan:",
        isi: "Tanduk patah, kuping sobek, dan ekor putus — para ulama berbeda pendapat apakah ini menghalangi sahnya qurban.",
      },
      {
        _type: "divider",
        _key: "div1",
        gaya: "dots",
      },
      {
        _type: "block",
        _key: "h2c",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "h2cs",
            text: "Waktu Penyembelihan",
          },
        ],
      },
      {
        _type: "block",
        _key: "wkt1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "wkt1s",
            text: "Waktu qurban dimulai setelah shalat Idul Adha dan selesai dengan berakhirnya hari Tasyriq (13 Dzulhijjah). Siapa yang menyembelih sebelum shalat Ied, maka itu adalah daging biasa, bukan qurban.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2d",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "h2ds",
            text: "Keutamaan 10 Hari Pertama Dzulhijjah",
          },
        ],
      },
      {
        _type: "block",
        _key: "kut1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "kut1s",
            text: "Rasulullah ﷺ bersabda bahwa tidak ada hari-hari yang amal shalih di dalamnya lebih dicintai Allah melebihi sepuluh hari pertama Dzulhijjah.",
          },
        ],
      },
      {
        _type: "block",
        _key: "li10",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li10s",
            text: "Termasuk bulan Haram yang empat (Dzulqa'dah, Dzulhijjah, Muharram, Rajab)",
          },
        ],
      },
      {
        _type: "block",
        _key: "li11",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li11s",
            text: "Hari di mana amal shalih paling dicintai Allah bahkan melebihi jihad",
          },
        ],
      },
      {
        _type: "block",
        _key: "li12",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li12s",
            text: "Dilipat gandakan pahala",
          },
        ],
      },
      {
        _type: "block",
        _key: "li13",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li13s",
            text: "Ada hari Arafah, 9 Dzulhijjah — puasa di hari ini menghapus dosa dua tahun",
          },
        ],
      },
      {
        _type: "block",
        _key: "li14",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "li14s",
            text: "Ada hari paling afdhal yaitu 10 Dzulhijjah (Idul Adha)",
          },
        ],
      },
      {
        _type: "callout",
        _key: "call4",
        jenis: "tip",
        judul: "Amalan utama di 10 hari Dzulhijjah:",
        isi: "Perbanyak shalat, puasa (terutama 9 Dzulhijjah), bersedekah, berhaji (bagi yang mampu), berqurban, dan perbanyak dzikir (takbir, tahlil, tahmid).",
      },
      {
        _type: "divider",
        _key: "div2",
        gaya: "dots",
      },
      {
        _type: "block",
        _key: "penutup",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "penutups",
            text: "Semoga Allah menerima ibadah qurban kita dan menjadikannya sebab keselamatan di dunia dan akhirat. Aamiin.",
          },
        ],
      },
    ],
  });

  console.log("✅ Fikih Qurban article created with real PDF.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
