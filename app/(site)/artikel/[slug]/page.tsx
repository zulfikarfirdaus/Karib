import { cache } from "react";
import { safeFetch } from "@/sanity/lib/client";
import { artikelDetailQuery, allArtikelQuery } from "@/lib/queries";
import { ArticleBody } from "@/components/artikel/ArticleBody";
import { ArticleCard } from "@/components/artikel/ArticleCard";
import { PDFViewer } from "@/components/artikel/PDFViewer";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { urlFor } from "@/lib/imageUrl";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Deduplicated — generateMetadata and the page function share one fetch per request
const getArtikel = cache((slug: string) =>
  safeFetch(artikelDetailQuery, { slug })
);

export async function generateStaticParams() {
  const artikels = await safeFetch(allArtikelQuery, {});
  return (artikels ?? []).map((a: { slug: string }) => ({ slug: a.slug }));
}

interface ArtikelDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtikelDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artikel = await getArtikel(slug);
  if (!artikel) return { title: "Tidak ditemukan" };

  return {
    title: artikel.judul,
    description: artikel.ringkasan,
    openGraph: {
      title: artikel.judul,
      description: artikel.ringkasan,
      images: artikel.gambarUtama?.asset
        ? [urlFor(artikel.gambarUtama).width(1200).height(630).url()]
        : [],
    },
  };
}

export default async function ArtikelDetailPage({ params }: ArtikelDetailPageProps) {
  const { slug } = await params;
  const artikel = await getArtikel(slug);

  if (!artikel) notFound();

  const related: Parameters<typeof ArticleCard>[0]["artikel"][] = artikel.related ?? [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}/artikel/${slug}`;

  const bodyText = Array.isArray(artikel.isi)
    ? artikel.isi
        .filter((b: { _type: string; children?: { text: string }[] }) => b._type === "block")
        .map((b: { children?: { text: string }[] }) =>
          b.children?.map((c: { text: string }) => c.text).join("") ?? ""
        )
        .join(" ")
    : "";

  const readingTime = estimateReadingTime(bodyText);

  const imageUrl = artikel.gambarUtama?.asset
    ? urlFor(artikel.gambarUtama).width(1200).height(600).url()
    : null;

  const pdfUrl = artikel.filePdf?.asset?.url;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-heading text-fg-muted mb-8">
        <Link href="/artikel" className="hover:text-fg transition-colors">
          Artikel
        </Link>
        {artikel.kategori && (
          <>
            <span>/</span>
            <Link
              href={`/kategori/${artikel.kategori.slug}`}
              className="hover:text-fg transition-colors"
            >
              {artikel.kategori.nama}
            </Link>
          </>
        )}
      </nav>

      {/* Header */}
      <header className="max-w-[680px] mx-auto mb-10">
        {artikel.kategori && (
          <Link
            href={`/kategori/${artikel.kategori.slug}`}
            className="text-xs font-heading uppercase tracking-widest text-accent hover:text-accent-hover mb-3 inline-block"
          >
            {artikel.kategori.nama}
          </Link>
        )}
        <h1 className="font-heading font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-fg mb-5">
          {artikel.judul}
        </h1>
        <p className="text-lg text-fg-muted font-body leading-relaxed mb-6">
          {artikel.ringkasan}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-xs font-heading text-fg-muted">
            <span>{formatDate(artikel.tanggalTerbit)}</span>
            <span>&middot;</span>
            <span>{readingTime} menit baca</span>
          </div>
          <ShareButtons url={pageUrl} title={artikel.judul} />
        </div>
      </header>

      {/* PDF viewer */}
      {pdfUrl && (
        <div className="mb-10">
          <PDFViewer url={pdfUrl} filename={`${artikel.judul}.pdf`} />
        </div>
      )}

      {/* Article body */}
      {artikel.isi && <ArticleBody content={artikel.isi} />}

      {/* Bottom share */}
      <div className="max-w-[680px] mx-auto mt-12 pt-8 flex items-center justify-between flex-wrap gap-4">
        <ShareButtons url={pageUrl} title={artikel.judul} />
        {artikel.tags && artikel.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artikel.tags.map((tag: string) => (
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

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-16 max-w-[680px] mx-auto border-t border-border pt-10">
          <h2 className="font-heading font-bold text-xl tracking-tight text-fg mb-6">
            Artikel Terkait
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {related.map((rel) => (
              <div key={rel._id} className="py-5">
                <ArticleCard artikel={rel} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
