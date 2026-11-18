import { BookOpen, Gift, Palette } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const items = [
  {
    icon: Palette,
    title: "فن من القلب",
    text: "كل خط وكل لون خرج من يد صادقة، بلا استعجال وبلا تكلّف.",
  },
  {
    icon: BookOpen,
    title: "كل رسمة لها قصة",
    text: "خلف كل عمل لحظة وشعور وحكاية، نرويها لك مع كل لوحة.",
  },
  {
    icon: Gift,
    title: "هدية حب",
    text: "صُنع هذا المعرض ليكون بيتاً يليق برسماتها، ورسالة حب تُعرض بهدوء.",
  },
];

export function WhySection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="لماذا هذا المكان؟" />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-beige/10 bg-ink-soft p-8 text-center transition-colors duration-500 hover:border-gold/40"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-6 font-display text-2xl text-beige">{title}</h3>
              <p className="mt-3 text-sm leading-8 text-beige/65">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
