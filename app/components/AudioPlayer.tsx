"use client";

import { useEffect, useRef, useState } from "react";
import { RECITERS, surahAudioUrl } from "@/lib/audio";
import { readJSON, writeJSON } from "@/lib/storage";

const RECITER_KEY = "sakina-reciter";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "٠:٠٠";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function AudioPlayer({ surahNumber, surahLabel }: { surahNumber: number; surahLabel: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setReciterId(readJSON(RECITER_KEY, RECITERS[0].id));
  }, []);

  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
  const src = surahAudioUrl(reciter, surahNumber);

  function toggle() {
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

  function changeReciter(id: string) {
    const wasPlaying = playing;
    audioRef.current?.pause();
    setPlaying(false);
    setReciterId(id);
    writeJSON(RECITER_KEY, id);
    if (wasPlaying) {
      // Give the <audio> element a tick to pick up the new src (key change) before resuming.
      setTimeout(() => {
        setLoading(true);
        audioRef.current?.play().catch(() => {
          setError(true);
          setLoading(false);
        });
      }, 60);
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface p-3.5">
      <audio
        key={src}
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => {
          setError(true);
          setLoading(false);
          setPlaying(false);
        }}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={playing ? "إيقاف الاستماع" : `استماع لسورة ${surahLabel}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white transition-colors hover:bg-accentStrong"
        >
          {loading ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          ) : playing ? (
            <span aria-hidden="true">❚❚</span>
          ) : (
            <span aria-hidden="true">▶</span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>استماع لسورة {surahLabel} كاملة</span>
            <span>
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surfaceMuted">
            <div
              className="h-full bg-accent transition-[width]"
              style={{ width: duration ? `${Math.min(100, (progress / duration) * 100)}%` : "0%" }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <label className="text-[11px] text-muted" htmlFor={`reciter-${surahNumber}-${surahLabel}`}>
          القارئ
        </label>
        <select
          id={`reciter-${surahNumber}-${surahLabel}`}
          value={reciterId}
          onChange={(e) => changeReciter(e.target.value)}
          className="rounded-lg border border-border bg-surfaceMuted/40 px-2 py-1.5 text-xs text-ink"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-2 text-[11px] text-danger">
          تعذر تحميل الصوت الآن. تحقق من الاتصال بالإنترنت أو جرّب قارئاً آخر.
        </p>
      )}
      <p className="mt-2 text-[10px] leading-relaxed text-muted/80">
        تلاوة للسورة كاملة من مصدر موثوق (mp3quran.net)، وقد لا تبدأ عند هذه الآية بالتحديد.
      </p>
    </div>
  );
}
