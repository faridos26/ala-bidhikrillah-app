
export type TabKey = "home" | "prayer" | "categories" | "stories" | "shahada" | "mosques" | "adhan" | "umrah" | "madhabs" | "tasbih" | "favorites";

const tabs: { key: TabKey; label: string }[] = [
  { key: "home", label: "الرئيسية" },
  { key: "prayer", label: "الصلاة" },
  { key: "categories", label: "المواضيع" },
  { key: "stories", label: "قصص" },
  { key: "shahada", label: "الشهادة" },
  { key: "mosques", label: "المساجد" },
  { key: "adhan", label: "الأذان" },
  { key: "umrah", label: "العمرة" },
  { key: "madhabs", label: "المذاهب" },
  { key: "tasbih", label: "التسبيح" },
  { key: "favorites", label: "المحفوظات" },
];

export function NavTabs({
  active,
  onChange,
  favoritesCount,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  favoritesCount: number;
}) {
  return (
    <nav role="tablist" aria-label="أقسام التطبيق" className="flex gap-1 overflow-x-auto border-b border-border py-2">
      {tabs.map((tab) => {
        const selected = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.key)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-bold transition-colors ${
              selected ? "bg-surfaceMuted text-accentStrong" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.key === "favorites" && favoritesCount > 0 ? ` (${favoritesCount})` : ""}
          </button>
        );
      })}
    </nav>
  );
}