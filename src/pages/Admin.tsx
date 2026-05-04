import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteSettings, useCars, useReviewsAll, useServices, type Car, type Review, type SiteSettings, type Service } from "@/hooks/useSiteData";
import { toast } from "sonner";
import {
  LogOut, Plus, Trash2, Save, Home, Car as CarIcon, MessageSquare, Settings as SettingsIcon, Loader2,
  ArrowLeft, Eye, EyeOff, BarChart3, Image as ImageIcon, Sparkles, MapPin, CreditCard, Wrench, Phone, MessageCircle,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { ThemeToggle } from "@/components/ThemeToggle";

type Tab = "overview" | "branding" | "content" | "services" | "cars" | "reviews" | "payment" | "contact";

const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "branding", label: "Branding & Hero", icon: Sparkles },
  { id: "content", label: "Section Copy", icon: SettingsIcon },
  { id: "services", label: "Services", icon: Wrench },
  { id: "cars", label: "Fleet / Cars", icon: CarIcon },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "payment", label: "Payment / UPI", icon: CreditCard },
  { id: "contact", label: "Contact & Map", icon: MapPin },
];

const Admin = () => {
  const { session, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!session) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card-elevated rounded-3xl p-8 max-w-md text-center border border-border">
        <h1 className="font-display font-bold text-2xl mb-2">Not authorized</h1>
        <p className="text-muted-foreground text-sm mb-4">Your account doesn't have admin access. Ask an existing admin to grant it.</p>
        <p className="text-xs text-muted-foreground mb-6">Your user id: <code className="text-primary break-all">{session.user.id}</code></p>
        <div className="flex gap-2 justify-center">
          <Link to="/" className="px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to site</Link>
          <button onClick={() => supabase.auth.signOut()} className="px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-secondary border border-border hover:bg-secondary/70 shrink-0" aria-label="Back to landing page">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shrink-0">A</div>
            <div className="min-w-0">
              <div className="font-display font-bold text-sm truncate">Admin Dashboard</div>
              <div className="text-[10px] uppercase tracking-widest text-primary truncate">Aim Car Travels</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="hidden sm:inline-flex items-center gap-2 px-4 h-9 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow hover:scale-[1.03] transition-transform">
              <Home className="w-4 h-4" /> View site
            </Link>
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 px-3 sm:px-4 h-9 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container py-6 lg:py-8 grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <div className="card-elevated rounded-2xl p-2 border border-border/60 lg:sticky lg:top-24 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-3 px-3 lg:px-4 h-11 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.id ? "bg-gradient-primary text-primary-foreground btn-glow" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4 shrink-0" /> <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {tab === "overview" && <Overview onJump={setTab} />}
          {tab === "branding" && <BrandingEditor />}
          {tab === "content" && <ContentEditor />}
          {tab === "services" && <ServicesEditor />}
          {tab === "cars" && <CarsEditor />}
          {tab === "reviews" && <ReviewsEditor />}
          {tab === "payment" && <PaymentEditor />}
          {tab === "contact" && <ContactEditor />}
        </main>
      </div>
    </div>
  );
};

/* ---------- Settings shared hook ---------- */
const useSettingsForm = () => {
  const { data, isLoading } = useSiteSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setForm(data); }, [data]);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const save = async (fields: (keyof SiteSettings)[]) => {
    if (!form) return;
    setSaving(true);
    const patch: Partial<SiteSettings> = {};
    fields.forEach((k) => ((patch as Record<string, unknown>)[k as string] = form[k]));
    const { error } = await supabase.from("site_settings").update(patch).eq("id", form.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  return { form, set, save, saving, isLoading };
};

/* ---------- Overview ---------- */
const Overview = ({ onJump }: { onJump: (t: Tab) => void }) => {
  const { data: cars = [] } = useCars({ includeInactive: true });
  const { data: reviews = [] } = useReviewsAll();
  const { data: services = [] } = useServices({ includeInactive: true });
  const { data: settings } = useSiteSettings();

  const stats = [
    { label: "Cars in fleet", value: cars.length, sub: `${cars.filter((c) => c.active).length} active`, icon: CarIcon, jump: "cars" as Tab },
    { label: "Services", value: services.length, sub: `${services.filter((s) => s.active).length} live`, icon: Wrench, jump: "services" as Tab },
    { label: "Reviews", value: reviews.length, sub: `${reviews.filter((r) => r.active).length} live`, icon: MessageSquare, jump: "reviews" as Tab },
    { label: "Payment", value: settings?.payment_enabled ? "Enabled" : "Off", sub: settings?.upi_id || "Add UPI ID", icon: CreditCard, jump: "payment" as Tab },
  ];

  return (
    <div className="space-y-6">
      <Section title="Welcome back 👋" description="Stunning dashboard. Manage every part of the landing page from here.">
        <div className="grid sm:grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <button key={i} onClick={() => onJump(s.jump)} className="text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition-all hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center"><s.icon className="w-4 h-4" /></div>
                <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">Edit →</div>
              </div>
              <div className="font-display font-bold text-2xl truncate">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label} · {s.sub}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Quick actions">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onJump("branding")} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow"><ImageIcon className="w-4 h-4" /> Change logo / hero image</button>
          <button onClick={() => onJump("payment")} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70"><CreditCard className="w-4 h-4" /> Setup UPI / QR</button>
          <button onClick={() => onJump("cars")} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70"><Plus className="w-4 h-4" /> Add a car</button>
          <Link to="/" className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70"><Home className="w-4 h-4" /> Open landing page</Link>
        </div>
      </Section>
    </div>
  );
};

/* ---------- Branding & Hero ---------- */
const BrandingEditor = () => {
  const { form, set, save, saving, isLoading } = useSettingsForm();
  if (isLoading || !form) return <Loading />;
  return (
    <Section title="Branding & Hero" description="Logo, hero background image, and the main headline at the top of the page.">
      <div className="grid sm:grid-cols-2 gap-6">
        <ImageUpload label="Logo (square works best)" value={form.logo_url} onChange={(v) => set("logo_url", v)} />
        <ImageUpload label="Hero background image" value={form.hero_image_url} onChange={(v) => set("hero_image_url", v)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Business Name" value={form.business_name} onChange={(v) => set("business_name", v)} />
        <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <Field label="Hero Eyebrow (small line above title)" value={form.hero_eyebrow} onChange={(v) => set("hero_eyebrow", v)} />
        <Field label="Hero Title" value={form.hero_title} onChange={(v) => set("hero_title", v)} />
        <Field label="Highlight word (must appear inside title)" value={form.hero_highlight} onChange={(v) => set("hero_highlight", v)} />
        <Field label="Rating (e.g. 4.9★)" value={form.rating} onChange={(v) => set("rating", v)} />
        <Field label="Reviews Count (e.g. 240+)" value={form.reviews_count} onChange={(v) => set("reviews_count", v)} />
        <Field label="Years in Business" value={form.years_in_business} onChange={(v) => set("years_in_business", v)} />
      </div>
      <Field label="Hero Subtitle" value={form.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} multiline />
      <SaveButton saving={saving} onClick={() => save(["logo_url","hero_image_url","business_name","tagline","hero_eyebrow","hero_title","hero_highlight","hero_subtitle","rating","reviews_count","years_in_business"])} />
    </Section>
  );
};

/* ---------- Section copy editor ---------- */
const ContentEditor = () => {
  const { form, set, save, saving, isLoading } = useSettingsForm();
  if (isLoading || !form) return <Loading />;
  return (
    <Section title="Section Copy" description="Edit headings & subtitles for the Services, Call-to-action, About and Footer sections.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Services section title" value={form.services_title} onChange={(v) => set("services_title", v)} />
        <Field label="Services section subtitle" value={form.services_subtitle} onChange={(v) => set("services_subtitle", v)} multiline />
        <Field label="CTA title" value={form.cta_title} onChange={(v) => set("cta_title", v)} />
        <Field label="CTA subtitle" value={form.cta_subtitle} onChange={(v) => set("cta_subtitle", v)} multiline />
      </div>
      <Field label="About / Footer text" value={form.about_text} onChange={(v) => set("about_text", v)} multiline />
      <Field label="Footer note (small line at bottom)" value={form.footer_note} onChange={(v) => set("footer_note", v)} />
      <SaveButton saving={saving} onClick={() => save(["services_title","services_subtitle","cta_title","cta_subtitle","about_text","footer_note"])} />
    </Section>
  );
};

/* ---------- Contact & Map ---------- */
const ContactEditor = () => {
  const { form, set, save, saving, isLoading } = useSettingsForm();
  if (isLoading || !form) return <Loading />;
  return (
    <Section title="Contact & Location" description="Phone, WhatsApp, address, opening hours and Google Maps embed.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone (tel: link, e.g. +919492456488)" value={form.phone_number} onChange={(v) => set("phone_number", v)} />
        <Field label="WhatsApp (digits only with country code)" value={form.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} />
        <Field label="Address" value={form.address} onChange={(v) => set("address", v)} />
        <Field label="Hours" value={form.hours} onChange={(v) => set("hours", v)} />
      </div>
      <Field
        label='Google Maps embed URL (Maps → Share → Embed → copy the src="…" link)'
        value={form.map_embed_url}
        onChange={(v) => set("map_embed_url", v)}
        multiline
      />
      {form.map_embed_url && (
        <div className="rounded-2xl overflow-hidden border border-border aspect-video">
          <iframe src={form.map_embed_url} title="Map preview" className="w-full h-full" loading="lazy" />
        </div>
      )}
      <SaveButton saving={saving} onClick={() => save(["phone_number","whatsapp_number","address","hours","map_embed_url"])} />
    </Section>
  );
};

/* ---------- Payment editor ---------- */
const PaymentEditor = () => {
  const { form, set, save, saving, isLoading } = useSettingsForm();
  if (isLoading || !form) return <Loading />;
  return (
    <Section title="Payment / UPI" description="Show a UPI QR + ID on the landing page so customers can pay instantly.">
      <label className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card cursor-pointer">
        <input type="checkbox" checked={form.payment_enabled} onChange={(e) => set("payment_enabled", e.target.checked)} className="w-5 h-5 accent-primary" />
        <div>
          <div className="font-semibold">Show payment section on landing page</div>
          <div className="text-xs text-muted-foreground">When off, the payment block is hidden from visitors.</div>
        </div>
      </label>

      <div className="grid sm:grid-cols-2 gap-6">
        <ImageUpload label="UPI / Payment QR image" value={form.payment_qr_url} onChange={(v) => set("payment_qr_url", v)} />
        <div className="space-y-4">
          <Field label="UPI ID (e.g. name@oksbi)" value={form.upi_id} onChange={(v) => set("upi_id", v)} />
          <Field label="Payment instructions" value={form.payment_note} onChange={(v) => set("payment_note", v)} multiline />
        </div>
      </div>

      <SaveButton saving={saving} onClick={() => save(["payment_enabled","payment_qr_url","upi_id","payment_note"])} />
    </Section>
  );
};

/* ---------- Services editor ---------- */
const ICON_OPTIONS: [string, string][] = [
  ["Car","🚗 Car"],["MapPin","📍 MapPin"],["PartyPopper","🎉 PartyPopper"],["Briefcase","💼 Briefcase"],
  ["ShieldCheck","🛡️ ShieldCheck"],["Clock","⏰ Clock"],["Star","⭐ Star"],["Sparkles","✨ Sparkles"],
  ["Gauge","⏱ Gauge"],["Fuel","⛽ Fuel"],["Settings","⚙️ Settings"],["Users","👥 Users"],
];

const ServicesEditor = () => {
  const { data: services = [] } = useServices({ includeInactive: true });
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["services"] });

  const add = async () => {
    const { error } = await supabase.from("services").insert({
      title: "New Service", description: "Describe this service.", icon: "Car", tags: ["Tag"], sort_order: 99,
    });
    if (error) return toast.error(error.message);
    toast.success("Service added"); refresh();
  };

  return (
    <Section title="Services" description="Edit the four (or more) service cards shown after the hero." action={
      <button onClick={add} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow"><Plus className="w-4 h-4" /> Add service</button>
    }>
      <div className="space-y-3">
        {services.map((s) => <ServiceRow key={s.id} service={s} onChange={refresh} />)}
        {services.length === 0 && <Empty text='No services yet — click "Add service"' />}
      </div>
    </Section>
  );
};

const ServiceRow = ({ service, onChange }: { service: Service; onChange: () => void }) => {
  const [s, setS] = useState(service);
  const [saving, setSaving] = useState(false);
  useEffect(() => setS(service), [service]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("services").update({
      title: s.title, description: s.description, icon: s.icon, tags: s.tags, sort_order: s.sort_order, active: s.active,
    }).eq("id", s.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onChange();
  };

  const del = async () => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); onChange();
  };

  return (
    <div className={`rounded-2xl border bg-card p-4 ${s.active ? "border-border" : "border-dashed border-muted-foreground/30 opacity-75"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-bold text-lg">{s.title || "Untitled"}</div>
        <ActiveBadge active={s.active} />
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Field compact label="Title" value={s.title} onChange={(v) => setS({ ...s, title: v })} />
        <SelectField compact label="Icon" value={s.icon} onChange={(v) => setS({ ...s, icon: v })} options={ICON_OPTIONS} />
        <div className="sm:col-span-2">
          <Field compact label="Description" value={s.description} onChange={(v) => setS({ ...s, description: v })} multiline />
        </div>
        <Field compact label="Tags (comma-separated)" value={s.tags.join(", ")} onChange={(v) => setS({ ...s, tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} />
        <Field compact label="Sort order" type="number" value={String(s.sort_order)} onChange={(v) => setS({ ...s, sort_order: Number(v) || 0 })} />
        <label className="inline-flex items-center gap-2 text-sm self-end h-9 sm:col-span-2">
          <input type="checkbox" checked={s.active} onChange={(e) => setS({ ...s, active: e.target.checked })} className="w-4 h-4 accent-primary" /> Active (visible on site)
        </label>
      </div>
      <RowActions onDelete={del} onSave={save} saving={saving} />
    </div>
  );
};

/* ---------- Cars editor ---------- */
const emptyCar = { name: "New Car", image_url: "", category: "suv", type_label: "Type", use_label: "Use case", seats: "5 Seater", fuel: "Petrol", transmission: "Manual", price_per_day: 2000, badge: null as string | null, sort_order: 99, active: true };

const CarsEditor = () => {
  const { data: cars = [] } = useCars({ includeInactive: true });
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["cars"] });

  const addCar = async () => {
    const { error } = await supabase.from("cars").insert(emptyCar);
    if (error) return toast.error(error.message);
    toast.success("Car added"); refresh();
  };

  return (
    <Section title="Fleet" description="Add, edit, reorder, or remove cars. Inactive cars are hidden from visitors." action={
      <button onClick={addCar} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow"><Plus className="w-4 h-4" /> Add car</button>
    }>
      <div className="space-y-3">
        {cars.map((c) => <CarRow key={c.id} car={c} onChange={refresh} />)}
        {cars.length === 0 && <Empty text='No cars yet — click "Add car"' />}
      </div>
    </Section>
  );
};

const CarRow = ({ car, onChange }: { car: Car; onChange: () => void }) => {
  const [c, setC] = useState(car);
  const [saving, setSaving] = useState(false);
  useEffect(() => setC(car), [car]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("cars").update({
      name: c.name, image_url: c.image_url, category: c.category, type_label: c.type_label, use_label: c.use_label,
      seats: c.seats, fuel: c.fuel, transmission: c.transmission, price_per_day: c.price_per_day, badge: c.badge,
      sort_order: c.sort_order, active: c.active,
    }).eq("id", c.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`${c.name} saved`); onChange();
  };

  const del = async () => {
    if (!confirm(`Delete ${c.name}?`)) return;
    const { error } = await supabase.from("cars").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); onChange();
  };

  return (
    <div className={`rounded-2xl border bg-card p-4 transition-colors ${c.active ? "border-border" : "border-dashed border-muted-foreground/30 opacity-75"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-bold text-lg">{c.name || "Untitled"}</div>
        <ActiveBadge active={c.active} />
      </div>
      <div className="space-y-3">
        <ImageUpload label="Car image" value={c.image_url} onChange={(url) => setC({ ...c, image_url: url })} compact />
        <div className="grid sm:grid-cols-2 gap-2">
          <Field compact label="Name" value={c.name} onChange={(v) => setC({ ...c, name: v })} />
          <SelectField compact label="Category" value={c.category} onChange={(v) => setC({ ...c, category: v })} options={[["suv", "SUV"], ["sedan", "Sedan"], ["mpv", "MPV"]]} />
          <Field compact label="Type label" value={c.type_label} onChange={(v) => setC({ ...c, type_label: v })} />
          <Field compact label="Use label" value={c.use_label} onChange={(v) => setC({ ...c, use_label: v })} />
          <Field compact label="Seats" value={c.seats} onChange={(v) => setC({ ...c, seats: v })} />
          <Field compact label="Fuel" value={c.fuel} onChange={(v) => setC({ ...c, fuel: v })} />
          <Field compact label="Transmission" value={c.transmission} onChange={(v) => setC({ ...c, transmission: v })} />
          <Field compact label="Price / day (₹)" type="number" value={String(c.price_per_day)} onChange={(v) => setC({ ...c, price_per_day: Number(v) || 0 })} />
          <Field compact label="Badge (optional)" value={c.badge ?? ""} onChange={(v) => setC({ ...c, badge: v || null })} />
          <Field compact label="Sort order" type="number" value={String(c.sort_order)} onChange={(v) => setC({ ...c, sort_order: Number(v) || 0 })} />
          <label className="inline-flex items-center gap-2 text-sm self-end h-9 sm:col-span-2">
            <input type="checkbox" checked={c.active} onChange={(e) => setC({ ...c, active: e.target.checked })} className="w-4 h-4 accent-primary" /> Active (visible on site)
          </label>
        </div>
      </div>
      <RowActions onDelete={del} onSave={save} saving={saving} />
    </div>
  );
};

/* ---------- Reviews editor ---------- */
const ReviewsEditor = () => {
  const { data: reviews = [] } = useReviewsAll();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["reviews"] });

  const add = async () => {
    const { error } = await supabase.from("reviews").insert({ name: "New Customer", initials: "NC", tag: "Recent rental", text: "Great service!", rating: 5, sort_order: 99 });
    if (error) return toast.error(error.message);
    toast.success("Review added"); refresh();
  };

  return (
    <Section title="Customer Reviews" description="Manage testimonials displayed on the landing page." action={
      <button onClick={add} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow"><Plus className="w-4 h-4" /> Add review</button>
    }>
      <div className="space-y-3">
        {reviews.map((r) => <ReviewRow key={r.id} review={r} onChange={refresh} />)}
        {reviews.length === 0 && <Empty text="No reviews yet" />}
      </div>
    </Section>
  );
};

const ReviewRow = ({ review, onChange }: { review: Review; onChange: () => void }) => {
  const [r, setR] = useState(review);
  const [saving, setSaving] = useState(false);
  useEffect(() => setR(review), [review]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("reviews").update({
      name: r.name, initials: r.initials, tag: r.tag, text: r.text, rating: r.rating, sort_order: r.sort_order, active: r.active,
    }).eq("id", r.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onChange();
  };

  const del = async () => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); onChange();
  };

  return (
    <div className={`rounded-2xl border bg-card p-4 ${r.active ? "border-border" : "border-dashed border-muted-foreground/30 opacity-75"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-bold text-lg">{r.name || "Untitled"}</div>
        <ActiveBadge active={r.active} />
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Field compact label="Name" value={r.name} onChange={(v) => setR({ ...r, name: v })} />
        <Field compact label="Initials" value={r.initials} onChange={(v) => setR({ ...r, initials: v })} />
        <Field compact label="Tag" value={r.tag} onChange={(v) => setR({ ...r, tag: v })} />
        <Field compact label="Rating (1-5)" type="number" value={String(r.rating)} onChange={(v) => setR({ ...r, rating: Math.max(1, Math.min(5, Number(v) || 5)) })} />
        <div className="sm:col-span-2">
          <Field compact label="Review text" value={r.text} onChange={(v) => setR({ ...r, text: v })} multiline />
        </div>
        <Field compact label="Sort order" type="number" value={String(r.sort_order)} onChange={(v) => setR({ ...r, sort_order: Number(v) || 0 })} />
        <label className="inline-flex items-center gap-2 text-sm self-end h-9">
          <input type="checkbox" checked={r.active} onChange={(e) => setR({ ...r, active: e.target.checked })} className="w-4 h-4 accent-primary" /> Active
        </label>
      </div>
      <RowActions onDelete={del} onSave={save} saving={saving} />
    </div>
  );
};

/* ---------- Shared UI ---------- */
const Section = ({ title, description, action, children }: { title: string; description?: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <div className="card-elevated rounded-3xl border border-border/60 p-5 sm:p-8 space-y-6">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const Field = ({ label, value, onChange, multiline, type = "text", compact }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string; compact?: boolean }) => (
  <div>
    <label className={`block font-medium mb-1 ${compact ? "text-xs text-muted-foreground" : "text-sm"}`}>{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
    )}
  </div>
);

const SelectField = ({ label, value, onChange, options, compact }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][]; compact?: boolean }) => (
  <div>
    <label className={`block font-medium mb-1 ${compact ? "text-xs text-muted-foreground" : "text-sm"}`}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);

const SaveButton = ({ saving, onClick }: { saving: boolean; onClick: () => void }) => (
  <button onClick={onClick} disabled={saving} className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-glow hover:scale-[1.02] transition-transform disabled:opacity-60">
    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes
  </button>
);

const RowActions = ({ onDelete, onSave, saving }: { onDelete: () => void; onSave: () => void; saving: boolean }) => (
  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
    <button onClick={onDelete} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 text-sm font-semibold hover:bg-destructive/20"><Trash2 className="w-4 h-4" /> Delete</button>
    <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow disabled:opacity-60">
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
    </button>
  </div>
);

const ActiveBadge = ({ active }: { active: boolean }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
    {active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {active ? "Live" : "Hidden"}
  </span>
);

const Loading = () => <div className="card-elevated rounded-2xl p-8 border border-border text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /></div>;
const Empty = ({ text }: { text: string }) => <div className="text-sm text-muted-foreground text-center py-8">{text}</div>;

export default Admin;
