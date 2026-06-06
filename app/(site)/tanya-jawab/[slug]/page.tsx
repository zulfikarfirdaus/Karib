export const revalidate = 3600;

import { cache, Suspense } from "react";
import { safeFetch } from "@/sanity/lib/client";
import { tanyaJawabDetailQuery, relatedTanyaJawabQuery, allTanyaJawabQuery } from "@/lib/queries";
import { ArticleBody } from "@/components/artikel/ArticleBody";
import { TanyaKaribForm } from "@/components/tanyajawab/TanyaKaribForm";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const getTanyaJawab = cache((slug: string) =>
  safeFetch(tanyaJawabDetailQuery, { slug }, 3600)
);

export async function generateStaticParams() {
  const items = await safeFetch(allTanyaJawabQuery, {});
  return (items ?? []).map((i: { slug: string }) => ({ slug: i.slug }));
}

interface TanyaJawabDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TanyaJawabDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTanyaJawab(slug);
  if (!item) return { title: "Tidak ditemukan" };

  return {
    title: item.pertanyaan,
    description: item.ringkasan ?? item.pertanyaan,
  };
}

type RelatedItem = { _id: string; pertanyaan: string; slug: string; kategori?: { nama: string; slug: string }; tanggalTerbit: string };

async function RelatedTanyaJawab({ slug, kategorRef }: { slug: string; kategorRef: string }) {
  const related = await safeFetch<RelatedItem[]>(relatedTanyaJawabQuery, { slug, kategorRef }, 3600);
  if (!related || related.length === 0) return null;

  return (
    <section className="mt-16 max-w-[680px] mx-auto border-t border-border pt-10">
      <p className="text-xs font-heading uppercase tracking-widest text-fg-muted mb-5">
        Tanya Jawab Lainnya
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {related.map((rel) => (
          <Link key={rel._id} href={`/tanya-jawab/${rel.slug}`} className="group">
            {rel.kategori && (
              <span className="text-[10px] font-heading uppercase tracking-widest text-accent block mb-2">
                {rel.kategori.nama}
              </span>
            )}
            <h3 className="font-heading font-semibold text-sm leading-snug tracking-tight text-fg group-hover:text-accent transition-colors mb-2">
              {rel.pertanyaan}
            </h3>
            <p className="text-xs text-fg-muted font-heading">{formatDate(rel.tanggalTerbit)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function TanyaJawabDetailPage({ params }: TanyaJawabDetailPageProps) {
  const { slug } = await params;
  const item = await getTanyaJawab(slug);

  if (!item) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}/tanya-jawab/${slug}`;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-heading text-fg-muted mb-8">
        <Link href="/tanya-jawab" className="hover:text-fg transition-colors">
          Tanya Jawab
        </Link>
        {item.kategori && (
          <>
            <span>/</span>
            <Link
              href={`/kategori/${item.kategori.slug}`}
              className="hover:text-fg transition-colors"
            >
              {item.kategori.nama}
            </Link>
          </>
        )}
      </nav>

      {/* Question */}
      <header className="max-w-[680px] mx-auto mb-12">
        {item.kategori && (
          <Link
            href={`/kategori/${item.kategori.slug}`}
            className="text-xs font-heading uppercase tracking-widest text-accent hover:text-accent-hover mb-3 inline-block"
          >
            {item.kategori.nama}
          </Link>
        )}

        <h1 className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight text-fg mb-6">
          {item.pertanyaan}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs font-heading text-fg-muted">{formatDate(item.tanggalTerbit)}</p>
          <ShareButtons url={pageUrl} title={item.pertanyaan} />
        </div>
      </header>

      {/* Answer */}
      {item.jawaban && (
        <div className="max-w-[680px] mx-auto">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-fg-muted">
              Jawaban Ustadz
            </p>
          </div>
          <ArticleBody content={item.jawaban} />
        </div>
      )}

      {/* Bottom */}
      <div className="max-w-[680px] mx-auto mt-12 pt-8 flex items-center justify-between flex-wrap gap-4">
        <ShareButtons url={pageUrl} title={item.pertanyaan} />
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-heading bg-card border border-border rounded-full text-fg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related — streams in after main content */}
      {item.kategorRef && (
        <Suspense fallback={null}>
          <RelatedTanyaJawab slug={slug} kategorRef={item.kategorRef} />
        </Suspense>
      )}

      {/* Tanya Karib */}
      <div className="mt-16 max-w-[680px] mx-auto bg-white dark:bg-card rounded-2xl px-4 sm:px-8 py-10">
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
    </article>
  );
}
