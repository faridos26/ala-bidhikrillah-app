"use client";

import { useState } from "react";
import mosquesData from "../../data/mosques.json";

type Mosque = {
  id: string;
  order: number;
  name_ar: string;
  name_en: string;
  city: string;
  country: string;
  flag: string;
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
      <div className="animate-rise mt-6">
        <button
          onClick={() => setSelectedMosque(null)}
          className="mb-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-gold"
        >
          ← رجوع للمساجد
        </button>

        <article className="overflow-hidden rounded-2xl border border-gold/30 bg-surface">
          {/* الصورة */}
          <div className="relative">
            {!imageError[selectedMosque.id] ? (
              <img
                src={selectedMosque.image}
                alt={selectedMosque.name_ar}
                className="h-72 w-full object-cover"
                onError={() => handleImageError(selectedMosque.id)}
              />
            ) : (
              <div className="grid h-72 w-full place-items-center bg-gradient-to-b from-gold/20 to-surface">
                <span className="text-8xl">{selectedMosque.icon}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gold/90 px-2.5 py-1 text-xs font-extrabold text-white">
                  #{selectedMosque.order}
                </span>
                <span className="text-2xl">{selectedMosque.flag}</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold text-white">
                {selectedMosque.name_ar}
              </h2>
              <p className="text-sm text-white/80">{selectedMosque.name_en}</p>
            </div>
          </div>

          <div className="p-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-surfaceMuted/40 p-3 text-center">
                <p className="text-lg">📍</p>
                <p className="mt-1 text-xs text-muted">الموقع</p>
                <p className="mt-1 text-sm font-bold">{selectedMosque.city}</p>
                <p className="text-xs text-muted">{selectedMosque.country}</p>
              </div>
              <div className="rounded-xl bg-surfaceMuted/40 p-3 text-center">
                <p className="text-lg">📅</p>
                <p className="mt-1 text-xs text-muted">البنيان</p>
                <p className="mt-1 text-sm font-bold">{selectedMosque.year_built}</p>
              </div>
              <div className="rounded-xl bg-surfaceMuted/40 p-3 text-center">
                <p className="text-lg">👥</p>
                <p className="mt-1 text-xs text-muted">السعة</p>
                <p className="mt-1 text-sm font-bold">{selectedMosque.capacity}</p>
              </div>
            </div>

            {/* الطراز المعماري */}
            <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4">
              <p className="text-sm font-bold text-gold-dark">🎨 الطراز المعماري</p>
              <p className="mt-1 text-sm">{selectedMosque.style}</p>
            </div>

            {/* الوصف */}
            <p className="mt-4 font-quran text-base leading-[2] text-ink/90">
              {selectedMosque.description}
            </p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <section className="animate-rise mt-6 space-y-5">
      {/* العنوان */}
      <div className="gold-card rounded-3xl p-6 text-center">
        <span className="text-5xl">🕌</span>
        <h1 className="gold-text mt-3 text-3xl font-extrabold">
          أجمل المساجد في العالم
        </h1>
        <p className="mt-2 text-sm text-muted">
          رحلة عبر {mosques.length} مسجدًا من أعرق مساجد العالم الإسلامي
        </p>
      </div>

      {/* شبكة المساجد */}
      <div className="grid gap-4 sm:grid-cols-2">
        {mosques.map((mosque) => (
          <button
            key={mosque.id}
            onClick={() => setSelectedMosque(mosque)}
            className="group overflow-hidden rounded-2xl border border-border bg-surface text-right transition-all hover:border-gold hover:shadow-soft"
          >
            {/* الصورة */}
            <div className="relative h-48 overflow-hidden">
              {!imageError[mosque.id] ? (
                <img
                  src={mosque.image}
                  alt={mosque.name_ar}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={() => handleImageError(mosque.id)}
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-b from-gold/20 to-surface">
                  <span className="text-6xl">{mosque.icon}</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-xs font-extrabold text-white shadow-soft">
                  {mosque.order}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{mosque.flag}</span>
                  <h3 className="text-lg font-extrabold text-white">
                    {mosque.name_ar}
                  </h3>
                </div>
              </div>
            </div>

            {/* معلومات */}
            <div className="p-4">
              <p className="text-xs font-bold text-gold-dark">
                📍 {mosque.city} - {mosque.country}
              </p>
              <p className="mt-2 line-clamp-2 text-xs leading-[1.7] text-muted">
                {mosque.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}