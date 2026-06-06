export const runtime = "edge";

import { safeFetch } from "@/sanity/lib/client";
import {
  paginatedArtikelQuery,
  paginatedArtikelByKategoriQuery,
  allKategoriQuery,
  artikelDetailQuery,
} from "@/lib/queries";
import { ArticleCard } from "@/components/artikel/ArticleCard";
import { CategoryPills } from "@/components/ui/CategoryPills";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Kumpulan artikel ilmu Islam oleh Ustadz Muhammad Ibrahim Saleh, Lc.",
};

interface ArtikelPageProps {
  searchParams: Promise<{ kategori?: string; page?: string }>;
}

const PER_PAGE = 10;

async function ArtikelList({ searchParams }: { searchParams: Promise<{ kategori?: string; page?: string }> }) {
  const { kategori: kategoriSlug, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const data = await safeFetch<{ total: number; items: Parameters<typeof ArticleCard>[0]["artikel"][] }>(
    kategoriSlug ? paginatedArtikelByKategoriQuery : paginatedArtikelQuery,
    kategoriSlug ? { slug: kategoriSlug, start, end } : { start, end }
  );

  const artikels = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  // Warm detail cache for visible articles
  void Promise.allSettled(
    artikels.slice(0, 6).map((a: { slug: string }) =>
      safeFetch(artikelDetailQuery, { slug: a.slug })
    )
  );

  if (artikels.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-heading text-fg-muted text-sm">
          Belum ada artikel dalam kategori ini.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artikels.map((artikel: Parameters<typeof ArticleCard>[0]["artikel"]) => (
          <ArticleCard key={artikel._id} artikel={artikel} variant="default" />
        ))}
      </div>
      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </>
  );
}

export default async function ArtikelPage({ searchParams }: ArtikelPageProps) {
  const kategoris = await safeFetch(allKategoriQuery) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12">
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl tracking-tighter leading-none text-fg">
          Artikel
        </h1>
      </div>

      <Suspense>
        <CategoryPills kategoris={kategoris as { _id: string; nama: string; slug: string }[]} className="mb-10" />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-card rounded-xl mb-4" />
                <div className="h-3 bg-card rounded w-1/3 mb-2" />
                <div className="h-5 bg-card rounded mb-2" />
                <div className="h-4 bg-card rounded w-2/3" />
              </div>
            ))}
          </div>
        }
      >
        <ArtikelList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
