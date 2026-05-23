import Link from "next/link";
import { NasihatCard } from "@/components/nasihat/NasihatCard";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface NasihatStripProps {
  nasihats: Parameters<typeof NasihatCard>[0]["nasihat"][];
}

export function NasihatStrip({ nasihats }: NasihatStripProps) {
  if (nasihats.length === 0) return null;

  return (
    <section className="border-y border-border py-12 bg-bg-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-2xl tracking-tight text-fg">
              Poster
            </h2>
            <p className="text-sm font-body text-fg-muted mt-1">
              Kutipan hikmah ulama, siap dibagikan
            </p>
          </div>
          <Link
            href="/poster"
            className="flex items-center gap-1.5 text-sm font-heading text-fg-muted hover:text-fg transition-colors"
          >
            Lihat semua
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nasihats.slice(0, 3).map((nasihat) => (
            <NasihatCard key={nasihat._id} nasihat={nasihat} />
          ))}
        </div>
      </div>
    </section>
  );
}
