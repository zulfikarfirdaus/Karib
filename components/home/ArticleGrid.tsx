import Link from "next/link";
import { ArticleCard } from "@/components/artikel/ArticleCard";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface ArticleGridProps {
  artikels: Parameters<typeof ArticleCard>[0]["artikel"][];
}

export function ArticleGrid({ artikels }: ArticleGridProps) {
  if (artikels.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading font-bold text-2xl tracking-tight text-fg">
            Artikel
          </h2>
          <p className="text-sm font-body text-fg-muted mt-1">
            Kajian mendalam berbasis Al-Qur'an dan Sunnah
          </p>
        </div>
        <Link
          href="/artikel"
          className="flex items-center gap-1.5 text-sm font-heading text-fg-muted hover:text-fg transition-colors"
        >
          Lihat semua
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artikels.slice(0, 6).map((artikel) => (
          <ArticleCard key={artikel._id} artikel={artikel} variant="default" />
        ))}
      </div>
    </section>
  );
}
