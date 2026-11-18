"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; r: number; vx: number; vy: number; a: number; p: number; c: string };

const COLORS = ["201,169,106", "127,168,215", "232,220,200"];

/** جزيئات عائمة خفيفة على canvas. تتوقف الحركة إن فضّل الجهاز تقليل الحركة. */
export function Particles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let dots: Dot[] = [];

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(24, w / 18)));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.25 + 0.05),
        a: Math.random() * 0.6 + 0.2,
        p: Math.random() * Math.PI * 2,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduce) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.y < -5) {
            d.y = h + 5;
            d.x = Math.random() * w;
          }
        }
        const twinkle = reduce ? 1 : 0.6 + 0.4 * Math.sin(t / 900 + d.p);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${d.c},${d.a * twinkle})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${d.c},0.6)`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    init();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      init();
      raf = requestAnimationFrame(draw);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
