import { Palette } from "lucide-react";

export function EmptyState({ message = "لا توجد رسمات هنا بعد، لكن القلب مليان أفكار" }: { message?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/30 text-gold">
        <Palette className="h-7 w-7" aria-hidden />
      </span>
      <p className="font-display text-2xl leading-10 text-beige/85">{message}</p>
    </div>
  );
}
