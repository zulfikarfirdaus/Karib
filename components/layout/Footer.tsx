import Link from "next/link";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/artikel", label: "Artikel" },
  { href: "/tanya-jawab", label: "Tanya Jawab" },
  { href: "/poster", label: "Poster" },
  { href: "/profil", label: "Profil" },
];

export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] dark:bg-[#F4F0E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-5">
        <div className="flex flex-col items-center gap-6">
          <p className="font-display font-extrabold text-[#F4F0E8] dark:text-[#1C1C1C] uppercase"
            style={{ fontSize: 18, letterSpacing: "-0.025em", lineHeight: 0.88 }}
          >
            KARIB
          </p>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#9A9490] dark:text-[#6B6560] hover:text-[#E8E4DC] dark:hover:text-[#1C1C1C] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-[#2C2C2C] dark:border-[#D8D0C4] mt-10 pt-4 text-center text-xs text-[#9A9490] dark:text-[#6B6560]">
          Created by{" "}
          <a
            href="https://spladestudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E8E4DC] dark:hover:text-[#1C1C1C] transition-colors"
          >
            Splade Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
