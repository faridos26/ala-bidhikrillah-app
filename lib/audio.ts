// Reciter servers verified live against https://www.mp3quran.net/api/v3/reciters
export type Reciter = { id: string; name: string; server: string };

export const RECITERS: Reciter[] = [
  { id: "basit", name: "عبد الباسط عبد الصمد (مرتل)", server: "https://server7.mp3quran.net/basit/" },
  { id: "basit_mjwd", name: "عبد الباسط عبد الصمد (مجوّد)", server: "https://server7.mp3quran.net/basit_mjwd/" },
  { id: "afs", name: "مشاري راشد العفاسي", server: "https://server8.mp3quran.net/afs/" },
  { id: "maher", name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
  { id: "husary", name: "محمود خليل الحصري", server: "https://server13.mp3quran.net/husary/" },
  { id: "minshawi", name: "محمد صديق المنشاوي", server: "https://server10.mp3quran.net/minshawi/" },
];

// تشغيل السورة كاملة
export function surahAudioUrl(reciter: Reciter, surahNumber: number) {
  const padded = String(surahNumber).padStart(3, "0");
  return `${reciter.server}${padded}.mp3`;
}

// تشغيل الآية فقط - نستخدم نفس رابط السورة لكن مع بدء من موضع الآية
// ملاحظة: mp3quran.net يوفر السور كاملة فقط، لذلك نعود للسورة الكاملة
export function ayahAudioUrl(reciter: Reciter, surahNumber: number, ayahNumber: number) {
  // بما أن mp3quran.net لا يوفر الآيات منفردة، نستخدم السورة الكاملة
  return surahAudioUrl(reciter, surahNumber);
}

// استخراج اسم السورة من المرجع
export function surahNameFromReference(reference: string) {
  return reference.replace(/^سورة\s*/, "").replace(/\s*\d.*$/, "").trim() || reference;
}

// استخراج رقم الآية من المرجع
export function ayahNumberFromReference(reference: string): number | undefined {
  const match = reference.match(/(\d+):(\d+)/);
  return match ? parseInt(match[2], 10) : undefined;
}