ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS whatsapp_default_message text NOT NULL DEFAULT 'Hi! I''d like to enquire about a self-drive car rental.',
  ADD COLUMN IF NOT EXISTS whatsapp_booking_template text NOT NULL DEFAULT 'Hi! I want to book the {car} (₹{price}/day). Please share availability.',
  ADD COLUMN IF NOT EXISTS whatsapp_payment_message text NOT NULL DEFAULT 'Hi! I have completed the payment, sending the screenshot now.';