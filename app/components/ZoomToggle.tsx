"use client";

import { useZoom } from "@/lib/useZoom";

export function ZoomToggle() {
  const { isZoomed, toggle } = useZoom();

  return (
    <button
      onClick={toggle}
      aria-label={isZoomed ? "تعطيل التكبير" : "تفعيل التكبير"}
      title={isZoomed ? "تكبير معطّل" : "تكبير الخط"}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors ${
        isZoomed
          ? "border-gold bg-gold/15 text-gold-dark"
          : "border-border bg-surface text-ink hover:border-accent"
      }`}
    >
      <span className="text-base leading-none">
        {isZoomed ? "🔍" : "🔎"}
      </span>
    </button>
  );
}