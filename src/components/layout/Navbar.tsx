"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/gallery", label: "المعرض" },
  { href: "/about", label: "قصتها" },
];

export function Navbar({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open ? "bg-ink/85 shadow-lg shadow-black/30 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20">
        <Link href="/" className="flex items-center gap-2.5 font-display text-2xl text-beige">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Palette className="h-4 w-4" aria-hidden />
          </span>
          {name}
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="التنقل الرئيسي">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "relative py-1 text-sm transition-colors",
                isActive(l.href) ? "text-gold" : "text-beige/75 hover:text-beige",
              )}
            >
              {l.label}
              {isActive(l.href) && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-1 h-px bg-gold" />
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          className="grid h-10 w-10 place-items-center rounded-full text-beige hover:bg-white/5 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden"
            aria-label="قائمة الجوال"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base",
                    isActive(l.href) ? "bg-gold/10 text-gold" : "text-beige/80 hover:bg-white/5",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
