"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Images, LogOut, PlusCircle, Settings, Star, Tags } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Artwork, Category, SiteSettings } from "@/lib/types";
import { revalidateSite, signOut } from "@/app/admin/actions";
import { ArtworkForm } from "./ArtworkForm";
import { ArtworksManager } from "./ArtworksManager";
import { CategoriesManager } from "./CategoriesManager";
import { SettingsForm } from "./SettingsForm";

type Tab = "artworks" | "add" | "categories" | "settings";

const tabs: { id: Tab; label: string; icon: typeof Images }[] = [
  { id: "artworks", label: "إدارة الرسمات", icon: Images },
  { id: "add", label: "إضافة رسمة", icon: PlusCircle },
  { id: "categories", label: "التصنيفات", icon: Tags },
  { id: "settings", label: "إعدادات الموقع", icon: Settings },
];

export function AdminDashboard({
  email,
  artworks,
  categories,
  settings,
}: {
  email: string;
  artworks: Artwork[];
  categories: Category[];
  settings: SiteSettings;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("artworks");

  // بعد أي تعديل: نُبطل ذاكرة الموقع العام ثم نحدّث بيانات اللوحة.
  const onChanged = useCallback(async () => {
    await revalidateSite();
    router.refresh();
  }, [router]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    artworks.forEach((a) => {
      if (a.category_id) m[a.category_id] = (m[a.category_id] ?? 0) + 1;
    });
    return m;
  }, [artworks]);

  const stats = [
    { label: "إجمالي الرسمات", value: artworks.length, icon: Images },
    { label: "التصنيفات", value: categories.length, icon: Tags },
    { label: "الرسمات المميزة", value: artworks.filter((a) => a.is_featured).length, icon: Star },
  ];

  return (
    <main id="main" className="mx-auto max-w-6xl px-5 py-8 md:py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-beige">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-beige/50" dir="ltr">
            {email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" rel="noopener" className={buttonStyles({ variant: "outline", size: "sm" })}>
            <ExternalLink className="h-4 w-4" aria-hidden />
            عرض الموقع
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4" aria-hidden />
              خروج
            </Button>
          </form>
        </div>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-3" aria-label="إحصائيات">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-beige/10 bg-ink-soft p-5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-display text-4xl leading-none text-beige">{value}</p>
              <p className="mt-1 text-xs text-beige/55">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <div role="tablist" aria-label="أقسام اللوحة" className="no-scrollbar mb-6 flex gap-2 overflow-x-auto border-b border-beige/10 pb-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
              tab === id ? "bg-gold text-ink" : "text-beige/70 hover:bg-white/5 hover:text-beige",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <section role="tabpanel" className="rounded-2xl border border-beige/10 bg-ink-soft/60 p-4 md:p-6">
        {tab === "artworks" && <ArtworksManager artworks={artworks} categories={categories} onChanged={onChanged} />}
        {tab === "add" && (
          <div className="mx-auto max-w-xl">
            <ArtworkForm categories={categories} onDone={onChanged} />
          </div>
        )}
        {tab === "categories" && <CategoriesManager categories={categories} counts={counts} onChanged={onChanged} />}
        {tab === "settings" && <SettingsForm settings={settings} onChanged={onChanged} />}
      </section>
    </main>
  );
}
