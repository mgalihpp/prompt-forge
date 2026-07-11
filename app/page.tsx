import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    // Root: dotted-grid backdrop via a radial-gradient background image.
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklch, var(--foreground) 12%, transparent) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <SiteHeader />
      <Hero />
      <SiteFooter />
    </div>
  );
}
