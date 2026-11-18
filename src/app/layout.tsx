import type { Metadata, Viewport } from "next";
import { Amiri, Cairo } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/data";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

const DESCRIPTION = "معرض فني خاص يضم رسمات من القلب: أنمي، كرتون، بورتريه ولوحات زيتية، ولكل رسمة قصة.";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const title = `${s.artist_display_name} | معرض الفن`;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: title, template: `%s | ${s.artist_display_name}` },
    description: DESCRIPTION,
    // الخصوصية: الموقع مخفي عن محركات البحث ما لم تفعّل NEXT_PUBLIC_ALLOW_INDEXING.
    robots: allowIndex ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    openGraph: { type: "website", locale: "ar_AR", siteName: s.artist_display_name, title, description: DESCRIPTION },
    icons: { icon: "/favicon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#0F0F12", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          تخطّي إلى المحتوى
        </a>
        {children}
        <Toaster dir="rtl" position="top-center" theme="dark" richColors />
      </body>
    </html>
  );
}
