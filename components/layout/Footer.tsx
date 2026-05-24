import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-fg mb-2">
              Karib
            </p>
            <p className="text-sm text-fg-muted leading-relaxed">
              Platform ilmu Islam oleh Ustadz Muhammad Ibrahim Saleh, Lc.
              Berdasarkan Al-Quran dan Sunnah.
            </p>
          </div>

          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-fg-muted mb-4">
              Navigasi
            </p>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Beranda" },
                { href: "/artikel", label: "Artikel" },
                { href: "/poster", label: "Poster" },
                { href: "/profil", label: "Profil Ustadz" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-fg-muted mb-4">
              Kategori
            </p>
            <ul className="space-y-2">
              {["Aqidah", "Fiqih", "Muamalah"].map((kat) => (
                <li key={kat}>
                  <Link
                    href={`/kategori/${kat.toLowerCase()}`}
                    className="text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    {kat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-fg-muted">
          Created by{" "}
          <a
            href="https://spladestudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg transition-colors"
          >
            Splade Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
