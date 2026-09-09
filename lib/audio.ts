// Reciter servers verified live against https://www.mp3quran.net/api/v3/reciters
// Each entry covers all 114 surahs (Hafs 'an 'Asim, the most common riwayah).
export type Reciter = { id: string; name: string; server: string };

export const RECITERS: Reciter[] = [
  { id: "afs", name: "مشاري راشد العفاسي", server: "https://server8.mp3quran.net/afs/" },
  { id: "maher", name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
  { id: "balilah", name: "بندر بليلة", server: "https://server6.mp3quran.net/balilah/" },
  { id: "akdr", name: "إبراهيم الأخضر", server: "https://server6.mp3quran.net/akdr/" },
];

// mp3quran.net serves one MP3 per full surah (e.g. 002.mp3), not per-ayah —
// so this always plays the whole surah, matching the dataset's own audio_note.
export function surahAudioUrl(reciter: Reciter, surahNumber: number) {
  const padded = String(surahNumber).padStart(3, "0");
  return `${reciter.server}${padded}.mp3`;
}

// Pulls the surah name out of references like "سورة الرعد 13:28" -> "الرعد".
export function surahNameFromReference(reference: string) {
  return reference.replace(/^سورة\s*/, "").replace(/\s*\d.*$/, "").trim() || reference;
}
