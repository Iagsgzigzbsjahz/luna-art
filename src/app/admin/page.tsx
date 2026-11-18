import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import { DEFAULT_SETTINGS } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Artwork, Category, SiteSettings } from "@/lib/types";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // فحص ثانٍ على الخادم (بجانب الـ middleware وسياسات RLS): هل هذا الحساب هو المشرف؟
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    return (
      <main id="main" className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <ShieldAlert className="mx-auto h-10 w-10 text-red-300" aria-hidden />
          <h1 className="mt-4 font-display text-3xl text-beige">ليست لديك صلاحية الدخول</h1>
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="outline">
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </main>
    );
  }

  const [artworksRes, categoriesRes, settingsRes] = await Promise.all([
    supabase
      .from("artworks")
      .select("id,title,description,category_id,image_url,is_featured,created_at,category:categories(id,name,slug)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id,name,slug,created_at").order("created_at", { ascending: true }),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const settings = { ...DEFAULT_SETTINGS, ...(settingsRes.data ?? {}) } as SiteSettings;
  if (!Array.isArray(settings.timeline)) settings.timeline = [];

  return (
    <AdminDashboard
      email={user.email ?? ""}
      artworks={(artworksRes.data ?? []) as unknown as Artwork[]}
      categories={(categoriesRes.data ?? []) as Category[]}
      settings={settings}
    />
  );
}
