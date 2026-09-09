"use client";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث في الآيات والأدعية…"
        aria-label="بحث في المحتوى"
        className="w-full rounded-2xl border border-border bg-surface py-3 pe-4 ps-10 text-sm text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-3.5 grid place-items-center text-muted">
        ⌕
      </span>
    </div>
  );
}
