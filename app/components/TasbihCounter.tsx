"use client";

import { useEffect, useState } from "react";
import { TASBIH_PHRASES, useTasbih } from "@/lib/useTasbih";

export function TasbihCounter() {
  const { phrase, phraseIndex, count, total, increment, reset, setPhrase } = useTasbih();
  const [pulse, setPulse] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // نبضة عند كل عد
  useEffect(() => {
    if (count > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 200);
      return () => clearTimeout(timer);
    }
  }, [count]);

  // تتبع الجلسة
  useEffect(() => {
    setSessionCount(count);
  }, [count]);

  const cycleProgress = Math.round((count / 33) * 100);
  const progressColor = count >= 33 ? "from-emerald-400 to-teal-500" : "from-amber-400 to-orange-500";
  const isComplete = count >= 33;

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-surfaceMuted/50 p-7 shadow-soft">
      {/* رأس العداد */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-ink">عداد التسبيح</h2>
          <p className="mt-1 text-xs text-muted">اضغط على الدائرة للعدّ</p>
        </div>
        <div className="rounded-full bg-accent/10 px-4 py-2 text-sm font-bold text-accentStrong">
          الإجمالي: {total}
        </div>
      </div>

      {/* اختيار الذكر */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TASBIH_PHRASES.map((p, i) => (
          <button
            key={p}
            onClick={() => setPhrase(i)}
            className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
              i === phraseIndex
                ? "border-accent bg-accent/10 text-accentStrong shadow-sm"
                : "border-border text-muted hover:border-accent/40 hover:text-ink"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* دائرة العد */}
      <div className="mt-8 flex justify-center">
        <div className="relative">
          {/* حلقة التقدم */}
          <svg className="h-52 w-52 -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-surfaceMuted"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - cycleProgress / 100)}`}
              className={`text-accent transition-all duration-300`}
            />
          </svg>

          {/* زر العد */}
          <button
            onClick={increment}
            aria-label={`عدّ تسبيحة: ${phrase}`}
            className={`absolute inset-0 m-auto grid h-44 w-44 select-none place-items-center rounded-full border-4 border-accent bg-white shadow-lg transition-all active:scale-95 ${
              pulse ? "scale-95" : ""
            }`}
          >
            <div className="text-center">
              <span className={`block text-6xl font-extrabold ${isComplete ? "text-emerald-500" : "text-accentStrong"}`}>
                {count}
              </span>
              <span className="mt-1 block text-xs font-bold text-muted">
                {isComplete ? "✓ اكتملت الدورة" : `${cycleProgress}%`}
              </span>
            </div>
          </button>

          {/* شريط التقدم اللوني */}
          <div className="absolute -bottom-2 left-1/2 h-2 w-32 -translate-x-1/2 overflow-hidden rounded-full bg-surfaceMuted">
            <div
              className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-300`}
              style={{ width: `${cycleProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* الذكر الحالي */}
      <p className="font-quran mt-6 text-center text-xl font-bold text-ink">{phrase}</p>

      {/* نقاط التقدم */}
      <div className="mx-auto mt-4 flex max-w-[300px] flex-wrap justify-center gap-1">
        {Array.from({ length: 33 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              i < count ? "bg-accent scale-100" : "bg-surfaceMuted scale-75"
            }`}
          />
        ))}
      </div>

      {/* إحصائيات الجلسة */}
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-surface p-3">
          <p className="text-2xl font-extrabold text-accentStrong">{count}</p>
          <p className="text-xs text-muted">الدورة الحالية</p>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <p className="text-2xl font-extrabold text-accentStrong">{total}</p>
          <p className="text-xs text-muted">الإجمالي</p>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <p className="text-2xl font-extrabold text-accentStrong">
            {Math.floor(total / 33)}
          </p>
          <p className="text-xs text-muted">دورات مكتملة</p>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="mt-5 flex justify-center gap-2">
        <button
          onClick={reset}
          className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-bold text-muted transition-colors hover:border-accent hover:text-accentStrong"
        >
          ↺ إعادة التعيين
        </button>
        {isComplete && (
          <button
            onClick={reset}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105"
          >
            ✨ ابدأ دورة جديدة
          </button>
        )}
      </div>

      {/* رسالة عند الاكتمال */}
      {isComplete && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm font-bold text-emerald-600">
            🎉 ما شاء الله! أكملت {phrase} 33 مرة
          </p>
        </div>
      )}
    </section>
  );
}