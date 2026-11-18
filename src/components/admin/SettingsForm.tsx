"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { processImage, removeImage, uploadImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/fields";
import type { SiteSettings, TimelineItem } from "@/lib/types";
import { ImagePicker } from "./ImagePicker";

export function SettingsForm({
  settings,
  onChanged,
}: {
  settings: SiteSettings;
  onChanged: () => void | Promise<void>;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [f, setF] = useState({
    artist_display_name: settings.artist_display_name,
    boyfriend_name: settings.boyfriend_name,
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    artist_bio: settings.artist_bio,
    maker_message: settings.maker_message,
    footer_text: settings.footer_text,
  });
  const [timeline, setTimeline] = useState<TimelineItem[]>(settings.timeline);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [busy, setBusy] = useState(false);

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const setItem = (i: number, k: keyof TimelineItem, v: string) =>
    setTimeline((p) => p.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.artist_display_name.trim()) return void toast.error("اسم الفنانة مطلوب");
    if (!f.boyfriend_name.trim()) return void toast.error("اسمك مطلوب");

    setBusy(true);
    let newAvatar: string | null = null;
    try {
      let avatarUrl = removeAvatar ? null : settings.artist_avatar_url;
      if (avatarFile) {
        newAvatar = await uploadImage(supabase, "avatars", await processImage(avatarFile, 800));
        avatarUrl = newAvatar;
      }
      const { error } = await supabase.from("site_settings").upsert({
        id: 1,
        artist_display_name: f.artist_display_name.trim(),
        boyfriend_name: f.boyfriend_name.trim(),
        hero_title: f.hero_title.trim(),
        hero_subtitle: f.hero_subtitle.trim(),
        artist_bio: f.artist_bio.trim(),
        maker_message: f.maker_message.trim(),
        footer_text: f.footer_text.trim(),
        artist_avatar_url: avatarUrl,
        timeline: timeline
          .map((t) => ({ label: t.label.trim(), title: t.title.trim(), text: t.text.trim() }))
          .filter((t) => t.title),
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    } catch (err) {
      if (newAvatar) await removeImage(supabase, "avatars", newAvatar);
      console.error(err);
      toast.error(err instanceof Error ? err.message : "تعذر حفظ الإعدادات. حاول مرة أخرى.");
      setBusy(false);
      return;
    }

    if ((newAvatar || removeAvatar) && settings.artist_avatar_url) {
      await removeImage(supabase, "avatars", settings.artist_avatar_url);
    }
    toast.success("تم حفظ الإعدادات وتحديث الموقع");
    setAvatarFile(null);
    setRemoveAvatar(false);
    setBusy(false);
    await onChanged();
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6">
      <div>
        <Label>صورة الفنانة (رسم توضيحي)</Label>
        <ImagePicker
          shape="round"
          file={avatarFile}
          onChange={(file) => {
            setAvatarFile(file);
            setRemoveAvatar(false);
          }}
          currentUrl={removeAvatar ? null : settings.artist_avatar_url}
        />
        <p className="mt-3 text-center text-xs leading-6 text-beige/45">
          استخدم رسماً أو أيقونة فقط، وليس صورة حقيقية. إن لم تضف صورة تظهر أيقونة افتراضية.
        </p>
        {settings.artist_avatar_url && !removeAvatar && !avatarFile && (
          <div className="mt-2 text-center">
            <Button size="sm" variant="ghost" onClick={() => setRemoveAvatar(true)}>
              إزالة الصورة
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="s-artist">اسم الفنانة المعروض</Label>
          <Input id="s-artist" value={f.artist_display_name} maxLength={60} onChange={set("artist_display_name")} required />
        </div>
        <div>
          <Label htmlFor="s-bf">اسمك (صانع الموقع)</Label>
          <Input id="s-bf" value={f.boyfriend_name} maxLength={60} onChange={set("boyfriend_name")} required />
        </div>
      </div>

      <div>
        <Label htmlFor="s-hero-title">عنوان الصفحة الرئيسية</Label>
        <Input id="s-hero-title" value={f.hero_title} maxLength={80} onChange={set("hero_title")} />
      </div>
      <div>
        <Label htmlFor="s-hero-sub">الوصف تحت العنوان</Label>
        <Textarea id="s-hero-sub" value={f.hero_subtitle} maxLength={300} onChange={set("hero_subtitle")} className="min-h-20" />
      </div>
      <div>
        <Label htmlFor="s-bio">نبذة عن الفنانة</Label>
        <Textarea id="s-bio" value={f.artist_bio} maxLength={1500} onChange={set("artist_bio")} className="min-h-36" />
      </div>
      <div>
        <Label htmlFor="s-msg">رسالتك في صفحة «قصتها»</Label>
        <Textarea id="s-msg" value={f.maker_message} maxLength={1500} onChange={set("maker_message")} className="min-h-36" />
      </div>
      <div>
        <Label htmlFor="s-footer">نص أسفل الموقع</Label>
        <Textarea id="s-footer" value={f.footer_text} maxLength={300} onChange={set("footer_text")} className="min-h-20" />
      </div>

      <fieldset className="space-y-3 rounded-2xl border border-beige/10 p-4">
        <legend className="px-2 text-sm font-medium text-beige/85">محطات رحلتها مع الفن</legend>
        {timeline.map((t, i) => (
          <div key={i} className="space-y-2 rounded-xl bg-ink-soft p-3">
            <div className="flex gap-2">
              <Input value={t.label} maxLength={30} onChange={(e) => setItem(i, "label", e.target.value)} placeholder="الوقت (مثال: البداية)" aria-label="الوقت" className="w-2/5" />
              <Input value={t.title} maxLength={60} onChange={(e) => setItem(i, "title", e.target.value)} placeholder="العنوان" aria-label="العنوان" />
              <Button size="icon" variant="danger" onClick={() => setTimeline((p) => p.filter((_, idx) => idx !== i))} aria-label="حذف المحطة" className="shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea value={t.text} maxLength={300} onChange={(e) => setItem(i, "text", e.target.value)} placeholder="وصف قصير" aria-label="الوصف" className="min-h-16" />
          </div>
        ))}
        {timeline.length < 10 && (
          <Button variant="outline" size="sm" onClick={() => setTimeline((p) => [...p, { label: "", title: "", text: "" }])}>
            <Plus className="h-4 w-4" aria-hidden />
            إضافة محطة
          </Button>
        )}
      </fieldset>

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
        حفظ الإعدادات
      </Button>
    </form>
  );
}
