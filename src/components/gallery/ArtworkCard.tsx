"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/lib/types";

/** بطاقة رسمة بإطار أبيض كلوحات المتاحف، مع هيكل تحميل وتكبير خفيف عند المرور. */
export function ArtworkCard({ artwork, priority = false }: { artwork: Artwork; priority?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mb-3 break-inside-avoid md:mb-4">
      <Link
        href={`/artwork/${artwork.id}`}
        aria-label={artwork.title}
        className="group relative block rounded-lg bg-white p-1.5 shadow-lg shadow-black/30 transition-shadow duration-500 hover:shadow-gold/20 md:p-2"
      >
        <div className="relative overflow-hidden rounded-[5px] bg-neutral-100">
          {!loaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-neutral-200 to-neutral-100" aria-hidden />
          )}
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            width={800}
            height={1000}
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={cn(
              "h-auto w-full transition duration-700 ease-out group-hover:scale-[1.04]",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/55 to-transparent p-3 pt-14 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
            <h3 className="font-display text-xl leading-snug text-beige">{artwork.title}</h3>
            {artwork.category && <span className="text-xs text-gold">{artwork.category.name}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
