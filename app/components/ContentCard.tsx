"use client";

import { useState } from "react";
import type { Category, Content } from "@/lib/sakina";
import { AudioPlayer } from "./AudioPlayer";
import { surahNameFromReference } from "@/lib/audio";
import { createShareImage, shareOrDownloadImage } from "@/lib/shareImage";

export function ContentCard({
  item,
  category,
  favorite,
  onFavorite,
}: {
  item: Content;
  category: Category;
  favorite: boolean;
  onFavorite: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageDone, setImageDone] = useState(false);

  async function shareAsImage() {
    setImageBusy(true);
    try {
      const dataUrl = await createShareImage({ text: item.text_ar, reference: item.reference });
      const outcome = await shareOrDownloadImage(dataUrl, `sakina-${item.reference}.png`.replace(/\s+/g, "-"));
      if (outcome === "downloaded") {
        setImageDone(true);
        setTimeout(() => setImageDone(false), 1800);
      }
    } catch {
      // Canvas/share unsupported in this browser — silently ignore, the text-share button still works.
    } finally {
      setImageBusy(false);
    }
  }

  async function share() {
    const text = `${item.text_ar}\n\n${item.reference}\n— سكينة برو`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "سكينة برو", text });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <article className="animate-rise rounded-2xl border border-border bg-surfaceMuted/40 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-accent">
          {item.type === "QURAN" ? "آية من القرآن الكريم" : item.type}
        </span>
        <button
          onClick={onFavorite}
          aria-pressed={favorite}
          aria-label={favorite ? "إزالة من المحفوظات" : "حفظ في المفضلة"}
          title="حفظ"
          className={`grid h-8 w-8 place-items-center rounded-full border text-lg transition-colors ${
            favorite ? "border-rose-200 text-rose-500" : "border-border text-muted hover:text-ink"
          }`}
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      <blockquote className="font-quran my-3 text-[22px] font-medium leading-[2.05]">
        ﴿{item.text_ar}﴾
      </blockquote>
      <div className="text-xs leading-[1.7] text-muted">
        {item.source} · {item.reference}
      </div>
      {item.type === "QURAN" && typeof item.surah_number === "number" && (
        <AudioPlayer surahNumber={item.surah_number} surahLabel={surahNameFromReference(item.reference)} />
      )}
      <div className="mt-4 flex gap-2">
        <button
          onClick={share}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-accentStrong transition-colors hover:border-accent"
        >
          {copied ? "تم النسخ" : "مشاركة"}
        </button>
        <button
          onClick={shareAsImage}
          disabled={imageBusy}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-accentStrong transition-colors hover:border-accent disabled:opacity-60"
        >
          {imageBusy ? "جارٍ التجهيز…" : imageDone ? "تم الحفظ" : "مشاركة كصورة"}
        </button>
      </div>
      <div className="mt-3 text-[11px] leading-[1.7] text-muted/80">
        اختير من المحتوى الموثّق المرتبط بتصنيف «{category.name_ar}».
      </div>
    </article>
  );
}
