import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  business_name: string;
  tagline: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  phone_number: string;
  whatsapp_number: string;
  address: string;
  hours: string;
  rating: string;
  reviews_count: string;
  years_in_business: string;
  about_text: string;
};

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data as SiteSettings | null;
    },
  });

export type Car = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  type_label: string;
  use_label: string;
  seats: string;
  fuel: string;
  transmission: string;
  price_per_day: number;
  badge: string | null;
  sort_order: number;
  active: boolean;
};

export const useCars = (opts: { includeInactive?: boolean } = {}) =>
  useQuery({
    queryKey: ["cars", opts.includeInactive ? "all" : "active"],
    queryFn: async () => {
      let q = supabase.from("cars").select("*").order("sort_order");
      if (!opts.includeInactive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Car[];
    },
  });

export const useReviewsAll = () =>
  useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });

export type Review = {
  id: string;
  name: string;
  initials: string;
  tag: string;
  text: string;
  rating: number;
  sort_order: number;
  active: boolean;
};

export const useReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });
