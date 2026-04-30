import { useState } from "react";
import { Users, Fuel, Settings, Clock, Phone } from "lucide-react";
import seltos from "@/assets/car-seltos.jpg";
import venue from "@/assets/car-venue.jpg";
import creta from "@/assets/car-creta.jpg";
import dzire from "@/assets/car-dzire.jpg";
import innova from "@/assets/car-innova.jpg";
import city from "@/assets/car-city.jpg";
import thar from "@/assets/car-thar.jpg";
import ertiga from "@/assets/car-ertiga.jpg";
import { toast } from "sonner";

type Cat = "all" | "suv" | "sedan" | "mpv";

const cars = [
  { name: "Kia Seltos", img: seltos, cat: "suv", type: "Compact SUV", use: "Daily & Outstation", seats: "5 Seater", fuel: "Petrol / Diesel", trans: "Auto / Manual", badge: "Premium", price: 2800 },
  { name: "Hyundai Venue", img: venue, cat: "suv", type: "Sub-Compact SUV", use: "City & Weekends", seats: "5 Seater", fuel: "Petrol", trans: "Manual / Auto", badge: null, price: 2200 },
  { name: "Hyundai Creta", img: creta, cat: "suv", type: "Compact SUV", use: "City & Highway", seats: "5 Seater", fuel: "Petrol / Diesel", trans: "Automatic", badge: "Trending", price: 3000 },
  { name: "Swift Dzire", img: dzire, cat: "sedan", type: "Compact Sedan", use: "Daily & Personal", seats: "5 Seater", fuel: "Petrol", trans: "Manual / Auto", badge: "Budget Friendly", price: 1600 },
  { name: "Innova Crysta", img: innova, cat: "mpv", type: "Premium MPV", use: "Family & Outstation", seats: "7 Seater", fuel: "Diesel", trans: "Automatic", badge: "Family Favorite", price: 3800 },
  { name: "Honda City", img: city, cat: "sedan", type: "Premium Sedan", use: "City & Business", seats: "5 Seater", fuel: "Petrol", trans: "Automatic", badge: null, price: 2600 },
  { name: "Mahindra Thar", img: thar, cat: "suv", type: "4x4 SUV", use: "Adventure & Events", seats: "5 Seater", fuel: "Diesel", trans: "Manual / Auto", badge: "Popular", price: 3500 },
  { name: "Maruti Ertiga", img: ertiga, cat: "mpv", type: "MPV", use: "Family & Group Travel", seats: "7 Seater", fuel: "Petrol / CNG", trans: "Manual", badge: "Best Value", price: 1900 },
];

const filters: { id: Cat; label: string }[] = [
  { id: "all", label: "All Cars" },
  { id: "suv", label: "SUVs" },
  { id: "sedan", label: "Sedans" },
  { id: "mpv", label: "MPVs" },
];

const Fleet = () => {
  const [active, setActive] = useState<Cat>("all");
  const visible = active === "all" ? cars : cars.filter((c) => c.cat === active);

  return (
    <section id="fleet" className="py-24 sm:py-32 bg-background/40">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="accent-rule">Our Cars</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mt-4 mb-4">
            Choose Your <span className="text-gradient">Ride</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every vehicle is thoroughly cleaned, serviced, and inspected before handover. Tap "Book Now" to instantly reserve via WhatsApp.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={`px-5 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                active === f.id
                  ? "bg-gradient-primary text-primary-foreground btn-glow scale-105"
                  : "bg-secondary/60 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map((car, i) => (
            <article
              key={car.name}
              className="card-elevated rounded-3xl overflow-hidden border border-border/60 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={car.img}
                  alt={car.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {car.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider btn-glow">
                    {car.badge}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-5">
                <h3 className="font-display font-bold text-xl mb-1">{car.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{car.type} • {car.use}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary/70 border border-border"><Users className="w-3 h-3" />{car.seats}</span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary/70 border border-border"><Fuel className="w-3 h-3" />{car.fuel}</span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary/70 border border-border"><Settings className="w-3 h-3" />{car.trans}</span>
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Starting from</div>
                    <div className="font-display font-bold text-2xl text-gradient">₹{car.price}<span className="text-sm text-muted-foreground font-medium">/day</span></div>
                  </div>
                </div>

                <button
                  onClick={() => toast.success(`Booking request sent for ${car.name}!`, { description: "We'll confirm via WhatsApp shortly." })}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:brightness-110 transition-all hover:scale-[1.02]"
                >
                  <Clock className="w-4 h-4" /> Book Now
                </button>
                <a
                  href="tel:+919999999999"
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call to Book
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fleet;
