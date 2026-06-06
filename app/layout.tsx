import type { Metadata } from "next";
import { IBM_Plex_Serif, Lora, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Karib: Ilmu & Hikmah Islam",
    template: "%s | Karib",
  },
  description:
    "Platform ilmu Islam dari Ustadz Muhammad Ibrahim Saleh, Lc. Berisi artikel mendalam dan nasihat singkat berdasarkan Al-Quran dan Sunnah.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${ibmPlexSerif.variable} ${lora.variable} ${plusJakarta.variable}`}
    >
      <body suppressHydrationWarning>
        {/* Anti-FOUC: must be beforeInteractive to run before hydration */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
