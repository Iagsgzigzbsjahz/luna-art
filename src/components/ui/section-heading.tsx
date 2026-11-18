import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 text-center", className)}>
      <h2 className="font-display text-4xl text-beige md:text-5xl">{title}</h2>
      <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-l from-transparent via-gold to-transparent" aria-hidden />
      {subtitle && <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-beige/65">{subtitle}</p>}
    </div>
  );
}
