import { defineField, defineType } from "sanity";

export default defineType({
  name: "pertanyaanMasuk",
  title: "Pertanyaan Masuk",
  type: "document",
  fields: [
    defineField({
      name: "nama",
      title: "Nama Pengirim",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nomorTelepon",
      title: "Nomor WhatsApp",
      type: "string",
      description: "Opsional",
    }),
    defineField({
      name: "pertanyaan",
      title: "Pertanyaan",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(1000),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Baru", value: "baru" },
          { title: "Diproses", value: "diproses" },
          { title: "Dijawab", value: "dijawab" },
        ],
        layout: "radio",
      },
      initialValue: "baru",
    }),
    defineField({
      name: "tanggalMasuk",
      title: "Tanggal Masuk",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Terbaru",
      name: "tanggalMasukDesc",
      by: [{ field: "tanggalMasuk", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "pertanyaan",
      subtitle: "nama",
      status: "status",
    },
    prepare({ title, subtitle, status }: { title?: string; subtitle?: string; status?: string }) {
      return {
        title: title?.substring(0, 80) ?? "Pertanyaan",
        subtitle: `${subtitle ?? "Anonim"} · ${status ?? "baru"}`,
      };
    },
  },
});
