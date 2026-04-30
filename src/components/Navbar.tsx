import { Phone, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#services", label: "Services" },
  { href: "#fleet", label: "Fleet" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60 py-3" : "py-5",
      )}
    >
      <div className="container flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground btn-glow group-hover:scale-110 transition-transform">
            A
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-base">Aim Car Travels</div>
            <div className="text-[10px] uppercase tracking-widest text-primary">Vijayawada</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/919999999999"
            className="hidden sm:inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href="tel:+919999999999"
            className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow hover:scale-105 transition-transform"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
