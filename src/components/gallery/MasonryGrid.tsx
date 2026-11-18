export function MasonryGrid({ children }: { children: React.ReactNode }) {
  return <div className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">{children}</div>;
}
