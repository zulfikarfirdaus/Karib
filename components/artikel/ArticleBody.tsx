import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/imageUrl";

// ─── Callout icon + colour config ────────────────────────────────────────────

const calloutConfig = {
  info: {
    icon: "ℹ",
    border: "border-blue-400 dark:border-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    icon_color: "text-blue-500 dark:text-blue-400",
    title_color: "text-blue-800 dark:text-blue-300",
  },
  tip: {
    icon: "✦",
    border: "border-emerald-400 dark:border-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    icon_color: "text-emerald-500 dark:text-emerald-400",
    title_color: "text-emerald-800 dark:text-emerald-300",
  },
  peringatan: {
    icon: "⚠",
    border: "border-amber-400 dark:border-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    icon_color: "text-amber-500 dark:text-amber-400",
    title_color: "text-amber-800 dark:text-amber-300",
  },
  penting: {
    icon: "!",
    border: "border-red-400 dark:border-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
    icon_color: "text-red-500 dark:text-red-400",
    title_color: "text-red-800 dark:text-red-300",
  },
} as const;

// ─── PortableText components ─────────────────────────────────────────────────

const components: PortableTextComponents = {
  // ── Custom object blocks ────────────────────────────────────────────────────
  types: {
    image: ({ value }) => {
      const url = urlFor(value).width(800).url();
      return (
        <figure className="my-10">
          <div className="relative w-full rounded-xl overflow-hidden bg-card">
            <Image
              src={url}
              alt={value.alt ?? ""}
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-fg-muted mt-3 font-heading italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    pullQuote: ({ value }) => (
      <aside className="my-12 px-2">
        <div className="border-t-2 border-b border-accent pt-6 pb-5">
          <p className="font-heading text-2xl sm:text-3xl font-semibold leading-snug tracking-tight text-fg italic text-center">
            &ldquo;{value.teks}&rdquo;
          </p>
          {value.atribusi && (
            <p className="text-center text-sm font-heading text-accent mt-4 tracking-wide">
              {value.atribusi}
            </p>
          )}
        </div>
      </aside>
    ),

    callout: ({ value }) => {
      const jenis = (value.jenis ?? "info") as keyof typeof calloutConfig;
      const cfg = calloutConfig[jenis] ?? calloutConfig.info;
      return (
        <div
          className={`my-8 rounded-xl border-l-4 px-5 py-4 ${cfg.border} ${cfg.bg}`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 text-base font-bold leading-none ${cfg.icon_color}`}
              aria-hidden
            >
              {cfg.icon}
            </span>
            <div className="flex-1 min-w-0">
              {value.judul && (
                <p
                  className={`font-heading font-semibold text-sm mb-1 ${cfg.title_color}`}
                >
                  {value.judul}
                </p>
              )}
              <p className="font-body text-base leading-relaxed text-fg">
                {value.isi}
              </p>
            </div>
          </div>
        </div>
      );
    },

    codeBlock: ({ value }) => (
      <div className="my-8 rounded-xl overflow-hidden border border-border">
        {value.bahasa && (
          <div className="px-4 py-2 bg-card border-b border-border">
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-fg-muted">
              {value.bahasa}
            </span>
          </div>
        )}
        <pre className="bg-[#1E1C1A] dark:bg-[#0E0D0B] px-5 py-5 overflow-x-auto">
          <code className="text-sm text-[#D4C9B0] font-mono leading-relaxed whitespace-pre">
            {value.kode}
          </code>
        </pre>
      </div>
    ),

    divider: ({ value }) => {
      const gaya = value.gaya ?? "dots";
      return (
        <div className="my-12 flex items-center justify-center" aria-hidden>
          {gaya === "dots" ? (
            <span className="text-fg-muted tracking-[0.5em] text-lg select-none">
              ···
            </span>
          ) : (
            <div className="w-24 h-px bg-border" />
          )}
        </div>
      );
    },
  },

  // ── Block-level styles ──────────────────────────────────────────────────────
  block: {
    h1: ({ children }) => (
      <h1 className="font-heading font-semibold text-3xl sm:text-4xl tracking-tight leading-tight mt-14 mb-5 text-fg">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading font-semibold text-2xl tracking-tight mt-10 mb-4 text-fg">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading font-semibold text-xl tracking-tight mt-8 mb-3 text-fg">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading font-semibold text-base uppercase tracking-widest mt-6 mb-2 text-fg-muted">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="font-body text-lg leading-[1.85] text-fg mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-accent pl-6 my-8 italic text-fg-muted font-body text-xl leading-relaxed">
        {children}
      </blockquote>
    ),
  },

  // ── Inline marks ────────────────────────────────────────────────────────────
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-fg">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    "strike-through": ({ children }) => (
      <span className="line-through text-fg-muted">{children}</span>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.88em] bg-card border border-border rounded px-1.5 py-0.5 text-accent">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank !== false ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-3 decoration-1 hover:text-accent-hover"
      >
        {children}
      </a>
    ),
  },

  // ── Lists ───────────────────────────────────────────────────────────────────
  list: {
    bullet: ({ children }) => (
      <ul className="font-body text-lg leading-relaxed list-disc pl-6 mb-6 space-y-2 text-fg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="font-body text-lg leading-relaxed list-decimal pl-6 mb-6 space-y-2 text-fg">
        {children}
      </ol>
    ),
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface ArticleBodyProps {
  content: unknown[];
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="max-w-[680px] mx-auto">
      <PortableText
        value={content as Parameters<typeof PortableText>[0]["value"]}
        components={components}
      />
    </div>
  );
}
