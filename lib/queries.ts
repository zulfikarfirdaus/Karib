import { groq } from "next-sanity";

const kategoriFragment = groq`
  kategori-> {
    _id,
    nama,
    "slug": slug.current
  }
`;

export const artikelCardFragment = groq`
  _id,
  judul,
  "slug": slug.current,
  ringkasan,
  gambarUtama { asset->, alt },
  ${kategoriFragment},
  tanggalTerbit,
  tags
`;

export const nasihatCardFragment = groq`
  _id,
  teks,
  "slug": slug.current,
  ${kategoriFragment},
  tema,
  narasumber,
  referensiKitab,
  tanggalTerbit
`;

// Tanya Jawab card fragment
export const tanyaJawabCardFragment = groq`
  _id,
  judul,
  pertanyaan,
  "slug": slug.current,
  ringkasan,
  ${kategoriFragment},
  tanggalTerbit,
  tags
`;

// Home page
export const homeQuery = groq`{
  "featuredArtikel": *[_type == "artikel"] | order(tanggalTerbit desc)[0] {
    ${artikelCardFragment}
  },
  "latestArtikel": *[_type == "artikel"] | order(tanggalTerbit desc)[1..7] {
    ${artikelCardFragment}
  },
  "latestNasihat": *[_type == "nasihat"] | order(tanggalTerbit desc)[0..5] {
    ${nasihatCardFragment}
  },
  "latestTanyaJawab": *[_type == "tanyaJawab"] | order(tanggalTerbit desc)[0..5] {
    ${tanyaJawabCardFragment}
  },
  "kategoris": *[_type == "kategori"] | order(nama asc) {
    _id, nama, "slug": slug.current
  }
}`;

// Artikel listing
export const allArtikelQuery = groq`
  *[_type == "artikel"] | order(tanggalTerbit desc) {
    ${artikelCardFragment}
  }
`;

export const artikelByKategoriQuery = groq`
  *[_type == "artikel" && kategori->slug.current == $slug] | order(tanggalTerbit desc) {
    ${artikelCardFragment}
  }
`;

export const paginatedArtikelQuery = groq`
{
  "total": count(*[_type == "artikel"]),
  "items": *[_type == "artikel"] | order(tanggalTerbit desc) [$start...$end] {
    ${artikelCardFragment}
  }
}
`;

export const paginatedArtikelByKategoriQuery = groq`
{
  "total": count(*[_type == "artikel" && kategori->slug.current == $slug]),
  "items": *[_type == "artikel" && kategori->slug.current == $slug] | order(tanggalTerbit desc) [$start...$end] {
    ${artikelCardFragment}
  }
}
`;

// Artikel detail — no related (related is fetched separately for streaming)
export const artikelDetailQuery = groq`
  *[_type == "artikel" && slug.current == $slug][0] {
    _id,
    judul,
    "slug": slug.current,
    ringkasan,
    gambarUtama { asset->, alt },
    ${kategoriFragment},
    "kategorRef": kategori._ref,
    isi,
    filePdf { asset-> },
    tanggalTerbit,
    tags
  }
`;

export const relatedArtikelQuery = groq`
  *[_type == "artikel" && slug.current != $slug] {
    ${artikelCardFragment},
    "_score": select(kategori._ref == $kategorRef => 1, 0)
  } | order(_score desc, tanggalTerbit desc)[0..2]
`;

// Tanya Jawab listing
export const allTanyaJawabQuery = groq`
  *[_type == "tanyaJawab"] | order(tanggalTerbit desc) {
    ${tanyaJawabCardFragment}
  }
`;

export const paginatedTanyaJawabQuery = groq`
{
  "total": count(*[_type == "tanyaJawab"]),
  "items": *[_type == "tanyaJawab"] | order(tanggalTerbit desc) [$start...$end] {
    ${tanyaJawabCardFragment}
  }
}
`;

// Tanya Jawab detail — related is fetched separately for streaming
export const tanyaJawabDetailQuery = groq`
  *[_type == "tanyaJawab" && slug.current == $slug][0] {
    _id,
    judul,
    pertanyaan,
    "slug": slug.current,
    ringkasan,
    ${kategoriFragment},
    "kategorRef": kategori._ref,
    jawaban,
    tanggalTerbit,
    tags
  }
`;

export const relatedTanyaJawabQuery = groq`
  *[_type == "tanyaJawab" && kategori._ref == $kategorRef && slug.current != $slug] | order(tanggalTerbit desc)[0..2] {
    ${tanyaJawabCardFragment}
  }
`;

// Nasihat listing
export const allNasihatQuery = groq`
  *[_type == "nasihat"] | order(tanggalTerbit desc) {
    ${nasihatCardFragment}
  }
`;

export const nasihatByKategoriQuery = groq`
  *[_type == "nasihat" && kategori->slug.current == $slug] | order(tanggalTerbit desc) {
    ${nasihatCardFragment}
  }
`;

// Nasihat detail
export const nasihatDetailQuery = groq`
  *[_type == "nasihat" && slug.current == $slug][0] {
    _id,
    teks,
    "slug": slug.current,
    ${kategoriFragment},
    tema,
    narasumber,
    referensiKitab,
    tanggalTerbit
  }
`;

// Kategori page (all content)
export const kategoriPageQuery = groq`{
  "kategori": *[_type == "kategori" && slug.current == $slug][0] {
    _id, nama, "slug": slug.current, deskripsi
  },
  "artikels": *[_type == "artikel" && kategori->slug.current == $slug] | order(tanggalTerbit desc) {
    ${artikelCardFragment}
  },
  "nasihats": *[_type == "nasihat" && kategori->slug.current == $slug] | order(tanggalTerbit desc) {
    ${nasihatCardFragment}
  }
}`;

// All categories
export const allKategoriQuery = groq`
  *[_type == "kategori"] | order(nama asc) {
    _id, nama, "slug": slug.current, deskripsi
  }
`;

// Profile (singleton)
export const profilQuery = groq`
  *[_type == "profilUstadz"][0] {
    nama, gelar, foto { asset-> }, bio, pendidikan, tautanSosial
  }
`;

// Search
export const searchQuery = groq`{
  "artikels": *[_type == "artikel" && (judul match $q || ringkasan match $q)] | order(tanggalTerbit desc) {
    ${artikelCardFragment}
  },
  "nasihats": *[_type == "nasihat" && teks match $q] | order(tanggalTerbit desc) {
    ${nasihatCardFragment}
  }
}`;
