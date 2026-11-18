import { createClient } from "@supabase/supabase-js";

/**
 * عميل قراءة عام (مفتاح anon بدون جلسة) لصفحات الزوار.
 * الطلبات تُخزَّن 60 ثانية وتُبطَل فورا عند أي تعديل من لوحة التحكم (وسم "content").
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("متغيرات Supabase غير مضبوطة. انسخ .env.example إلى .env.local واملأ القيم.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 60, tags: ["content"] } } as RequestInit),
    },
  });
}
