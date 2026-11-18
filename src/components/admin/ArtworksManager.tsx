"use client";

import { useMemo, useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { removeImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn, formatDate } from "@/lib/utils";
import type { Artwork, Category } from "@/lib/types";
import { ArtworkForm } from "./ArtworkForm";

export function ArtworksManager({
  artworks,
  categories,
  onChanged,
}: {
  artworks: Artwork[];
  categories: Category[];
  onChanged: () => void | Promise<void>;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [deleting, setDeleting] = useState<Artwork | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleFeatured(a: Artwork) {
    setBusyId(a.id);
    const { error } = await supabase.from("artworks").update({ is_featured: !a.is_featured }).eq("id", a.id);
    setBusyId(null);
    if (error) return void toast.error("تعذر تحديث حالة التمييز");
    toast.success(a.is_featured ? "أُزيلت من المميزة" : "أُضيفت إلى المميزة");
    await onChanged();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    const { error } = await supabase.from("artworks").delete().eq("id", deleting.id);
    if (error) {
      toast.error("تعذر حذف الرسمة");
      setBusyId(null);
      return;
    }
    await removeImage(supabase, "artworks", deleting.image_url);
    toast.success("تم حذف الرسمة");
    setDeleting(null);
    setBusyId(null);
    await onChanged();
  }

  if (artworks.length === 0) {
    return (
      <p className="py-14 text-center font-display text-2xl text-beige/70">
        لا توجد رسمات بعد. افتح تبويب «إضافة رسمة» وانشر أول عمل.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-beige/10 text-start text-xs text-beige/50">
              <th className="px-3 py-3 text-start font-medium">الصورة</th>
              <th className="px-3 py-3 text-start font-medium">العنوان</th>
              <th className="px-3 py-3 text-start font-medium">التصنيف</th>
              <th className="px-3 py-3 text-start font-medium">مميزة</th>
              <th className="px-3 py-3 text-start font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((a) => (
              <tr key={a.id} className="border-b border-beige/5 last:border-0">
                <td className="px-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image_url} alt={a.title} loading="lazy" className="h-14 w-14 rounded-lg bg-white object-cover" />
                </td>
                <td className="px-3 py-3">
                  <p className="font-medium text-beige">{a.title}</p>
                  <p className="text-xs text-beige/40">{formatDate(a.created_at)}</p>
                </td>
                <td className="px-3 py-3 text-beige/70">{a.category?.name ?? "بدون تصنيف"}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={a.is_featured}
                    aria-label={`تمييز ${a.title}`}
                    disabled={busyId === a.id}
                    onClick={() => toggleFeatured(a)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors disabled:opacity-50",
                      a.is_featured ? "bg-gold" : "bg-white/15",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow",
                        a.is_featured ? "end-0.5" : "start-0.5",
                      )}
                    />
                  </button>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(a)} aria-label={`تعديل ${a.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="danger" onClick={() => setDeleting(a)} aria-label={`حذف ${a.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title="تعديل الرسمة">
        {editing && (
          <ArtworkForm
            key={editing.id}
            artwork={editing}
            categories={categories}
            onDone={async () => {
              setEditing(null);
              await onChanged();
            }}
          />
        )}
      </Dialog>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} title="حذف الرسمة">
        <p className="text-sm leading-8 text-beige/75">
          سيتم حذف «{deleting?.title}» وصورتها نهائياً، ولا يمكن التراجع عن ذلك.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={busyId === deleting?.id}>
            {busyId === deleting?.id && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            حذف نهائياً
          </Button>
        </div>
      </Dialog>
    </>
  );
}
