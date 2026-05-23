import { defineField, defineType } from "sanity";

export default defineType({
  name: "profilUstadz",
  title: "Profil Ustadz",
  type: "document",
  fields: [
    defineField({
      name: "nama",
      title: "Nama",
      type: "string",
      initialValue: "Muhammad Ibrahim Saleh",
    }),
    defineField({
      name: "gelar",
      title: "Gelar / Title",
      type: "string",
      initialValue: "Lc",
    }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Biografi",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "pendidikan",
      title: "Riwayat Pendidikan",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "institusi", title: "Institusi", type: "string" }),
            defineField({ name: "gelarDiperoleh", title: "Gelar", type: "string" }),
            defineField({ name: "tahun", title: "Tahun Lulus", type: "string" }),
          ],
          preview: {
            select: { title: "institusi", subtitle: "tahun" },
          },
        },
      ],
    }),
    defineField({
      name: "tautanSosial",
      title: "Tautan Media Sosial",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: ["YouTube", "Instagram", "Twitter/X", "Telegram", "Website"],
              },
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "nama", media: "foto" },
  },
});
