"use client";

import moodData from "../../data/moodEmojis.json";

type Mood = {
  emoji: string;
  label_ar: string;
  label_en: string;
  category_code: string;
  color: string;
};

export function MoodPicker({ onSelect }: { onSelect: (categoryCode: string, label: string) => void }) {
  const moods = moodData.moods as Mood[];

  return (
    <div className="mt-6 rounded-3xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
      <div className="text-center">
        <h2 className="gold-text text-xl font-extrabold">كيف تشعر الآن؟</h2>
        <p className="mt-1 text-xs text-muted">اضغط على الوجه الأقرب لحالتك</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-8">
        {moods.map((mood) => (
          <button
            key={mood.category_code}
            onClick={() => onSelect(mood.category_code, mood.label_ar)}
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-surface p-3 transition-all hover:border-gold hover:bg-gold/10 hover:scale-105 hover:shadow-soft active:scale-95"
            aria-label={`${mood.label_ar} - ${mood.label_en}`}
          >
            <span className="text-4xl transition-transform group-hover:scale-110" role="img" aria-hidden="true">
              {mood.emoji}
            </span>
            <span className="text-[10px] font-bold text-ink">{mood.label_ar}</span>
            <span className="text-[9px] text-muted opacity-70">{mood.label_en}</span>
          </button>
        ))}
      </div>
    </div>
  );
}