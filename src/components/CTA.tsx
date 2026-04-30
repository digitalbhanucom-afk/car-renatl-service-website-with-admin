import { Phone, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

const CTA = () => {
  const { data } = useSiteSettings();
  const phone = data?.phone_number ?? "+919492456488";
  const wa = data?.whatsapp_number ?? "919492456488";
  const waMsg = encodeURIComponent("Hi! I'd like to book a self-drive car.");

  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 p-10 sm:p-16 text-center bg-gradient-card">
          <div className="absolute inset-0 bg-gradient-radial opacity-80" />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="relative z-10">
            <span className="accent-rule">Get In Touch</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mt-4 mb-4">
              Ready to Hit the <span className="text-gradient">Road?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Book your self-drive car in under 2 minutes. Call us or send a WhatsApp message — we respond instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-glow hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" /> Call Now to Book
              </a>
              <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-[#25D366] text-white font-semibold hover:brightness-110 transition-all">
                <MessageCircle className="w-5 h-5" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
