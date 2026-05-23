import { defineField, defineType } from "sanity";

export default defineType({
  name: "kategori",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({
      name: "nama",
      title: "Nama Kategori",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nama" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deskripsi",
      title: "Deskripsi",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "nama" },
  },
});
