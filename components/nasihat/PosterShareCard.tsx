"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { ShareNetwork } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { Link } from "@phosphor-icons/react/dist/csr/Link";
import { Check } from "@phosphor-icons/react/dist/csr/Check";

const themeColors = {
  pasir: { bg: "#C96530", text: "#FFF5EC", accent: "#FFD4A8", border: "#E07840" },
  zaitun: { bg: "#2C3A2A", text: "#D4E0D0", accent: "#8FBF84", border: "#4A6347" },
  arang: { bg: "#38342F", text: "#E8E4DC", accent: "#C97E2A", border: "#5A5754" },
  krem: { bg: "#FFFFFF", text: "#2C2218", accent: "#A0621A", border: "#E0D5C0" },
} as const;

interface PosterShareCardProps {
  nasihat: {
    teks: string;
    slug: string;
    narasumber?: string;
    referensiKitab?: string;
    tema?: string;
    kategori?: { nama: string; slug: string };
  };
  pageUrl?: string;
}

export function PosterShareCard({ nasihat, pageUrl }: PosterShareCardProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    if (!pageUrl) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = pageUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tema = (nasihat.tema ?? "pasir") as keyof typeof themeColors;
  const c = themeColors[tema] ?? themeColors.pasir;

  const fontSize = nasihat.teks.length > 150 ? "26px" : "32px";

  async function generateBlob(): Promise<Blob> {
    if (!exportRef.current) throw new Error("No element");
    const dataUrl = await toPng(exportRef.current, {
      pixelRatio: 2,
      width: 540,
      height: 540,
    });
    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function handleShare() {
    setLoading(true);
    try {
      const blob = await generateBlob();
      const file = new File([blob], `nasihat-${nasihat.slug}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        download(blob);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    setLoading(true);
    try {
      download(await generateBlob());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function download(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nasihat-${nasihat.slug}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Visible responsive card */}
      <div
        className="rounded-3xl p-10 sm:p-14 mb-8 min-h-[320px] flex flex-col justify-between"
        style={{ backgroundColor: c.bg, color: c.text }}
      >
        <p className="font-body text-xl sm:text-2xl leading-relaxed">{nasihat.teks}</p>
        <div className="flex items-end justify-between mt-8">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-widest" style={{ color: c.accent }}>
              {nasihat.narasumber}
            </p>
            {nasihat.referensiKitab && (
              <p className="font-heading text-xs uppercase tracking-widest opacity-60 mt-1" style={{ color: c.accent }}>
                {nasihat.referensiKitab}
              </p>
            )}
          </div>
          <span className="text-4xl select-none" style={{ opacity: 0.1 }}>☽</span>
        </div>
      </div>

      {/* Off-screen 1080×1080 export canvas (rendered at 540px, exported at 2× = 1080px) */}
      <div
        ref={exportRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "540px",
          height: "540px",
          backgroundColor: c.bg,
          color: c.text,
          padding: "64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "0px",
        }}
      >
        {/* Category tag */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "2px", backgroundColor: c.accent, borderRadius: "2px" }} />
          <span style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: c.accent,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
          }}>
            {nasihat.kategori?.nama ?? "Karib"}
          </span>
        </div>

        {/* Quote */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "32px 0" }}>
          <p style={{
            fontSize,
            lineHeight: 1.7,
            color: c.text,
            fontStyle: "italic",
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}>
            {nasihat.teks}
          </p>
        </div>

        {/* Attribution */}
        <div>
          <div style={{ width: "48px", height: "1px", backgroundColor: c.border, marginBottom: "16px" }} />
          <p style={{
            fontSize: "13px",
            color: c.accent,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: 0,
          }}>
            {nasihat.narasumber ?? "Karib"}
          </p>
          {nasihat.referensiKitab && (
            <p style={{
              fontSize: "11px",
              color: c.text,
              opacity: 0.5,
              fontFamily: "system-ui, sans-serif",
              margin: "4px 0 0",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              {nasihat.referensiKitab}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-row items-center gap-2 sm:gap-3">
        <button
          onClick={handleShare}
          disabled={loading}
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-heading text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          <ShareNetwork size={17} weight="bold" />
          {loading ? "…" : (
            <>
              <span className="sm:hidden">Bagikan</span>
              <span className="hidden sm:inline">Bagikan Poster</span>
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 text-fg-muted hover:text-fg border border-border hover:border-fg-muted font-heading text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          <DownloadSimple size={17} weight="bold" />
          {loading ? "…" : (
            <>
              <span className="sm:hidden">Unduh</span>
              <span className="hidden sm:inline">Unduh PNG</span>
            </>
          )}
        </button>
        {pageUrl && (
          <button
            onClick={handleCopyLink}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 text-fg-muted hover:text-fg border border-border hover:border-fg-muted font-heading text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            {copied ? <Check size={17} weight="bold" /> : <Link size={17} weight="bold" />}
            {copied ? "Disalin!" : (
              <>
                <span className="sm:hidden">Salin</span>
                <span className="hidden sm:inline">Salin Tautan</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
