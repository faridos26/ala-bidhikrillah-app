import type { Category, Content } from "@/lib/sakina";
import { ContentCard } from "./ContentCard";

export function SearchResults({
  query,
  results,
  favorites,
  onToggleFavorite,
}: {
  query: string;
  results: { category: Category; content: Content }[];
  favorites: string[];
  onToggleFavorite: (item: Content) => void;
}) {
  if (!results.length) {
    return (
      <div className="py-10 text-center text-muted">
        <p className="font-bold text-ink">لا نتائج لـ «{query}»</p>
        <small className="text-xs">جرّب كلمة أخرى، أو تصفح المواضيع أدناه بعد مسح البحث.</small>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3.5">
      {results.map(({ content, category }, i) => (
        <ContentCard
          key={i}
          item={content}
          category={category}
          favorite={favorites.includes(`${content.reference}|${content.text_ar}`)}
          onFavorite={() => onToggleFavorite(content)}
        />
      ))}
    </div>
  );
}
