"use client";

import { useState, useRef, useEffect } from "react";
import adhanData from "../../data/adhan.json";
import { SpeechButton } from "./SpeechButton";

type AdhanPhrase = {
  arabic: string;
  transliteration: string;
  meaning: string;
  repeat: number;
};

type AdhanAudio = {
  name: string;
  url: string;
};

export function AdhanSection() {
  const [activePhrase, setActivePhrase] = useState<number | null>(null);
  const [selectedMuadhin, setSelectedMuadhin] = useState<string>("makkah");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const adhan = adhanData.adhan;
  const phrases = adhan.phrases as AdhanPhrase[];
  const audioSources = adhan.adhan_audio as Record<string, AdhanAudio>;
  const currentAudio = audioSources[selectedMuadhin];

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function toggleAdhan() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    setLoading(true);
    setError(false);
    audio.play().catch(() => {
      setError(true);
      setLoading(false);
    });
  }

  function changeMuadhin(id: string) {
    const wasPlaying = playing;
    audioRef.current?.pause();
    setPlaying(false);
    setSelectedMuadhin(id);
    if (wasPlaying) {
      setTimeout(() => {
        setLoading(true);
        audioRef.current?.play().catch(() => {
          setError(true);
          setLoading(false);
        });
      }, 100);
    }
  }

  return (
    <section className="animate-rise mt-6 space-y-5">
      {/* العنوان */}
      <div className="gold-card rounded-3xl p-6 text-center">
        <span className="text-5xl">🕌</span>
        <h1 className="gold-text mt-3 text-3xl font-extrabold">{adhan.title}</h1>
        <p className="mt-1 text-sm text-muted">{adhan.title_en}</p>
        <p className="mt-3 font-quran text-base leading-[2] text-ink/90">
          {adhan.introduction}
        </p>
      </div>

      {/* مشغل الأذان */}
      <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
        <h2 className="mb-4 text-lg font-extrabold text-gold-dark">🎧 استماع الأذان</h2>

        <audio
          key={currentAudio.url}
          ref={audioRef}
          src={currentAudio.url}
          preload="none"
          onPlay={() => {
            setPlaying(true);
            setLoading(false);
          }}
          onPause={() => setPlaying(false)}
          onWaiting={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
            setPlaying(false);
          }}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAdhan}
            aria-label={playing ? "إيقاف الأذان" : "تشغيل الأذان"}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-2xl text-white shadow-soft transition-transform hover:scale-105"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : playing ? (
              <span>❚❚</span>
            ) : (
              <span>▶</span>
            )}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gold-dark">
              {playing ? "الأذان قيد التشغيل..." : "اضغط للاستماع للأذان"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {currentAudio.name}
            </p>
          </div>
        </div>

        {/* اختيار المؤذن */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(audioSources).map(([id, audio]) => (
            <button
              key={id}
              onClick={() => changeMuadhin(id)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                id === selectedMuadhin
                  ? "border-gold bg-gold/15 text-gold-dark shadow-sm"
                  : "border-border text-muted hover:border-gold/40 hover:text-ink"
              }`}
            >
              {audio.name}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-[11px] text-danger">
            تعذر تحميل الأذان. تحقق من الاتصال بالإنترنت أو جرّب مؤذنًا آخر.
          </p>
        )}
      </div>

      {/* نص الأذان */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 text-lg font-extrabold text-gold-dark">📜 نص الأذان ومعانيه</h2>
        <div className="space-y-2">
          {phrases.map((phrase, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-surfaceMuted/30 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-quran text-xl font-bold leading-[2] text-ink">
                    {phrase.arabic}
                  </p>
                  <p className="mt-1 text-xs font-medium text-accentStrong">
                    {phrase.transliteration}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    المعنى: {phrase.meaning}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <SpeechButton text={phrase.arabic} />
                  {phrase.repeat > 1 && (
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold-dark">
                      ×{phrase.repeat}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* الدعاء بعد الأذان */}
      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5">
        <h2 className="mb-3 text-lg font-extrabold text-gold-dark">🤲 الدعاء بعد الأذان</h2>
        <p className="font-quran text-lg leading-[2] text-ink">{adhan.after_adhan.dua_ar}</p>
        <div className="mt-3 flex items-center gap-2">
          <SpeechButton text={adhan.after_adhan.dua_ar} />
          <span className="text-xs text-muted">
            {adhan.after_adhan.source} · {adhan.after_adhan.reference}
          </span>
        </div>
      </div>

      {/* السنن */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-lg font-extrabold text-accentStrong">✨ من السنن عند الأذان</h2>
        <ul className="space-y-2">
          {adhan.sunnah.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
              <span className="mt-1 text-gold">❋</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* الآداب */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-lg font-extrabold text-accentStrong">📖 آداب الأذان والإقامة</h2>
        <ul className="space-y-2">
          {adhan.etiquette.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
              <span className="mt-1 text-gold">❋</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}