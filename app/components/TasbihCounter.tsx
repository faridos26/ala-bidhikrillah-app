"use client";

import { TASBIH_PHRASES, useTasbih } from "@/lib/useTasbih";

export function TasbihCounter() {
  const { phrase, phraseIndex, count, total, increment, reset, setPhrase } = useTasbih();

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-7">
      <div className="flex items-center justify-between font-extrabold text-accentStrong">
        <div>
          <span>عداد التسبيح</span>
          <small className="mt-1 block text-xs font-normal text-muted">اضغط للعدّ، يدور كل 33</small>
        </div>
        <span className="text-xs font-normal text-muted">الإجمالي: {total}</span>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-1.5">
        {TASBIH_PHRASES.map((p, i) => (
          <button
            key={p}
            onClick={() => setPhrase(i)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              i === phraseIndex
                ? "border-accent bg-surfaceMuted text-accentStrong"
                : "border-border text-muted hover:text-ink"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={increment}
        aria-label={`عدّ تسبيحة: ${phrase}`}
        className="font-quran mx-auto mt-7 grid h-40 w-40 select-none place-items-center rounded-full border-4 border-accent bg-surfaceMuted/50 text-3xl font-bold text-accentStrong shadow-soft transition-transform active:scale-95"
      >
        {count}
      </button>

      <p className="font-quran mt-4 text-center text-lg text-ink">{phrase}</p>

      <div className="mx-auto mt-4 flex max-w-[280px] flex-wrap justify-center gap-1">
        {Array.from({ length: 33 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i < count ? "bg-accent" : "bg-surfaceMuted"}`}
          />
        ))}
      </div>

      <div className="mt-5 text-center">
        <button
          onClick={reset}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-accent hover:text-accentStrong"
        >
          إعادة تعيين هذه الدورة
        </button>
      </div>
    </section>
  );
}
