import { Skeleton } from "@/components/ui/skeleton";

const heights = ["h-64", "h-80", "h-52", "h-72", "h-60", "h-80", "h-56", "h-72"];

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-32" aria-busy="true" aria-label="جارٍ التحميل">
      <Skeleton className="mx-auto mb-4 h-12 w-2/3 max-w-md" />
      <Skeleton className="mx-auto mb-12 h-4 w-1/2 max-w-sm" />
      <div className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
        {heights.map((h, i) => (
          <Skeleton key={i} className={`mb-3 w-full break-inside-avoid md:mb-4 ${h}`} />
        ))}
      </div>
    </div>
  );
}
