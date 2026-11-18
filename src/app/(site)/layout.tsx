import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar name={settings.artist_display_name} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
