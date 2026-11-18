import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Artwork, Category, SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  artist_display_name: "Luna Art",
  artist_bio: "",
  artist_avatar_url: null,
  boyfriend_name: "عمر النجار",
  hero_title: "حيث تولد المشاعر على الورق",
  hero_subtitle: "",
  footer_text: "",
  maker_message: "",
  timeline: [],
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  const merged = { ...DEFAULT_SETTINGS, ...(data ?? {}) } as SiteSettings;
  if (!Array.isArray(merged.timeline)) merged.timeline = [];
  return merged;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await createPublicClient()
    .from("categories")
    .select("id,name,slug,created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
});

export const getArtworks = cache(async (): Promise<Artwork[]> => {
  const { data, error } = await createPublicClient()
    .from("artworks")
    .select(
      "id,title,description,category_id,image_url,is_featured,created_at,category:categories(id,name,slug)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Artwork[];
});
