import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

// Fall back to Sanity CLI token if no explicit API token is set
const cliConfigPath = join(homedir(), ".config", "sanity", "config.json");
let cliToken = null;
try {
  const cfg = JSON.parse(readFileSync(cliConfigPath, "utf8"));
  cliToken = cfg.authToken ?? null;
} catch {}

const token = process.env.SANITY_API_TOKEN ?? cliToken;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const items = [
  {
    _id: "tanya-jawab-shalat-jamak",
    _type: "tanyaJawab",
    pertanyaan: "Bolehkah menjamak shalat karena bekerja kantoran dan tidak bisa meninggalkan meja?",
    slug: { _type: "slug", current: "bolehkah-jamak-shalat-kerja-kantoran" },
    ringkasan: "Banyak pekerja kantoran kesulitan menunaikan shalat tepat waktu. Apakah kondisi ini membolehkan jamak?",
    kategori: { _type: "reference", _ref: "kategori-fiqih" },
    tanggalTerbit: "2025-04-10T08:00:00.000Z",
    tags: ["shalat", "jamak", "pekerjaan"],
    jawaban: [
      {
        _type: "block", _key: "a1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Menjamak shalat hanya diperbolehkan dalam kondisi-kondisi yang disebutkan syariat, yaitu: safar (perjalanan), hujan lebat, sakit, dan beberapa uzur berat lainnya. Bekerja di kantor — meskipun pekerjaan itu penting — tidak masuk dalam kategori uzur yang membolehkan jamak menurut jumhur ulama." }],
        markDefs: [],
      },
      {
        _type: "block", _key: "a2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "Yang diwajibkan bagi seorang pekerja adalah berusaha meminta izin atau mengatur waktu istirahat agar bisa menunaikan shalat tepat waktu. Jika tempat kerja tidak memungkinkan sama sekali, maka ia wajib mencari pekerjaan lain yang tidak menghalanginya dari kewajiban terbesar dalam Islam ini." }],
        markDefs: [],
      },
      {
        _type: "callout", _key: "a3",
        jenis: "penting",
        judul: "Kaidah Penting",
        isi: "Meninggalkan kewajiban (shalat tepat waktu) demi kepentingan dunia (pekerjaan) adalah bentuk mendahulukan yang lebih rendah atas yang lebih tinggi.",
      },
      {
        _type: "block", _key: "a4",
        style: "normal",
        children: [{ _type: "span", _key: "s4", text: "Adapun jika seseorang dalam perjalanan dinas (safar syar'i, yaitu sekitar 80 km lebih), maka jamak dan qashar dibolehkan selama masa perjalanan tersebut." }],
        markDefs: [],
      },
    ],
  },
  {
    _id: "tanya-jawab-zakat-saham",
    _type: "tanyaJawab",
    pertanyaan: "Apakah saham yang saya miliki di bursa efek wajib dikeluarkan zakatnya?",
    slug: { _type: "slug", current: "zakat-saham-bursa-efek" },
    ringkasan: "Investasi saham kini semakin umum. Bagaimana Islam memandang kewajiban zakat atas kepemilikan saham?",
    kategori: { _type: "reference", _ref: "kategori-fiqih" },
    tanggalTerbit: "2025-04-18T08:00:00.000Z",
    tags: ["zakat", "saham", "investasi", "muamalah"],
    jawaban: [
      {
        _type: "block", _key: "b1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Ya, saham wajib dikeluarkan zakatnya jika telah mencapai nisab dan haul (satu tahun kepemilikan). Para ulama kontemporer berbeda pendapat mengenai cara perhitungannya, namun pendapat yang paling kuat dan mudah dipraktikkan adalah:" }],
        markDefs: [],
      },
      {
        _type: "block", _key: "b2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "Jika saham dibeli dengan tujuan investasi jangka panjang (bukan untuk diperdagangkan), maka zakatkan nilai dividen yang diterima, bukan nilai saham keseluruhan — sama seperti zakat hasil sewa properti." }],
        markDefs: [],
      },
      {
        _type: "block", _key: "b3",
        style: "normal",
        children: [{ _type: "span", _key: "s3", text: "Namun jika saham tersebut aktif diperjualbelikan (trading), maka seluruh nilai pasar saham di akhir haul dihitung sebagai harta dagang dan dikenakan zakat 2,5% setelah mencapai nisab (setara 85 gram emas)." }],
        markDefs: [],
      },
      {
        _type: "callout", _key: "b4",
        jenis: "tip",
        judul: "Langkah Praktis",
        isi: "Tetapkan satu hari dalam setahun (misalnya 1 Ramadan) sebagai hari perhitungan zakat seluruh harta. Hitung nilai portofolio saham pada hari itu, lalu keluarkan 2,5% jika sudah mencapai nisab.",
      },
    ],
  },
  {
    _id: "tanya-jawab-membaca-quran-haid",
    _type: "tanyaJawab",
    pertanyaan: "Apakah wanita yang sedang haid boleh membaca Al-Qur'an dari hafalan tanpa menyentuh mushaf?",
    slug: { _type: "slug", current: "wanita-haid-baca-quran-hafalan" },
    ringkasan: "Pertanyaan yang sering muncul di kalangan wanita muslimah: bolehkah melantunkan ayat Al-Qur'an saat haid?",
    kategori: { _type: "reference", _ref: "kategori-fiqih" },
    tanggalTerbit: "2025-05-02T08:00:00.000Z",
    tags: ["haid", "Al-Qur'an", "wanita", "thaharah"],
    jawaban: [
      {
        _type: "block", _key: "c1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Dalam masalah ini ulama berbeda pendapat. Pendapat yang rajih (kuat) — sebagaimana dipilih oleh Ibnu Taimiyyah, Ibnu Qayyim, dan sebagian ulama kontemporer — adalah bahwa wanita haid boleh membaca Al-Qur'an dari hafalan (tanpa menyentuh mushaf), khususnya jika ada keperluan seperti menghafal, mengajar, atau khawatir lupa." }],
        markDefs: [],
      },
      {
        _type: "block", _key: "c2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "Alasannya: tidak ada dalil yang tegas dan sahih yang melarang wanita haid membaca Al-Qur'an. Hadis yang melarang hal ini derajatnya dha'if (lemah). Adapun melarang wanita haid dari membaca Al-Qur'an selama berhari-hari akan memutusnya dari zikir dan ibadah yang sangat ia butuhkan." }],
        markDefs: [],
      },
      {
        _type: "pullQuote", _key: "c3",
        teks: "Tidak ada dalil sahih yang mengharamkan wanita haid membaca Al-Qur'an.",
        atribusi: "Syaikhul Islam Ibnu Taimiyyah",
      },
      {
        _type: "block", _key: "c4",
        style: "normal",
        children: [{ _type: "span", _key: "s4", text: "Adapun menyentuh mushaf secara langsung tanpa penghalang, maka yang lebih hati-hati adalah tidak melakukannya selama haid. Ia boleh membaca melalui aplikasi di handphone atau menggunakan sarung tangan/kain sebagai pembatas." }],
        markDefs: [],
      },
    ],
  },
  {
    _id: "tanya-jawab-niat-puasa",
    _type: "tanyaJawab",
    pertanyaan: "Apakah niat puasa Ramadan harus diucapkan setiap malam, atau cukup satu kali di awal bulan?",
    slug: { _type: "slug", current: "niat-puasa-ramadan-setiap-malam-atau-sekali" },
    ringkasan: "Banyak yang bingung soal niat puasa: apakah harus diperbarui tiap malam atau bisa sekali untuk satu bulan penuh?",
    kategori: { _type: "reference", _ref: "kategori-fiqih" },
    tanggalTerbit: "2025-05-10T08:00:00.000Z",
    tags: ["puasa", "niat", "Ramadan", "ibadah"],
    jawaban: [
      {
        _type: "block", _key: "d1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Para ulama berbeda pendapat dalam masalah ini. Madzhab Maliki berpendapat cukup satu niat di awal bulan untuk seluruh puasa Ramadan, karena puasa Ramadan adalah satu ibadah yang berkesinambungan." }],
        markDefs: [],
      },
      {
        _type: "block", _key: "d2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "Adapun madzhab Syafi'i dan Hanbali — dan ini yang diamalkan mayoritas muslimin di Indonesia — berpendapat bahwa niat harus diperbaharui setiap malam sebelum fajar, karena setiap hari puasa adalah ibadah yang berdiri sendiri." }],
        markDefs: [],
      },
      {
        _type: "callout", _key: "d3",
        jenis: "info",
        judul: "Yang Lebih Hati-Hati",
        isi: "Memperbarui niat setiap malam adalah lebih hati-hati dan keluar dari perbedaan pendapat. Niat cukup di dalam hati; tidak perlu diucapkan dengan lisan secara keras.",
      },
      {
        _type: "block", _key: "d4",
        style: "normal",
        children: [{ _type: "span", _key: "s4", text: "Yang terpenting adalah seseorang memiliki tekad yang pasti sejak malam untuk berpuasa keesokan harinya. Bangun sahur pun sudah mengindikasikan adanya niat, selama tidak ada hal yang membatalkan tekad tersebut." }],
        markDefs: [],
      },
    ],
  },
  {
    _id: "tanya-jawab-sedekah-orang-tua",
    _type: "tanyaJawab",
    pertanyaan: "Lebih utama mana: bersedekah kepada orang tua yang masih hidup atau kepada fakir miskin yang bukan keluarga?",
    slug: { _type: "slug", current: "sedekah-orang-tua-vs-fakir-miskin" },
    ringkasan: "Pertanyaan tentang prioritas sedekah: antara kewajiban terhadap orang tua dan keutamaan membantu orang yang membutuhkan.",
    kategori: { _type: "reference", _ref: "kategori-akhlak" },
    tanggalTerbit: "2025-05-15T08:00:00.000Z",
    tags: ["sedekah", "orang tua", "birrul walidain", "akhlak"],
    jawaban: [
      {
        _type: "block", _key: "e1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Nafkah kepada orang tua yang membutuhkan adalah wajib bagi yang mampu, bukan sekadar sedekah sunnah. Maka mendahulukan pemenuhan kebutuhan orang tua adalah prioritas utama dan hukumnya wajib sebelum bicara tentang sedekah kepada siapapun." }],
        markDefs: [],
      },
      {
        _type: "block", _key: "e2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "Namun jika yang dimaksud adalah keduanya sudah terpenuhi kebutuhannya, dan kita ingin memberikan hadiah atau sedekah tambahan, maka orang tua tetap lebih berhak didahulukan karena hak mereka lebih besar dan pahala birrul walidain sangat agung dalam Islam." }],
        markDefs: [],
      },
      {
        _type: "pullQuote", _key: "e3",
        teks: "Seorang lelaki datang kepada Nabi ﷺ meminta izin untuk berjihad. Beliau bertanya: 'Apakah kedua orang tuamu masih hidup?' Ia menjawab: 'Ya.' Beliau bersabda: 'Maka berjihadlah pada keduanya.'",
        atribusi: "HR. Bukhari & Muslim",
      },
      {
        _type: "block", _key: "e4",
        style: "normal",
        children: [{ _type: "span", _key: "s4", text: "Hal ini menunjukkan bahwa berbakti kepada orang tua — termasuk memperhatikan kebutuhan mereka secara finansial — mendapat kedudukan yang sangat tinggi, bahkan disandingkan dengan jihad fi sabilillah." }],
        markDefs: [],
      },
    ],
  },
];

async function run() {
  console.log("Seeding Tanya Jawab...\n");
  for (const doc of items) {
    await client.createOrReplace(doc);
    console.log(`✓ ${doc.pertanyaan.substring(0, 60)}…`);
  }
  console.log(`\nSelesai: ${items.length} Tanya Jawab berhasil ditambahkan.`);
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
