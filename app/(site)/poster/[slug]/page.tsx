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
import { DownloadPosterButton } from "@/components/nasihat/DownloadPosterButton";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const nasihats = await safeFetch(allNasihatQuery, {});
  return (nasihats ?? []).map((n: { slug: string }) => ({ slug: n.slug }));
}

interface NasihatDetailPageProps {
  params: Promise<{ slug: string }>;
}

const themeBg: Record<string, string> = {
  pasir: "bg-[#F5EDD8] text-[#3D2B0E]",
  zaitun: "bg-[#2C3A2A] text-[#D4E0D0]",
  arang: "bg-[#1E1C1A] text-[#E8E4DC]",
  krem: "bg-[#FAF5EC] text-[#2C2218]",
};

const themeAccent: Record<string, string> = {
  pasir: "text-[#A0621A]",
  zaitun: "text-[#8FBF84]",
  arang: "text-[#C97E2A]",
  krem: "text-[#A0621A]",
};

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

  const tema = nasihat.tema ?? "pasir";
  const cardBg = themeBg[tema] ?? themeBg.pasir;
  const accentColor = themeAccent[tema] ?? themeAccent.pasir;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}/poster/${slug}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
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

      {/* Poster preview card */}
      <div className={`rounded-3xl p-10 sm:p-14 mb-8 relative min-h-[320px] flex flex-col justify-between ${cardBg}`}>
        <p className="font-body text-xl sm:text-2xl leading-relaxed">
          {nasihat.teks}
        </p>
        <div className="flex items-end justify-between mt-8">
          <div>
            <p className={`font-heading text-xs font-bold uppercase tracking-widest ${accentColor}`}>
              {nasihat.narasumber}
            </p>
            {nasihat.referensiKitab && (
              <p className={`font-heading text-xs uppercase tracking-widest opacity-60 mt-1 ${accentColor}`}>
                {nasihat.referensiKitab}
              </p>
            )}
          </div>
          <span className="text-4xl opacity-10 select-none">☽</span>
        </div>
      </div>

      {/* Meta */}
      <p className="text-xs font-heading text-fg-muted mb-6">
        {formatDate(nasihat.tanggalTerbit)}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-border">
        <DownloadPosterButton slug={slug} />
        <ShareButtons url={pageUrl} title={nasihat.teks.substring(0, 80)} />
      </div>

      {/* Info */}
      <p className="mt-6 text-xs text-fg-muted font-heading">
        Unduh poster 1080x1080 untuk dibagikan di Instagram, WhatsApp, atau media sosial lainnya.
      </p>
    </div>
  );
}
