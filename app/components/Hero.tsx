export function Hero() {
  return (
    <section className="relative overflow-hidden px-3 pb-7 pt-14 text-center">
      {/* نجمة ذهبية كبيرة */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-56 w-56 text-gold opacity-[0.08]"
      >
        <path
          fill="currentColor"
          d="M100 10 L112 76 L178 88 L112 100 L100 166 L88 100 L22 88 L88 76 Z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          d="M100 30 L108 72 L150 80 L108 88 L100 130 L92 88 L50 80 L92 72 Z"
        />
      </svg>

      {/* زخرفة دائرية */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute left-1/2 top-20 h-32 w-32 -translate-x-1/2 text-gold opacity-[0.05]"
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 5 L55 45 L95 50 L55 55 L50 95 L45 55 L5 50 L45 45 Z" fill="currentColor" />
      </svg>

      <p className="mb-2 text-lg text-gold">✦ ۞ ✦</p>
      <h1 className="gold-text mx-auto text-[clamp(32px,6vw,52px)] font-extrabold leading-tight tracking-tight">
        خذ لحظة… واذكر الله
      </h1>
      <p className="mx-auto mt-3 max-w-[620px] text-[17px] leading-[1.9] text-muted">
        اكتب ما يثقل قلبك، وسنبحث لك عن آية موثوقة مرتبطة بحالتك.
      </p>

      {/* فاصل ذهبي */}
      <div className="gold-divider mx-auto max-w-xs">
        <span>۞</span>
      </div>
    </section>
  );
}