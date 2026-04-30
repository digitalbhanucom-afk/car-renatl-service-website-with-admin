import { MapPin, Clock, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

const Footer = () => {
  const { data } = useSiteSettings();
  const wa = data?.whatsapp_number ?? "919492456488";

  return (
    <footer id="contact" className="border-t border-border/60 pt-20 pb-10">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground">A</div>
              <div>
                <div className="font-display font-bold">{data?.business_name ?? "Aim Car Travels"}</div>
                <div className="text-[10px] uppercase tracking-widest text-primary">{data?.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{data?.about_text}</p>
          </div>

          <div className="lg:col-span-2">
            <div className="font-semibold mb-4">Quick Links</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#fleet" className="hover:text-primary transition-colors">Our Fleet</a></li>
              <li><a href="#reviews" className="hover:text-primary transition-colors">Reviews</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="font-semibold mb-4">Services</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Self-Drive Rentals</li>
              <li>Wedding Cars</li>
              <li>Outstation Travel</li>
              <li>Premium Vehicles</li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <div className="card-elevated rounded-2xl p-4 border border-border/60 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">{data?.address}</div>
                <div className="text-xs text-muted-foreground">India</div>
              </div>
            </div>
            <div className="card-elevated rounded-2xl p-4 border border-border/60 flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">{data?.hours}</div>
                <div className="text-xs text-muted-foreground">Book anytime, pick up anytime</div>
              </div>
            </div>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="card-elevated rounded-2xl p-4 border border-border/60 flex items-start gap-3 hover:border-primary/40 transition-colors">
              <MessageCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">WhatsApp</div>
                <div className="text-xs text-primary">Chat on WhatsApp →</div>
              </div>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div>© 2026 {data?.business_name ?? "Aim Car Travels"}. All rights reserved.</div>
          <div>Crafted with care in Vijayawada 🇮🇳</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
