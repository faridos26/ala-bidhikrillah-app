"use client";

import { useState } from "react";
import mosquesData from "../../data/mosques.json";

type Mosque = {
  id: string;
  name_ar: string;
  name_en: string;
  city: string;
  country: string;
  year_built: string;
  style: string;
  capacity: string;
  description: string;
  image: string;
  icon: string;
  pattern: string;
};

// أنماط هندسية إسلامية مختلفة لكل مسجد
const patterns: Record<string, { bg: string; gradient: string; border: string }> = {
  pattern_makkah: { bg: "#1a0f0a", gradient: "from-[#3d2417] to-[#1a0f0a]", border: "#c9a13b" },
  pattern_madinah: { bg: "#0a1f14", gradient: "from-[#1a3d2a] to-[#0a1f14]", border: "#4ade80" },
  pattern_quds: { bg: "#1a1410", gradient: "from-[#3d3020] to-[#1a1410]", border: "#c9a13b" },
  pattern_qayrawan: { bg: "#141d14", gradient: "from-[#2a3d2a] to-[#141d14]", border: "#a3c9a3" },
  pattern_zitouna: { bg: "#101a14", gradient: "from-[#1a3d2a] to-[#101a14]", border: "#8bc9a3" },
  pattern_blue: { bg: "#0a1420", gradient: "from-[#1a2a4a] to-[#0a1420]", border: "#60a5fa" },
  pattern_hagia: { bg: "#141014", gradient: "from-[#3d1a3d] to-[#141014]", border: "#c084fc" },
  pattern_cordoba: { bg: "#1a0f0a", gradient: "from-[#4a2a1a] to-[#1a0f0a]", border: "#f59e0b" },
  pattern_faisal: { bg: "#0a1a14", gradient: "from-[#1a3d2a] to-[#0a1a14]", border: "#34d399" },
  pattern_zayed: { bg: "#0a141a", gradient: "from-[#1a3a5a] to-[#0a141a]", border: "#60a5fa" },
  pattern_hassan: { bg: "#0a1a1a", gradient: "from-[#1a4a4a] to-[#0a1a1a]", border: "#2dd4bf" },
  pattern_suleymaniye: { bg: "#141410", gradient: "from-[#3d3d1a] to-[#141410]", border: "#eab308" },
};

export function MosquesSection() {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  const mosques = mosquesData.mosques as Mosque[];

  function PatternDisplay({ mosque, large = false }: { mosque: Mosque; large?: boolean }) {
    const pattern = patterns[mosque.pattern] || patterns.pattern_makkah;
    return (
      <div
        className={`relative grid place-items-center overflow-hidden ${large ? "h-64" : "h-40"}`}
        style={{
          background: `linear-gradient(135deg, ${pattern.bg}, ${pattern.gradient})`,
          borderBottom: `3px solid ${pattern.border}`,
        }}
      >
        {/* زخرفة هندسية */}
        <svg
          viewBox="0 0 200 200"
          className={`absolute inset-0 h-full w-full opacity-20 ${large ? "h-64" : "h-40"}`}
        >
          <defs>
            <pattern id={`grid-${mosque.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={pattern.border} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill={`url(#grid-${mosque.id})`} />
          <path
            d="M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z"
            fill="none"
            stroke={pattern.border}
            strokeWidth="1.5"
          />
          <path
            d="M100 40 L115 85 L160 100 L115 115 L100 160 L85 115 L40 100 L85 85 Z"
            fill="none"
            stroke={pattern.border}
            strokeWidth="1"
            opacity="0.7"
          />
          <circle cx="100" cy="100" r="20" fill="none" stroke={pattern.border} strokeWidth="0.8" />
        </svg>

        {/* الأيقونة */}
        <span className={`relative z-10 ${large ? "text-8xl" : "text-6xl"} drop-shadow-lg`}>
          {mosque.icon}
        </span>

        {/* اسم المسجد */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center">
          <h3 className={`font-extrabold text-white ${large ? "text-2xl" : "text-lg"}`}>
            {mosque.name_ar}
          </h3>
          {large && <p className="text-sm text-white/80">{mosque.name_en}</p>}
        </div>
      </div>
    );
  }

  if (selectedMosque) {
    return (
      <div className="animate-rise">
        <button
          onClick={() => setSelectedMosque(null)}
          className="mb-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-accent"
        >
          ← رجوع للمساجد
        </button>

        <article className="overflow-hidden rounded-2xl border border-border bg-surfaceMuted/40">
          <PatternDisplay mosque={selectedMosque} large />

          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-surface p-3 text-center">
                <p className="text-lg font-extrabold text-accentStrong">📍</p>
                <p className="mt-1 text-xs text-muted">الموقع</p>
                <p className="mt-1 text-sm font-bold">{selectedMosque.city}</p>
                <p className="text-xs text-muted">{selectedMosque.country}</p>
              </div>
              <div className="rounded-xl bg-surface p-3 text-center">
                <p className="text-lg font-extrabold text-accentStrong">📅</p>
                <p className="mt-1 text-xs text-muted">البنيان</p>
                <p className="mt-1 text-sm font-bold">{selectedMosque.year_built}</p>
              </div>
              <div className="rounded-xl bg-surface p-3 text-center">
                <p className="text-lg font-extrabold text-accentStrong">👥</p>
                <p className="mt-1 text-xs text-muted">السعة</p>
                <p className="mt-1 text-sm font-bold">{selectedMosque.capacity}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-sm font-bold text-accentStrong">🎨 الطراز المعماري</p>
              <p className="mt-1 text-sm">{selectedMosque.style}</p>
            </div>

            <p className="mt-4 font-quran text-base leading-[2] text-ink/90">
              {selectedMosque.description}
            </p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mosques.map((mosque) => (
        <button
          key={mosque.id}
          onClick={() => setSelectedMosque(mosque)}
          className="animate-rise group overflow-hidden rounded-2xl border border-border bg-surfaceMuted/40 text-right transition-all hover:border-accent hover:shadow-soft"
        >
          <PatternDisplay mosque={mosque} />
          <div className="p-4">
            <p className="text-xs font-bold text-accentStrong">
              📍 {mosque.city} - {mosque.country}
            </p>
            <p className="mt-2 line-clamp-2 text-xs text-muted">{mosque.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}