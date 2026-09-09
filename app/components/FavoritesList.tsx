import type { Category, Content } from "@/lib/sakina";
import { ContentCard } from "./ContentCard";

export function FavoritesList({
  items,
  onToggleFavorite,
}: {
  items: { category: Category; content: Content }[];
  onToggleFavorite: (item: Content) => void;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-7">
      <div className="flex items-center justify-between font-extrabold text-accentStrong">
        <div>
          <span>المحفوظات</span>
          <small className="mt-1 block text-xs font-normal text-muted">محتوى حفظته للعودة إليه</small>
        </div>
        <span aria-hidden="true">♥</span>
      </div>
      {!items.length ? (
        <div className="py-14 text-center text-muted">
          <div className="text-4xl text-muted/60">♡</div>
          <p className="mt-2.5 font-bold text-ink">لا توجد محتويات محفوظة بعد.</p>
          <small className="text-xs">اضغط على ♡ بجانب أي آية لحفظها.</small>
        </div>
      ) : (
        <div className="mt-5 grid gap-3.5">
          {items.map(({ content, category }, i) => (
            <ContentCard
              key={i}
              item={content}
              category={category}
              favorite={true}
              onFavorite={() => onToggleFavorite(content)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
