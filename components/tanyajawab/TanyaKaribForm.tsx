"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";

export function TanyaKaribForm() {
  const [nama, setNama] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/tanya-karib", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nomorTelepon, pertanyaan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Gagal mengirim. Coba lagi.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setNama("");
      setNomorTelepon("");
      setPertanyaan("");
    } catch {
      setErrorMsg("Gagal mengirim. Periksa koneksi internet Anda.");
      setStatus("error");
    }
  }

  const charCount = pertanyaan.length;

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <CheckCircle size={36} weight="light" className="text-accent" />
        <p className="font-heading font-semibold text-fg text-base">Pertanyaan terkirim</p>
        <p className="font-body text-sm text-fg-muted max-w-sm leading-relaxed">
          Terima kasih. Pertanyaanmu sudah kami terima dan akan dijawab oleh Ustadz secepatnya.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-heading text-fg-muted hover:text-fg transition-colors underline underline-offset-2"
        >
          Kirim pertanyaan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-heading font-medium text-fg-muted uppercase tracking-widest">
            Nama
          </label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Tulis nama"
            required
            minLength={2}
            maxLength={80}
            className="w-full bg-white dark:bg-bg border border-border rounded-lg px-4 py-2.5 text-sm font-body text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-accent/60 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-heading font-medium text-fg-muted uppercase tracking-widest">
            Nomor WhatsApp <span className="normal-case tracking-normal text-fg-muted/50">(opsional)</span>
          </label>
          <input
            type="tel"
            value={nomorTelepon}
            onChange={(e) => setNomorTelepon(e.target.value)}
            placeholder="08123456789"
            maxLength={20}
            className="w-full bg-white dark:bg-bg border border-border rounded-lg px-4 py-2.5 text-sm font-body text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-accent/60 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-heading font-medium text-fg-muted uppercase tracking-widest">
          Pertanyaan
        </label>
        <textarea
          value={pertanyaan}
          onChange={(e) => setPertanyaan(e.target.value)}
          placeholder="Tulis pertanyaanmu disini..."
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          className="w-full bg-white dark:bg-bg border border-border rounded-lg px-4 py-2.5 text-sm font-body text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-accent/60 transition-colors resize-none leading-relaxed"
        />
        <p className={cn("text-[11px] font-heading text-right", charCount > 900 ? "text-amber-500" : "text-fg-muted/50")}>
          {charCount}/1000
        </p>
      </div>

      {status === "error" && (
        <p className="text-xs font-body text-red-500">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-fg text-bg font-heading text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <PaperPlaneTilt size={15} weight="bold" />
        {status === "loading" ? "Mengirim..." : "Kirim Pertanyaan"}
      </button>
    </form>
  );
}
