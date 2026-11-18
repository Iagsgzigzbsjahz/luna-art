"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function FilterBar({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
}) {
  const chips = [{ slug: "all", name: "الكل" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))];

  return (
    <div
      role="tablist"
      aria-label="تصنيفات الرسمات"
      className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
    >
      {chips.map((c) => (
        <button
          key={c.slug}
          type="button"
          role="tab"
          aria-selected={active === c.slug}
          onClick={() => onChange(c.slug)}
          className={cn(
            "shrink-0 rounded-full border px-5 py-2 text-sm transition-colors duration-300",
            active === c.slug
              ? "border-gold bg-gold text-ink"
              : "border-beige/20 text-beige/80 hover:border-gold/60 hover:text-gold",
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
