export function CategoryIcon({ code, size = "md" }: { code: string; size?: "sm" | "md" | "lg" }) {
  const icons: Record<string, { emoji: string; color: string; bg: string }> = {
    SADNESS_DISTRESS: { emoji: "☁️", color: "#64748b", bg: "#f1f5f9" },
    ANXIETY_FEAR: { emoji: "🌊", color: "#0369a1", bg: "#e0f2fe" },
    LOSS_CALAMITY: { emoji: "🤲", color: "#7c3aed", bg: "#ede9fe" },
    ILLNESS_TRIAL: { emoji: "💚", color: "#15803d", bg: "#dcfce7" },
    RIZQ_HARDSHIP: { emoji: "🌾", color: "#b45309", bg: "#fef3c7" },
    PATIENCE_STEADFASTNESS: { emoji: "🌱", color: "#166534", bg: "#dcfce7" },
    LONELINESS_COMFORT: { emoji: "🕊️", color: "#0e7490", bg: "#cffafe" },
    HOPE: { emoji: "🌅", color: "#ea580c", bg: "#ffedd5" },
    TRANQUILITY_PEACE: { emoji: "✨", color: "#a16207", bg: "#fef9c3" },
    STUDY_GUIDANCE: { emoji: "📖", color: "#1d4ed8", bg: "#dbeafe" },
    GUIDANCE_DECISION: { emoji: "🧭", color: "#0f766e", bg: "#ccfbf1" },
    SUCCESS_ACHIEVEMENT: { emoji: "🏆", color: "#b91c1c", bg: "#fee2e2" },
    REPENTANCE_REGRET: { emoji: "💧", color: "#2563eb", bg: "#dbeafe" },
    FORGIVENESS_ISTIGHFAR: { emoji: "🌙", color: "#4338ca", bg: "#e0e7ff" },
    JOY_GRATITUDE: { emoji: "🌸", color: "#be185d", bg: "#fce7f3" },
    FAMILY_KINSHIP: { emoji: "👨‍👩‍👧‍👦", color: "#92400e", bg: "#fef3c7" },
    MARRIAGE_SEEKING: { emoji: "💍", color: "#9d174d", bg: "#fce7f3" },
    MARITAL_RELATIONSHIP: { emoji: "❤️", color: "#dc2626", bg: "#fee2e2" },
    GENERAL_FALLBACK: { emoji: "🕌", color: "#334155", bg: "#e2e8f0" },
    SAFETY_CRISIS: { emoji: "🆘", color: "#dc2626", bg: "#fee2e2" },
  };

  const icon = icons[code] || icons.GENERAL_FALLBACK;
  const sizes = {
    sm: "h-8 w-8 text-lg",
    md: "h-12 w-12 text-2xl",
    lg: "h-16 w-16 text-3xl",
  };

  return (
    <div
      className={`grid ${sizes[size]} place-items-center rounded-full`}
      style={{ backgroundColor: icon.bg, color: icon.color }}
      aria-hidden="true"
    >
      {icon.emoji}
    </div>
  );
}