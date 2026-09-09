export function Hero() {
  return (
    <section className="relative overflow-hidden px-3 pb-7 pt-14 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-48 w-48 text-accent opacity-[0.06]"
      >
        <path
          fill="currentColor"
          d="M100 10 L112 76 L178 88 L112 100 L100 166 L88 100 L22 88 L88 76 Z"
        />
      </svg>
      <p className="mb-2 text-lg text-gold">✦</p>
      <h1 className="mx-auto text-[clamp(32px,6vw,52px)] font-extrabold leading-tight tracking-tight">
        خذ لحظة… واذكر الله
      </h1>
      <p className="mx-auto mt-3 max-w-[620px] text-[17px] leading-[1.9] text-muted">
        اكتب ما يثقل قلبك، وسنبحث لك عن آية موثوقة مرتبطة بحالتك.
      </p>
    </section>
  );
}
