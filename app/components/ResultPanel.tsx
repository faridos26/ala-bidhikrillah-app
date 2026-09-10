import type { Category, Content } from "@/lib/sakina";
import { getProphetStoryForCategory } from "@/lib/sakina";
import { ContentCard } from "./ContentCard";
import { SafetyNotice } from "./SafetyNotice";
import { ProphetStoryCard } from "./ProphetStory";

export function ResultPanel({
  category,
  score,
  content,
  favorites,
  onToggleFavorite,
}: {
  category: Category;
  score: number;
  content: Content[];
  favorites: string[];
  onToggleFavorite: (item: Content) => void;
}) {
  if (category.is_safety_route) {
    return (
      <div className="mt-7 border-t border-border pt-6" aria-live="polite">
        <SafetyNotice />
      </div>
    );
  }

  const prophetStory = getProphetStoryForCategory(category.code);

  return (
    <div className="mt-7 border-t border-border pt-6" aria-live="polite">
      <div className="flex items-start justify-between gap-3.5">
        <div>
          <span className="text-xs text-muted">نبحث لك في المحتوى الموثوق</span>
          <h2 className="mt-1.5 text-2xl font-bold">{category.name_ar}</h2>
        </div>
        <span className="whitespace-nowrap rounded-full border border-border px-2.5 py-1.5 text-[11px] text-muted">
          مطابقة {Math.round(score * 100)}%
        </span>
      </div>

      <div className="mt-5 grid gap-3.5">
        {content.map((item, index) => (
          <ContentCard
            key={`${item.reference}-${index}`}
            item={item}
            category={category}
            favorite={favorites.includes(`${item.reference}|${item.text_ar}`)}
            onFavorite={() => onToggleFavorite(item)}
          />
        ))}
        {!content.length && (
          <p className="text-muted">لا يوجد محتوى موثّق متاح لهذا التصنيف حاليًا.</p>
        )}
      </div>

      {prophetStory && (
        <div className="mt-5">
          <ProphetStoryCard story={prophetStory} />
        </div>
      )}

      {category.code === "GENERAL_FALLBACK" && (
        <div className="mt-3.5 rounded-2xl bg-surfaceMuted p-3.5 text-xs leading-[1.8] text-muted">
          لم نصل إلى تصنيف واضح. يمكنك إعادة صياغة ما تشعر به بكلمات أكثر تحديدًا، أو تصفح
          المواضيع مباشرة.
        </div>
      )}
    </div>
  );
}
