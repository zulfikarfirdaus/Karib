import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TanyaJawabCardProps {
  item: {
    _id: string;
    pertanyaan: string;
    slug: string;
    ringkasan?: string;
    kategori?: { nama: string; slug: string };
    tanggalTerbit: string;
  };
  className?: string;
}

export function TanyaJawabCard({ item, className }: TanyaJawabCardProps) {
  return (
    <article className={cn("group border-b border-border py-7 first:pt-0 last:border-0", className)}>
      <div className="flex items-start">
        <div className="flex-1 min-w-0">
          {item.kategori && (
            <Link
              href={`/kategori/${item.kategori.slug}`}
              className="text-[10px] font-heading uppercase tracking-widest text-accent hover:text-accent-hover mb-2 inline-block"
            >
              {item.kategori.nama}
            </Link>
          )}
          <Link href={`/tanya-jawab/${item.slug}`}>
            <h3 className="font-heading font-semibold text-lg leading-snug tracking-tight text-fg group-hover:text-accent transition-colors mb-2">
              {item.pertanyaan}
            </h3>
          </Link>
          {item.ringkasan && (
            <p className="text-sm text-fg-muted leading-relaxed line-clamp-2 font-body mb-3">
              {item.ringkasan}
            </p>
          )}
          <p className="text-xs text-fg-muted font-heading">{formatDate(item.tanggalTerbit)}</p>
        </div>
      </div>
    </article>
  );
}
