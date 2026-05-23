import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/imageUrl";
import { formatDate } from "@/lib/utils";
import { ArticleCard } from "@/components/artikel/ArticleCard";

interface HeroSectionProps {
  featuredArtikel: Parameters<typeof ArticleCard>[0]["artikel"] | null;
  secondaryArtikel: Parameters<typeof ArticleCard>[0]["artikel"][];
}

function SideCard({ artikel }: { artikel: Parameters<typeof ArticleCard>[0]["artikel"] }) {
  const imageUrl = artikel.gambarUtama?.asset
    ? urlFor(artikel.gambarUtama).auto("format").url()
    : null;

  return (
    <Link href={`/artikel/${artikel.slug}`} className="flex gap-4 group">
      {imageUrl && (
        <div className="relative shrink-0 w-48 h-32 rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={artikel.gambarUtama?.alt ?? artikel.judul}
            fill
            sizes="192px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {artikel.kategori && (
          <span className="text-[10px] font-heading font-semibold uppercase tracking-widest text-accent">
            {artikel.kategori.nama}
          </span>
        )}
        <h3 className="font-heading font-semibold text-[0.9375rem] leading-snug text-fg group-hover:text-accent transition-colors line-clamp-2 mt-1">
          {artikel.judul}
        </h3>
        <p className="text-[11px] text-fg-muted mt-1.5 font-heading">{formatDate(artikel.tanggalTerbit)}</p>
      </div>
    </Link>
  );
}

export function HeroSection({ featuredArtikel, secondaryArtikel }: HeroSectionProps) {
  if (!featuredArtikel) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: featured article */}
        <ArticleCard artikel={featuredArtikel} variant="featured" />

        {/* Right: secondary articles — natural height, clean stacking */}
        {secondaryArtikel.length > 0 && (
          <div className="flex flex-col divide-y divide-border">
            {secondaryArtikel.slice(0, 3).map((artikel) => (
              <div key={artikel._id} className="py-7 first:pt-0 last:pb-0">
                <SideCard artikel={artikel} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
