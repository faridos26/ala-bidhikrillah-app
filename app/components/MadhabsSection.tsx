"use client";

import { useState } from "react";
import madhabsData from "../../data/madhabs.json";
import { SpeechButton } from "./SpeechButton";

type Madhab = {
  id: string;
  name: string;
  founder: string;
  founder_years: string;
  icon: string;
  color: string;
  origin: string;
  era: string;
  meaning: string;
  founder_bio: string;
  methodology: string[];
  methodology_notes: string;
  features: string[];
  spread: string;
  famous_books: string[];
  students: string[];
  note: string;
};

const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100" },
};

export function MadhabsSection() {
  const [selectedMadhab, setSelectedMadhab] = useState<Madhab | null>(null);

  const intro = madhabsData.introduction;
  const madhabs = madhabsData.madhabs as Madhab[];
  const conclusion = madhabsData.conclusion;

  if (selectedMadhab) {
    const colors = colorClasses[selectedMadhab.color] || colorClasses.emerald;
    return (
      <div className="animate-rise mt-6 space-y-5">
        <button
          onClick={() => setSelectedMadhab(null)}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-gold"
        >
          ← رجوع للمذاهب
        </button>

        {/* العنوان */}
        <div className={`rounded-3xl border-2 ${colors.border} ${colors.bg} p-6`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{selectedMadhab.icon}</span>
            <div>
              <h1 className={`text-2xl font-extrabold ${colors.text}`}>{selectedMadhab.name}</h1>
              <p className="mt-1 text-sm font-bold text-ink">{selectedMadhab.founder}</p>
              <p className="text-xs text-muted">{selectedMadhab.founder_years}</p>
            </div>
          </div>
        </div>

        {/* معلومات أساسية */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-lg">📍</p>
            <p className="mt-1 text-xs text-muted">النشأة</p>
            <p className="mt-1 text-sm font-bold">{selectedMadhab.origin}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-lg">📅</p>
            <p className="mt-1 text-xs text-muted">العصر</p>
            <p className="mt-1 text-sm font-bold">{selectedMadhab.era}</p>
          </div>
        </div>

        {/* التعريف */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className={`mb-3 text-lg font-extrabold ${colors.text}`}>📖 التعريف</h2>
          <p className="font-quran text-base leading-[2] text-ink/90">{selectedMadhab.meaning}</p>
        </div>

        {/* سيرة المؤسس */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className={`mb-3 text-lg font-extrabold ${colors.text}`}>👤 سيرة المؤسس</h2>
          <p className="font-quran text-base leading-[2] text-ink/90">{selectedMadhab.founder_bio}</p>
        </div>

        {/* أصول المذهب */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className={`mb-3 text-lg font-extrabold ${colors.text}`}>⚖️ أصول المذهب</h2>
          <div className="flex flex-wrap gap-2">
            {selectedMadhab.methodology.map((m, i) => (
              <span
                key={i}
                className={`rounded-full ${colors.badge} px-3 py-1.5 text-xs font-bold ${colors.text}`}
              >
                {m}
              </span>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-surfaceMuted/40 p-3 font-quran text-sm leading-[1.9] text-ink/80">
            {selectedMadhab.methodology_notes}
          </p>
        </div>

        {/* الخصائص */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className={`mb-3 text-lg font-extrabold ${colors.text}`}>✨ ما يميز المذهب</h2>
          <ul className="space-y-2">
            {selectedMadhab.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                <span className={`mt-1 ${colors.text}`}>❋</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* الانتشار */}
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5">
          <h2 className="mb-3 text-lg font-extrabold text-gold-dark">🌍 أين ينتشر</h2>
          <p className="font-quran text-base leading-[2] text-ink/90">{selectedMadhab.spread}</p>
        </div>

        {/* الكتب الشهيرة */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className={`mb-3 text-lg font-extrabold ${colors.text}`}>📚 من أشهر كتب المذهب</h2>
          <ul className="space-y-2">
            {selectedMadhab.famous_books.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                <span className={`mt-1 ${colors.text}`}>📗</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* أبرز طلاب المؤسس */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className={`mb-3 text-lg font-extrabold ${colors.text}`}>🎓 من أبرز طلابه</h2>
          <ul className="space-y-2">
            {selectedMadhab.students.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                <span className={`mt-1 ${colors.text}`}>✦</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ملاحظة */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
          <h2 className="mb-3 text-lg font-extrabold text-accentStrong">📝 ملاحظة</h2>
          <p className="font-quran text-base leading-[2] text-ink/90">{selectedMadhab.note}</p>
          <div className="mt-3">
            <SpeechButton text={`${selectedMadhab.name}. ${selectedMadhab.founder}. ${selectedMadhab.meaning}. ${selectedMadhab.founder_bio}`} variant="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="animate-rise mt-6 space-y-5">
      {/* العنوان */}
      <div className="gold-card rounded-3xl p-6 text-center">
        <span className="text-5xl">📚</span>
        <h1 className="gold-text mt-3 text-3xl font-extrabold">{intro.title}</h1>
        <p className="mt-1 text-sm text-muted">{intro.subtitle}</p>
        <p className="mt-4 font-quran text-base leading-[2] text-ink/90">{intro.text}</p>
      </div>

      {/* بطاقات المذاهب */}
      <div className="grid gap-3 sm:grid-cols-2">
        {madhabs.map((madhab) => {
          const colors = colorClasses[madhab.color] || colorClasses.emerald;
          return (
            <button
              key={madhab.id}
              onClick={() => setSelectedMadhab(madhab)}
              className={`group rounded-2xl border-2 ${colors.border} ${colors.bg} p-5 text-right transition-all hover:scale-[1.02] hover:shadow-soft`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-muted">مذهب</p>
                  <h3 className={`mt-1 text-xl font-extrabold ${colors.text}`}>
                    {madhab.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-ink">{madhab.founder}</p>
                  <p className="text-xs text-muted">{madhab.founder_years}</p>
                </div>
                <span className="text-5xl transition-transform group-hover:scale-110">
                  {madhab.icon}
                </span>
              </div>
              <p className="mt-3 rounded-full bg-white/60 px-3 py-1 text-[11px] font-bold text-muted inline-block">
                📍 {madhab.origin}
              </p>
            </button>
          );
        })}
      </div>

      {/* خاتمة محايدة */}
      <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
        <h2 className="mb-3 text-lg font-extrabold text-gold-dark">
          🤝 {conclusion.title}
        </h2>
        <p className="font-quran text-base leading-[2] text-ink/90">{conclusion.text}</p>
      </div>
    </section>
  );
}