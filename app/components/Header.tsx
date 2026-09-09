import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex h-16 items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-xl font-extrabold text-white shadow-soft">
        س
      </div>
      <div className="leading-tight">
        <strong className="block text-base">سكينة برو</strong>
        <small className="block text-[11px] text-muted">وَتَطْمَئِنُّ الْقُلُوبُ</small>
      </div>
      <span
        className="me-auto h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_5px_var(--surface-muted)]"
        title="المحتوى من قاعدة موثوقة"
      />
      <ThemeToggle />
    </header>
  );
}
