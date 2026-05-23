"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";

export function CariInput({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setValue(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = val.trim();
      if (trimmed.length >= 2) {
        router.replace(`/cari?q=${encodeURIComponent(trimmed)}`, { scroll: false });
      } else {
        router.replace("/cari", { scroll: false });
      }
    }, 300);
  }

  return (
    <div className="relative">
      <MagnifyingGlass
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Cari artikel atau nasihat…"
        autoFocus
        className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3.5 font-body text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent transition-colors text-base"
      />
    </div>
  );
}
