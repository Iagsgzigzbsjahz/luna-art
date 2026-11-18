import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArtworks, getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "المعرض" };

export default async function GalleryPage() {
  const [categories, artworks] = await Promise.all([getCategories(), getArtworks()]);
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-32 md:pt-40">
      <SectionHeading title="المعرض" subtitle="كل الرسمات في مكان واحد. ابحث، صفّ، وتجوّل كما تشاء." />
      <GalleryBrowser artworks={artworks} categories={categories} mode="gallery" />
    </div>
  );
}
