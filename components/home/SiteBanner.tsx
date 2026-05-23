"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";

const BG =
  "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export function SiteBanner() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="-mt-20 relative w-full min-h-[100dvh] overflow-hidden">
      {/* Background image */}
      <Image
        src={BG}
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center"
      />

      {/* Content: headline top-left, manifesto+search bottom-right */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col justify-between px-8 sm:px-20 pt-36 pb-16 sm:pb-20">

        {/* Top-left: headline */}
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl lg:text-[3.25rem] tracking-tight leading-[1.08] text-[#1C1C1C] max-w-xl">
          Kita semua tersesat,<br />
          tanpa petunjuk Rabb.
        </h1>

        {/* Bottom-right: manifesto + search */}
        <div className="flex justify-end">
          <div className="flex flex-col gap-5 w-full max-w-md">
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Setiap jiwa membutuhkan petunjuk. Tanpa ilmu yang benar, kita hanya mengikuti prasangka dan hawa nafsu. Di sini, kami menghadirkan kajian Al-Qur'an dan Sunnah agar kita menemukan jalan yang lurus.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex items-center w-[320px] overflow-hidden rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(10px)",
              }}
            >
              <MagnifyingGlass
                size={14}
                weight="bold"
                className="ml-3.5 shrink-0"
                style={{ color: "rgba(255,255,255,0.5)" }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari keyword artikel"
                className="flex-1 bg-transparent py-2.5 px-2.5 text-sm font-body text-white focus:outline-none placeholder:text-white/40 min-w-0"
                style={{ caretColor: "#D4892E" }}
              />
              <button
                type="submit"
                className="shrink-0 m-1 rounded-full px-4 py-1.5 font-heading text-sm font-semibold transition-colors"
                style={{ background: "#fff", color: "#3D2B0E" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F5EDD8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
