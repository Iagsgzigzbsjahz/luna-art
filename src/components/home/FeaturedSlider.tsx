"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/lib/types";

export function FeaturedSlider({ artworks }: { artworks: Artwork[] }) {
  const n = artworks.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    if (n < 2 || paused) return;
    const id = setInterval(() => go(1), 6500);
    return () => clearInterval(id);
  }, [n, paused, go]);

  if (n === 0) return null;
  const a = artworks[Math.min(i, n - 1)];

  return (
    <section
      className="py-20 md:py-28"
      aria-roledescription="carousel"
      aria-label="رسمات مميزة"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="رسمات مميزة" subtitle="مختارات تحمل شيئاً خاصاً من القلب." />

        <AnimatePresence mode="wait">
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid items-center gap-8 md:grid-cols-2 lg:gap-16"
          >
            <Link
              href={`/artwork/${a.id}`}
              className="block rounded-xl bg-white p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] md:p-4"
              aria-label={a.title}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-white">
                <Image
                  src={a.image_url}
                  alt={a.title}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="text-center md:text-start">
              {a.category && (
                <span className="inline-block rounded-full border border-azure/40 bg-azure/10 px-3 py-1 text-xs text-azure">
                  {a.category.name}
                </span>
              )}
              <h3 className="mt-4 font-display text-4xl text-beige md:text-5xl">{a.title}</h3>
              {a.description && (
                <p className="mt-5 line-clamp-5 text-base leading-9 text-beige/70">{a.description}</p>
              )}
              <Link href={`/artwork/${a.id}`} className={buttonStyles({ variant: "outline", className: "mt-8" })}>
                عرض الرسمة
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {n > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="الرسمة السابقة"
              className="grid h-10 w-10 place-items-center rounded-full border border-beige/20 text-beige transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="اختيار الرسمة">
              {artworks.map((x, idx) => (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`الرسمة ${idx + 1}: ${x.title}`}
                  onClick={() => setI(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    idx === i ? "w-8 bg-gold" : "w-2 bg-beige/25 hover:bg-beige/50",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="الرسمة التالية"
              className="grid h-10 w-10 place-items-center rounded-full border border-beige/20 text-beige transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
