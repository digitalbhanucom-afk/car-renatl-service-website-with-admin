-- Extend site_settings with logo, hero image, map, payment, services/cta copy
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS logo_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS map_embed_url text NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.5!2d80.6480!3d16.5062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMwJzIyLjMiTiA4MMKwMzgnNTIuOCJF!5e0!3m2!1sen!2sin!4v1700000000000',
  ADD COLUMN IF NOT EXISTS services_title text NOT NULL DEFAULT 'Rent Your Way, Drive Your Way',
  ADD COLUMN IF NOT EXISTS services_subtitle text NOT NULL DEFAULT 'Choose from flexible rental plans tailored for every trip — short commutes, family getaways, or special occasions.',
  ADD COLUMN IF NOT EXISTS cta_title text NOT NULL DEFAULT 'Ready to Hit the Road?',
  ADD COLUMN IF NOT EXISTS cta_subtitle text NOT NULL DEFAULT 'Book your self-drive car in under 2 minutes. Call us or send a WhatsApp message — we respond instantly.',
  ADD COLUMN IF NOT EXISTS footer_note text NOT NULL DEFAULT 'Crafted with care in Vijayawada 🇮🇳',
  ADD COLUMN IF NOT EXISTS payment_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_qr_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS upi_id text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS payment_note text NOT NULL DEFAULT 'Scan the QR or pay to our UPI ID. Send screenshot on WhatsApp to confirm.';

-- Editable services table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Car',
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads services" ON public.services;
CREATE POLICY "Public reads services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed default services if empty
INSERT INTO public.services (title, description, icon, tags, sort_order)
SELECT * FROM (VALUES
  ('Self-Drive Rentals', 'Hourly, daily, or multi-day rentals with unlimited flexibility. Perfect for personal errands, family trips, or just a weekend drive.', 'Car', ARRAY['Hourly','Daily','Multi-Day','Personal Use'], 1),
  ('Outstation Travel', 'Hit the highway with confidence. Long-distance rentals with flexible durations — drive to Hyderabad, Goa, or anywhere you choose.', 'MapPin', ARRAY['Long Distance','Flexible Duration','Highway Ready'], 2),
  ('Event & Occasion Rentals', 'Make your special day unforgettable with premium vehicles. Wedding arrivals, anniversary celebrations, or high-profile events.', 'PartyPopper', ARRAY['Weddings','Premium Cars','Special Events'], 3),
  ('Monthly Corporate', 'Long-term rentals for professionals and businesses. Discounted monthly pricing with full maintenance handled.', 'Briefcase', ARRAY['Corporate','Discounted','Maintenance Included'], 4)
) AS v(title, description, icon, tags, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.services);