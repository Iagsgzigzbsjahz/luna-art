import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "قصتها" };

export default async function AboutPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-32 md:pt-40">
      <header className="text-center">
        <div className="relative mx-auto h-44 w-44 animate-float">
          <div aria-hidden className="absolute -inset-2 rounded-full bg-gradient-to-tr from-gold via-azure to-gold opacity-60 blur-md" />
          <Image
            src={s.artist_avatar_url || "/avatar-default.svg"}
            alt="رسم توضيحي للفنانة"
            width={176}
            height={176}
            priority
            className="relative h-44 w-44 rounded-full border-2 border-gold/60 bg-ink-soft object-cover"
          />
        </div>
        <h1 className="mt-8 font-display text-5xl text-beige md:text-6xl">{s.artist_display_name}</h1>
        <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-lg leading-10 text-beige/75">{s.artist_bio}</p>
      </header>

      {s.timeline.length > 0 && (
        <section className="mt-24">
          <SectionHeading title="رحلتها مع الفن" />
          <ol className="relative mx-auto max-w-2xl border-s border-gold/30 ps-8">
            {s.timeline.map((t, i) => (
              <li key={i} className="relative pb-12 last:pb-0">
                <span aria-hidden className="absolute -start-[41px] top-2 h-4 w-4 rounded-full border-2 border-gold bg-ink" />
                {t.label && <p className="text-sm text-gold">{t.label}</p>}
                <h3 className="mt-1 font-display text-2xl text-beige">{t.title}</h3>
                {t.text && <p className="mt-2 text-sm leading-8 text-beige/65">{t.text}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-24">
        <SectionHeading title="رسالة من صانع الموقع" />
        <figure className="relative mx-auto max-w-2xl rounded-2xl border border-gold/25 bg-ink-soft p-8 text-center md:p-12">
          <Quote className="mx-auto h-8 w-8 text-gold/60" aria-hidden />
          <blockquote className="mt-5 whitespace-pre-line font-display text-2xl leading-[2.4] text-beige/90">
            {s.maker_message}
          </blockquote>
          <figcaption className="mt-8 flex items-center justify-center gap-2 text-beige/70">
            <Heart className="h-4 w-4 fill-gold text-gold" aria-hidden />
            <span>هدية صُنعت بحب من</span>
            <span className="font-display text-2xl text-gold">{s.boyfriend_name}</span>
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
