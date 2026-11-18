"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ArtworkCard } from "./ArtworkCard";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { MasonryGrid } from "./MasonryGrid";
import { Input, Select } from "@/components/ui/fields";
import { buttonStyles } from "@/components/ui/button";
import { normalizeArabic } from "@/lib/utils";
import type { Artwork, Category } from "@/lib/types";

type Sort = "newest" | "oldest" | "featured";

/** التصفية والبحث والترتيب كلها داخل المتصفح، فتتغير النتائج فوراً دون إعادة تحميل. */
export function GalleryBrowser({
  artworks,
  categories,
  mode,
}: {
  artworks: Artwork[];
  categories: Category[];
  mode: "home" | "gallery";
}) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const list = useMemo(() => {
    let r = artworks;
    if (active !== "all") {
      const cat = categories.find((c) => c.slug === active);
      r = r.filter((a) => a.category_id === cat?.id);
    }
    const q = normalizeArabic(query);
    if (q) r = r.filter((a) => normalizeArabic(a.title).includes(q));

    const time = (a: Artwork) => new Date(a.created_at).getTime();
    return [...r].sort((a, b) => {
      if (sort === "oldest") return time(a) - time(b);
      if (sort === "featured" && a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return time(b) - time(a);
    });
  }, [artworks, categories, active, query, sort]);

  const shown = mode === "home" ? list.slice(0, 12) : list;
  const noArtworksAtAll = artworks.length === 0;

  return (
    <div>
      {mode === "gallery" && (
        <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-beige/40" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بعنوان الرسمة"
              aria-label="بحث بعنوان الرسمة"
              className="ps-11"
            />
          </div>
          <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="ترتيب الرسمات" className="sm:w-44">
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="featured">المميزة</option>
          </Select>
        </div>
      )}

      {!noArtworksAtAll && <FilterBar categories={categories} active={active} onChange={setActive} />}

      <div className="mt-8" aria-live="polite">
        {shown.length === 0 ? (
          noArtworksAtAll ? (
            <EmptyState />
          ) : query ? (
            <EmptyState message="لم نجد رسمة بهذا العنوان، جرّب كلمة أخرى" />
          ) : (
            <EmptyState />
          )
        ) : (
          <MasonryGrid>
            {shown.map((a, idx) => (
              <ArtworkCard key={a.id} artwork={a} priority={idx < 4} />
            ))}
          </MasonryGrid>
        )}
      </div>

      {mode === "home" && list.length > 0 && (
        <div className="mt-10 text-center">
          <Link href="/gallery" className={buttonStyles({ variant: "outline", size: "lg" })}>
            عرض المعرض كاملاً
          </Link>
        </div>
      )}
    </div>
  );
}
