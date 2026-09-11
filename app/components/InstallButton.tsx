"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type BrowserType = "chrome" | "safari" | "firefox" | "samsung" | "other";

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [browser, setBrowser] = useState<BrowserType>("other");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // التحقق إذا كان التطبيق مثبتًا بالفعل
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // التحقق من نوع المتصفح
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    let browserType: BrowserType = "other";
    if (/samsungbrowser/.test(userAgent)) {
      browserType = "samsung";
    } else if (/firefox|fxios/.test(userAgent)) {
      browserType = "firefox";
    } else if (/crios|chrome/.test(userAgent) && !/edg/.test(userAgent)) {
      browserType = "chrome";
    } else if (/safari/.test(userAgent) && isIOSDevice) {
      browserType = "safari";
    }
    setBrowser(browserType);

    // الاستماع لحدث التثبيت (Android/Chrome)
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    function handleAppInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    // إذا كان التطبيق مثبتًا، لا نفعل شيئًا
    if (isInstalled) return;

    // إذا كان هناك prompt جاهز (Chrome Android) → نفتحه مباشرة
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        }
      } catch {
        // المستخدم أغلق النافذة
      }
      return;
    }

    // خلاف ذلك → نعرض التعليمات
    setShowInstructions(true);
  }

  // لا نعرض الزر إذا كان التطبيق مثبتًا
  if (isInstalled) return null;

  // الحصول على اسم المتصفح بالعربية
  function getBrowserName(): string {
    switch (browser) {
      case "chrome":
        return "Google Chrome";
      case "safari":
        return "Safari";
      case "firefox":
        return "Firefox";
      case "samsung":
        return "Samsung Internet";
      default:
        return "المتصفح";
    }
  }

  return (
    <>
      {/* الزر - يظهر دائمًا حتى لو كان مثبتًا */}
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-gold to-gold-dark px-3 py-2 text-xs font-extrabold text-white shadow-soft transition-all hover:scale-105 active:scale-95"
        aria-label="تثبيت التطبيق على هاتفك"
        title="تثبيت التطبيق"
      >
        <span className="text-sm">📲</span>
        <span className="hidden xs:inline">تثبيت</span>
      </button>

      {/* نافذة التعليمات */}
      {showInstructions && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-gold/30 bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="text-center">
              <span className="text-5xl">📲</span>
              <h2 className="gold-text mt-3 text-xl font-extrabold">
                تثبيت التطبيق على هاتفك
              </h2>
              <p className="mt-2 text-xs text-muted">
                اتبع التعليمات حسب متصفحك
              </p>
            </div>

            {/* تعليمات Chrome / Samsung / Edge */}
            {(browser === "chrome" || browser === "samsung" || browser === "other") && !isIOS && (
              <div className="mt-5 space-y-3">
                <p className="text-center text-xs font-bold text-gold-dark">
                  {getBrowserName()}
                </p>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surfaceMuted/30 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-sm font-extrabold text-gold-dark">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">افتح قائمة المتصفح</p>
                    <p className="mt-1 text-xs text-muted">
                      اضغط على <span className="inline-block rounded bg-surfaceMuted px-1.5 py-0.5">⋮</span> في الأعلى
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surfaceMuted/30 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-sm font-extrabold text-gold-dark">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">اختر أحد الخيارات</p>
                    <p className="mt-1 text-xs text-muted">
                      <span className="inline-block rounded bg-surfaceMuted px-1.5 py-0.5">📲 تثبيت التطبيق</span>
                      {" أو "}
                      <span className="inline-block rounded bg-surfaceMuted px-1.5 py-0.5">➕ إضافة إلى الشاشة الرئيسية</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* تعليمات iOS / Safari */}
            {(isIOS || browser === "safari") && (
              <div className="mt-5 space-y-3">
                <p className="text-center text-xs font-bold text-gold-dark">
                  Safari على iPhone/iPad
                </p>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surfaceMuted/30 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-sm font-extrabold text-gold-dark">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">اضغط زر المشاركة</p>
                    <p className="mt-1 text-xs text-muted">
                      في أسفل الشاشة، ابحث عن{" "}
                      <span className="inline-block rounded bg-surfaceMuted px-1.5 py-0.5 text-base">⬆️</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surfaceMuted/30 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-sm font-extrabold text-gold-dark">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">"إضافة إلى الشاشة الرئيسية"</p>
                    <p className="mt-1 text-xs text-muted">
                      مرر للأسفل واختر{" "}
                      <span className="inline-block rounded bg-surfaceMuted px-1.5 py-0.5 text-sm">
                        ➕ إضافة إلى الشاشة
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* تعليمات Firefox */}
            {browser === "firefox" && !isIOS && (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-3">
                  <p className="text-sm font-bold text-amber-700">⚠️ ملاحظة</p>
                  <p className="mt-1 text-xs text-amber-700">
                    Firefox لا يدعم تثبيت التطبيقات بشكل كامل. للحصول على أفضل تجربة، افتح الموقع في{" "}
                    <strong>Google Chrome</strong> أو <strong>Samsung Internet</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 rounded-xl bg-gold/5 p-3 text-center">
              <p className="text-xs text-gold-dark">
                ✅ بعد التثبيت، ستجد أيقونة <strong>سكينة برو</strong> على شاشة هاتفك
              </p>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 w-full rounded-xl bg-gradient-to-br from-gold to-gold-dark px-4 py-3 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105"
            >
              فهمت، شكرًا
            </button>
          </div>
        </div>
      )}
    </>
  );
}