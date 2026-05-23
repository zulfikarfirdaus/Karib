import { safeFetch } from "@/sanity/lib/client";
import { searchQuery } from "@/lib/queries";
import { ArticleCard } from "@/components/artikel/ArticleCard";
import { NasihatCard } from "@/components/nasihat/NasihatCard";
import { CariInput } from "./CariInput";

interface CariPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CariPage({ searchParams }: CariPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results =
    query.length >= 2
      ? await safeFetch(searchQuery, { q: `${query}*` })
      : null;

  const total =
    (results?.artikels?.length ?? 0) + (results?.nasihats?.length ?? 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-heading font-bold text-4xl tracking-tighter leading-none text-fg mb-6">
          Cari
        </h1>
        <CariInput initialValue={query} />
      </div>

      {results && (
        <div>
          <p className="text-xs font-heading text-fg-muted mb-6 uppercase tracking-widest">
            {total === 0
              ? `Tidak ada hasil untuk "${query}"`
              : `${total} hasil untuk "${query}"`}
          </p>

          {results.artikels && results.artikels.length > 0 && (
            <section className="mb-10">
              <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-fg-muted mb-5 pb-3 border-b border-border">
                Artikel
              </h2>
              <div className="flex flex-col divide-y divide-border">
                {results.artikels.map(
                  (artikel: Parameters<typeof ArticleCard>[0]["artikel"]) => (
                    <div key={artikel._id} className="py-5">
                      <ArticleCard artikel={artikel} variant="compact" />
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {results.nasihats && results.nasihats.length > 0 && (
            <section>
              <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-fg-muted mb-5 pb-3 border-b border-border">
                Nasihat Singkat
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.nasihats.map(
                  (nasihat: Parameters<typeof NasihatCard>[0]["nasihat"]) => (
                    <NasihatCard key={nasihat._id} nasihat={nasihat} />
                  )
                )}
              </div>
            </section>
          )}
        </div>
      )}

      {!results && query.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-heading text-fg-muted text-sm">
            Ketik minimal 2 karakter untuk mulai mencari.
          </p>
        </div>
      )}
    </div>
  );
}
