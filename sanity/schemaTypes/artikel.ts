import { defineField, defineType } from "sanity";

export default defineType({
  name: "artikel",
  title: "Artikel",
  type: "document",
  fields: [
    defineField({
      name: "judul",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: { source: "judul", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ringkasan",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      description: "Deskripsi singkat artikel (tampil di kartu dan SEO)",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "gambarUtama",
      title: "Gambar Utama",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "kategori",
      title: "Kategori",
      type: "reference",
      to: [{ type: "kategori" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isi",
      title: "Isi Artikel",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote / Blockquote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Strikethrough", value: "strike-through" },
              { title: "Inline Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  { name: "href", type: "url", title: "URL" },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Buka di tab baru",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
        },
        // ─── Custom block: Pull Quote ───────────────────────────────
        {
          name: "pullQuote",
          type: "object",
          title: "Pull Quote",
          fields: [
            defineField({
              name: "teks",
              title: "Teks",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "atribusi",
              title: "Atribusi (opsional)",
              type: "string",
              description: "Misal: — Imam Malik, atau nama ulama",
            }),
          ],
          preview: {
            select: { title: "teks" },
            prepare: (value: Record<string, unknown>) => ({
              title: `" ${String(value.title ?? "").substring(0, 60)}…"`,
            }),
          },
        },
        // ─── Custom block: Callout ──────────────────────────────────
        {
          name: "callout",
          type: "object",
          title: "Callout / Kotak Info",
          fields: [
            defineField({
              name: "jenis",
              title: "Jenis",
              type: "string",
              options: {
                list: [
                  { title: "Info", value: "info" },
                  { title: "Tip / Faedah", value: "tip" },
                  { title: "Peringatan", value: "peringatan" },
                  { title: "Penting", value: "penting" },
                ],
                layout: "radio",
              },
              initialValue: "info",
            }),
            defineField({
              name: "judul",
              title: "Judul Callout (opsional)",
              type: "string",
            }),
            defineField({
              name: "isi",
              title: "Isi",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "judul", subtitle: "isi", jenis: "jenis" },
            prepare: ({
              title,
              subtitle,
              jenis,
            }: {
              title?: string;
              subtitle?: string;
              jenis?: string;
            }) => ({
              title: title || subtitle?.substring(0, 60) || "Callout",
              subtitle: jenis,
            }),
          },
        },
        // ─── Custom block: Code Block ───────────────────────────────
        {
          name: "codeBlock",
          type: "object",
          title: "Blok Kode",
          fields: [
            defineField({
              name: "bahasa",
              title: "Bahasa / Label (opsional)",
              type: "string",
              description: "Misal: Arabic, Python, JavaScript",
            }),
            defineField({
              name: "kode",
              title: "Kode / Teks",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "bahasa", subtitle: "kode" },
            prepare: ({
              title,
              subtitle,
            }: {
              title?: string;
              subtitle?: string;
            }) => ({
              title: title ? `Code: ${title}` : "Code Block",
              subtitle: subtitle?.substring(0, 60),
            }),
          },
        },
        // ─── Custom block: Divider ──────────────────────────────────
        {
          name: "divider",
          type: "object",
          title: "Pemisah (Divider)",
          fields: [
            defineField({
              name: "gaya",
              title: "Gaya",
              type: "string",
              options: {
                list: [
                  { title: "Titik-titik  ···", value: "dots" },
                  { title: "Garis ——", value: "line" },
                ],
                layout: "radio",
              },
              initialValue: "dots",
            }),
          ],
          preview: {
            prepare: () => ({ title: "─── Pemisah ───" }),
          },
        },
        // ─── Image block ────────────────────────────────────────────
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
        },
      ],
    }),
    defineField({
      name: "filePdf",
      title: "File PDF (opsional)",
      type: "file",
      description: "Upload PDF jika artikel memiliki versi unduhan",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "tanggalTerbit",
      title: "Tanggal Terbit",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    {
      title: "Terbaru",
      name: "tanggalTerbitDesc",
      by: [{ field: "tanggalTerbit", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "judul",
      subtitle: "kategori.nama",
      media: "gambarUtama",
    },
  },
});
