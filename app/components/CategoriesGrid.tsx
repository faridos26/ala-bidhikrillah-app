import type { Category } from "@/lib/sakina";

export function CategoriesGrid({
  categories,
  countFor,
  onSelect,
}: {
  categories: Category[];
  countFor: (category: Category) => number;
  onSelect: (category: Category) => void;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-7">
      <div className="flex items-center justify-between font-extrabold text-accentStrong">
        <div>
          <span>استكشف المواضيع</span>
          <small className="mt-1 block text-xs font-normal text-muted">اختر موضوعاً للبدء</small>
        </div>
        <span className="text-sm text-muted">{categories.length}</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {categories.map((category) => (
          <button
            key={category.code}
            onClick={() => onSelect(category)}
            className="rounded-2xl border border-border bg-surfaceMuted/40 p-3.5 text-start transition-colors hover:border-accent hover:bg-surfaceMuted"
          >
            <span className="block font-bold">{category.name_ar}</span>
            <small className="mt-1.5 block text-[11px] text-muted">
              {countFor(category)} محتوى موثّق
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}
