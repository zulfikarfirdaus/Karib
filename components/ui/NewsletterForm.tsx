"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { Warning } from "@phosphor-icons/react/dist/csr/Warning";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  variant?: "default" | "compact";
  className?: string;
}

export function NewsletterForm({ variant = "default", className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Terjadi kesalahan");
      setStatus("success");
      setMessage("Berhasil! Cek email Anda untuk konfirmasi.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Gagal. Coba lagi.");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("flex items-center gap-3 text-accent", className)}>
        <CheckCircle size={20} weight="fill" />
        <p className="text-sm font-heading">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      {variant === "default" && (
        <p className="text-xs font-heading uppercase tracking-widest text-fg-muted mb-3">
          Newsletter
        </p>
      )}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Alamat email Anda"
          required
          className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm font-body text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-heading text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {status === "loading" ? (
            "..."
          ) : (
            <>
              Daftar
              <ArrowRight size={16} weight="bold" />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="flex items-center gap-1.5 mt-2 text-xs text-red-500">
          <Warning size={14} />
          {message}
        </p>
      )}
    </form>
  );
}
