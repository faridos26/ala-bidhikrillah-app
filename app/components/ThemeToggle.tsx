"use client";

import { useTheme } from "@/lib/useTheme";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-ink transition-colors hover:border-accent"
    >
      <span className="text-base leading-none">{isDark ? "☀" : "☾"}</span>
    </button>
  );
}
