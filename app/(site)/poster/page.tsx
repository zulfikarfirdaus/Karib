export const runtime = "edge";

import { safeFetch } from "@/sanity/lib/client";
import { allNasihatQuery } from "@/lib/queries";
import { NasihatCard } from "@/components/nasihat/NasihatCard";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Poster",
  description: "Kata-kata hikmah Islam dari Ustadz Muhammad Ibrahim Saleh, Lc, dapat diunduh sebagai poster.",
};

async function NasihatGrid() {
  const nasihats = await safeFetch(allNasihatQuery) ?? [];

  if (nasihats.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-heading text-fg-muted text-sm">Belum ada nasihat.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {nasihats.map((nasihat: Parameters<typeof NasihatCard>[0]["nasihat"]) => (
        <NasihatCard key={nasihat._id} nasihat={nasihat} />
      ))}
    </div>
  );
}

export default async function NasihatPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-12">
      <div className="mb-10">
        <p className="text-xs font-heading uppercase tracking-widest text-accent mb-2">
          Hikmah
        </p>
        <h1 className="font-heading font-bold text-4xl tracking-tighter leading-none text-fg mb-3">
          Poster
        </h1>
        <p className="text-sm text-fg-muted font-body max-w-lg">
          Kata-kata hikmah yang dapat dibagikan sebagai poster ke media sosial.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse min-h-[200px] bg-card rounded-2xl" />
            ))}
          </div>
        }
      >
        <NasihatGrid />
      </Suspense>
    </div>
  );
}
