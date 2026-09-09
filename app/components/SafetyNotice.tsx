export function SafetyNotice() {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200/70 bg-dangerSurface p-6">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-rose-100 font-black text-danger">
        !
      </div>
      <h2 className="mb-1.5 mt-3 text-lg font-bold">أنت لست وحدك</h2>
      <p className="leading-[1.9] text-ink/80">
        إذا كان هناك خطر فوري أو احتمال لإيذاء النفس، لا تبقَ وحدك. تواصل الآن مع شخص تثق به
        أو مع خدمات الطوارئ المحلية. هذا التطبيق ليس بديلاً عن المساعدة الطبية أو الطارئة.
      </p>
      <div className="mt-4 rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white">
        اتصل برقم الطوارئ في بلدك، أو بخط المساعدة النفسية المحلي، الآن.
      </div>
    </div>
  );
}
