"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { List } from "@phosphor-icons/react/dist/csr/List";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/artikel", label: "Artikel" },
  { href: "/tanya-jawab", label: "Tanya Jawab" },
  { href: "/poster", label: "Poster" },
];

interface SearchResults {
  artikels: { _id: string; judul: string; slug: string }[];
  nasihats: { _id: string; teks: string; slug: string }[];
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(null);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const search = useCallback((q: string) => {
    if (q.trim().length < 2) { setResults(null); return; }
    startTransition(async () => {
      const res = await fetch(`/api/cari?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    search(val);
  }

  const hasResults = results && (results.artikels.length > 0 || results.nasihats.length > 0);
  const showDropdown = searchOpen && query.length >= 2;

  // When not scrolled and not searching: white text (over hero image)
  // When scrolled or searching: solid background, dark text
  const isOverlay = pathname === "/" && !scrolled && !searchOpen && !menuOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        isOverlay
          ? ""
          : "bg-bg border-b border-border/40"
      )}
    >
      <div className="px-8 sm:px-14 w-full">
        <nav className="h-16 flex items-center relative">

          {searchOpen ? (
            /* ── Search mode ───────────────────────────────────────── */
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <MagnifyingGlass size={15} className={cn(isOverlay ? "text-white/70" : "text-fg-muted")} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Cari artikel atau nasihat…"
                className={cn(
                  "flex-1 min-w-0 bg-transparent font-body text-sm focus:outline-none",
                  isOverlay ? "text-white placeholder:text-white/50" : "text-fg placeholder:text-fg-muted"
                )}
              />
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Tutup cari"
                className={cn(
                  "w-8 h-8 flex items-center justify-center transition-colors shrink-0",
                  isOverlay ? "text-white/70 hover:text-white" : "text-fg-muted hover:text-fg"
                )}
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <>
              {/* ── Left: nav links ─────────────────────────────────── */}
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "font-heading text-sm font-medium transition-colors",
                      isOverlay
                        ? pathname.startsWith(link.href)
                          ? "text-white"
                          : "text-white/65 hover:text-white"
                        : pathname.startsWith(link.href)
                          ? "text-fg"
                          : "text-fg-muted hover:text-fg"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* ── Center: logo ─────────────────────────────────────── */}
              <Link
                href="/"
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 font-heading text-base font-semibold tracking-tight transition-colors",
                  isOverlay ? "text-white" : "text-fg hover:text-accent"
                )}
              >
                Karib
              </Link>

              {/* ── Right: icons ─────────────────────────────────────── */}
              <div className="flex items-center gap-6 ml-auto">
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Buka cari"
                  className={cn(
                    "h-8 px-1 font-heading text-sm font-medium transition-colors",
                    isOverlay ? "text-white/70 hover:text-white" : "text-fg-muted hover:text-fg"
                  )}
                >
                  Cari
                </button>
                <Link
                  href="/profil"
                  aria-label="Profil"
                  className={cn(
                    "hidden md:flex h-8 px-1 items-center font-heading text-sm font-medium transition-colors",
                    isOverlay
                      ? pathname.startsWith("/profil") ? "text-white" : "text-white/70 hover:text-white"
                      : pathname.startsWith("/profil") ? "text-fg" : "text-fg-muted hover:text-fg"
                  )}
                >
                  Profil
                </Link>
                <ThemeToggle isOverlay={isOverlay} />
                <button
                  className={cn(
                    "md:hidden w-8 h-8 flex items-center justify-center transition-colors",
                    isOverlay ? "text-white/70 hover:text-white" : "text-fg-muted hover:text-fg"
                  )}
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Menu"
                >
                  {menuOpen ? <X size={16} /> : <List size={16} />}
                </button>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Search results dropdown */}
      {showDropdown && (
        <div className="border-t border-border/40 bg-bg">
          <div className="px-8 sm:px-14 py-5 w-full">
            {isPending && (
              <p className="text-xs font-heading text-fg-muted">Mencari…</p>
            )}
            {!isPending && results && !hasResults && (
              <p className="text-xs font-heading text-fg-muted">
                Tidak ada hasil untuk &ldquo;{query}&rdquo;
              </p>
            )}
            {!isPending && results?.artikels && results.artikels.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-fg-muted mb-3">Artikel</p>
                <div className="flex flex-col">
                  {results.artikels.slice(0, 5).map((a) => (
                    <Link
                      key={a._id}
                      href={`/artikel/${a.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="font-heading text-sm text-fg hover:text-accent transition-colors py-1.5 border-b border-border/30 last:border-0"
                    >
                      {a.judul}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {!isPending && results?.nasihats && results.nasihats.length > 0 && (
              <div>
                <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-fg-muted mb-3">Nasihat</p>
                <div className="flex flex-col">
                  {results.nasihats.slice(0, 4).map((n) => (
                    <Link
                      key={n._id}
                      href={`/poster/${n.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="font-heading text-sm text-fg hover:text-accent transition-colors py-1.5 border-b border-border/30 last:border-0 line-clamp-1"
                    >
                      {n.teks}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && !searchOpen && (
        <div className="md:hidden border-t border-border/40 bg-bg">
          <div className="px-8 sm:px-14 pb-5 pt-4 flex flex-col gap-5 w-full">
            {[...navLinks, { href: "/profil", label: "Profil" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "font-heading text-sm font-medium",
                  pathname.startsWith(link.href) ? "text-fg" : "text-fg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
