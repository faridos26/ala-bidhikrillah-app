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
};

export function MosquesSection() {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const mosques = mosquesData.mosques as Mosque[];

  function handleImageError(id: string) {
    setImageError((prev) => ({ ...prev, [id]: true }));
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
          <div className="relative">
            {!imageError[selectedMosque.id] ? (
              <img
                src={selectedMosque.image}
                alt={selectedMosque.name_ar}
                className="h-72 w-full object-cover"
                onError={() => handleImageError(selectedMosque.id)}
              />
            ) : (
              <div className="grid h-72 w-full place-items-center bg-gradient-to-b from-accent/20 to-surface">
                <span className="text-8xl">{selectedMosque.icon}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="text-2xl font-extrabold text-white">{selectedMosque.name_ar}</h2>
              <p className="text-sm text-white/80">{selectedMosque.name_en}</p>
            </div>
          </div>

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
          <div className="relative h-40 overflow-hidden">
            {!imageError[mosque.id] ? (
              <img
                src={mosque.image}
                alt={mosque.name_ar}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => handleImageError(mosque.id)}
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-b from-accent/20 to-surface">
                <span className="text-6xl">{mosque.icon}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <h3 className="text-lg font-extrabold text-white">{mosque.name_ar}</h3>
              <p className="text-xs text-white/80">{mosque.name_en}</p>
            </div>
          </div>
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