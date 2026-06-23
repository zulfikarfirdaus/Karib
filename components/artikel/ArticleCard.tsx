import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  artikel: {
    _id: string;
    judul: string;
    slug: string;
    ringkasan: string;
    kategori?: { nama: string; slug: string };
    tanggalTerbit: string;
    tags?: string[];
  };
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function ArticleCard({ artikel, variant = "default", className }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <article className={cn("group", className)}>
        {artikel.kategori && (
          <span className="text-[10px] font-heading uppercase tracking-widest text-accent">
            {artikel.kategori.nama}
          </span>
        )}
        <Link href={`/artikel/${artikel.slug}`}>
          <h3 className="font-heading font-semibold text-sm text-fg leading-snug mt-0.5 line-clamp-2 group-hover:text-accent transition-colors">
            {artikel.judul}
          </h3>
        </Link>
        <p className="text-xs text-fg-muted mt-1">{formatDate(artikel.tanggalTerbit)}</p>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className={cn("group", className)}>
        {artikel.kategori && (
          <Link
            href={`/kategori/${artikel.kategori.slug}`}
            className="text-xs font-heading uppercase tracking-widest text-accent hover:text-accent-hover"
          >
            {artikel.kategori.nama}
          </Link>
        )}
        <Link href={`/artikel/${artikel.slug}`}>
          <h2 className="font-heading font-semibold text-2xl md:text-3xl leading-tight tracking-tight text-fg mt-2 mb-3 group-hover:text-accent transition-colors line-clamp-3">
            {artikel.judul}
          </h2>
        </Link>
        <p className="text-fg-muted text-sm leading-relaxed line-clamp-2 mb-4 font-body">
          {artikel.ringkasan}
        </p>
        <p className="text-xs text-fg-muted font-heading">{formatDate(artikel.tanggalTerbit)}</p>
      </article>
    );
  }

  // default card
  return (
    <article className={cn("group bg-card rounded-xl p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow", className)}>
      {artikel.kategori && (
        <Link
          href={`/kategori/${artikel.kategori.slug}`}
          className="text-[10px] font-heading uppercase tracking-widest text-accent hover:text-accent-hover"
        >
          {artikel.kategori.nama}
        </Link>
      )}
      <Link href={`/artikel/${artikel.slug}`} className="flex-1 flex flex-col gap-2">
        <h3 className="font-heading font-semibold text-base leading-snug tracking-tight text-fg group-hover:text-accent transition-colors">
          {artikel.judul}
        </h3>
        <p className="text-sm text-fg-muted leading-relaxed line-clamp-2 font-body">
          {artikel.ringkasan}
        </p>
      </Link>
      <p className="text-xs text-fg-muted font-heading mt-auto">{formatDate(artikel.tanggalTerbit)}</p>
    </article>
  );
}
