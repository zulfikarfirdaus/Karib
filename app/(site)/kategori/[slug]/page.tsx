import { safeFetch } from "@/sanity/lib/client";
import { kategoriPageQuery, allKategoriQuery } from "@/lib/queries";
import { ArticleCard } from "@/components/artikel/ArticleCard";
import { NasihatCard } from "@/components/nasihat/NasihatCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const kategoris = await safeFetch(allKategoriQuery, {});
  return (kategoris ?? []).map((k: { slug: string }) => ({ slug: k.slug }));
}

interface KategoriPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: KategoriPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await safeFetch(kategoriPageQuery, { slug });
  if (!data?.kategori) return { title: "Kategori" };
  return {
    title: data.kategori.nama,
    description: data.kategori.deskripsi ?? `Artikel dan nasihat kategori ${data.kategori.nama}`,
  };
}

export default async function KategoriPage({ params }: KategoriPageProps) {
  const { slug } = await params;
  const data = await safeFetch(kategoriPageQuery, { slug });

  if (!data?.kategori) notFound();

  const { kategori, artikels, nasihats } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-heading uppercase tracking-widest text-accent mb-2">
          Kategori
        </p>
        <h1 className="font-heading font-bold text-4xl tracking-tighter leading-none text-fg mb-3">
          {kategori.nama}
        </h1>
        {kategori.deskripsi && (
          <p className="text-fg-muted font-body text-base max-w-lg">{kategori.deskripsi}</p>
        )}
        <p className="text-xs font-heading text-fg-muted mt-3">
          {artikels.length} artikel &middot; {nasihats.length} nasihat
        </p>
      </div>

      {/* Articles */}
      {artikels.length > 0 && (
        <section className="mb-14">
          <h2 className="font-heading font-bold text-xl tracking-tight text-fg mb-6 pb-4 border-b border-border">
            Artikel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artikels.map((artikel: Parameters<typeof ArticleCard>[0]["artikel"]) => (
              <ArticleCard key={artikel._id} artikel={artikel} />
            ))}
          </div>
        </section>
      )}

      {/* Nasihat */}
      {nasihats.length > 0 && (
        <section>
          <h2 className="font-heading font-bold text-xl tracking-tight text-fg mb-6 pb-4 border-b border-border">
            Nasihat Singkat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nasihats.map((nasihat: Parameters<typeof NasihatCard>[0]["nasihat"]) => (
              <NasihatCard key={nasihat._id} nasihat={nasihat} />
            ))}
          </div>
        </section>
      )}

      {artikels.length === 0 && nasihats.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-heading text-fg-muted text-sm">
            Belum ada konten dalam kategori ini.
          </p>
        </div>
      )}
    </div>
  );
}
