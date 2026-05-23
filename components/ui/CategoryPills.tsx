"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  nama: string;
  slug: string;
}

interface CategoryPillsProps {
  kategoris: Category[];
  baseHref?: string;
  className?: string;
}

export function CategoryPills({ kategoris, baseHref = "", className }: CategoryPillsProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("kategori");

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Link
        href={baseHref || pathname}
        className={cn(
          "px-4 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all",
          !current
            ? "bg-accent text-white border-accent"
            : "border-border text-fg-muted hover:border-fg hover:text-fg"
        )}
      >
        Semua
      </Link>
      {kategoris.map((kat) => (
        <Link
          key={kat._id}
          href={`${baseHref || pathname}?kategori=${kat.slug}`}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all",
            current === kat.slug
              ? "bg-accent text-white border-accent"
              : "border-border text-fg-muted hover:border-fg hover:text-fg"
          )}
        >
          {kat.nama}
        </Link>
      ))}
    </div>
  );
}
