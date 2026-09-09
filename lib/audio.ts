// Reciter servers verified live against https://www.mp3quran.net/api/v3/reciters
// Each entry covers all 114 surahs (Hafs 'an 'Asim, the most common riwayah).
export type Reciter = { id: string; name: string; server: string; ayahServer?: string };

export const RECITERS: Reciter[] = [
  { id: "basit", name: "عبد الباسط عبد الصمد (مرتل)", server: "https://server7.mp3quran.net/basit/", ayahServer: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal/" },
  { id: "basit_mjwd", name: "عبد الباسط عبد الصمد (مجوّد)", server: "https://server7.mp3quran.net/basit_mjwd/", ayahServer: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmujawwad/" },
  { id: "afs", name: "مشاري راشد العفاسي", server: "https://server8.mp3quran.net/afs/", ayahServer: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" },
  { id: "maher", name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/", ayahServer: "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly/" },
  { id: "husary", name: "محمود خليل الحصري", server: "https://server13.mp3quran.net/husary/", ayahServer: "https://cdn.islamic.network/quran/audio/128/ar.husary/" },
  { id: "minshawi", name: "محمد صديق المنشاوي", server: "https://server10.mp3quran.net/minshawi/", ayahServer: "https://cdn.islamic.network/quran/audio/128/ar.minshawi/" },
];

// mp3quran.net serves one MP3 per full surah (e.g. 002.mp3), not per-ayah —
// so this always plays the whole surah, matching the dataset's own audio_note.
export function surahAudioUrl(reciter: Reciter, surahNumber: number) {
  const padded = String(surahNumber).padStart(3, "0");
  return `${reciter.server}${padded}.mp3`;
}

// Per-ayah audio URL from islamic.network CDN
// Format: https://cdn.islamic.network/quran/audio/128/ar.reciter/SSAAA.mp3
// Example: 2:286 -> 002286.mp3
export function ayahAudioUrl(reciter: Reciter, surahNumber: number, ayahNumber: number) {
  if (!reciter.ayahServer) {
    return surahAudioUrl(reciter, surahNumber);
  }
  const paddedSurah = String(surahNumber).padStart(3, "0");
  const paddedAyah = String(ayahNumber).padStart(3, "0");
  return `${reciter.ayahServer}${paddedSurah}${paddedAyah}.mp3`;
}

// Pulls the surah name out of references like "سورة الرعد 13:28" -> "الرعد".
export function surahNameFromReference(reference: string) {
  return reference.replace(/^سورة\s*/, "").replace(/\s*\d.*$/, "").trim() || reference;
}

// Extract ayah number from reference like "سورة الرعد 13:28" -> 28
export function ayahNumberFromReference(reference: string): number | undefined {
  const match = reference.match(/(\d+):(\d+)/);
  return match ? parseInt(match[2], 10) : undefined;
}