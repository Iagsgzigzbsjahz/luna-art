import { FeaturedSlider } from "@/components/home/FeaturedSlider";
import { Hero } from "@/components/home/Hero";
import { WhySection } from "@/components/home/WhySection";
import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArtworks, getCategories, getSettings } from "@/lib/data";

export default async function HomePage() {
  const [settings, categories, artworks] = await Promise.all([getSettings(), getCategories(), getArtworks()]);
  const featured = artworks.filter((a) => a.is_featured);

  return (
    <>
      <Hero name={settings.artist_display_name} title={settings.hero_title} subtitle={settings.hero_subtitle} />
      <FeaturedSlider artworks={featured} />
      <section id="gallery" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title="أحدث الرسمات" />
          <GalleryBrowser artworks={artworks} categories={categories} mode="home" />
        </div>
      </section>
      <WhySection />
    </>
  );
}
