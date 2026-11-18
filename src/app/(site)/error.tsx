"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-5 pt-24 text-center">
      <div>
        <h1 className="font-display text-4xl text-beige">تعذّر تحميل الصفحة</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-beige/65">
          حدثت مشكلة أثناء جلب البيانات. تحقق من اتصالك ثم أعد المحاولة.
        </p>
        <Button onClick={reset} className="mt-8">
          <RotateCcw className="h-4 w-4" aria-hidden />
          إعادة المحاولة
        </Button>
      </div>
    </div>
  );
}
