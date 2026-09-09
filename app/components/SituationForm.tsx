"use client";

import { FormEvent } from "react";

const examples = [
  "أشعر بالقلق والخوف وأحتاج إلى الطمأنينة",
  "مررت بمصيبة وفقدت شخصاً عزيزاً",
  "أمر بضيق في الرزق وأحتاج إلى الأمل",
  "أشعر بالحيرة ولا أعرف أي قرار أتخذ",
];

export function SituationForm({
  text,
  onTextChange,
  onSubmit,
}: {
  text: string;
  onTextChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (text.trim()) onSubmit(text.trim());
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="situation" className="mb-2.5 block font-extrabold">
        كيف تشعر الآن؟
      </label>
      <textarea
        id="situation"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="اكتب بحرية… مثال: أشعر بالقلق من المستقبل"
        rows={5}
        className="w-full resize-y rounded-2xl border border-border bg-surfaceMuted/40 p-4 leading-[1.9] text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
      />
      <button
        type="submit"
        className="mt-3 w-full rounded-2xl bg-accent py-3.5 font-extrabold text-white shadow-soft transition-colors hover:bg-accentStrong"
      >
        ابحث عن السكينة <span aria-hidden="true">←</span>
      </button>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {examples.map((example) => (
          <button
            type="button"
            key={example}
            onClick={() => onTextChange(example)}
            className="rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accentStrong"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}
