"use client";

import { useEffect, useState } from "react";
import {
  PrayerDay,
  CALCULATION_METHODS,
  fetchPrayerTimes,
  getCityName,
  getCountdown,
  formatTime12h,
} from "@/lib/prayerTimes";
import { readJSON, writeJSON } from "@/lib/storage";
import tunisianCitiesData from "../../data/tunisianCities.json";

const LOCATION_KEY = "sakina-location";
const METHOD_KEY = "sakina-method";

type SavedLocation = {
  latitude: number;
  longitude: number;
  city: string;
};

type TunisianCity = {
  id: string;
  name_ar: string;
  name_en: string;
  region: string;
  latitude: number;
  longitude: number;
  icon: string;
};

export function PrayerTimesSection() {
  const [prayerDay, setPrayerDay] = useState<PrayerDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const [method, setMethod] = useState<number>(4);
  const [countdown, setCountdown] = useState<string>("");
  const [location, setLocation] = useState<SavedLocation | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [locationMode, setLocationMode] = useState<"none" | "city" | "gps">("none");

  const cities = tunisianCitiesData.cities as TunisianCity[];

  // استرجاع الإعدادات المحفوظة
  useEffect(() => {
    const savedLocation = readJSON<SavedLocation | null>(LOCATION_KEY, null);
    const savedMethod = readJSON<number>(METHOD_KEY, 4);
    setMethod(savedMethod);
    if (savedLocation) {
      setLocation(savedLocation);
      setCity(savedLocation.city);
    }
  }, []);

  // جلب مواقيت الصلاة
  useEffect(() => {
    if (!location) return;

    setLoading(true);
    setError(null);

    fetchPrayerTimes(location.latitude, location.longitude, method)
      .then((data) => {
        setPrayerDay(data);
        setLoading(false);
      })
      .catch(() => {
        setError("تعذر جلب مواقيت الصلاة. تحقق من الاتصال بالإنترنت.");
        setLoading(false);
      });
  }, [location, method]);

  // العد التنازلي المباشر
  useEffect(() => {
    if (!prayerDay?.nextPrayer) return;

    const interval = setInterval(() => {
      if (prayerDay.nextPrayer) {
        setCountdown(getCountdown(prayerDay.nextPrayer.time));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerDay]);

  function requestLocation() {
    setLocationMode("gps");

    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع. اختر مدينتك يدويًا.");
      setLocationMode("none");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const cityName = await getCityName(latitude, longitude);
        const newLocation = { latitude, longitude, city: cityName };
        setLocation(newLocation);
        setCity(cityName);
        writeJSON(LOCATION_KEY, newLocation);
      },
      () => {
        setError("تم رفض الوصول للموقع. اختر مدينتك يدويًا من القائمة.");
        setLoading(false);
        setLocationMode("none");
      },
      { timeout: 10000 }
    );
  }

  function selectCity(cityData: TunisianCity) {
    const newLocation = {
      latitude: cityData.latitude,
      longitude: cityData.longitude,
      city: cityData.name_ar,
    };
    setLocation(newLocation);
    setCity(cityData.name_ar);
    writeJSON(LOCATION_KEY, newLocation);
    setShowCityPicker(false);
    setLocationMode("none");
  }

  function changeMethod(newMethod: number) {
    setMethod(newMethod);
    writeJSON(METHOD_KEY, newMethod);
  }

  function changeLocation() {
    setLocation(null);
    setPrayerDay(null);
    setCity("");
    setLocationMode("none");
  }

  // شاشة اختيار الموقع
  if (!location && !loading) {
    return (
      <section className="animate-rise mt-6 space-y-5">
        <div className="gold-card rounded-3xl p-6 text-center">
          <span className="text-6xl">🕌</span>
          <h1 className="gold-text mt-3 text-3xl font-extrabold">مواقيت الصلاة</h1>
          <p className="mt-3 text-sm leading-[1.9] text-muted">
            اختر طريقة تحديد موقعك لمعرفة مواقيت الصلاة في مدينتك
          </p>
        </div>
        {/* آية قرآنية */}
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5 text-center">
          <p className="font-quran text-xl font-bold leading-[2] text-gold-dark">
            ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾
          </p>
          <p className="mt-2 text-xs text-muted">سورة النساء - الآية 103</p>
        </div>

        {/* اختيار المدينة يدويًا */}
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
          <h2 className="mb-3 text-base font-extrabold text-gold-dark">
            🏙️ اختر مدينتك
          </h2>
          <p className="mb-4 text-xs text-muted">
            الطريقة الأسرع والأدق - لا تحتاج إنترنت للتحديد
          </p>

          <div className="grid grid-cols-2 gap-2">
            {cities.map((cityData) => (
              <button
                key={cityData.id}
                onClick={() => selectCity(cityData)}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface p-3 transition-all hover:border-gold hover:bg-gold/10 hover:scale-105"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {cityData.icon}
                </span>
                <span className="text-sm font-bold text-ink">{cityData.name_ar}</span>
                <span className="text-[10px] text-muted">{cityData.region}</span>
              </button>
            ))}
          </div>
        </div>

        {/* أو تحديد تلقائي */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-base font-extrabold text-accentStrong">
            📍 أو حدّد موقعك تلقائيًا
          </h2>
          <p className="mb-4 text-xs text-muted">
            يستخدم GPS الهاتف لمعرفة مدينتك
          </p>

          <button
            onClick={requestLocation}
            disabled={locationMode === "gps"}
            className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {locationMode === "gps" ? "⏳ جاري تحديد الموقع..." : "📍 تحديد موقعي تلقائيًا"}
          </button>

          {error && (
            <p className="mt-3 rounded-lg bg-danger-surface p-2 text-xs text-danger">
              ⚠️ {error}
            </p>
          )}
        </div>
      </section>
    );
  }

  // حالة التحميل
  if (loading && !prayerDay) {
    return (
      <section className="animate-rise mt-6">
        <div className="gold-card rounded-3xl p-12 text-center">
          <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          <p className="mt-4 text-sm text-muted">جاري جلب مواقيت الصلاة...</p>
        </div>
      </section>
    );
  }

  // حالة الخطأ
  if (error && !prayerDay) {
    return (
      <section className="animate-rise mt-6">
        <div className="rounded-3xl border border-danger/30 bg-danger-surface p-8 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="mt-3 text-sm text-danger">{error}</p>
          <button
            onClick={changeLocation}
            className="mt-4 rounded-lg bg-danger px-6 py-2 text-sm font-bold text-white"
          >
            إعادة الاختيار
          </button>
        </div>
      </section>
    );
  }

  if (!prayerDay) return null;

  const nextPrayerName = prayerDay.nextPrayer?.name || "";
  const nextPrayerTime = prayerDay.nextPrayer?.time || "";

  return (
    <section className="animate-rise mt-6 space-y-5">
      {/* البطاقة الرئيسية */}
      <div className="gold-card rounded-3xl p-6 text-center">
        <button
          onClick={changeLocation}
          className="text-xs font-bold text-gold-dark underline decoration-dotted underline-offset-4"
        >
          📍 {city} (تغيير الموقع)
        </button>
        <p className="mt-1 text-xs text-muted">{prayerDay.hijri_date} هـ</p>

        {prayerDay.nextPrayer && (
          <div className="mt-5">
            <p className="text-sm text-muted">الصلاة القادمة</p>
            <p className="gold-text mt-1 text-3xl font-extrabold">{nextPrayerName}</p>
            <p className="mt-1 text-lg font-bold text-ink">{formatTime12h(nextPrayerTime)}</p>
            <p className="mt-3 inline-block rounded-full bg-gold/10 px-4 py-2 text-sm font-bold text-gold-dark">
              ⏱ {countdown || prayerDay.nextPrayerCountdown}
            </p>
          </div>
        )}
      </div>

      {/* قائمة الصلوات */}
      <div className="grid gap-2">
        {prayerDay.prayers.map((prayer) => {
          const isNext = prayer.name === nextPrayerName;
          const isSunrise = prayer.name_en === "Sunrise";
          return (
            <div
              key={prayer.name}
              className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                isNext
                  ? "border-gold bg-gold/10 shadow-soft"
                  : isSunrise
                  ? "border-border/40 bg-surfaceMuted/20"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{prayer.icon}</span>
                <div>
                  <p
                    className={`text-base font-bold ${
                      isNext ? "text-gold-dark" : isSunrise ? "text-muted" : "text-ink"
                    }`}
                  >
                    {prayer.name}
                  </p>
                  {isSunrise && <p className="text-[10px] text-muted">ليس وقت صلاة</p>}
                </div>
              </div>
              <p
                className={`text-lg font-extrabold ${
                  isNext ? "text-gold-dark" : "text-ink"
                }`}
              >
                {formatTime12h(prayer.time)}
              </p>
            </div>
          );
        })}
      </div>

      {/* اختيار طريقة الحساب */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <label className="block text-xs font-bold text-muted">
          طريقة حساب المواقيت
        </label>
        <select
          value={method}
          onChange={(e) => changeMethod(parseInt(e.target.value, 10))}
          className="mt-2 w-full rounded-lg border border-border bg-surfaceMuted/40 px-3 py-2 text-sm text-ink"
        >
          {CALCULATION_METHODS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}