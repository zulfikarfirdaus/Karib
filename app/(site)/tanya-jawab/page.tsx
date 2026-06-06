export const runtime = "edge";

import { safeFetch } from "@/sanity/lib/client";
import { paginatedTanyaJawabQuery } from "@/lib/queries";
import { TanyaJawabCard } from "@/components/tanyajawab/TanyaJawabCard";
import { TanyaKaribForm } from "@/components/tanyajawab/TanyaKaribForm";
import { Pagination } from "@/components/ui/Pagination";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tanya Jawab",
  description: "Kumpulan tanya jawab seputar ilmu Islam bersama Ustadz Muhammad Ibrahim Saleh, Lc.",
};

const PER_PAGE = 10;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function TanyaJawabPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const data = await safeFetch<{ total: number; items: Parameters<typeof TanyaJawabCard>[0]["item"][] }>(
    paginatedTanyaJawabQuery,
    { start, end }
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16">
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl tracking-tighter leading-none text-fg">
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <TanyaJawabCard key={item._id} item={item} />
            ))}
          </div>
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </>
      )}

      {/* Tanya Karib */}
      <div className="mt-20 bg-white dark:bg-card rounded-2xl px-4 sm:px-8 py-10">
        <div className="mb-6">
          <p className="text-xs font-heading uppercase tracking-widest text-accent mb-2">
            Tanya Karib
          </p>
          <h2 className="font-display font-bold text-2xl tracking-tight text-fg">
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
