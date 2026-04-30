import { Phone, MessageCircle, Shield, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useSiteSettings } from "@/hooks/useSiteData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { href: "#services", label: "Services" },
  { href: "#fleet", label: "Fleet" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data } = useSiteSettings();
  const { isAdmin, session } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = data?.phone_number ?? "+919492456488";
  const wa = data?.whatsapp_number ?? "919492456488";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60 py-3" : "py-5",
      )}
    >
      <div className="container flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground btn-glow group-hover:scale-110 transition-transform">
            A
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-display font-bold text-base">{data?.business_name ?? "Aim Car Travels"}</div>
            <div className="text-[10px] uppercase tracking-widest text-primary">{data?.tagline ?? "Vijayawada"}</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
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
          <ThemeToggle />
          {session ? (
            isAdmin ? (
              <Link to="/admin" className="hidden sm:inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            ) : (
              <button onClick={() => supabase.auth.signOut()} className="hidden sm:inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70">
                <LogOut className="w-4 h-4" />
              </button>
            )
          ) : (
            <Link to="/auth" aria-label="Admin login" className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary border border-border hover:bg-secondary/70">
              <LogIn className="w-4 h-4" />
            </Link>
          )}
          <a href={`https://wa.me/${wa}`} className="hidden md:inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70 transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow hover:scale-105 transition-transform">
            <Phone className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
