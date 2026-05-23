/**
 * Updates the featured article with rich content that demos every block type,
 * generates a minimal PDF, and uploads it to Sanity as a file asset.
 */
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

// ─── Minimal PDF generator ──────────────────────────────────────────────────

function escapePDF(str) {
  return str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createPDF({ title, subtitle, author, lines }) {
  // Build content stream with title + body lines
  const streamLines = [
    "BT",
    "/F1 22 Tf",
    "60 760 Td",
    `(${escapePDF(title)}) Tj`,
    "0 -10 Td",
    "/F2 1 Tf (.) Tj", // thin rule via zero-height trick
    "/F1 11 Tf",
    "0 -20 Td",
    `(${escapePDF(subtitle)}) Tj`,
    "0 -35 Td",
  ];

  for (const line of lines) {
    streamLines.push(`(${escapePDF(line)}) Tj`);
    streamLines.push("0 -20 Td");
  }

  streamLines.push("0 -30 Td");
  streamLines.push("/F1 10 Tf");
  streamLines.push(`(${escapePDF(author)}) Tj`);
  streamLines.push("ET");

  const streamContent = streamLines.join("\n");

  const objs = [];

  objs[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objs[2] = `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`;
  objs[3] = [
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842]",
    "   /Contents 4 0 R",
    "   /Resources << /Font << /F1 5 0 R /F2 5 0 R >> >> >>",
  ].join("\n");
  objs[4] = `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`;
  objs[5] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0, 0, 0, 0, 0, 0];

  for (let i = 1; i <= 5; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += "xref\n0 6\n";
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= 5; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

// ─── Rich article content (ISI) ──────────────────────────────────────────────

function block(style, text, marks = []) {
  const key = Math.random().toString(36).slice(2, 8);
  return {
    _type: "block",
    _key: key,
    style,
    children: [{ _type: "span", _key: key + "s", text, marks }],
  };
}

function blockMarked(style, spans) {
  const key = Math.random().toString(36).slice(2, 8);
  return {
    _type: "block",
    _key: key,
    style,
    children: spans.map((s, i) => ({
      _type: "span",
      _key: key + "s" + i,
      text: s.text,
      marks: s.marks ?? [],
    })),
  };
}

function listItem(style, text, marks = []) {
  const key = Math.random().toString(36).slice(2, 8);
  return {
    _type: "block",
    _key: key,
    style: "normal",
    listItem: style,
    level: 1,
    children: [{ _type: "span", _key: key + "s", text, marks }],
  };
}

function pullQuote(teks, atribusi) {
  return {
    _type: "pullQuote",
    _key: Math.random().toString(36).slice(2, 8),
    teks,
    atribusi,
  };
}

function callout(jenis, isi, judul) {
  return {
    _type: "callout",
    _key: Math.random().toString(36).slice(2, 8),
    jenis,
    isi,
    ...(judul ? { judul } : {}),
  };
}

function codeBlock(kode, bahasa) {
  return {
    _type: "codeBlock",
    _key: Math.random().toString(36).slice(2, 8),
    kode,
    bahasa,
  };
}

function divider(gaya = "dots") {
  return {
    _type: "divider",
    _key: Math.random().toString(36).slice(2, 8),
    gaya,
  };
}

const isi = [
  // ── Opening ──────────────────────────────────────────────────────
  block(
    "normal",
    "Di antara perkara yang paling wajib diketahui oleh setiap Muslim adalah enam rukun iman. Ini bukan sekadar hafalan. Ia adalah fondasi yang menopang seluruh bangunan agama seseorang."
  ),
  block(
    "normal",
    "Artikel ini akan mengurai keenam rukun tersebut secara rinci, beserta dalil, catatan penting, dan kesalahan-kesalahan umum yang perlu dihindari."
  ),

  // ── Pull Quote ───────────────────────────────────────────────────
  pullQuote(
    "Iman itu bukan angan-angan dan bukan pula hiasan, melainkan apa yang bersemayam di hati dan dibuktikan dengan amal perbuatan.",
    "— Imam Hasan Al-Bashri"
  ),

  // ── H1 Section ───────────────────────────────────────────────────
  block("h1", "Keenam Rukun Iman"),

  block(
    "normal",
    "Dalil keenam rukun iman terdapat dalam hadits Jibril yang masyhur, ketika ia bertanya kepada Rasulullah ﷺ tentang iman. Beliau menjawab:"
  ),

  block(
    "blockquote",
    "Iman adalah engkau beriman kepada Allah, malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, Hari Akhir, dan beriman kepada takdir yang baik maupun yang buruk."
  ),

  block("normal", "(HR. Muslim no. 8)"),

  divider("dots"),

  // ── H2 + H3 ──────────────────────────────────────────────────────
  block("h2", "1. Iman kepada Allah"),

  block(
    "normal",
    "Iman kepada Allah mencakup empat perkara yang tidak boleh dipisah-pisahkan. Keempat perkara ini membentuk satu kesatuan yang utuh dalam keyakinan seorang Muslim."
  ),

  block("h3", "a. Iman terhadap Wujud Allah"),
  block(
    "normal",
    "Ini adalah perkara yang paling mendasar. Allah ada — keberadaan-Nya terbukti melalui fitrah, akal, syariat, dan kenyataan inderawi. Tidak ada satu pun makhluk yang menciptakan dirinya sendiri."
  ),

  block("h3", "b. Iman terhadap Rububiyyah"),
  blockMarked("normal", [
    { text: "Tauhid Rububiyyah" },
    { text: " adalah mengesakan Allah dalam segala perbuatan-Nya: menciptakan, memberi rezeki, menghidupkan, mematikan, dan mengatur seluruh alam semesta. Kata kunci yang perlu diingat: " },
    { text: "Allah adalah satu-satunya Pencipta dan Pengatur.", marks: ["strong"] },
  ]),

  // ── Callout: Info ────────────────────────────────────────────────
  callout(
    "info",
    "Tauhid rububiyyah saja tidak cukup untuk menjadi seorang Muslim. Orang-orang musyrik Quraisy pun mengakui bahwa Allah-lah Pencipta alam semesta, namun mereka tetap disebut musyrik karena tidak mengesakan-Nya dalam ibadah.",
    "Perhatikan:"
  ),

  block("h3", "c. Iman terhadap Uluhiyyah"),
  block(
    "normal",
    "Ini adalah inti dari dakwah para nabi: mengesakan Allah dalam ibadah. Tidak boleh ada sesembahan lain selain Allah. Inilah makna dari syahadat la ilaha illallah."
  ),

  block("h3", "d. Iman terhadap Asma wa Sifat"),
  blockMarked("normal", [
    { text: "Kita menetapkan nama-nama dan sifat-sifat Allah sesuai yang Allah tetapkan untuk diri-Nya dalam Al-Qur'an dan yang Rasul-Nya tetapkan dalam hadits yang shahih — " },
    { text: "tanpa tahrif, ta'thil, takyif, maupun tamtsil.", marks: ["em"] },
  ]),

  // ── Callout: Tip ─────────────────────────────────────────────────
  callout(
    "tip",
    "Cara mudah mengingat empat perkara iman kepada Allah: WARU — Wujud, Allah ada; Rububiyyah, Allah Pencipta dan Pengatur; Uluhiyyah, Allah satu-satunya yang berhak diibadahi; (Asma wa) sifat, nama dan sifat Allah ditetapkan sebagaimana adanya.",
    "Faedah"
  ),

  divider("line"),

  // ── H2 Section ───────────────────────────────────────────────────
  block("h2", "2. Iman kepada Malaikat"),

  block(
    "normal",
    "Malaikat adalah makhluk yang Allah ciptakan dari cahaya. Mereka tidak pernah mendurhakai Allah dan selalu melaksanakan apa yang diperintahkan. Di antara malaikat yang wajib kita ketahui namanya:"
  ),

  listItem("bullet", "Jibril — pembawa wahyu"),
  listItem("bullet", "Mikail — penjaga hujan dan tumbuh-tumbuhan"),
  listItem("bullet", "Israfil — peniup sangkakala"),
  listItem("bullet", "Izrail — pencabut nyawa"),
  listItem("bullet", "Raqib dan Atid — pencatat amal"),
  listItem("bullet", "Munkar dan Nakir — penanya di alam kubur"),
  listItem("bullet", "Malik — penjaga neraka"),
  listItem("bullet", "Ridwan — penjaga surga"),

  divider("dots"),

  // ── H2 Section ───────────────────────────────────────────────────
  block("h2", "3. Iman kepada Kitab-kitab Allah"),

  block(
    "normal",
    "Allah menurunkan kitab-kitab-Nya kepada para rasul sebagai petunjuk bagi manusia. Empat kitab utama yang disebutkan dalam Al-Qur'an:"
  ),

  listItem("number", "Taurat — diturunkan kepada Nabi Musa 'alaihissalam"),
  listItem("number", "Zabur — diturunkan kepada Nabi Dawud 'alaihissalam"),
  listItem("number", "Injil — diturunkan kepada Nabi Isa 'alaihissalam"),
  listItem("number", "Al-Qur'an — diturunkan kepada Nabi Muhammad ﷺ"),

  // ── Callout: Peringatan ──────────────────────────────────────────
  callout(
    "peringatan",
    "Taurat, Zabur, dan Injil yang ada sekarang sudah mengalami perubahan dan pemalsuan (tahrif). Kita tidak boleh membenarkan maupun mendustakan isinya secara sembarangan. Yang wajib diikuti hanyalah Al-Qur'an, sebab ia terjaga kemurniannya hingga hari kiamat.",
    "Peringatan penting:"
  ),

  divider("dots"),

  // ── H2 Section ───────────────────────────────────────────────────
  block("h2", "4. Iman kepada Para Rasul"),

  blockMarked("normal", [
    { text: "Kita beriman bahwa Allah mengutus para rasul kepada umat manusia dengan " },
    { text: "membawa berita gembira dan peringatan", marks: ["strong"] },
    { text: ". Jumlah nabi disebutkan dalam hadits sebanyak 124.000, sedangkan rasul berjumlah 315. Nama-nama yang disebutkan dalam Al-Qur'an ada 25 nabi dan rasul." },
  ]),

  // ── H4 ───────────────────────────────────────────────────────────
  block("h4", "Sifat Wajib Para Rasul"),

  listItem("bullet", "Siddiq — selalu jujur"),
  listItem("bullet", "Amanah — dapat dipercaya"),
  listItem("bullet", "Tabligh — menyampaikan risalah"),
  listItem("bullet", "Fathanah — cerdas dan bijaksana"),

  // ── Callout: Penting ─────────────────────────────────────────────
  callout(
    "penting",
    "Nabi Muhammad ﷺ adalah penutup para nabi dan rasul. Tidak ada nabi setelah beliau. Siapa yang mengaku-ngaku kenabian setelah beliau maka ia adalah pendusta, meski ia mendatangkan sejuta tanda-tanda ajaib.",
    "Khatamun Nabiyyin:"
  ),

  divider("dots"),

  // ── H2 Section ───────────────────────────────────────────────────
  block("h2", "5. Iman kepada Hari Akhir"),

  block(
    "normal",
    "Iman kepada Hari Akhir mencakup iman kepada semua yang terjadi setelah kematian: fitnah kubur, azab dan nikmat kubur, kebangkitan, pengumpulan di Padang Mahsyar, hisab, mizan, shirat, surga, dan neraka."
  ),

  pullQuote(
    "Dunia ini adalah penjara bagi orang beriman dan surga bagi orang kafir.",
    "— HR. Muslim"
  ),

  block(
    "normal",
    "Mengingat hari akhir adalah salah satu obat terbaik untuk hati yang lalai. Ia menyadarkan kita bahwa semua yang ada di dunia ini — jabatan, harta, popularitas — hanyalah sementara dan akan dimintai pertanggungjawaban."
  ),

  divider("line"),

  // ── H2 Section ───────────────────────────────────────────────────
  block("h2", "6. Iman kepada Takdir"),

  block(
    "normal",
    "Ini adalah rukun iman yang paling banyak disalahpahami. Iman kepada takdir memiliki empat tingkatan yang semuanya harus diyakini:"
  ),

  codeBlock(
    `1. Al-'Ilmu    — Allah mengetahui segala sesuatu yang akan terjadi
2. Al-Kitabah  — Allah mencatatnya di Lauhul Mahfuzh
3. Al-Masyiah  — Segala sesuatu terjadi atas kehendak Allah
4. Al-Khalq    — Allah-lah yang menciptakan segala sesuatu`,
    "Empat Tingkatan Iman kepada Takdir"
  ),

  callout(
    "info",
    "Iman kepada takdir tidak berarti kita boleh berpangku tangan. Rasulullah ﷺ bersabda: 'Beramallah, karena masing-masing akan dimudahkan kepada apa yang ia diciptakan untuknya.' Takdir tidak menghilangkan kewajiban berikhtiar.",
    "Salah Paham yang Umum:"
  ),

  block(
    "normal",
    "Iman kepada takdir seharusnya melahirkan ketenangan hati: kita tidak bersedih berlebihan atas musibah yang menimpa, dan tidak pula bangga berlebihan atas nikmat yang datang — karena semuanya berasal dari Allah dan semuanya atas kehendak-Nya."
  ),

  divider("dots"),

  // ── Penutup ──────────────────────────────────────────────────────
  block("h2", "Penutup"),

  blockMarked("normal", [
    { text: "Keenam rukun iman ini bukan hafalan ujian. Ia adalah " },
    { text: "cahaya yang menerangi setiap langkah kehidupan", marks: ["em"] },
    {
      text: ". Semakin dalam kita memahaminya, semakin kuat fondasi aqidah kita, dan semakin tenteram jiwa kita dalam menghadapi ujian dunia.",
    },
  ]),

  callout(
    "tip",
    "Untuk memperdalam pemahaman tentang rukun iman, bacalah karya-karya ulama seperti: Syarh Ushul Iman karya Syaikh Ibn Utsaimin, Al-Aqidah Al-Wasithiyah karya Syaikhul Islam Ibnu Taimiyyah, dan Al-Qawa'id Al-Mutsla karya Syaikh Ibn Utsaimin. Semuanya tersedia dalam terjemahan Bahasa Indonesia.",
    "Referensi Belajar Lebih Lanjut"
  ),

  block(
    "normal",
    "Semoga Allah memberikan kita pemahaman yang benar terhadap agama-Nya, meneguhkan iman kita di atas Al-Qur'an dan Sunnah, serta mewafatkan kita dalam keadaan husnul khatimah. Aamiin."
  ),
];

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  // 1. Generate & upload PDF
  console.log("Generating PDF...");
  const pdfBuffer = createPDF({
    title: "Ringkasan: Mengenal Rukun Iman",
    subtitle: "Enam Pilar Keimanan yang Wajib Diketahui Setiap Muslim",
    author: "Ustadz Muhammad Ibrahim Saleh, Lc — ustadzi.id",
    lines: [
      "1. Iman kepada Allah (wujud, rububiyyah, uluhiyyah, asma wa sifat)",
      "2. Iman kepada Malaikat-malaikat Allah",
      "3. Iman kepada Kitab-kitab Allah (Taurat, Zabur, Injil, Al-Qur'an)",
      "4. Iman kepada Rasul-rasul Allah (penutup: Nabi Muhammad SAW)",
      "5. Iman kepada Hari Akhir (kubur, mahsyar, hisab, surga, neraka)",
      "6. Iman kepada Takdir (ilmu, kitabah, masyiah, khalq)",
      "",
      "Dalil: Hadits Jibril — HR. Muslim no. 8",
      "",
      "Dokumen ini adalah ringkasan. Baca artikel lengkap di ustadzi.id",
    ],
  });

  console.log("Uploading PDF to Sanity...");
  const pdfAsset = await client.assets.upload("file", pdfBuffer, {
    filename: "ringkasan-rukun-iman.pdf",
    contentType: "application/pdf",
  });
  console.log("✓ PDF uploaded:", pdfAsset._id);

  // 2. Update the featured artikel
  console.log("Updating featured artikel...");
  await client.createOrReplace({
    _type: "artikel",
    _id: "artikel-featured",
    judul: "Mengenal Rukun Iman: Enam Pilar Keimanan yang Wajib Diketahui Setiap Muslim",
    slug: {
      _type: "slug",
      current: "mengenal-rukun-iman-pilar-keimanan",
    },
    ringkasan:
      "Iman bukan sekadar ucapan di lisan. Ia mencakup keyakinan di hati, perkataan, dan perbuatan. Pelajari enam rukun iman beserta dalil, catatan penting, dan kesalahan umum yang perlu dihindari.",
    kategori: { _type: "reference", _ref: "kategori-aqidah" },
    tanggalTerbit: "2025-05-01T07:00:00.000Z",
    tags: ["aqidah", "rukun-iman", "tauhid", "dasar-islam"],
    filePdf: {
      _type: "file",
      asset: { _type: "reference", _ref: pdfAsset._id },
    },
    isi,
  });

  console.log("✅ Featured artikel updated with rich content + PDF.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
