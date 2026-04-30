import { Phone, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

export const FloatingActions = () => {
  const { data } = useSiteSettings();
  const phone = data?.phone_number ?? "+919492456488";
  const wa = data?.whatsapp_number ?? "919492456488";
  const waMsg = encodeURIComponent("Hi! I'd like to book a self-drive car.");

  return (
    <div className="fixed right-4 sm:right-6 bottom-6 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${wa}?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle className="w-6 h-6 relative" />
      </a>
      <a
        href={`tel:${phone}`}
        aria-label="Call now"
        className="group relative w-14 h-14 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center btn-glow hover:scale-110 transition-transform"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
};
