"use client";

import { useState } from "react";
import storiesData from "../../data/stories.json";

type Story = {
  id: string;
  title: string;
  age_range: string;
  theme: string;
  icon: string;
  summary: string;
  content: string;
  lesson: string;
  hadith: string;
  questions: string[];
};

export function StoriesSection() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  const stories = storiesData.stories as Story[];

  if (selectedStory) {
    return (
      <div className="animate-rise">
        <button
          onClick={() => {
            setSelectedStory(null);
            setShowQuestions(false);
          }}
          className="mb-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-accent"
        >
          ← رجوع للقصص
        </button>

        <article className="rounded-2xl border border-border bg-surfaceMuted/40 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-4xl">{selectedStory.icon}</span>
            <div>
              <h2 className="text-xl font-extrabold text-ink">{selectedStory.title}</h2>
              <p className="text-xs text-muted">
                {selectedStory.theme} · {selectedStory.age_range}
              </p>
            </div>
          </div>

          <div className="space-y-3 font-quran text-lg leading-[2] text-ink/90">
            {selectedStory.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-sm font-bold text-accentStrong">📌 العبرة:</p>
            <p className="mt-1 font-quran text-base leading-[1.8]">{selectedStory.lesson}</p>
          </div>

          <div className="mt-3 rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-bold text-accentStrong">📖 من السنة:</p>
            <p className="mt-1 font-quran text-base leading-[1.8]">{selectedStory.hadith}</p>
          </div>

          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className="mt-4 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-accentStrong transition-colors hover:border-accent"
          >
            {showQuestions ? "إخفاء الأسئلة" : "💭 أسئلة للمناقشة"}
          </button>

          {showQuestions && (
            <ul className="mt-3 space-y-2">
              {selectedStory.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg bg-surface p-3 text-sm">
                  <span className="font-bold text-accent">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => setSelectedStory(story)}
          className="animate-rise rounded-2xl border border-border bg-surfaceMuted/40 p-5 text-right transition-all hover:border-accent hover:shadow-soft"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-4xl">{story.icon}</span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accentStrong">
              {story.theme}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-ink">{story.title}</h3>
          <p className="mt-1 text-sm text-muted">{story.summary}</p>
          <p className="mt-2 text-xs text-muted/70">{story.age_range}</p>
        </button>
      ))}
    </div>
  );
}