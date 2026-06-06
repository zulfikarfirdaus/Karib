"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CaretLeft } from "@phosphor-icons/react/dist/csr/CaretLeft";
import { CaretRight } from "@phosphor-icons/react/dist/csr/CaretRight";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  // Show max 5 page numbers around current page
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Pagination">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-card transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Halaman sebelumnya"
      >
        <CaretLeft size={14} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-fg-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-heading transition-colors",
              p === currentPage
                ? "bg-fg text-bg font-semibold"
                : "text-fg-muted hover:text-fg hover:bg-card"
            )}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-card transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Halaman berikutnya"
      >
        <CaretRight size={14} />
      </button>
    </nav>
  );
}
