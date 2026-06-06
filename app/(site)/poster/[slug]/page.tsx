export const revalidate = 3600;

import { cache } from "react";
import { safeFetch } from "@/sanity/lib/client";
import { nasihatDetailQuery, allNasihatQuery } from "@/lib/queries";

const getNasihat = cache((slug: string) =>
  safeFetch(nasihatDetailQuery, { slug })
);
import { ShareButtons } from "@/components/ui/ShareButtons";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PosterShareCard } from "@/components/nasihat/PosterShareCard";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const nasihats = await safeFetch(allNasihatQuery, {});
  return (nasihats ?? []).map((n: { slug: string }) => ({ slug: n.slug }));
}

interface NasihatDetailPageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: NasihatDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const nasihat = await getNasihat(slug);
  if (!nasihat) return { title: "Tidak ditemukan" };

  return {
    title: nasihat.teks.substring(0, 60) + "…",
    description: nasihat.teks,
  };
}

export default async function NasihatDetailPage({ params }: NasihatDetailPageProps) {
  const { slug } = await params;
  const nasihat = await getNasihat(slug);

  if (!nasihat) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}/poster/${slug}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-heading text-fg-muted mb-8">
        <Link href="/poster" className="hover:text-fg transition-colors">
          Poster
        </Link>
        {nasihat.kategori && (
          <>
            <span>/</span>
            <Link
              href={`/kategori/${nasihat.kategori.slug}`}
              className="hover:text-fg transition-colors"
            >
              {nasihat.kategori.nama}
            </Link>
          </>
        )}
      </nav>

      {/* Poster preview card + share/download buttons */}
      <PosterShareCard nasihat={nasihat} />

      {/* Meta */}
      <p className="text-xs font-heading text-fg-muted mb-6">
        {formatDate(nasihat.tanggalTerbit)}
      </p>

      {/* Link sharing */}
      <div className="pt-6 border-t border-border">
        <ShareButtons url={pageUrl} title={nasihat.teks.substring(0, 80)} />
      </div>

      <p className="mt-6 text-xs text-fg-muted font-heading">
        Bagikan poster 1080×1080 langsung ke WhatsApp, Instagram, atau simpan ke galeri.
      </p>
    </div>
  );
}
