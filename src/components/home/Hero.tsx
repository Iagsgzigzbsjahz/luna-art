"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Particles } from "./Particles";
import { buttonStyles } from "@/components/ui/button";

export function Hero({ name, title, subtitle }: { name: string; title: string; subtitle: string }) {
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,rgba(127,168,215,0.20),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(201,169,106,0.13),transparent_55%)]"
      />
      <Particles className="absolute inset-0 -z-10 h-full w-full" />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/[0.03] px-4 py-1.5 text-sm text-gold"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          {name}
        </motion.div>

        <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-display text-5xl leading-[1.5] text-beige sm:text-6xl md:text-7xl">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 + words.length * 0.2 + 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-9 text-beige/70 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 + words.length * 0.2 + 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href="#gallery" className={buttonStyles({ size: "lg" })}>
            استكشف المعرض
          </a>
          <Link href="/about" className={buttonStyles({ variant: "outline", size: "lg" })}>
            قصتها
          </Link>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-6 text-gold/70"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
