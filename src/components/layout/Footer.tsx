import Link from "next/link";
import { Heart, Palette } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t border-beige/10 bg-ink-soft/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center">
        <Link href="/" className="flex items-center gap-2 font-display text-3xl text-beige">
          <Palette className="h-5 w-5 text-gold" aria-hidden />
          {settings.artist_display_name}
        </Link>

        <nav className="flex gap-6 text-sm text-beige/65" aria-label="روابط التذييل">
          <Link href="/" className="hover:text-gold">الرئيسية</Link>
          <Link href="/gallery" className="hover:text-gold">المعرض</Link>
          <Link href="/about" className="hover:text-gold">قصتها</Link>
        </nav>

        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-beige/80">
          <Heart className="h-4 w-4 fill-gold text-gold" aria-hidden />
          <span>صُنع بحب من</span>
          <span className="font-display text-xl text-gold">{settings.boyfriend_name}</span>
          <span>إلى</span>
          <span className="font-display text-xl text-gold">{settings.artist_display_name}</span>
        </p>

        {settings.footer_text && (
          <p className="max-w-xl text-xs leading-7 text-beige/45">{settings.footer_text}</p>
        )}
      </div>
    </footer>
  );
}
