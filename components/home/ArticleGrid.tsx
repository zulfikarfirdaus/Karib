import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/imageUrl";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface Artikel {
  _id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  gambarUtama?: { asset: { _ref: string }; alt?: string };
  kategori?: { nama: string; slug: string };
  tanggalTerbit: string;
}

interface ArticleGridProps {
  artikels: Artikel[];
}

export function ArticleGrid({ artikels }: ArticleGridProps) {
  if (artikels.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl tracking-tight text-fg">Artikel</h2>
        <Link
          href="/artikel"
          className="flex items-center gap-1 text-xs font-heading text-fg-muted hover:text-fg transition-colors"
        >
          Lihat semua
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {artikels.slice(0, 5).map((artikel) => {
          const imageUrl = artikel.gambarUtama?.asset
            ? urlFor(artikel.gambarUtama).width(160).height(110).auto("format").url()
            : null;

          return (
            <article key={artikel._id} className="group flex items-start gap-5 py-5">
              <div className="flex-1 min-w-0">
                {artikel.kategori && (
                  <span className="text-[10px] font-heading uppercase tracking-widest text-accent block mb-1">
                    {artikel.kategori.nama}
                  </span>
                )}
                <Link href={`/artikel/${artikel.slug}`}>
                  <h3 className="font-heading font-semibold text-lg leading-snug tracking-tight text-fg group-hover:text-accent transition-colors line-clamp-2 mb-1.5">
                    {artikel.judul}
                  </h3>
                </Link>
                <p className="text-sm text-fg-muted font-body leading-relaxed line-clamp-2 mb-2">
                  {artikel.ringkasan}
                </p>
                <p className="text-xs text-fg-muted font-heading">{formatDate(artikel.tanggalTerbit)}</p>
              </div>

              {imageUrl && (
                <Link href={`/artikel/${artikel.slug}`} className="shrink-0">
                  <div className="w-20 h-[52px] sm:w-28 sm:h-[72px] relative rounded-lg overflow-hidden bg-card">
                    <Image
                      src={imageUrl}
                      alt={artikel.gambarUtama?.alt ?? artikel.judul}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
