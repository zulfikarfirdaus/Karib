"use client";

import { useState } from "react";
import { buildShareUrl } from "@/lib/utils";

interface NasihatHeroShareProps {
  url: string;
  title: string;
  textColor: string;
}

export function NasihatHeroShare({ url, title, textColor }: NasihatHeroShareProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-1.5">
      <a
        href={buildShareUrl("whatsapp", url, title)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke WhatsApp"
        className={`w-6 h-6 flex items-center justify-center rounded-full border border-current opacity-40 hover:opacity-80 transition-opacity ${textColor}`}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9z" />
        </svg>
      </a>
      <button
        onClick={copy}
        aria-label={copied ? "Disalin" : "Salin tautan"}
        className={`w-6 h-6 flex items-center justify-center rounded-full border border-current transition-opacity ${textColor} ${copied ? "opacity-80" : "opacity-40 hover:opacity-80"}`}
      >
        {copied ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 15l6-6M11 6l.463-.536a5 5 0 0 1 7.07 7.07l-.534.465M13 18l-.397.534a5.07 5.07 0 0 1-7.127 0 4.97 4.97 0 0 1 0-7.07l.524-.464" />
          </svg>
        )}
      </button>
    </div>
  );
}
