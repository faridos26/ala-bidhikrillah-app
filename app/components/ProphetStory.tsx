"use client";

import { useState } from "react";
import type { ProphetStory } from "@/lib/sakina";
import { SpeechButton } from "./SpeechButton";

export function ProphetStoryCard({ story }: { story: ProphetStory }) {
  const [expanded, setExpanded] = useState(false);
  const [showVerses, setShowVerses] = useState(false);

  return (
    <div className="mt-4 rounded-2xl border border-gold/30 bg-gradient-to-b from-surface to-gold/5 p-5">
      {/* الرأس */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{story.icon}</span>
          <div>
            <p className="text-[11px] font-bold text-gold-dark">📖 قصة ملهمة</p>
            <h3 className="text-base font-extrabold text-ink">{story.title}</h3>
            <p className="text-[11px] text-muted">{story.prophet}</p>
          </div>
        </div>
      </div>

      {/* المقدمة */}
      <p className="mt-3 font-quran text-sm leading-[1.9] text-ink/80">
        {story.introduction}
      </p>

      {/* زر القراءة */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold text-gold-dark transition-colors hover:bg-gold/20"
      >
        {expanded ? "▲ إخفاء القصة" : "▼ اقرأ القصة كاملة"}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* القصة */}
          <div className="space-y-3">
            {story.story.split("\n\n").map((paragraph, i) => (
              <p key={i} className="font-quran text-base leading-[2] text-ink/90">
                {paragraph}
              </p>
            ))}
          </div>

          {/* زر الاستماع للقصة */}
          <div className="flex items-center gap-2">
            <SpeechButton text={story.story.replace(/\n\n/g, " ")} label="استماع للقصة" />
          </div>

          {/* الآيات */}
          <button
            onClick={() => setShowVerses(!showVerses)}
            className="w-full rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs font-bold text-gold-dark transition-colors hover:bg-gold/10"
          >
            {showVerses ? "▲ إخفاء الآيات" : "📖 الآيات المرتبطة بالقصة"}
          </button>

          {showVerses && (
            <div className="space-y-2 rounded-xl border border-gold/20 bg-white/40 p-3">
              {story.quran_verses.map((verse, i) => (
                <div key={i} className="rounded-lg bg-surface p-3">
                  <p className="font-quran text-base leading-[2] text-ink">
                    ﴿{verse.text_ar}﴾
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted">{verse.reference}</span>
                    <SpeechButton text={verse.text_ar} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* العبرة */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-xs font-bold text-accentStrong">💡 العبرة</p>
            <p className="mt-1 font-quran text-sm leading-[1.9] text-ink/90">
              {story.lesson}
            </p>
          </div>

          {/* الربط بالحالة */}
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
            <p className="text-xs font-bold text-gold-dark">🎯 لماذا هذه القصة تناسبك؟</p>
            <p className="mt-1 font-quran text-sm leading-[1.9] text-ink/90">
              {story.connection}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}