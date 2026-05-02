import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteSettings, useCars, useReviewsAll, type Car, type Review, type SiteSettings } from "@/hooks/useSiteData";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Save, Home, Car as CarIcon, MessageSquare, Settings as SettingsIcon, Loader2, ArrowLeft, Eye, EyeOff, BarChart3 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { ThemeToggle } from "@/components/ThemeToggle";

type Tab = "overview" | "content" | "cars" | "reviews";

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
          <div className="card-elevated rounded-2xl p-3 border border-border/60 lg:sticky lg:top-24 grid grid-cols-2 lg:flex lg:flex-col gap-1">
            {[
              { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
              { id: "content" as Tab, label: "Site Content", icon: SettingsIcon },
              { id: "cars" as Tab, label: "Fleet / Cars", icon: CarIcon },
              { id: "reviews" as Tab, label: "Reviews", icon: MessageSquare },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.id ? "bg-gradient-primary text-primary-foreground btn-glow" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4 shrink-0" /> <span>{t.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {tab === "overview" && <Overview onJump={setTab} />}
          {tab === "content" && <ContentEditor />}
          {tab === "cars" && <CarsEditor />}
          {tab === "reviews" && <ReviewsEditor />}
        </main>
      </div>
    </div>
  );
};

/* ---------- Overview ---------- */
const Overview = ({ onJump }: { onJump: (t: Tab) => void }) => {
  const { data: cars = [] } = useCars({ includeInactive: true });
  const { data: reviews = [] } = useReviewsAll();
  const { data: settings } = useSiteSettings();

  const stats = [
    { label: "Total cars", value: cars.length, sub: `${cars.filter((c) => c.active).length} active`, icon: CarIcon, jump: "cars" as Tab },
    { label: "Reviews", value: reviews.length, sub: `${reviews.filter((r) => r.active).length} live`, icon: MessageSquare, jump: "reviews" as Tab },
    { label: "WhatsApp", value: settings?.whatsapp_number ?? "—", sub: "Booking number", icon: SettingsIcon, jump: "content" as Tab },
    { label: "Phone", value: settings?.phone_number ?? "—", sub: "Call number", icon: SettingsIcon, jump: "content" as Tab },
  ];

  return (
    <div className="space-y-6">
      <Section title="Welcome back" description="Manage every part of the landing page from here.">
        <div className="grid sm:grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <button key={i} onClick={() => onJump(s.jump)} className="text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition-colors group">
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
          <button onClick={() => onJump("cars")} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow"><Plus className="w-4 h-4" /> Add a car</button>
          <button onClick={() => onJump("reviews")} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70"><Plus className="w-4 h-4" /> Add a review</button>
          <button onClick={() => onJump("content")} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70"><SettingsIcon className="w-4 h-4" /> Edit hero text</button>
          <Link to="/" className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-secondary/70"><Home className="w-4 h-4" /> Open landing page</Link>
        </div>
      </Section>
    </div>
  );
};

/* ---------- Content editor ---------- */
const ContentEditor = () => {
  const { data, isLoading } = useSiteSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading || !form) return <div className="card-elevated rounded-2xl p-8 border border-border text-center text-muted-foreground">Loading…</div>;

  const set = (k: keyof SiteSettings, v: string) => setForm({ ...form, [k]: v });

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(form).eq("id", form.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Site content saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  return (
    <Section title="Edit Landing Page Content" description="Changes save to the database and update the live site for everyone.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Business Name" value={form.business_name} onChange={(v) => set("business_name", v)} />
        <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <Field label="Hero Eyebrow" value={form.hero_eyebrow} onChange={(v) => set("hero_eyebrow", v)} />
        <Field label="Hero Title" value={form.hero_title} onChange={(v) => set("hero_title", v)} />
        <Field label="Hero Highlight (must appear inside title)" value={form.hero_highlight} onChange={(v) => set("hero_highlight", v)} />
        <Field label="Phone (tel: link)" value={form.phone_number} onChange={(v) => set("phone_number", v)} />
        <Field label="WhatsApp Number (digits only, with country code)" value={form.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} />
        <Field label="Address" value={form.address} onChange={(v) => set("address", v)} />
        <Field label="Hours" value={form.hours} onChange={(v) => set("hours", v)} />
        <Field label="Rating (e.g. 4.9★)" value={form.rating} onChange={(v) => set("rating", v)} />
        <Field label="Reviews Count (e.g. 240+)" value={form.reviews_count} onChange={(v) => set("reviews_count", v)} />
        <Field label="Years in Business" value={form.years_in_business} onChange={(v) => set("years_in_business", v)} />
      </div>
      <Field label="Hero Subtitle" value={form.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} multiline />
      <Field label="About / Footer Text" value={form.about_text} onChange={(v) => set("about_text", v)} multiline />
      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-glow hover:scale-[1.02] transition-transform disabled:opacity-60">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes
      </button>
    </Section>
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
    toast.success("Car added");
    refresh();
  };

  return (
    <Section title="Fleet" description="Add, edit, reorder, or remove cars shown on the landing page. Inactive cars are hidden from visitors." action={<button onClick={addCar} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow"><Plus className="w-4 h-4" /> Add car</button>}>
      <div className="space-y-3">
        {cars.map((c) => <CarRow key={c.id} car={c} onChange={refresh} />)}
        {cars.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">No cars yet — click "Add car"</div>}
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
    toast.success(`${c.name} saved`);
    onChange();
  };

  const del = async () => {
    if (!confirm(`Delete ${c.name}?`)) return;
    const { error } = await supabase.from("cars").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    onChange();
  };

  return (
    <div className={`rounded-2xl border bg-card p-4 transition-colors ${c.active ? "border-border" : "border-dashed border-muted-foreground/30 opacity-75"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-bold text-lg">{c.name || "Untitled"}</div>
        <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${c.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          {c.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {c.active ? "Live" : "Hidden"}
        </span>
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

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
        <button onClick={del} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 text-sm font-semibold hover:bg-destructive/20"><Trash2 className="w-4 h-4" /> Delete</button>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>
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
    toast.success("Review added");
    refresh();
  };

  return (
    <Section title="Customer Reviews" description="Manage testimonials displayed on the landing page." action={<button onClick={add} className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow"><Plus className="w-4 h-4" /> Add review</button>}>
      <div className="space-y-3">
        {reviews.map((r) => <ReviewRow key={r.id} review={r} onChange={refresh} />)}
        {reviews.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">No reviews yet</div>}
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
    <div className={`rounded-2xl border bg-card p-4 grid sm:grid-cols-2 gap-2 ${r.active ? "border-border" : "border-dashed border-muted-foreground/30 opacity-75"}`}>
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
      <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button onClick={del} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 text-sm font-semibold hover:bg-destructive/20"><Trash2 className="w-4 h-4" /> Delete</button>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold btn-glow disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>
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

export default Admin;
