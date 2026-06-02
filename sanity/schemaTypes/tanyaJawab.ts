import { defineField, defineType } from "sanity";

export default defineType({
  name: "tanyaJawab",
  title: "Tanya Jawab",
  type: "document",
  fields: [
    defineField({
      name: "pertanyaan",
      title: "Pertanyaan",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: { source: "pertanyaan", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ringkasan",
      title: "Ringkasan",
      type: "text",
      rows: 2,
      description: "Deskripsi singkat untuk SEO dan pratinjau (opsional)",
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "kategori",
      title: "Kategori",
      type: "reference",
      to: [{ type: "kategori" }],
    }),
    defineField({
      name: "jawaban",
      title: "Jawaban Ustadz",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
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
        {
          name: "pullQuote",
          type: "object",
          title: "Pull Quote",
          fields: [
            defineField({ name: "teks", title: "Teks", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
            defineField({ name: "atribusi", title: "Atribusi (opsional)", type: "string" }),
          ],
          preview: {
            select: { title: "teks" },
            prepare: (value: Record<string, unknown>) => ({
              title: `" ${String(value.title ?? "").substring(0, 60)}…"`,
            }),
          },
        },
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
            defineField({ name: "judul", title: "Judul Callout (opsional)", type: "string" }),
            defineField({ name: "isi", title: "Isi", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: "judul", subtitle: "isi", jenis: "jenis" },
            prepare: ({ title, subtitle, jenis }: { title?: string; subtitle?: string; jenis?: string }) => ({
              title: title || subtitle?.substring(0, 60) || "Callout",
              subtitle: jenis,
            }),
          },
        },
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
          preview: { prepare: () => ({ title: "─── Pemisah ───" }) },
        },
      ],
      validation: (Rule) => Rule.required(),
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
      title: "pertanyaan",
      subtitle: "kategori.nama",
    },
  },
});
