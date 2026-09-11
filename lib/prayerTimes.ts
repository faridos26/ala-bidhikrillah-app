// استخدام AlAdhan API المجاني لحساب مواقيت الصلاة
// https://aladhan.com/prayer-times-api

export type PrayerTime = {
  name: string;
  name_en: string;
  time: string; // HH:MM
  icon: string;
};

export type PrayerDay = {
  date: string;
  hijri_date: string;
  hijri_month: string;
  hijri_year: string;
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  nextPrayerCountdown: string;
};

const CACHE_KEY_PREFIX = "sakina-prayer-cache-";
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 ساعة

// طرق حساب مواقيت الصلاة
export const CALCULATION_METHODS: { id: number; name: string }[] = [
  { id: 4, name: "أم القرى - مكة المكرمة" },
  { id: 5, name: "الهيئة المصرية العامة للمساحة" },
  { id: 3, name: "رابطة العالم الإسلامي" },
  { id: 2, name: "الجمعية الإسلامية بأمريكا الشمالية" },
  { id: 8, name: "جامعة العلوم الإسلامية - كراتشي" },
  { id: 12, name: "الاتحاد الإسلامي الفرنسي" },
  { id: 13, name: "ديانة تركيا" },
];

export function formatTime12h(time24: string): string {
  const [hourStr, minute] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "م" : "ص";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${period}`;
}

export function timeToMinutes(time24: string): number {
  const [hour, minute] = time24.split(":").map((s) => parseInt(s, 10));
  return hour * 60 + minute;
}

export function getNextPrayer(prayers: PrayerTime[]): PrayerTime | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const actualPrayers = prayers.filter((p) => p.name_en !== "Sunrise");

  for (const prayer of actualPrayers) {
    if (timeToMinutes(prayer.time) > currentMinutes) {
      return prayer;
    }
  }
  return actualPrayers[0] || null;
}

export function getCountdown(targetTime: string): string {
  const now = new Date();
  const [hours, minutes] = targetTime.split(":").map((s) => parseInt(s, 10));
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target.getTime() < now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  if (h > 0) {
    return `${h} س ${m} د`;
  }
  if (m > 0) {
    return `${m} د ${s} ث`;
  }
  return `${s} ث`;
}

// جلب مع timeout
async function fetchWithTimeout(url: string, timeoutMs: number = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// تخزين مؤقت
function saveToCache(key: string, data: PrayerDay): void {
  try {
    const cacheData = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch {
    // localStorage غير متاح
  }
}

function loadFromCache(key: string): PrayerDay | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    // إذا كان الكاش قديمًا (أكثر من 24 ساعة)، نتجاهله
    if (age > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return data as PrayerDay;
  } catch {
    return null;
  }
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: number = 4
): Promise<PrayerDay> {
  const today = new Date();
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  // مفتاح الكاش
  const cacheKey = `${CACHE_KEY_PREFIX}${latitude.toFixed(2)}-${longitude.toFixed(2)}-${dateStr}-${method}`;

  // محاولة القراءة من الكاش أولاً
  const cached = loadFromCache(cacheKey);
  if (cached) {
    // نعيد الكاش فورًا (سريع)، ثم نحدّث في الخلفية
    refreshInBackground(latitude, longitude, method, dateStr, cacheKey);
    return cached;
  }

  // لا يوجد كاش → نجلب من API
  return fetchFromAPI(latitude, longitude, method, dateStr, cacheKey);
}

async function fetchFromAPI(
  latitude: number,
  longitude: number,
  method: number,
  dateStr: string,
  cacheKey: string
): Promise<PrayerDay> {
  const today = new Date();
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  try {
    const response = await fetchWithTimeout(url, 8000);

    if (!response.ok) {
      throw new Error("فشل جلب مواقيت الصلاة");
    }

    const data = await response.json();
    const timings = data.data.timings;
    const hijri = data.data.date.hijri;

    const prayers: PrayerTime[] = [
      { name: "الفجر", name_en: "Fajr", time: timings.Fajr.substring(0, 5), icon: "🌅" },
      { name: "الشروق", name_en: "Sunrise", time: timings.Sunrise.substring(0, 5), icon: "☀️" },
      { name: "الظهر", name_en: "Dhuhr", time: timings.Dhuhr.substring(0, 5), icon: "🌞" },
      { name: "العصر", name_en: "Asr", time: timings.Asr.substring(0, 5), icon: "🌤️" },
      { name: "المغرب", name_en: "Maghrib", time: timings.Maghrib.substring(0, 5), icon: "🌆" },
      { name: "العشاء", name_en: "Isha", time: timings.Isha.substring(0, 5), icon: "🌙" },
    ];

    const nextPrayer = getNextPrayer(prayers);

    const result: PrayerDay = {
      date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
      hijri_date: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
      hijri_month: hijri.month.ar,
      hijri_year: hijri.year,
      prayers,
      nextPrayer,
      nextPrayerCountdown: nextPrayer ? getCountdown(nextPrayer.time) : "",
    };

    // حفظ في الكاش
    saveToCache(cacheKey, result);

    return result;
  } catch (error) {
    // فشل الاتصال → جرّب الكاش القديم حتى لو كان قديمًا
    const oldCache = loadFromCache(cacheKey);
    if (oldCache) return oldCache;

    throw error;
  }
}

// تحديث في الخلفية بدون انتظار
async function refreshInBackground(
  latitude: number,
  longitude: number,
  method: number,
  dateStr: string,
  cacheKey: string
): Promise<void> {
  try {
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    const response = await fetchWithTimeout(url, 8000);
    if (!response.ok) return;

    const data = await response.json();
    const timings = data.data.timings;
    const hijri = data.data.date.hijri;

    const prayers: PrayerTime[] = [
      { name: "الفجر", name_en: "Fajr", time: timings.Fajr.substring(0, 5), icon: "🌅" },
      { name: "الشروق", name_en: "Sunrise", time: timings.Sunrise.substring(0, 5), icon: "☀️" },
      { name: "الظهر", name_en: "Dhuhr", time: timings.Dhuhr.substring(0, 5), icon: "🌞" },
      { name: "العصر", name_en: "Asr", time: timings.Asr.substring(0, 5), icon: "🌤️" },
      { name: "المغرب", name_en: "Maghrib", time: timings.Maghrib.substring(0, 5), icon: "🌆" },
      { name: "العشاء", name_en: "Isha", time: timings.Isha.substring(0, 5), icon: "🌙" },
    ];

    const nextPrayer = getNextPrayer(prayers);

    const result: PrayerDay = {
      date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      hijri_date: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
      hijri_month: hijri.month.ar,
      hijri_year: hijri.year,
      prayers,
      nextPrayer,
      nextPrayerCountdown: nextPrayer ? getCountdown(nextPrayer.time) : "",
    };

    saveToCache(cacheKey, result);
  } catch {
    // صمتًا - التحديث في الخلفية
  }
}

export async function getCityName(latitude: number, longitude: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`;
    const response = await fetchWithTimeout(url, 5000);
    if (!response.ok) return "موقعك الحالي";
    const data = await response.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state ||
      "موقعك الحالي"
    );
  } catch {
    return "موقعك الحالي";
  }
}