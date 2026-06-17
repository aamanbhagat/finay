import { StockTicker } from "@/components/layout/stock-ticker";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-(--radius) focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy"
      >
        Skip to content
      </a>
      <StockTicker />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
