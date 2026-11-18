-- =====================================================================
--  Luna Art - قاعدة البيانات الكاملة
--  شغّل هذا الملف كاملاً مرة واحدة من: Supabase > SQL Editor > New query
--  (آمن للتشغيل أكثر من مرة)
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1) profiles: حساب المشرف الوحيد
--    أول مستخدم يُنشأ في Supabase Auth يصبح مشرفاً تلقائياً، ولا أحد غيره.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
-- لا توجد سياسات كتابة: لا يمكن لأي عميل تعديل هذا الجدول.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.profiles) then
    insert into public.profiles (id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2) categories: تصنيفات ديناميكية
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 40),
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3) artworks
-- ---------------------------------------------------------------------
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text check (description is null or char_length(description) <= 4000),
  category_id uuid references public.categories (id) on delete set null,
  image_url text not null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists artworks_category_idx on public.artworks (category_id);
create index if not exists artworks_created_idx on public.artworks (created_at desc);
create index if not exists artworks_featured_idx on public.artworks (is_featured) where is_featured;

-- ---------------------------------------------------------------------
-- 4) site_settings: صف واحد فقط (id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  artist_display_name text not null default 'Luna Art',
  artist_bio text not null default 'ترسم كأن الألوان تعرف أسرارها. بين خطوط الحبر وضربات الزيت تصنع عوالم صغيرة تشبه القلب حين يكون صافياً: مرة حالمة كسماء ليلية، ومرة مرحة كطفولة لا تكبر. كل لوحة هنا تحمل جزءاً منها، وكل رسمة تحكي ما عجزت عنه الكلمات.',
  artist_avatar_url text,
  boyfriend_name text not null default 'عمر النجار',
  hero_title text not null default 'حيث تولد المشاعر على الورق',
  hero_subtitle text not null default 'معرض خاص يجمع رسمات بالحبر والزيت والألوان، كل واحدة منها حكاية صغيرة وُلدت من القلب.',
  footer_text text not null default 'جميع الرسمات من إبداع الفنانة، ولا يجوز نسخها أو إعادة نشرها دون إذنها.',
  maker_message text not null default E'إلى من جعلت الألوان تتكلم،\nصنعت لك هذا المكان ليكون بيتاً لرسماتك، تُعرض فيه كما تستحق من جمال. لا يهمني كم شخصاً سيراه، يكفيني أن تبتسمي حين تجدين أعمالك معلّقة هنا كأنها في أرقى المتاحف.\nستظلين دائماً فنانتي المفضلة.',
  timeline jsonb not null default '[
    {"label":"البداية","title":"أول خطوط بالقلم","text":"بدأت الحكاية بقلم وورقة وفضول لا ينتهي."},
    {"label":"عالم الألوان","title":"اكتشاف الألوان والأكريليك","text":"خرجت الرسمات من الأبيض والأسود إلى ألوان جريئة وبورتريهات ملوّنة."},
    {"label":"الأنمي والكرتون","title":"شخصيات تنبض بالحياة","text":"رسمت شخصياتها المفضلة بالحبر والنقاط، وأضافت إليها لمستها الخاصة."},
    {"label":"اللوحات الزيتية","title":"ليالٍ مرصّعة بالنجوم","text":"مع الزيت صارت الضربات أعمق، والسماء أكثر زرقة."},
    {"label":"ما زالت الرحلة","title":"والقادم أجمل","text":"كل رسمة جديدة خطوة أخرى في طريق لا ينتهي."}
  ]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- تصنيفات البداية (يمكنك تعديلها أو حذفها أو إضافة غيرها من لوحة التحكم)
insert into public.categories (name, slug) values
  ('أنمي', 'anime'),
  ('كرتون', 'cartoon'),
  ('بورتريه', 'portrait'),
  ('لوحات زيتية', 'oil-paintings')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------
-- 5) Row Level Security: القراءة للجميع، والكتابة للمشرف فقط
-- ---------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.artworks enable row level security;
alter table public.site_settings enable row level security;

-- categories
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories for select using (true);
drop policy if exists "categories_insert" on public.categories;
create policy "categories_insert" on public.categories for insert to authenticated with check (public.is_admin());
drop policy if exists "categories_update" on public.categories;
create policy "categories_update" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "categories_delete" on public.categories;
create policy "categories_delete" on public.categories for delete to authenticated using (public.is_admin());

-- artworks
drop policy if exists "artworks_read" on public.artworks;
create policy "artworks_read" on public.artworks for select using (true);
drop policy if exists "artworks_insert" on public.artworks;
create policy "artworks_insert" on public.artworks for insert to authenticated with check (public.is_admin());
drop policy if exists "artworks_update" on public.artworks;
create policy "artworks_update" on public.artworks for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "artworks_delete" on public.artworks;
create policy "artworks_delete" on public.artworks for delete to authenticated using (public.is_admin());

-- site_settings (لا حذف)
drop policy if exists "settings_read" on public.site_settings;
create policy "settings_read" on public.site_settings for select using (true);
drop policy if exists "settings_insert" on public.site_settings;
create policy "settings_insert" on public.site_settings for insert to authenticated with check (public.is_admin() and id = 1);
drop policy if exists "settings_update" on public.site_settings;
create policy "settings_update" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin() and id = 1);

-- ---------------------------------------------------------------------
-- 6) Storage: حاويتان عامتان للصور (قراءة الروابط للجميع، الرفع للمشرف فقط)
--    لا توجد سياسة select عامة عمداً: لا يمكن لأحد سرد الملفات، فقط فتح الرابط المباشر.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('artworks', 'artworks', true, 10485760, array['image/webp', 'image/jpeg', 'image/png']),
  ('avatars',  'avatars',  true,  5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "luna_storage_select" on storage.objects;
create policy "luna_storage_select" on storage.objects
  for select to authenticated using (bucket_id in ('artworks', 'avatars') and public.is_admin());

drop policy if exists "luna_storage_insert" on storage.objects;
create policy "luna_storage_insert" on storage.objects
  for insert to authenticated with check (bucket_id in ('artworks', 'avatars') and public.is_admin());

drop policy if exists "luna_storage_update" on storage.objects;
create policy "luna_storage_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('artworks', 'avatars') and public.is_admin())
  with check (bucket_id in ('artworks', 'avatars') and public.is_admin());

drop policy if exists "luna_storage_delete" on storage.objects;
create policy "luna_storage_delete" on storage.objects
  for delete to authenticated using (bucket_id in ('artworks', 'avatars') and public.is_admin());
