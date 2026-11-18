"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/fields";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fails, setFails] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Date.now() < lockedUntil) {
      setError("محاولات كثيرة. انتظر دقيقة ثم أعد المحاولة.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      const f = fails + 1;
      if (f >= 5) {
        setLockedUntil(Date.now() + 60_000);
        setFails(0);
      } else {
        setFails(f);
      }
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={busy || !email || !password}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
        تسجيل الدخول
      </Button>
    </form>
  );
}
