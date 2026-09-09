"use client";

import { useState, useRef, useEffect } from "react";
import shahadaData from "../../data/shahada.json";

type ShahadaWord = {
  arabic: string;
  transliteration: string;
  meaning: string;
};

export function ShahadaSection() {
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [speed, setSpeed] = useState(0.8);
  const [showTranslation, setShowTranslation] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const words = shahadaData.shahada.words as ShahadaWord[];

  function stopSpeaking() {
    if (timerRef.current) clearTimeout(timerRef.current);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setActiveWordIndex(null);
  }

  function speakFullShahada() {
    stopSpeaking();
    const text = shahadaData.shahada.arabic_full;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = speed;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith("ar"));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setActiveWordIndex(null);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setActiveWordIndex(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    // محاكاة الكراوكي
    const wordDurations = [1500, 1200, 1000, 1500, 1200, 1000];
    let currentIndex = 0;
    wordDurations.forEach((duration, i) => {
      timerRef.current = setTimeout(() => {
        setActiveWordIndex(i);
        currentIndex = i;
      }, wordDurations.slice(0, i).reduce((a, b) => a + b, 0));
    });

    const totalDuration = wordDurations.reduce((a, b) => a + b, 0);
    timerRef.current = setTimeout(() => {
      setActiveWordIndex(null);
    }, totalDuration);
  }

  function speakWord(index: number) {
    stopSpeaking();
    const text = words[index].arabic;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = speed;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith("ar"));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onstart = () => {
      setSpeaking(true);
      setActiveWordIndex(index);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setActiveWordIndex(null);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setActiveWordIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-accent/5 p-7 shadow-soft">
      <div className="text-center">
        <span className="text-5xl">🕌</span>
        <h2 className="mt-3 text-2xl font-extrabold text-ink">نطق الشهادة</h2>
        <p className="mt-1 text-sm text-muted">
          The Shahada - Declaration of Faith
        </p>
      </div>

      {/* النص الكامل مع الترجمة */}
      <div className="mt-6 rounded-2xl bg-white/70 p-6 text-center backdrop-blur">
        <p className="font-quran text-3xl font-bold leading-[2] text-ink">
          {shahadaData.shahada.arabic_full}
        </p>
        <p className="mt-3 text-sm font-medium text-accentStrong">
          {shahadaData.shahada.transliteration}
        </p>
        {showTranslation && (
          <div className="mt-3 border-t border-border/50 pt-3">
            <p className="text-sm text-ink/80">{shahadaData.shahada.english_translation}</p>
            <p className="mt-1 text-xs text-muted">{shahadaData.shahada.french_translation}</p>
          </div>
        )}
      </div>

      {/* أزرار التحكم */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          onClick={speakFullShahada}
          className={`rounded-xl px-6 py-3 text-sm font-bold transition-all ${
            speaking
              ? "bg-red-500 text-white shadow-soft"
              : "bg-accent text-white shadow-soft hover:scale-105"
          }`}
        >
          {speaking ? "⏹ إيقاف" : "🔊 استماع للشهادة كاملة"}
        </button>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold text-accentStrong hover:border-accent"
        >
          {showTranslation ? "إخفاء الترجمة" : "إظهار الترجمة"}
        </button>
      </div>

      {/* التحكم في السرعة */}
      <div className="mx-auto mt-4 max-w-xs">
        <label className="block text-center text-xs font-bold text-muted">
          سرعة النطق: {speed}x
        </label>
        <input
          type="range"
          min="0.4"
          max="1.2"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="mt-2 w-full accent-accent"
        />
      </div>

      {/* الكلمات المنفصلة - الكراوكي */}
      <div className="mt-6">
        <h3 className="text-center text-sm font-bold text-muted">
          اضغط على كل كلمة لسماعها منفردة
        </h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {words.map((word, i) => (
            <button
              key={i}
              onClick={() => speakWord(i)}
              className={`rounded-xl border p-4 text-right transition-all ${
                activeWordIndex === i
                  ? "border-accent bg-accent/15 shadow-soft scale-105"
                  : "border-border bg-surface hover:border-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-quran text-xl font-bold text-ink">{word.arabic}</span>
                {activeWordIndex === i && <span className="text-accent">🔊</span>}
              </div>
              <p className="mt-1 text-xs font-medium text-accentStrong">{word.transliteration}</p>
              <p className="mt-1 text-[11px] text-muted">{word.meaning}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ملاحظة */}
      <p className="mt-5 text-center text-xs text-muted">
        {shahadaData.shahada.note}
      </p>
    </section>
  );
}