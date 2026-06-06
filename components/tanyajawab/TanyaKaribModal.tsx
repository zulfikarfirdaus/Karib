"use client";

import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { TanyaKaribForm } from "./TanyaKaribForm";

export function TanyaKaribModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-1 py-2.5 text-sm font-heading font-semibold border border-border text-fg-muted rounded-xl hover:border-accent hover:text-accent transition-colors duration-150"
      >
        Tanya Karib
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="absolute inset-0 bg-fg/20 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-lg bg-bg border border-border rounded-2xl p-8 shadow-xl">
            <div className="flex items-start justify-between mb-10">
              <div>
                <p className="text-[10px] font-heading uppercase tracking-widest text-accent mb-2">
                  Tanya Karib
                </p>
                <h2 className="font-display font-bold text-2xl tracking-tight text-fg leading-none mb-3">
                  Ada Pertanyaan?
                </h2>
                <p className="text-sm text-fg-muted font-body leading-snug max-w-sm">
                  Kirim pertanyaanmu, jika terpilih maka akan Ustadz jawab dan diterbitkan di website ini.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-fg-muted hover:text-fg transition-colors mt-0.5 -mr-1 shrink-0 ml-4"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <TanyaKaribForm />
          </div>
        </div>
      )}
    </>
  );
}
