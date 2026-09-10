"use client";

import { useState, useMemo } from "react";
import asmaData from "../../data/asmaAllah.json";
import { SpeechButton } from "./SpeechButton";

type AllahName = {
  order: number;
  arabic: string;
  meaning: string;
};

export function AsmaAllahSection() {
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState<AllahName | null>(null);

  const names = asmaData.names as AllahName[];
  const intro = asmaData.introduction;

  const filteredNames = useMemo(() => {
    const q = search.trim();
    if (!q) return names;
    return names.filter(
      (n) => n.arabic.includes(q) || n.meaning.includes(q)
    );
  }, [search, names]);

  // عرض الاسم المفرد
  if (selectedName) {
    return (
      <div className="animate-rise mt-6">
        <button
          onClick={() => setSelectedName(null)}
          className="mb-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-gold"
        >
          ← رجوع للأسماء
        </button>

        <div className="gold-card rounded-3xl p-8 text-center">
          <p className="text-xs font-bold text-muted">
            الاسم رقم {selectedName.order}
          </p>

          <p className="font-quran mt-6 text-5xl font-extrabold text-gold-dark leading-[1.5]">
            {selectedName.arabic}
          </p>

          <div className="mx-auto my-6 max-w-xs">
            <div className="gold-divider">
              <span>❋</span>
            </div>
          </div>

          <p className="text-xs font-bold text-accentStrong">المعنى</p>
          <p className="mt-2 font-quran text-xl leading-[2] text-ink">
            {selectedName.meaning}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <SpeechButton text={`${selectedName.arabic}. ${selectedName.meaning}`} variant="large" />
          </div>

          {/* التنقل بين الأسماء */}
          <div className="mt-6 flex justify-center gap-2">
            {selectedName.order > 1 && (
              <button
                onClick={() => setSelectedName(names[selectedName.order - 2])}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-gold"
              >
                ← السابق
              </button>
            )}
            {selectedName.order < names.length && (
              <button
                onClick={() => setSelectedName(names[selectedName.order])}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-gold"
              >
                التالي →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // عرض القائمة الرئيسية
  return (
    <section className="animate-rise mt-6 space-y-5">
      {/* العنوان */}
      <div className="gold-card rounded-3xl p-6 text-center">
        <span className="text-5xl">✨</span>
        <h1 className="gold-text mt-3 text-3xl font-extrabold">{intro.title}</h1>
        <p className="mt-1 text-sm text-muted">{intro.subtitle}</p>
        <p className="mt-4 font-quran text-base leading-[2] text-ink/90">
          {intro.text}
        </p>
      </div>

      {/* عدّاد */}
      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-3 text-center">
        <p className="text-xs text-muted">
          {filteredNames.length === names.length
            ? `العدد الإجمالي: ${names.length} اسمًا`
            : `النتائج: ${filteredNames.length} من ${names.length}`}
        </p>
      </div>

      {/* بحث */}
      <div className="rounded-2xl border border-border bg-surface p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ابحث في الأسماء أو المعاني..."
          className="w-full rounded-xl border border-border bg-surfaceMuted/40 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-gold focus:ring-4 focus:ring-gold/10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="mt-2 text-xs text-muted underline"
          >
            مسح البحث
          </button>
        )}
      </div>

      {/* شبكة الأسماء */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {filteredNames.map((name) => (
          <button
            key={name.order}
            onClick={() => setSelectedName(name)}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-gold hover:bg-gold/5 hover:scale-105 hover:shadow-soft"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/15 text-[11px] font-extrabold text-gold-dark">
              {name.order}
            </span>
            <span className="font-quran text-xl font-extrabold text-gold-dark transition-transform group-hover:scale-110">
              {name.arabic}
            </span>
            <span className="line-clamp-2 text-center text-[10px] leading-[1.6] text-muted">
              {name.meaning}
            </span>
          </button>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">لا توجد نتائج مطابقة لبحثك</p>
        </div>
      )}

      {/* دعاء */}
      <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5 text-center">
        <p className="font-quran text-base leading-[2] text-gold-dark">
          «وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا»
        </p>
        <p className="mt-2 text-xs text-muted">سورة الأعراف - الآية 180</p>
      </div>
    </section>
  );
}