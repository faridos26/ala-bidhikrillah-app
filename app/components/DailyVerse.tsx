import type { Category, Content } from "@/lib/sakina";
import { AudioPlayer } from "./AudioPlayer";
import { surahNameFromReference } from "@/lib/audio";

export function DailyVerse({
  category,
  content,
  favorite,
  onFavorite,
}: {
  category: Category;
  content: Content;
  favorite: boolean;
  onFavorite: () => void;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-border bg-surface p-7 shadow-soft">
      <div className="flex items-center justify-between font-extrabold text-accentStrong">
        <span>لحظة اليوم</span>
        <span aria-hidden="true">🌿</span>
      </div>
      <p className="mt-5 text-xs font-extrabold text-accent">{category.name_ar}</p>
      <blockquote className="font-quran my-3 text-xl leading-[2.05]">﴿{content.text_ar}﴾</blockquote>
      <p className="text-xs text-muted">{content.reference}</p>
      {content.type === "QURAN" && typeof content.surah_number === "number" && (
        <AudioPlayer
          surahNumber={content.surah_number}
          surahLabel={surahNameFromReference(content.reference)}
        />
      )}
      <button
        onClick={onFavorite}
        className="mt-4 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-accentStrong transition-colors hover:border-accent"
      >
        {favorite ? "♥ محفوظة" : "♡ حفظ لحظتي"}
      </button>
    </section>
  );
}
