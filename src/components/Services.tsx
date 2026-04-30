import { Car, MapPin, PartyPopper, Briefcase } from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Self-Drive Rentals",
    desc: "Hourly, daily, or multi-day rentals with unlimited flexibility. Perfect for personal errands, family trips, or just a weekend drive.",
    tags: ["Hourly", "Daily", "Multi-Day", "Personal Use"],
  },
  {
    icon: MapPin,
    title: "Outstation Travel",
    desc: "Hit the highway with confidence. Long-distance rentals with flexible durations — drive to Hyderabad, Goa, or anywhere you choose.",
    tags: ["Long Distance", "Flexible Duration", "Highway Ready"],
  },
  {
    icon: PartyPopper,
    title: "Event & Occasion Rentals",
    desc: "Make your special day unforgettable with premium vehicles. Wedding arrivals, anniversary celebrations, or high-profile events.",
    tags: ["Weddings", "Premium Cars", "Special Events"],
  },
  {
    icon: Briefcase,
    title: "Monthly Corporate",
    desc: "Long-term rentals for professionals and businesses. Discounted monthly pricing with full maintenance handled.",
    tags: ["Corporate", "Discounted", "Maintenance Included"],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 sm:py-32 relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="accent-rule">Our Services</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mt-4 mb-4">
            Rent Your Way, <span className="text-gradient">Drive Your Way</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose from flexible rental plans tailored for every trip — short commutes, family getaways, or special occasions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="card-elevated rounded-3xl p-6 border border-border/60 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform duration-500 btn-glow">
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-secondary/70 border border-border text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
