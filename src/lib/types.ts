export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Artwork = {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  image_url: string;
  is_featured: boolean;
  created_at: string;
  category?: Pick<Category, "id" | "name" | "slug"> | null;
};

export type TimelineItem = {
  label: string;
  title: string;
  text: string;
};

export type SiteSettings = {
  id: number;
  artist_display_name: string;
  artist_bio: string;
  artist_avatar_url: string | null;
  boyfriend_name: string;
  hero_title: string;
  hero_subtitle: string;
  footer_text: string;
  maker_message: string;
  timeline: TimelineItem[];
};
