"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="إغلاق" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-beige/10 bg-ink-raised p-6 shadow-2xl sm:rounded-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-beige">{title}</h2>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="rounded-full p-2 text-beige/60 hover:bg-white/5 hover:text-beige">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
