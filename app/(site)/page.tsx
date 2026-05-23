import { safeFetch } from "@/sanity/lib/client";
import { homeQuery } from "@/lib/queries";
import { SiteBanner } from "@/components/home/SiteBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { NasihatStrip } from "@/components/home/NasihatStrip";
import { ArticleGrid } from "@/components/home/ArticleGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda",
};

export default async function HomePage() {
  const data = await safeFetch(homeQuery);

  const featuredArtikel = data?.featuredArtikel ?? null;
  const latestArtikel = data?.latestArtikel ?? [];
  const latestNasihat = data?.latestNasihat ?? [];

  return (
    <>
      {/* Banner hero */}
      <SiteBanner />

      {/* Featured articles */}
      <HeroSection
        featuredArtikel={featuredArtikel}
        secondaryArtikel={latestArtikel.slice(0, 3)}
      />

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <hr className="border-border" />
      </div>

      {/* Article grid */}
      <ArticleGrid artikels={latestArtikel.slice(3)} />

      {/* Poster strip */}
      <NasihatStrip nasihats={latestNasihat} />

    </>
  );
}
