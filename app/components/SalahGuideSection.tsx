"use client";

import { useState } from "react";
import salahData from "../../data/salahGuide.json";
import { SpeechButton } from "./SpeechButton";

export function SalahGuideSection() {
  const [activeTab, setActiveTab] = useState<"pillars" | "dhikr" | "dua_tashahud" | "dhikr_salam" | "dua_adhan" | "nawafil">("pillars");

  const data = salahData;

  return (
    <section className="animate-rise mt-6 space-y-5">
      {/* العنوان */}
      <div className="gold-card rounded-3xl p-6 text-center">
        <span className="text-5xl">🕌</span>
        <h1 className="gold-text mt-3 text-3xl font-extrabold">{data.title}</h1>
        <p className="mt-1 text-sm text-muted">{data.title_en}</p>
        <p className="mt-4 font-quran text-lg leading-[2] text-gold-dark">
          ﴿{data.verse.text_ar}﴾
        </p>
        <p className="mt-1 text-xs text-muted">{data.verse.reference}</p>
        <div className="mt-4">
          <SpeechButton text={`${data.verse.text_ar}. ${data.verse.reference}`} />
        </div>
      </div>

      {/* التبويبات */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          onClick={() => setActiveTab("pillars")}
          className={`rounded-xl border px-3 py-3 text-xs font-bold transition-all ${
            activeTab === "pillars"
              ? "border-gold bg-gold/15 text-gold-dark shadow-sm"
              : "border-border bg-surface text-muted hover:border-gold/40 hover:text-ink"
          }`}
        >
          📖 أركان الصلاة
        </button>
        <button
          onClick={() => setActiveTab("dhikr")}
          className={`rounded-xl border px-3 py-3 text-xs font-bold transition-all ${
            activeTab === "dhikr"
              ? "border-gold bg-gold/15 text-gold-dark shadow-sm"
              : "border-border bg-surface text-muted hover:border-gold/40 hover:text-ink"
          }`}
        >
          🤲 أذكار الصلاة
        </button>
        <button
          onClick={() => setActiveTab("dua_tashahud")}
          className={`rounded-xl border px-3 py-3 text-xs font-bold transition-all ${
            activeTab === "dua_tashahud"
              ? "border-gold bg-gold/15 text-gold-dark shadow-sm"
              : "border-border bg-surface text-muted hover:border-gold/40 hover:text-ink"
          }`}
        >
          🌙 بعد التشهد
        </button>
        <button
          onClick={() => setActiveTab("dhikr_salam")}
          className={`rounded-xl border px-3 py-3 text-xs font-bold transition-all ${
            activeTab === "dhikr_salam"
              ? "border-gold bg-gold/15 text-gold-dark shadow-sm"
              : "border-border bg-surface text-muted hover:border-gold/40 hover:text-ink"
          }`}
        >
          ✨ بعد السلام
        </button>
        <button
          onClick={() => setActiveTab("dua_adhan")}
          className={`rounded-xl border px-3 py-3 text-xs font-bold transition-all ${
            activeTab === "dua_adhan"
              ? "border-gold bg-gold/15 text-gold-dark shadow-sm"
              : "border-border bg-surface text-muted hover:border-gold/40 hover:text-ink"
          }`}
        >
          🕌 بين الأذان والإقامة
        </button>
        <button
          onClick={() => setActiveTab("nawafil")}
          className={`rounded-xl border px-3 py-3 text-xs font-bold transition-all ${
            activeTab === "nawafil"
              ? "border-gold bg-gold/15 text-gold-dark shadow-sm"
              : "border-border bg-surface text-muted hover:border-gold/40 hover:text-ink"
          }`}
        >
          ⭐ السنن والنوافل
        </button>
      </div>

      {/* المحتوى حسب التبويب */}

      {/* 1. أركان الصلاة */}
      {activeTab === "pillars" && (
        <div className="space-y-2">
          <h2 className="gold-text text-xl font-extrabold">📖 {data.pillars.title}</h2>
          {data.pillars.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/15 text-sm font-extrabold text-gold-dark">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-ink">{item.name}</p>
                  <p className="mt-1 text-sm leading-[1.8] text-muted">{item.description}</p>
                </div>
                <SpeechButton text={`${item.name}. ${item.description}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. أذكار الصلاة */}
      {activeTab === "dhikr" && (
        <div className="space-y-4">
          <h2 className="gold-text text-xl font-extrabold">🤲 {data.dhikr_in_prayer.title}</h2>
          {data.dhikr_in_prayer.items.map((section, i) => (
            <div key={i} className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
              <h3 className="mb-3 text-base font-extrabold text-gold-dark">
                {section.name}
              </h3>
              <div className="space-y-3">
                {section.phrases.map((phrase, j) => (
                  <div key={j} className="rounded-xl border border-border bg-surface p-3">
                    <p className="font-quran text-lg leading-[2] text-ink">
                      {phrase.arabic}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <SpeechButton text={phrase.arabic} />
                      {phrase.repeat && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-dark">
                          × {phrase.repeat}
                        </span>
                      )}
                      {phrase.note && (
                        <span className="text-[11px] text-muted">{phrase.note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. الدعاء بعد التشهد */}
      {activeTab === "dua_tashahud" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
            <h2 className="gold-text text-xl font-extrabold">🌙 {data.dua_after_tashahud.title}</h2>
            <p className="mt-3 rounded-lg bg-gold/5 p-3 font-quran text-sm leading-[1.9] text-gold-dark">
              {data.dua_after_tashahud.hadith}
            </p>
          </div>
          {data.dua_after_tashahud.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <p className="font-quran text-base leading-[2] text-ink">
                {item.arabic}
              </p>
              {item.translation && (
                <p className="mt-2 text-xs leading-[1.7] text-muted">
                  💬 {item.translation}
                </p>
              )}
              {item.source && (
                <p className="mt-1 text-[11px] text-gold-dark">
                  📚 {item.source}
                </p>
              )}
              <div className="mt-3">
                <SpeechButton text={item.arabic} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. أذكار بعد السلام */}
      {activeTab === "dhikr_salam" && (
        <div className="space-y-3">
          <h2 className="gold-text text-xl font-extrabold">✨ {data.dhikr_after_salam.title}</h2>
          {data.dhikr_after_salam.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-4"
            >
              <p className="font-quran text-lg leading-[2] text-ink">
                {item.arabic}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <SpeechButton text={item.arabic} />
                {item.repeat && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-dark">
                    × {item.repeat}
                  </span>
                )}
                {item.note && (
                  <span className="text-[11px] text-muted">{item.note}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. الدعاء بين الأذان والإقامة */}
      {activeTab === "dua_adhan" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
            <h2 className="gold-text text-xl font-extrabold">🕌 {data.dua_between_adhan_iqama.title}</h2>
            <p className="mt-3 rounded-lg bg-gold/5 p-3 font-quran text-sm leading-[1.9] text-gold-dark">
              {data.dua_between_adhan_iqama.hadith}
            </p>
            <p className="mt-2 text-[11px] text-muted">
              📚 {data.dua_between_adhan_iqama.source}
            </p>
          </div>
          {data.dua_between_adhan_iqama.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <p className="font-quran text-base leading-[2] text-ink">
                {item.arabic}
              </p>
              <div className="mt-3">
                <SpeechButton text={item.arabic} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. السنن والنوافل */}
      {activeTab === "nawafil" && (
        <div className="space-y-3">
          <h2 className="gold-text text-xl font-extrabold">⭐ {data.sunan_nawafil.title}</h2>
          {data.sunan_nawafil.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-lg">
                  ⭐
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-gold-dark">{item.name}</p>
                  <p className="mt-2 font-quran text-sm leading-[1.9] text-ink/80">
                    {item.details}
                  </p>
                  <div className="mt-2">
                    <SpeechButton text={`${item.name}. ${item.details}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}