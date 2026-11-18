"use client";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ImagePicker({
  file,
  onChange,
  currentUrl,
  shape = "wide",
  hint,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  currentUrl?: string | null;
  shape?: "wide" | "round";
  hint?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = preview ?? currentUrl ?? null;

  function pick(f?: File | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return void toast.error("الملف المختار ليس صورة");
    if (f.size > 25 * 1024 * 1024) return void toast.error("حجم الصورة كبير جداً (الحد 25 ميجابايت)");
    onChange(f);
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed p-4 text-center transition-colors focus-within:border-gold",
        shape === "round" ? "mx-auto h-44 w-44 rounded-full" : "min-h-48 w-full rounded-2xl",
        drag ? "border-gold bg-gold/5" : "border-beige/25 hover:border-gold/60",
      )}
    >
      <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="معاينة الصورة"
          className={cn(shape === "round" ? "h-full w-full rounded-full object-cover" : "max-h-72 w-full rounded-lg object-contain")}
        />
      ) : (
        <>
          <ImagePlus className="h-8 w-8 text-gold" aria-hidden />
          <span className="text-sm text-beige/70">اضغط لاختيار صورة أو اسحبها هنا</span>
        </>
      )}
      {hint && !src && <span className="text-xs text-beige/40">{hint}</span>}
    </label>
  );
}
