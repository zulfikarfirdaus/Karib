import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { KaribAnimatedLogo } from "@/components/home/KaribAnimatedLogo";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg text-fg">
      <Suspense>
        <Navbar />
        <KaribAnimatedLogo />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
