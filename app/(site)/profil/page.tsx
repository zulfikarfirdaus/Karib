import { safeFetch } from "@/sanity/lib/client";
import { profilQuery } from "@/lib/queries";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/imageUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Ustadz",
  description: "Profil dan biografi Ustadz Muhammad Ibrahim Saleh, Lc.",
};

export default async function ProfilPage() {
  const profil = await safeFetch(profilQuery);

  const fotoUrl = profil?.foto?.asset
    ? urlFor(profil.foto).width(400).height(400).url()
    : null;

  if (!profil) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="font-heading text-fg-muted">Profil belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-12">
        {fotoUrl ? (
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-card shrink-0">
            <Image
              src={fotoUrl}
              alt={profil.nama}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-card shrink-0 flex items-center justify-center">
            <span className="text-5xl text-fg-muted opacity-30">☽</span>
          </div>
        )}

        <div className="flex-1">
          <p className="text-xs font-heading uppercase tracking-widest text-accent mb-2">
            Tentang
          </p>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl tracking-tighter leading-none text-fg">
            {profil.nama}
          </h1>
          {profil.gelar && (
            <p className="font-heading text-fg-muted mt-1">{profil.gelar}</p>
          )}

          {/* Social links */}
          {profil.tautanSosial?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profil.tautanSosial.map(
                (item: { platform: string; url: string }, i: number) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-heading border border-border rounded-full text-fg-muted hover:text-fg hover:border-fg transition-colors"
                  >
                    {item.platform}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {profil.bio && (
        <section className="mb-12">
          <h2 className="font-heading font-bold text-lg tracking-tight text-fg mb-4 pb-3 border-b border-border">
            Biografi
          </h2>
          <div className="prose-article">
            <PortableText value={profil.bio} />
          </div>
        </section>
      )}

      {/* Education */}
      {profil.pendidikan?.length > 0 && (
        <section>
          <h2 className="font-heading font-bold text-lg tracking-tight text-fg mb-4 pb-3 border-b border-border">
            Riwayat Pendidikan
          </h2>
          <ul className="space-y-4">
            {profil.pendidikan.map(
              (
                item: { institusi: string; gelarDiperoleh: string; tahun: string },
                i: number
              ) => (
                <li key={i} className="flex gap-4">
                  <span className="text-accent font-heading text-sm font-bold w-12 shrink-0">
                    {item.tahun}
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-fg">
                      {item.gelarDiperoleh}
                    </p>
                    <p className="text-xs text-fg-muted mt-0.5">{item.institusi}</p>
                  </div>
                </li>
              )
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
