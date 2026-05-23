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

async function seed() {
  console.log("Seeding Sanity with initial content...\n");

  // --- Kategori ---
  const kategoriList = [
    { _type: "kategori", _id: "kategori-aqidah", nama: "Aqidah", slug: { _type: "slug", current: "aqidah" }, deskripsi: "Pembahasan seputar keyakinan dan tauhid dalam Islam." },
    { _type: "kategori", _id: "kategori-fiqih", nama: "Fiqih", slug: { _type: "slug", current: "fiqih" }, deskripsi: "Hukum-hukum Islam dalam kehidupan sehari-hari." },
    { _type: "kategori", _id: "kategori-muamalah", nama: "Muamalah", slug: { _type: "slug", current: "muamalah" }, deskripsi: "Hubungan antar manusia dalam perspektif Islam." },
    { _type: "kategori", _id: "kategori-akhlak", nama: "Akhlak", slug: { _type: "slug", current: "akhlak" }, deskripsi: "Pembinaan karakter dan adab Islami." },
  ];

  for (const k of kategoriList) {
    await client.createOrReplace(k);
    console.log(`✓ Kategori: ${k.nama}`);
  }

  // --- Profil Ustadz ---
  await client.createOrReplace({
    _type: "profilUstadz",
    _id: "profil-ustadz-singleton",
    nama: "Muhammad Ibrahim Saleh",
    gelar: "Lc",
    bio: [
      {
        _type: "block",
        _key: "bio1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span1",
            text: "Ustadz Muhammad Ibrahim Saleh, Lc adalah seorang da'i dan pengajar ilmu syariah yang berdedikasi dalam menyebarkan ilmu agama Islam yang bersumber dari Al-Qur'an dan As-Sunnah sesuai pemahaman Salafus Shalih.",
          },
        ],
      },
      {
        _type: "block",
        _key: "bio2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span2",
            text: "Beliau menyelesaikan pendidikan di Universitas Islam di Madinah dan aktif mengajar serta berdakwah di berbagai forum kajian.",
          },
        ],
      },
    ],
    pendidikan: [
      { _key: "p1", institusi: "Universitas Islam Madinah", gelar: "Lc (Sarjana Syariah)", tahun: "2010" },
    ],
    tautanSosial: [
      { _key: "s1", platform: "YouTube", url: "https://youtube.com" },
    ],
  });
  console.log("✓ Profil Ustadz");

  // --- Artikel ---
  const artikelList = [
    {
      _type: "artikel",
      _id: "artikel-tauhid-dasar",
      judul: "Memahami Tauhid: Fondasi Utama Aqidah Islam",
      slug: { _type: "slug", current: "memahami-tauhid-fondasi-utama-aqidah-islam" },
      ringkasan: "Tauhid adalah inti dari ajaran Islam. Memahaminya dengan benar adalah kewajiban setiap Muslim agar ibadah kita diterima oleh Allah Subhanahu wa Ta'ala.",
      kategori: { _type: "reference", _ref: "kategori-aqidah" },
      tanggalTerbit: "2025-01-15T08:00:00.000Z",
      isi: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "Tauhid secara bahasa berarti mengesakan. Secara istilah, tauhid adalah mengesakan Allah dalam segala hal yang menjadi kekhususan-Nya, baik dalam rububiyyah, uluhiyyah, maupun asma wa sifat-Nya." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "Pembagian Tauhid" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "Para ulama membagi tauhid menjadi tiga bagian utama: Tauhid Rububiyyah (mengesakan Allah dalam perbuatan-Nya), Tauhid Uluhiyyah (mengesakan Allah dalam ibadah), dan Tauhid Asma wa Sifat (mengesakan Allah dalam nama dan sifat-Nya)." }] },
        { _type: "block", _key: "b4", style: "normal", children: [{ _type: "span", _key: "s4", text: "Ketiga jenis tauhid ini harus dipahami secara utuh dan diamalkan dalam kehidupan sehari-hari. Seseorang belum dianggap bertauhid dengan sempurna jika hanya mengakui salah satu bagian saja." }] },
        { _type: "block", _key: "b5", style: "h2", children: [{ _type: "span", _key: "s5", text: "Pentingnya Mempelajari Tauhid" }] },
        { _type: "block", _key: "b6", style: "normal", children: [{ _type: "span", _key: "s6", text: "Allah Ta'ala berfirman dalam Al-Qur'an bahwa Dia tidak akan mengampuni dosa syirik, namun mengampuni dosa-dosa selainnya bagi siapa yang Dia kehendaki. Ini menunjukkan betapa agungnya kedudukan tauhid dalam Islam." }] },
      ],
      tags: ["tauhid", "aqidah", "dasar-islam"],
    },
    {
      _type: "artikel",
      _id: "artikel-sholat-khusyuk",
      judul: "Kunci Meraih Kekhusyukan dalam Shalat",
      slug: { _type: "slug", current: "kunci-meraih-kekhusyukan-dalam-shalat" },
      ringkasan: "Shalat adalah tiang agama, namun berapa banyak dari kita yang benar-benar merasakannya? Inilah panduan praktis untuk meraih kekhusyukan yang sesungguhnya.",
      kategori: { _type: "reference", _ref: "kategori-fiqih" },
      tanggalTerbit: "2025-02-03T09:00:00.000Z",
      isi: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "Kekhusyukan dalam shalat adalah ruh dari ibadah tersebut. Rasulullah bersabda bahwa betapa banyak orang yang shalat namun tidak mendapatkan apa-apa kecuali kelelahan." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "Persiapan Sebelum Shalat" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "Kekhusyukan dimulai jauh sebelum takbir pertama. Persiapkan hati dengan berwudhu secara sempurna, kenakan pakaian terbaik, dan datanglah ke tempat shalat dengan tenang." }] },
        { _type: "block", _key: "b4", style: "h2", children: [{ _type: "span", _key: "s4", text: "Memahami Makna Bacaan" }] },
        { _type: "block", _key: "b5", style: "normal", children: [{ _type: "span", _key: "s5", text: "Salah satu kunci terbesar kekhusyukan adalah memahami apa yang kita baca. Pelajari terjemah Al-Fatihah dan bacaan-bacaan shalat lainnya sehingga kita tahu kepada siapa kita sedang berbicara." }] },
      ],
      tags: ["shalat", "ibadah", "khusyuk"],
    },
    {
      _type: "artikel",
      _id: "artikel-adab-bertetangga",
      judul: "Adab Bertetangga dalam Islam: Hak yang Sering Terlupakan",
      slug: { _type: "slug", current: "adab-bertetangga-dalam-islam" },
      ringkasan: "Islam menempatkan hak tetangga sangat tinggi hingga Rasulullah mengulang pesannya tiga kali. Seberapa baik kita menunaikan hak mereka?",
      kategori: { _type: "reference", _ref: "kategori-muamalah" },
      tanggalTerbit: "2025-03-10T10:00:00.000Z",
      isi: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "Rasulullah bersabda: 'Jibril terus menerus mewasiatkan kepadaku tentang tetangga, hingga aku mengira tetangga akan mendapat warisan.' Hadits ini menunjukkan betapa besarnya hak tetangga dalam Islam." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "Hak-hak Tetangga" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "Di antara hak tetangga adalah: tidak menyakitinya baik dengan perkataan maupun perbuatan, berbagi makanan kepadanya, menjenguknya ketika sakit, mengucapkan selamat saat ada kebahagiaan, dan berduka bersamanya saat ada musibah." }] },
      ],
      tags: ["muamalah", "adab", "tetangga", "akhlak"],
    },
    {
      _type: "artikel",
      _id: "artikel-ikhlas-amalan",
      judul: "Ikhlas: Syarat Diterimanya Setiap Amalan",
      slug: { _type: "slug", current: "ikhlas-syarat-diterimanya-setiap-amalan" },
      ringkasan: "Amalan sebesar gunung pun tidak akan diterima tanpa keikhlasan. Bagaimana cara kita menanamkan dan menjaga keikhlasan dalam setiap ibadah?",
      kategori: { _type: "reference", _ref: "kategori-akhlak" },
      tanggalTerbit: "2025-04-05T08:30:00.000Z",
      isi: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "Allah Ta'ala berfirman: 'Padahal mereka tidak disuruh kecuali supaya menyembah Allah dengan memurnikan ketaatan kepada-Nya dalam (menjalankan) agama...' (QS. Al-Bayyinah: 5). Ayat ini menegaskan bahwa ikhlas adalah syarat mutlak diterimanya ibadah." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "Pengertian Ikhlas" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "Ikhlas adalah memurnikan niat hanya untuk Allah semata, tidak ada campuran motivasi lain seperti ingin dipuji manusia, mencari keuntungan duniawi, atau menghindari celaan." }] },
      ],
      tags: ["akhlak", "ikhlas", "ibadah", "tazkiyatunnafs"],
    },
    {
      _type: "artikel",
      _id: "artikel-featured",
      judul: "Mengenal Rukun Iman: Pilar Keimanan yang Wajib Diketahui Setiap Muslim",
      slug: { _type: "slug", current: "mengenal-rukun-iman-pilar-keimanan" },
      ringkasan: "Iman bukan sekadar ucapan di lisan. Ia mencakup keyakinan di hati, perkataan, dan perbuatan. Pelajari enam rukun iman beserta penjelasan rincinya.",
      kategori: { _type: "reference", _ref: "kategori-aqidah" },
      tanggalTerbit: "2025-05-01T07:00:00.000Z",
      isi: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "Rukun iman ada enam: iman kepada Allah, kepada malaikat-Nya, kepada kitab-kitab-Nya, kepada rasul-rasul-Nya, kepada Hari Akhir, dan kepada takdir baik maupun buruk. Keenamnya disebutkan dalam satu hadits yang diriwayatkan oleh Umar bin Khattab radhiyallahu 'anhu." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "1. Iman kepada Allah" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "Iman kepada Allah mencakup iman terhadap wujud-Nya, rububiyyah-Nya, uluhiyyah-Nya, serta asma dan sifat-Nya. Ini adalah fondasi dari seluruh rukun iman yang lain." }] },
        { _type: "block", _key: "b4", style: "h2", children: [{ _type: "span", _key: "s4", text: "2. Iman kepada Malaikat" }] },
        { _type: "block", _key: "b5", style: "normal", children: [{ _type: "span", _key: "s5", text: "Malaikat adalah makhluk yang diciptakan Allah dari cahaya. Mereka tidak pernah membangkang kepada Allah dan selalu melaksanakan apa yang diperintahkan kepada mereka." }] },
        { _type: "block", _key: "b6", style: "h2", children: [{ _type: "span", _key: "s6", text: "Kesimpulan" }] },
        { _type: "block", _key: "b7", style: "normal", children: [{ _type: "span", _key: "s7", text: "Mempelajari rukun iman bukan sekadar hafalan, melainkan pemahaman yang harus tertanam di hati dan tercermin dalam kehidupan sehari-hari. Semoga Allah meneguhkan iman kita." }] },
      ],
      tags: ["aqidah", "rukun-iman", "tauhid"],
    },
  ];

  for (const a of artikelList) {
    await client.createOrReplace(a);
    console.log(`✓ Artikel: ${a.title}`);
  }

  // --- Nasihat ---
  const nasihatList = [
    {
      _type: "nasihat",
      _id: "nasihat-1",
      teks: "Setiap amalan tergantung pada niatnya. Maka luruskanlah niatmu sebelum beramal, karena itulah yang akan menentukan nilainya di sisi Allah.",
      slug: { _type: "slug", current: "setiap-amalan-tergantung-niatnya" },
      kategori: { _type: "reference", _ref: "kategori-akhlak" },
      narasumber: "Umar bin Al-Khattab",
      referensiKitab: "Shahih Al-Bukhari, no. 1",
      tanggalTerbit: "2025-01-20T08:00:00.000Z",
      tema: "pasir",
    },
    {
      _type: "nasihat",
      _id: "nasihat-2",
      teks: "Janganlah kamu meremehkan kebaikan sekecil apapun, meskipun hanya dengan menyambut saudaramu dengan wajah yang berseri.",
      slug: { _type: "slug", current: "jangan-remehkan-kebaikan-sekecil-apapun" },
      kategori: { _type: "reference", _ref: "kategori-akhlak" },
      narasumber: "Abu Dzar Al-Ghifari",
      referensiKitab: "Shahih Muslim, no. 2626",
      tanggalTerbit: "2025-02-10T09:00:00.000Z",
      tema: "zaitun",
    },
    {
      _type: "nasihat",
      _id: "nasihat-3",
      teks: "Dunia ini tidak lebih berharga di sisi Allah daripada sayap seekor nyamuk. Jangan biarkan ia membuatmu lalai dari mempersiapkan akhirat.",
      slug: { _type: "slug", current: "dunia-tidak-lebih-berharga-dari-sayap-nyamuk" },
      kategori: { _type: "reference", _ref: "kategori-aqidah" },
      narasumber: "Nabi Muhammad ﷺ",
      referensiKitab: "Sunan At-Tirmidzi, no. 2320",
      tanggalTerbit: "2025-03-05T07:30:00.000Z",
      tema: "arang",
    },
    {
      _type: "nasihat",
      _id: "nasihat-4",
      teks: "Barang siapa yang menginginkan kebahagiaan dunia, maka hendaklah ia berilmu. Barang siapa yang menginginkan kebahagiaan akhirat, maka hendaklah ia berilmu. Dan barang siapa yang menginginkan keduanya, maka hendaklah ia berilmu.",
      slug: { _type: "slug", current: "menginginkan-kebahagiaan-maka-berilmu" },
      kategori: { _type: "reference", _ref: "kategori-aqidah" },
      narasumber: "Imam Syafi'i",
      referensiKitab: "Al-Majmu' Syarh Al-Muhadzdzab",
      tanggalTerbit: "2025-03-25T10:00:00.000Z",
      tema: "krem",
    },
    {
      _type: "nasihat",
      _id: "nasihat-5",
      teks: "Seorang Muslim yang kuat lebih baik dan lebih dicintai Allah daripada seorang Muslim yang lemah. Perkuatlah dirimu dengan ilmu, iman, dan amal.",
      slug: { _type: "slug", current: "muslim-yang-kuat-lebih-baik" },
      kategori: { _type: "reference", _ref: "kategori-akhlak" },
      narasumber: "Nabi Muhammad ﷺ",
      referensiKitab: "Shahih Muslim, no. 2664",
      tanggalTerbit: "2025-04-15T08:00:00.000Z",
      tema: "pasir",
    },
    {
      _type: "nasihat",
      _id: "nasihat-6",
      teks: "Takwa bukanlah pakaian yang dikenakan hanya di masjid. Ia adalah cahaya yang harus menerangi setiap langkah, setiap ucapan, dan setiap pilihan dalam hidupmu.",
      slug: { _type: "slug", current: "takwa-bukan-hanya-di-masjid" },
      kategori: { _type: "reference", _ref: "kategori-aqidah" },
      narasumber: "Ibnu Qayyim Al-Jauziyyah",
      referensiKitab: "Madarij As-Salikin",
      tanggalTerbit: "2025-05-01T07:00:00.000Z",
      tema: "zaitun",
    },
  ];

  for (const n of nasihatList) {
    await client.createOrReplace(n);
    console.log(`✓ Nasihat: ${n.teks.substring(0, 50)}...`);
  }

  console.log("\n✅ Seeding complete! Data is now in Sanity.");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
