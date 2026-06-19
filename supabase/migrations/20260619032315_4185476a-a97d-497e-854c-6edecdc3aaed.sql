ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_ad_image_1 TEXT,
  ADD COLUMN IF NOT EXISTS hero_ad_image_2 TEXT,
  ADD COLUMN IF NOT EXISTS hero_ad_image_3 TEXT,
  ADD COLUMN IF NOT EXISTS hero_ad_image_4 TEXT;