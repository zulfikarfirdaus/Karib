import Link from "next/link";
import { cn } from "@/lib/utils";

const themeStyles: Record<string, string> = {
  pasir: "bg-white text-[#3D2B0E]",
  zaitun: "bg-[#2C3A2A] text-[#D4E0D0]",
  arang: "bg-[#1E1C1A] text-[#E8E4DC]",
  krem: "bg-[#B85C1A] text-[#FFF5EC]",
};

const accentStyles: Record<string, string> = {
  pasir: "text-[#A0621A]",
  zaitun: "text-[#8FBF84]",
  arang: "text-[#C97E2A]",
  krem: "text-[#FFD9B0]",
};

interface NasihatCardProps {
  nasihat: {
    _id: string;
    teks: string;
    slug: string;
    kategori?: { nama: string; slug: string };
    tema?: string;
    narasumber?: string;
  };
  className?: string;
}

export function NasihatCard({ nasihat, className }: NasihatCardProps) {
  const tema = nasihat.tema ?? "pasir";
  const cardBg = themeStyles[tema] ?? themeStyles.pasir;
  const accentColor = accentStyles[tema] ?? accentStyles.pasir;

  return (
    <Link href={`/poster/${nasihat.slug}`} className={cn("block group", className)}>
      <article
        className={cn(
          "rounded-2xl p-6 min-h-[200px] flex flex-col justify-between transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg",
          cardBg
        )}
      >
        <p className="font-body text-base leading-relaxed line-clamp-5 flex-1">
          {nasihat.teks}
        </p>
        {nasihat.narasumber && (
          <p className={cn("mt-5 text-[10px] font-heading uppercase tracking-widest", accentColor)}>
            {nasihat.narasumber}
          </p>
        )}
      </article>
    </Link>
  );
}
