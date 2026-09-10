"use client";

import { useState, useEffect, useRef } from "react";

export function SpeechButton({
  text,
  label,
  variant = "default",
}: {
  text: string;
  label?: string;
  variant?: "default" | "large";
}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    // تحميل الأصوات (بعض المتصفحات تحتاج وقت لتحميلها)
    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
      }
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function getBestArabicVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(
      (v) => v.lang.startsWith("ar") || v.lang.includes("AR") || v.lang.includes("ar-")
    );

    if (arabicVoices.length === 0) return null;

    // نفضّل الأصوات الرجالية العربية
    const preferred =
      arabicVoices.find(
        (v) =>
          v.name.toLowerCase().includes("maged") ||
          v.name.toLowerCase().includes("naayf") ||
          v.name.toLowerCase().includes("majed") ||
          v.name.toLowerCase().includes("hoda") === false && v.name.toLowerCase().includes("male")
      ) || arabicVoices[0];

    return preferred;
  }

  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // إيقاف أي نطق سابق
    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    setError(null);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    utterance.volume = 1;

    const voice = getBestArabicVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (e) => {
      setSpeaking(false);
      if (e.error !== "canceled" && e.error !== "interrupted") {
        setError("تعذر النطق. جرّب متصفح Chrome أو Edge.");
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
      // بعض المتصفحات تحتاج هذا التحقق بعد لحظة
      setTimeout(() => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          setSpeaking(false);
        }
      }, 500);
    } catch {
      setError("تعذر النطق في هذا المتصفح");
      setSpeaking(false);
    }
  }

  if (!supported) {
    return (
      <span className="text-[10px] text-muted">
        الاستماع غير مدعوم في هذا المتصفح
      </span>
    );
  }

  const sizeClasses =
    variant === "large" ? "px-5 py-3 text-sm" : "px-3 py-1.5 text-xs";

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={speaking ? speak : speak}
        className={`inline-flex items-center gap-1.5 rounded-full border font-bold transition-all ${sizeClasses} ${
          speaking
            ? "border-accent bg-accent text-white shadow-soft scale-105"
            : "border-accent/40 bg-accent/5 text-accentStrong hover:border-accent hover:bg-accent/10"
        }`}
        title={speaking ? "إيقاف الاستماع" : "استماع بصوت خاشع"}
        aria-label={speaking ? "إيقاف الاستماع" : "استماع للنص"}
      >
        {speaking ? (
          <>
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-white" />
            إيقاف
          </>
        ) : (
          <>
            🔊 استماع
            {label && <span className="font-normal opacity-80">{label}</span>}
          </>
        )}
      </button>
      {error && <span className="text-[10px] text-danger">{error}</span>}
    </div>
  );
}