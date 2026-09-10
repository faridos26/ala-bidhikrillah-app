"use client";

import { useState, useEffect, useRef } from "react";

export function ReadPageButton({ textToRead }: { textToRead: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // إيقاف القراءة عند تغيير النص
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      }
    };
  }, [textToRead]);

  function toggleReading() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    if (!textToRead.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;
    utterance.pitch = 0.95;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith("ar"));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  if (!supported) return null;

  return (
    <button
      onClick={toggleReading}
      className={`fixed bottom-6 left-6 z-50 grid h-14 w-14 place-items-center rounded-full shadow-lg transition-all hover:scale-110 ${
        speaking
          ? "bg-gradient-to-br from-red-500 to-red-600 text-white animate-pulse"
          : "bg-gradient-to-br from-gold to-gold-dark text-white"
      }`}
      aria-label={speaking ? "إيقاف القراءة" : "اقرأ لي الصفحة"}
      title={speaking ? "إيقاف القراءة" : "اقرأ لي الصفحة"}
    >
      {speaking ? (
        <span className="text-2xl">⏹</span>
      ) : (
        <span className="text-2xl">🔊</span>
      )}
    </button>
  );
}