"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/fields";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoriesManager({
  categories,
  counts,
  onChanged,
}: {
  categories: Category[];
  counts: Record<string, number>;
  onChanged: () => void | Promise<void>;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleting, setDeleting] = useState<Category | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setBusy(true);
    const { error } = await supabase.from("categories").insert({ name: n, slug: slugify(n) });
    setBusy(false);
    if (error) return void toast.error(error.code === "23505" ? "هذا التصنيف موجود مسبقاً" : "تعذر إضافة التصنيف");
    toast.success(`تمت إضافة التصنيف «${n}» وسيظهر في الفلاتر فوراً`);
    setName("");
    await onChanged();
  }

  async function saveEdit(c: Category) {
    const n = editName.trim();
    if (!n || n === c.name) return setEditingId(null);
    setBusy(true);
    const { error } = await supabase.from("categories").update({ name: n, slug: slugify(n) }).eq("id", c.id);
    setBusy(false);
    if (error) return void toast.error(error.code === "23505" ? "يوجد تصنيف بهذا الاسم" : "تعذر تعديل التصنيف");
    toast.success("تم تعديل التصنيف");
    setEditingId(null);
    await onChanged();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    const { error } = await supabase.from("categories").delete().eq("id", deleting.id);
    setBusy(false);
    if (error) return void toast.error("تعذر حذف التصنيف");
    toast.success("تم حذف التصنيف");
    setDeleting(null);
    await onChanged();
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
      <form onSubmit={add} className="h-fit space-y-4 rounded-2xl border border-beige/10 bg-ink-soft p-5">
        <div>
          <Label htmlFor="cat-name">تصنيف جديد</Label>
          <Input id="cat-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="مثال: حب، حزن، ذكريات" />
        </div>
        <Button type="submit" className="w-full" disabled={busy || !name.trim()}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          إضافة التصنيف
        </Button>
        <p className="text-xs leading-6 text-beige/45">يُنشأ الرابط تلقائياً، ويظهر التصنيف في فلاتر الرئيسية والمعرض دون أي تعديل على الأكواد.</p>
      </form>

      <ul className="space-y-2" aria-label="التصنيفات الحالية">
        {categories.length === 0 && <li className="py-8 text-center text-beige/55">لا توجد تصنيفات بعد.</li>}
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-beige/10 bg-ink-soft px-4 py-3">
            {editingId === c.id ? (
              <>
                <Input
                  autoFocus
                  value={editName}
                  maxLength={40}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(c)}
                  className="h-10 py-0"
                  aria-label="اسم التصنيف"
                />
                <div className="flex gap-1">
                  <Button size="icon" variant="blue" onClick={() => saveEdit(c)} disabled={busy} aria-label="حفظ">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} aria-label="إلغاء">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="font-medium text-beige">{c.name}</p>
                  <p className="text-xs text-beige/45">{counts[c.id] ?? 0} رسمة</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                    aria-label={`تعديل ${c.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="danger" onClick={() => setDeleting(c)} aria-label={`حذف ${c.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} title="حذف التصنيف">
        <p className="text-sm leading-8 text-beige/75">
          سيُحذف التصنيف «{deleting?.name}» فقط. الرسمات داخله ({deleting ? counts[deleting.id] ?? 0 : 0}) لن تُحذف، وستصبح بدون تصنيف.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            حذف التصنيف
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
