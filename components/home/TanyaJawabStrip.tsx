import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { formatDate } from "@/lib/utils";
import { TanyaKaribModal } from "@/components/tanyajawab/TanyaKaribModal";

interface TanyaJawabItem {
  _id: string;
  pertanyaan: string;
  slug: string;
  ringkasan?: string;
  kategori?: { nama: string; slug: string };
  tanggalTerbit: string;
}

interface TanyaJawabStripProps {
  items: TanyaJawabItem[];
}

export function TanyaJawabStrip({ items }: TanyaJawabStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-card rounded-2xl px-5 py-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-2xl tracking-tight text-fg">Tanya Jawab</h2>
        <Link
          href="/tanya-jawab"
          className="flex items-center gap-1 text-xs font-heading text-fg-muted hover:text-fg transition-colors"
        >
          Lihat semua
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => (
          <article key={item._id} className="group py-4">
            {item.kategori && (
              <span className="text-[10px] font-heading uppercase tracking-widest text-accent block mb-1.5">
                {item.kategori.nama}
              </span>
            )}
            <Link href={`/tanya-jawab/${item.slug}`}>
              <h3 className="font-heading font-semibold text-base leading-snug tracking-tight text-fg group-hover:text-accent transition-colors line-clamp-3">
                {item.pertanyaan}
              </h3>
            </Link>
            <p className="text-xs text-fg-muted font-heading mt-2">
              {formatDate(item.tanggalTerbit)}
            </p>
          </article>
        ))}
      </div>

      <TanyaKaribModal />
    </div>
  );
}
