import { sakinaData } from "@/lib/sakina";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border pt-6 text-center text-[11px] leading-[1.9] text-muted">
      {/* زخرفة ذهبية */}
      <p className="mb-4 text-base text-gold">✦ ۞ ✦</p>

      {/* اسم التطبيق */}
      <p className="gold-text text-base font-extrabold">سكينة برو</p>
      <p className="mt-1 font-quran text-xs text-muted">وَتَطْمَئِنُّ الْقُلُوبُ</p>

      {/* فاصل ذهبي */}
      <div className="gold-divider mx-auto my-4 max-w-xs">
        <span>❋</span>
      </div>

      {/* معلومات المطوّر */}
      <div className="mx-auto max-w-md space-y-2">
        <p className="text-xs font-bold text-ink">👨‍💻 منفّذ التطبيق</p>
        <p className="text-sm font-extrabold text-gold-dark">Ferid Rezgui</p>

        {/* روابط التواصل */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <a
            href="https://www.facebook.com/ferid.rezgui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-accentStrong transition-colors hover:border-gold hover:text-gold-dark"
            aria-label="فيسبوك"
          >
            <span>📘</span>
            <span>فيسبوك</span>
          </a>
          <a
            href="https://wa.me/21622609221"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-accentStrong transition-colors hover:border-gold hover:text-gold-dark"
            aria-label="واتساب"
          >
            <span>💬</span>
            <span>واتساب</span>
          </a>
        </div>
      </div>

      {/* فاصل */}
      <div className="gold-divider mx-auto my-4 max-w-xs">
        <span>❋</span>
      </div>

      {/* معلومات المحتوى */}
      <div className="space-y-1">
        <p>المحتوى الديني لا يُولَّد بواسطة الذكاء الاصطناعي.</p>
        <p>الذكاء الاصطناعي مخصص للتصنيف فقط.</p>
        <p className="pt-2 text-[10px] opacity-70">
          نسخة البيانات: {sakinaData.app.version} · حالة المحتوى: {sakinaData.app.status}
        </p>
      </div>

      {/* حقوق النشر */}
      <p className="mt-4 text-[10px] opacity-60">
        © 2026 · سكينة برو · مشروع مجاني · جميع الحقوق محفوظة
      </p>

      {/* دعاء */}
      <p className="mt-3 font-quran text-xs text-gold-dark">
        🤲 جزاكم الله خيرًا
      </p>
    </footer>
  );
}