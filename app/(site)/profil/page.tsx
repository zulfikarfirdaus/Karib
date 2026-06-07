
import { safeFetch } from "@/sanity/lib/client";
import { profilQuery } from "@/lib/queries";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Ustadz",
  description: "Profil dan biografi Ustadz Muhammad Ibrahim Saleh, Lc.",
};

export default async function ProfilPage() {
  const profil = await safeFetch(profilQuery);

  if (!profil) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24">
        <p className="font-heading text-fg-muted text-sm">Profil belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 sm:pt-36 pb-20">
      {/* Profile header */}
      <header className="mb-16 pb-12 border-b border-border">
        <h1 className="font-display font-bold text-5xl sm:text-6xl tracking-tighter leading-none text-fg">
          {profil.nama}{profil.gelar ? `, ${profil.gelar}` : ""}
        </h1>

        {profil.tautanSosial?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-7">
            {profil.tautanSosial.map(
              (item: { platform: string; url: string }, i: number) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-heading border border-border rounded-full text-fg-muted hover:text-fg hover:border-fg/50 transition-colors duration-150"
                >
                  {item.platform}
                </a>
              )
            )}
          </div>
        )}
      </header>

      {/* Bio */}
      {profil.bio && (
        <section className="mb-14">
          <div className="prose-article">
            <PortableText value={profil.bio} />
          </div>
        </section>
      )}

      {/* Education */}
      {profil.pendidikan?.length > 0 && (
        <section>
          <h2 className="text-xs font-heading uppercase tracking-widest text-fg-muted mb-7 pb-3 border-b border-border">
            Riwayat Pendidikan
          </h2>
          <ul className="space-y-6">
            {profil.pendidikan.map(
              (
                item: { institusi: string; gelarDiperoleh: string; tahun: string },
                i: number
              ) => (
                <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-6">
                  <span className="font-heading text-sm font-bold text-accent pt-0.5 tabular-nums">
                    {item.tahun}
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-fg leading-snug">
                      {item.gelarDiperoleh}
                    </p>
                    <p className="text-xs text-fg-muted mt-1">{item.institusi}</p>
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
