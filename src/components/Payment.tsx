import { QrCode, Copy, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { toast } from "sonner";

const Payment = () => {
  const { data } = useSiteSettings();
  if (!data?.payment_enabled) return null;

  const wa = data.whatsapp_number || "919492456488";
  const upi = data.upi_id;
  const upiLink = upi ? `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(data.business_name)}&cu=INR` : "";

  return (
    <section id="payment" className="py-20 sm:py-28">
      <div className="container">
        <div className="max-w-5xl mx-auto rounded-[2rem] border border-border/60 card-elevated p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="accent-rule">Pay & Confirm</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 mb-3">
              Quick <span className="text-gradient">UPI Payment</span>
            </h2>
            <p className="text-muted-foreground mb-5 text-sm leading-relaxed">{data.payment_note}</p>

            {upi && (
              <div className="rounded-2xl border border-border bg-background/50 p-4 mb-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">UPI ID</div>
                <div className="flex items-center justify-between gap-3">
                  <code className="font-mono text-base sm:text-lg font-semibold text-primary break-all">{upi}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(upi); toast.success("UPI ID copied"); }}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-secondary border border-border text-xs font-semibold hover:bg-secondary/70 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {upi && (
                <a href={upiLink} className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow hover:scale-[1.03] transition-transform">
                  Open UPI App
                </a>
              )}
              <a
                href={`https://wa.me/${wa}?text=${encodeURIComponent(data.whatsapp_payment_message || "Hi! I've completed the payment, sending the screenshot now.")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:brightness-110"
              >
                <MessageCircle className="w-4 h-4" /> Send Screenshot
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xs aspect-square rounded-3xl border border-border bg-background/60 p-4 flex items-center justify-center overflow-hidden">
              {data.payment_qr_url ? (
                <img src={data.payment_qr_url} alt="Payment QR code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="w-16 h-16 mx-auto mb-2 opacity-40" />
                  <div className="text-xs">QR will appear here</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
