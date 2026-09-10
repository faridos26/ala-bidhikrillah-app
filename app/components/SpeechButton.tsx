"use client";

import { useState, useEffect } from "react";

export function SpeechButton({ text, label, variant = "default" }: { text: string; label?: string; variant?: "default" | "large" }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.75; // أبطأ قليلاً للخشوع
    utterance.pitch = 0.85; // نبرة أعمق وأكثر خشوعاً
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    // البحث عن صوت عربي رجالي
    const arabicVoices = voices.filter((v) => v.lang.startsWith("ar"));
    const maleVoice = arabicVoices.find(
      (v) =>
        v.name.toLowerCase().includes("majed") ||
        v.name.toLowerCase().includes("maged") ||
        v.name.toLowerCase().includes("m Male") ||
        v.name.toLowerCase().includes("male") ||
        v.name.includes("Maged") ||
        v.name.includes("Naayf")
    );
    const arabicVoice = maleVoice || arabicVoices[0];
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (!supported) {
    return (
      <span className="text-[10px] text-muted">
        الاستماع غير مدعوم في هذا المتصفح
      </span>
    );
  }

  const sizeClasses =
    variant === "large"
      ? "px-5 py-3 text-sm"
      : "px-3 py-1.5 text-xs";

  return (
    <button
      onClick={speaking ? stop : speak}
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
  );
}