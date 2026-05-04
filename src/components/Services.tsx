import { Car, MapPin, PartyPopper, Briefcase, ShieldCheck, Clock, Star, Sparkles, Gauge, Fuel, Settings, Users, type LucideIcon } from "lucide-react";
import { useServices, useSiteSettings } from "@/hooks/useSiteData";

const ICONS: Record<string, LucideIcon> = {
  Car, MapPin, PartyPopper, Briefcase, ShieldCheck, Clock, Star, Sparkles, Gauge, Fuel, Settings, Users,
};

const Services = () => {
  const { data: services = [] } = useServices();
  const { data: settings } = useSiteSettings();

  return (
    <section id="services" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="accent-rule">Our Services</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mt-4 mb-4">
            {settings?.services_title?.split(",").map((part, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 && arr.length > 1 ? <span className="text-gradient">{part.trim()}</span> : part}
                {i < arr.length - 1 ? ", " : ""}
              </span>
            )) ?? "Our Services"}
          </h2>
          <p className="text-muted-foreground text-lg">{settings?.services_subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Car;
            return (
              <div
                key={s.id}
                className="card-elevated rounded-3xl p-6 border border-border/60 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform duration-500 btn-glow">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-secondary/70 border border-border text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
