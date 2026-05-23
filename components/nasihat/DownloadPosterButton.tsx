"use client";

import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { useState } from "react";

interface DownloadPosterButtonProps {
  slug: string;
}

export function DownloadPosterButton({ slug }: DownloadPosterButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/og/nasihat?slug=${slug}`);
      if (!res.ok) throw new Error("Gagal generate poster");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nasihat-${slug}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh poster. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-heading text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
    >
      <DownloadSimple size={17} weight="bold" />
      {loading ? "Menyiapkan…" : "Unduh Poster"}
    </button>
  );
}
