"use client";

import { buildShareUrl } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Inline SVGs (Tabler Icons — consistent 24×24 stroke style) ──────────────

function IconWhatsapp({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9z" />
      <path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v4h3v7h4v-7h3l1-4h-4v-2a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2z" />
    </svg>
  );
}

function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function IconLink({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 15l6-6" />
      <path d="M11 6l.463-.536a5 5 0 0 1 7.07 7.07l-.534.465" />
      <path d="M13 18l-.397.534a5.07 5.07 0 0 1-7.127 0 4.97 4.97 0 0 1 0-7.07l.524-.464" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
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

  const actions = [
    {
      label: "WhatsApp",
      icon: <IconWhatsapp />,
      href: buildShareUrl("whatsapp", url, title),
      hover: "hover:text-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-700",
    },
    {
      label: "Facebook",
      icon: <IconFacebook />,
      href: buildShareUrl("facebook", url, title),
      hover: "hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-700",
    },
    {
      label: "Email",
      icon: <IconMail />,
      href: buildShareUrl("email", url, title),
      hover: "hover:text-fg hover:border-fg-muted",
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[10px] font-heading font-semibold uppercase tracking-[0.15em] text-fg-muted mr-0.5">
        Bagikan
      </span>

      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${action.label}`}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full",
            "border border-border text-fg-muted",
            "transition-colors duration-150",
            action.hover
          )}
        >
          {action.icon}
        </a>
      ))}

      <button
        onClick={copyUrl}
        aria-label={copied ? "Tautan disalin" : "Salin tautan"}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-150",
          copied
            ? "border-accent text-accent"
            : "border-border text-fg-muted hover:text-fg hover:border-fg-muted"
        )}
      >
        {copied ? <IconCheck /> : <IconLink />}
      </button>
    </div>
  );
}
