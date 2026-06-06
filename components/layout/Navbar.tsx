"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { List } from "@phosphor-icons/react/dist/csr/List";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { User } from "@phosphor-icons/react/dist/csr/User";
import { Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { Sun } from "@phosphor-icons/react/dist/csr/Sun";
import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/artikel", label: "Artikel" },
  { href: "/tanya-jawab", label: "Tanya Jawab" },
  { href: "/poster", label: "Poster" },
];

const mobileNavLinks = [
  { href: "/", label: "Beranda" },
  ...navLinks,
];

const INV_BG    = "bg-bg border-b border-border/40";
const INV_FG    = "text-fg";
const INV_MUTED = "text-fg-muted";
const INV_MUTED_HOVER = "hover:text-fg";
const INV_BORDER = "border-border/40";

interface SearchResults {
  artikels: { _id: string; judul: string; slug: string }[];
  nasihats: { _id: string; teks: string; slug: string }[];
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark]         = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState<SearchResults | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pathname !== "/") { setScrolled(true); return; }
    const hero = document.querySelector<HTMLElement>("[data-hero-section]");
    if (!hero) { setScrolled(window.scrollY > 20); return; }
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when mobile off-canvas is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
      if (e.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const search = useCallback((q: string) => {
    if (q.trim().length < 2) { setResults(null); return; }
    startTransition(async () => {
      const res  = await fetch(`/api/cari?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    search(val);
  }

  function toggleTheme() {
    const dark = document.documentElement.classList.toggle("dark");
    setIsDark(dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }

  const hasResults   = results && (results.artikels.length > 0 || results.nasihats.length > 0);
  const showDropdown = searchOpen && query.length >= 2;       // desktop inline search results
  const showMenuSearch = query.length >= 2;                   // results inside hamburger / off-canvas

  const isOverlay = pathname === "/" && !scrolled && !searchOpen;

  return (
    <>
      {/* ── Fixed header ─────────────────────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          isOverlay ? "" : INV_BG
        )}
      >
        <div className="px-4 sm:px-6 w-full">
          <nav className="h-16 flex items-center relative">

            {searchOpen ? (
              /* ── Desktop inline search bar ─────────────────────────── */
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <MagnifyingGlass size={15} className={cn(isOverlay ? "text-white/70" : INV_MUTED)} />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={handleChange}
                  placeholder="Cari artikel atau nasihat…"
                  className={cn(
                    "flex-1 min-w-0 bg-transparent font-body text-sm focus:outline-none",
                    isOverlay
                      ? "text-white placeholder:text-white/50"
                      : cn(INV_FG, "placeholder:text-[#E8E4DC]/40 dark:placeholder:text-[#1C1C1C]/40")
                  )}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Tutup cari"
                  className={cn(
                    "w-8 h-8 flex items-center justify-center transition-colors shrink-0",
                    isOverlay ? "text-white/70 hover:text-white" : cn(INV_MUTED, INV_MUTED_HOVER)
                  )}
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center w-full">
                {/* Nav links — visible on desktop only */}
                <div className="hidden sm:flex items-center gap-6 ml-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-heading text-sm font-medium transition-colors",
                        isOverlay
                          ? pathname.startsWith(link.href) ? "text-white" : "text-white/65 hover:text-white"
                          : pathname.startsWith(link.href) ? INV_FG : cn(INV_MUTED, INV_MUTED_HOVER)
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Hamburger — always right */}
                <button
                  className={cn(
                    "w-10 h-10 flex items-center justify-center transition-colors ml-auto sm:ml-6",
                    isOverlay ? "text-white/70 hover:text-white" : cn(INV_MUTED, INV_MUTED_HOVER)
                  )}
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Menu"
                >
                  {menuOpen ? <X size={22} /> : <List size={22} />}
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* ── Desktop inline search results ──────────────────────────────── */}
        {showDropdown && (
          <div className={cn("border-t", INV_BG, INV_BORDER)}>
            <div className="px-8 sm:px-14 py-5 w-full">
              {isPending && <p className={cn("text-xs font-heading", INV_MUTED)}>Mencari…</p>}
              {!isPending && results && !hasResults && (
                <p className={cn("text-xs font-heading", INV_MUTED)}>
                  Tidak ada hasil untuk &ldquo;{query}&rdquo;
                </p>
              )}
              {!isPending && results?.artikels && results.artikels.length > 0 && (
                <div className="mb-5">
                  <p className={cn("text-[10px] font-heading font-semibold uppercase tracking-widest mb-3", INV_MUTED)}>Artikel</p>
                  <div className="flex flex-col">
                    {results.artikels.slice(0, 5).map((a) => (
                      <Link key={a._id} href={`/artikel/${a.slug}`} onClick={() => setSearchOpen(false)}
                        className={cn("font-heading text-sm transition-colors py-1.5 border-b last:border-0", INV_FG, INV_BORDER, "hover:text-accent")}>
                        {a.judul}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {!isPending && results?.nasihats && results.nasihats.length > 0 && (
                <div>
                  <p className={cn("text-[10px] font-heading font-semibold uppercase tracking-widest mb-3", INV_MUTED)}>Nasihat</p>
                  <div className="flex flex-col">
                    {results.nasihats.slice(0, 4).map((n) => (
                      <Link key={n._id} href={`/poster/${n.slug}`} onClick={() => setSearchOpen(false)}
                        className={cn("font-heading text-sm transition-colors py-1.5 border-b last:border-0 line-clamp-1", INV_FG, INV_BORDER, "hover:text-accent")}>
                        {n.teks}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Desktop hamburger dropdown (sm: and above only) ─────────────── */}
        {menuOpen && !searchOpen && (
          <div className="hidden sm:block absolute top-full right-6 w-72 bg-bg border border-border/60 shadow-sm z-50">
            {/* Inline search */}
            <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
              <MagnifyingGlass size={14} className="text-fg-muted shrink-0" />
              <input
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Cari artikel atau nasihat…"
                className="flex-1 min-w-0 bg-transparent font-body text-sm text-fg placeholder:text-fg-muted focus:outline-none"
                autoFocus
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults(null); }} className="text-fg-muted hover:text-fg">
                  <X size={13} />
                </button>
              )}
            </div>
            {showMenuSearch && (
              <div className="px-4 py-3 border-b border-border/40 max-h-60 overflow-y-auto">
                {isPending && <p className="text-xs text-fg-muted font-heading">Mencari…</p>}
                {!isPending && results && !hasResults && (
                  <p className="text-xs text-fg-muted font-heading">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
                )}
                {!isPending && results?.artikels && results.artikels.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-fg-muted mb-2">Artikel</p>
                    {results.artikels.slice(0, 4).map((a) => (
                      <Link key={a._id} href={`/artikel/${a.slug}`} onClick={() => setMenuOpen(false)}
                        className="block text-sm font-heading text-fg hover:text-accent transition-colors py-1 border-b border-border/20 last:border-0">
                        {a.judul}
                      </Link>
                    ))}
                  </div>
                )}
                {!isPending && results?.nasihats && results.nasihats.length > 0 && (
                  <div>
                    <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-fg-muted mb-2">Nasihat</p>
                    {results.nasihats.slice(0, 3).map((n) => (
                      <Link key={n._id} href={`/poster/${n.slug}`} onClick={() => setMenuOpen(false)}
                        className="block text-sm font-heading text-fg hover:text-accent transition-colors py-1 border-b border-border/20 last:border-0 line-clamp-1">
                        {n.teks}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="py-1">
              <Link href="/profil" onClick={() => setMenuOpen(false)}
                className={cn("flex items-center gap-3 px-4 py-3 font-heading text-sm font-medium transition-colors",
                  pathname.startsWith("/profil") ? "text-fg" : "text-fg-muted hover:text-fg")}>
                <User size={15} />
                Profil
              </Link>
              <button onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 font-heading text-sm font-medium text-fg-muted hover:text-fg transition-colors">
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile off-canvas backdrop ───────────────────────────────────── */}
      <div
        className={cn(
          "sm:hidden fixed inset-0 bg-fg/40 backdrop-blur-sm z-[49]",
          "transition-opacity duration-300",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      {/* ── Mobile off-canvas panel ──────────────────────────────────────── */}
      <div
        className={cn(
          "sm:hidden fixed top-0 right-0 h-[100dvh] w-4/5 max-w-xs bg-bg z-[51]",
          "border-l border-border/40 flex flex-col",
          "transition-transform duration-300 ease-out",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel header — close button only */}
        <div className="flex items-center justify-end px-5 h-16 shrink-0">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
            className="w-10 h-10 flex items-center justify-center text-fg-muted hover:text-fg transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* Search */}
          <div className="px-6 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={14} className="text-fg-muted shrink-0" />
              <input
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Cari artikel atau nasihat…"
                className="flex-1 min-w-0 bg-transparent font-body text-sm text-fg placeholder:text-fg-muted focus:outline-none"
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults(null); }} className="text-fg-muted hover:text-fg">
                  <X size={13} />
                </button>
              )}
            </div>
            {showMenuSearch && (
              <div className="mt-3 max-h-52 overflow-y-auto">
                {isPending && <p className="text-xs text-fg-muted font-heading">Mencari…</p>}
                {!isPending && results && !hasResults && (
                  <p className="text-xs text-fg-muted font-heading">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
                )}
              {!isPending && results?.artikels && results.artikels.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-fg-muted mb-2">Artikel</p>
                  {results.artikels.slice(0, 4).map((a) => (
                    <Link key={a._id} href={`/artikel/${a.slug}`} onClick={() => setMenuOpen(false)}
                      className="block text-sm font-heading text-fg hover:text-accent transition-colors py-1.5 border-b border-border/20 last:border-0">
                      {a.judul}
                    </Link>
                  ))}
                </div>
              )}
              {!isPending && results?.nasihats && results.nasihats.length > 0 && (
                <div>
                  <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-fg-muted mb-2">Nasihat</p>
                  {results.nasihats.slice(0, 3).map((n) => (
                    <Link key={n._id} href={`/poster/${n.slug}`} onClick={() => setMenuOpen(false)}
                      className="block text-sm font-heading text-fg hover:text-accent transition-colors py-1.5 border-b border-border/20 last:border-0 line-clamp-1">
                      {n.teks}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          </div>

          {/* Nav links */}
          <nav className="px-6 py-2">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center h-12 font-heading text-base font-medium transition-colors",
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)) ? "text-fg" : "text-fg-muted hover:text-fg"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Push footer to bottom */}
          <div className="flex-1" />

          {/* Footer — always at the very bottom */}
          <div className="px-6 shrink-0">
            <Link
              href="/profil"
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 h-12 font-heading text-sm font-medium transition-colors",
                pathname.startsWith("/profil") ? "text-fg" : "text-fg-muted hover:text-fg"
              )}
            >
              <User size={15} />
              Profil
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 h-12 font-heading text-sm font-medium text-fg-muted hover:text-fg transition-colors"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
