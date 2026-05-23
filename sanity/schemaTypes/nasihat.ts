import { defineField, defineType } from "sanity";

export default defineType({
  name: "nasihat",
  title: "Nasihat Singkat",
  type: "document",
  fields: [
    defineField({
      name: "teks",
      title: "Teks Nasihat",
      type: "text",
      rows: 4,
      description: "Nasihat singkat (maksimal 300 karakter untuk poster)",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: {
        source: (doc) => {
          const words = (doc.teks as string)?.split(" ").slice(0, 6).join(" ");
          return words ?? "nasihat";
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kategori",
      title: "Kategori",
      type: "reference",
      to: [{ type: "kategori" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "narasumber",
      title: "Nama Narasumber",
      type: "string",
      description: "Nama ulama, sahabat, atau tokoh yang dikutip (tampil di atas poster)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "referensiKitab",
      title: "Referensi Kitab",
      type: "string",
      description: "Nama kitab atau sumber rujukan (tampil di bawah poster)",
    }),
    defineField({
      name: "tema",
      title: "Tema Poster",
      type: "string",
      options: {
        list: [
          { title: "Pasir (Krem)", value: "pasir" },
          { title: "Zaitun (Hijau Tua)", value: "zaitun" },
          { title: "Arang (Gelap)", value: "arang" },
          { title: "Krem Terang", value: "krem" },
        ],
        layout: "radio",
      },
      initialValue: "pasir",
    }),
    defineField({
      name: "tanggalTerbit",
      title: "Tanggal Terbit",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
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
      title: "teks",
      subtitle: "kategori.nama",
    },
    prepare({ title, subtitle }) {
      return {
        title: (title as string)?.substring(0, 60) + "…",
        subtitle,
      };
    },
  },
});
