export const runtime = "edge";

import { safeFetch } from "@/sanity/lib/client";
import { homeQuery, artikelDetailQuery, tanyaJawabDetailQuery } from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { NasihatStrip } from "@/components/home/NasihatStrip";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import { TanyaJawabStrip } from "@/components/home/TanyaJawabStrip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda",
};

export default async function HomePage() {
  const data = await safeFetch(homeQuery);

  const featuredArtikel = data?.featuredArtikel;
  const latestArtikel = data?.latestArtikel ?? [];
  const latestNasihat = data?.latestNasihat ?? [];
  const latestTanyaJawab = data?.latestTanyaJawab ?? [];

  // Warm detail-page cache without blocking the home page render
  const slugsToPreload = [
    ...(featuredArtikel ? [featuredArtikel.slug] : []),
    ...latestArtikel.map((a: { slug: string }) => a.slug),
  ];
  void Promise.allSettled([
    ...slugsToPreload.map((slug) => safeFetch(artikelDetailQuery, { slug })),
    ...latestTanyaJawab.map((tj: { slug: string }) =>
      safeFetch(tanyaJawabDetailQuery, { slug: tj.slug })
    ),
  ]);

  return (
    <>
      <HeroSection />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[13fr_7fr] gap-10 lg:gap-14">
          <ArticleGrid artikels={latestArtikel} />
          <div>
            <TanyaJawabStrip items={latestTanyaJawab} />
          </div>
        </div>
      </section>

      <NasihatStrip nasihats={latestNasihat} />
    </>
  );
}
