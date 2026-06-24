"use client";

import { useEffect, useState } from "react";
import { TanyaKaribForm } from "./TanyaKaribForm";
import { ChatCircleDots } from "@phosphor-icons/react/dist/csr/ChatCircleDots";
import { X } from "@phosphor-icons/react/dist/csr/X";

export function TanyaKaribDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="mt-16 max-w-[680px] mx-auto flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 px-7 py-3.5 bg-fg text-bg font-heading text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
        >
          <ChatCircleDots size={18} weight="bold" />
          Ada Pertanyaan?
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Tanya Karib"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-[640px] max-h-[90dvh] overflow-y-auto bg-white dark:bg-card rounded-2xl px-5 sm:px-8 py-8 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 p-1.5 rounded-full text-fg-muted hover:text-fg hover:bg-border/50 transition-colors"
            >
              <X size={18} weight="bold" />
            </button>

            <div className="mb-6">
              <p className="text-xs font-heading uppercase tracking-widest text-accent mb-2">
                Tanya Karib
              </p>
              <h2 className="font-display font-bold text-2xl tracking-tight text-fg">
                Ada Pertanyaan?
              </h2>
              <p className="mt-2 text-sm font-body text-fg-muted">
                Kirim pertanyaanmu, jika terpilih maka akan Ustadz jawab dan diterbitkan di website ini.
              </p>
            </div>

            <TanyaKaribForm />
          </div>
        </div>
      )}
    </>
  );
}
