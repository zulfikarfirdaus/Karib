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
    <article className={cn("group bg-card rounded-xl p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow", className)}>
      {item.kategori && (
        <Link
          href={`/kategori/${item.kategori.slug}`}
          className="text-[10px] font-heading uppercase tracking-widest text-accent hover:text-accent-hover"
        >
          {item.kategori.nama}
        </Link>
      )}
      <Link href={`/tanya-jawab/${item.slug}`} className="flex-1">
        <h3 className="font-heading font-semibold text-base leading-snug tracking-tight text-fg group-hover:text-accent transition-colors">
          {item.pertanyaan}
        </h3>
      </Link>
      {item.ringkasan && (
        <p className="text-sm text-fg-muted leading-relaxed line-clamp-2 font-body">
          {item.ringkasan}
        </p>
      )}
      <p className="text-xs text-fg-muted font-heading mt-auto">{formatDate(item.tanggalTerbit)}</p>
    </article>
  );
}
