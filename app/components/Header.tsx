import { ThemeToggle } from "./ThemeToggle";
import { ZoomToggle } from "./ZoomToggle";

export function Header() {
  return (
    <header className="gold-card relative flex h-16 items-center gap-3 rounded-2xl px-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-xl font-extrabold text-white shadow-soft">
        س
      </div>
      <div className="leading-tight">
        <strong className="gold-text block text-base">سكينة برو</strong>
        <small className="block text-[11px] text-muted">وَتَطْمَئِنُّ الْقُلُوبُ</small>
      </div>
      <span
        className="me-auto h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]"
        title="المحتوى من قاعدة موثوقة"
      />
      <ZoomToggle />
      <ThemeToggle />
    </header>
  );
}