"use client";

import { useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { processImage, removeImage, uploadImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/fields";
import type { Artwork, Category } from "@/lib/types";
import { ImagePicker } from "./ImagePicker";

export function ArtworkForm({
  categories,
  artwork,
  onDone,
}: {
  categories: Category[];
  artwork?: Artwork;
  onDone: () => void | Promise<void>;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [title, setTitle] = useState(artwork?.title ?? "");
  const [description, setDescription] = useState(artwork?.description ?? "");
  const [categoryId, setCategoryId] = useState(artwork?.category_id ?? "");
  const [featured, setFeatured] = useState(artwork?.is_featured ?? false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return void toast.error("اكتب عنواناً للرسمة");
    if (!artwork && !file) return void toast.error("اختر صورة الرسمة");

    setBusy(true);
    let uploaded: string | null = null;
    try {
      if (file) uploaded = await uploadImage(supabase, "artworks", await processImage(file, 2400));

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        category_id: categoryId || null,
        is_featured: featured,
        ...(uploaded ? { image_url: uploaded } : {}),
      };
      const { error } = artwork
        ? await supabase.from("artworks").update(payload).eq("id", artwork.id)
        : await supabase.from("artworks").insert({ ...payload, image_url: uploaded });
      if (error) throw error;
    } catch (err) {
      if (uploaded) await removeImage(supabase, "artworks", uploaded);
      console.error(err);
      toast.error(err instanceof Error ? err.message : "تعذر حفظ الرسمة. حاول مرة أخرى.");
      setBusy(false);
      return;
    }

    if (artwork && uploaded) await removeImage(supabase, "artworks", artwork.image_url);
    toast.success(artwork ? "تم حفظ التعديلات" : "تمت إضافة الرسمة بنجاح");
    if (!artwork) {
      setTitle("");
      setDescription("");
      setCategoryId("");
      setFeatured(false);
    }
    setFile(null);
    setBusy(false);
    await onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label>صورة الرسمة</Label>
        <ImagePicker file={file} onChange={setFile} currentUrl={artwork?.image_url} hint="JPG أو PNG أو WebP" />
        <p className="mt-2 text-xs text-beige/45">
          تُحذف بيانات الصورة الخفية (مثل موقع التصوير) تلقائياً قبل الرفع حفاظاً على الخصوصية.
        </p>
      </div>
      <div>
        <Label htmlFor="art-title">العنوان</Label>
        <Input id="art-title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="art-desc">القصة</Label>
        <Textarea
          id="art-desc"
          value={description}
          maxLength={4000}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="ما الحكاية وراء هذه الرسمة؟"
        />
      </div>
      <div>
        <Label htmlFor="art-cat">التصنيف</Label>
        <Select id="art-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">بدون تصنيف</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm text-beige/85">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-5 w-5 rounded border-beige/30 bg-ink-soft accent-[#C9A96A]"
        />
        رسمة مميزة (تظهر في شريط الصفحة الرئيسية)
      </label>
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
        {artwork ? "حفظ التعديلات" : "نشر الرسمة"}
      </Button>
    </form>
  );
}
