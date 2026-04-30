import heroCar from "@/assets/hero-car.jpg";
import { Phone, MessageCircle, Star, ShieldCheck, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <img src={heroCar} alt="Premium SUV on coastal highway" className="w-full h-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-12 gap-10 py-20">
        <div className="lg:col-span-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-primary">Available 24/7 — Book Anytime</span>
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] mb-6">
            Self-Drive Cars in <span className="text-gradient">Vijayawada</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Well-maintained vehicles with transparent pricing. From compact cars to premium SUVs — pick up at Benz Circle and drive anywhere.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <a href="tel:+919999999999" className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-gradient-primary text-primary-foreground font-semibold text-base btn-glow hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" /> Call to Book
            </a>
            <a href="https://wa.me/919999999999" className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-secondary/80 backdrop-blur border border-border font-semibold text-base hover:bg-secondary transition-colors">
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {[
              { v: "4.9★", l: "Google Rating" },
              { v: "240+", l: "Verified Reviews" },
              { v: "8+", l: "Years in Business" },
              { v: "24/7", l: "Booking Open" },
            ].map((s, i) => (
              <div key={i} className="card-elevated rounded-2xl p-4 border border-border/50">
                <div className="font-display font-bold text-2xl text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 hidden lg:flex flex-col gap-4 justify-center">
          {[
            { icon: ShieldCheck, t: "Inspected & Sanitised", d: "Every car cleaned before handover" },
            { icon: Clock, t: "Instant Booking", d: "Reply on WhatsApp in 2 mins" },
            { icon: Star, t: "Loved by 240+ Drivers", d: "4.9-star Google rating" },
          ].map((f, i) => (
            <div
              key={i}
              className="card-elevated rounded-2xl p-5 border border-border/60 backdrop-blur animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.15}s`, opacity: 0 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold mb-1">{f.t}</div>
                  <div className="text-sm text-muted-foreground">{f.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
