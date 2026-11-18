import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="font-display text-8xl text-gold">404</p>
        <h1 className="mt-4 font-display text-3xl text-beige">هذه الصفحة غير موجودة</h1>
        <p className="mt-3 text-sm text-beige/60">ربما انتقلت الرسمة أو تغيّر الرابط.</p>
        <Link href="/" className={buttonStyles({ className: "mt-8" })}>
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
