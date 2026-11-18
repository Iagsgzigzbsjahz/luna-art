import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { ArtworkCard } from "@/components/gallery/ArtworkCard";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArtworks } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = (await getArtworks()).find((x) => x.id === params.id);
  if (!a) return { title: "رسمة غير موجودة" };
  const description = a.description?.slice(0, 160) || `رسمة بعنوان ${a.title}`;
  return {
    title: a.title,
    description,
    openGraph: { title: a.title, description, images: [{ url: a.image_url }] },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const artworks = await getArtworks();
  const idx = artworks.findIndex((x) => x.id === params.id);
  if (idx < 0) notFound();

  const a = artworks[idx];
  const newer = artworks[idx - 1] ?? null; // القائمة مرتبة من الأحدث للأقدم
  const older = artworks[idx + 1] ?? null;
  const related = a.category_id
    ? artworks.filter((x) => x.category_id === a.category_id && x.id !== a.id).slice(0, 4)
    : [];

  return (
    <article className="mx-auto max-w-6xl px-5 pb-10 pt-28 md:pt-36">
      <Link href="/gallery" className="mb-8 inline-flex items-center gap-2 text-sm text-beige/65 hover:text-gold">
        <ArrowRight className="h-4 w-4" aria-hidden />
        العودة إلى المعرض
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="self-start rounded-xl bg-white p-3 shadow-2xl shadow-black/60 md:p-4 lg:sticky lg:top-28">
          <Image
            src={a.image_url}
            alt={a.title}
            width={1600}
            height={2000}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-auto w-full rounded-md"
          />
        </div>

        <div className="lg:pt-6">
          {a.category && (
            <span className="inline-block rounded-full border border-azure/40 bg-azure/10 px-3 py-1 text-xs text-azure">
              {a.category.name}
            </span>
          )}
          <h1 className="mt-4 font-display text-5xl leading-tight text-beige md:text-6xl">{a.title}</h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-beige/55">
            <CalendarDays className="h-4 w-4 text-gold" aria-hidden />
            <time dateTime={a.created_at}>{formatDate(a.created_at)}</time>
          </p>
          <div className="my-8 h-px w-20 bg-gradient-to-l from-transparent via-gold to-transparent" aria-hidden />
          {a.description ? (
            <p className="whitespace-pre-line text-lg leading-10 text-beige/80">{a.description}</p>
          ) : (
            <p className="text-beige/45">لم تكتب الفنانة قصة لهذه الرسمة بعد.</p>
          )}
        </div>
      </div>

      <nav className="mt-16 flex items-stretch justify-between gap-4" aria-label="التنقل بين الرسمات">
        {newer ? (
          <Link
            href={`/artwork/${newer.id}`}
            className="flex flex-1 items-center gap-3 rounded-2xl border border-beige/10 bg-ink-soft p-4 transition-colors hover:border-gold/40"
          >
            <ChevronRight className="h-5 w-5 shrink-0 text-gold" aria-hidden />
            <span className="min-w-0">
              <span className="block text-xs text-beige/50">الرسمة السابقة</span>
              <span className="block truncate font-display text-xl text-beige">{newer.title}</span>
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {older ? (
          <Link
            href={`/artwork/${older.id}`}
            className="flex flex-1 items-center justify-end gap-3 rounded-2xl border border-beige/10 bg-ink-soft p-4 text-end transition-colors hover:border-gold/40"
          >
            <span className="min-w-0">
              <span className="block text-xs text-beige/50">الرسمة التالية</span>
              <span className="block truncate font-display text-xl text-beige">{older.title}</span>
            </span>
            <ChevronLeft className="h-5 w-5 shrink-0 text-gold" aria-hidden />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>

      {related.length > 0 && (
        <section className="mt-24">
          <SectionHeading title="رسمات من نفس التصنيف" />
          <MasonryGrid>
            {related.map((r) => (
              <ArtworkCard key={r.id} artwork={r} />
            ))}
          </MasonryGrid>
        </section>
      )}
    </article>
  );
}
