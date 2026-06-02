import { safeFetch } from "@/sanity/lib/client";
import { allTanyaJawabQuery } from "@/lib/queries";
import { TanyaJawabCard } from "@/components/tanyajawab/TanyaJawabCard";
import { TanyaKaribForm } from "@/components/tanyajawab/TanyaKaribForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tanya Jawab",
  description: "Kumpulan tanya jawab seputar ilmu Islam bersama Ustadz Muhammad Ibrahim Saleh, Lc.",
};

export default async function TanyaJawabPage() {
  const items = (await safeFetch(allTanyaJawabQuery)) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-16">
      <div className="mb-10">
        <p className="text-xs font-heading uppercase tracking-widest text-accent mb-2">
          Ilmu Islam
        </p>
        <h1 className="font-heading font-bold text-4xl tracking-tighter leading-none text-fg">
          Tanya Jawab
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-heading text-fg-muted text-sm">
            Belum ada tanya jawab yang diterbitkan.
          </p>
        </div>
      ) : (
        <div>
          {items.map((item: Parameters<typeof TanyaJawabCard>[0]["item"]) => (
            <TanyaJawabCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* Tanya Karib */}
      <div className="mt-16 bg-white dark:bg-card rounded-2xl px-8 py-10">
        <div className="mb-6">
          <p className="text-xs font-heading uppercase tracking-widest text-accent mb-2">
            Tanya Karib
          </p>
          <h2 className="font-heading font-bold text-2xl tracking-tight text-fg">
            Ada Pertanyaan?
          </h2>
          <p className="mt-2 text-sm font-body text-fg-muted">
            Kirim pertanyaanmu, jika terpilih maka akan Ustadz jawab dan diterbitkan di website ini.
          </p>
        </div>
        <TanyaKaribForm />
      </div>
    </div>
  );
}
