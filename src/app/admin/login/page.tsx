import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main id="main" className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Lock className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-4xl text-beige">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-beige/55">لوحة التحكم مخصصة لصانع الموقع فقط.</p>
        </div>
        <div className="rounded-2xl border border-beige/10 bg-ink-soft p-6 shadow-2xl shadow-black/40">
          <LoginForm />
        </div>
        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-beige/55 hover:text-gold">
          <ArrowRight className="h-4 w-4" aria-hidden />
          العودة إلى الموقع
        </Link>
      </div>
    </main>
  );
}
