"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [hidden, setHidden] = useState(false);

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

    // التحقق من iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // الاستماع لحدث التثبيت (Android/Chrome)
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // الاستماع لنجاح التثبيت
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
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

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
    }
  }

  // لا نعرض الزر إذا كان التطبيق مثبتًا
  if (isInstalled || hidden) return null;

  // لا نعرض إذا لم يكن هناك إمكانية تثبيت (لا Android ولا iOS)
  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      {/* الزر */}
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-gold to-gold-dark px-3 py-2 text-xs font-extrabold text-white shadow-soft transition-all hover:scale-105 active:scale-95"
        aria-label="تثبيت التطبيق على هاتفك"
        title="تثبيت التطبيق"
      >
        <span className="text-sm">📲</span>
        <span className="hidden xs:inline">تثبيت</span>
      </button>

      {/* نافذة تعليمات iOS */}
      {showIOSInstructions && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowIOSInstructions(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-gold/30 bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="text-center">
              <span className="text-5xl">📲</span>
              <h2 className="gold-text mt-3 text-xl font-extrabold">
                تثبيت التطبيق على iPhone
              </h2>
              <p className="mt-2 text-xs text-muted">
                اتبع هاتين الخطوتين البسيطتين
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-surfaceMuted/30 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-sm font-extrabold text-gold-dark">
                  1
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">اضغط زر المشاركة</p>
                  <p className="mt-1 text-xs text-muted">
                    في أسفل الشاشة، ابحث عن زر المشاركة{" "}
                    <span className="inline-block rounded bg-surfaceMuted px-1.5 py-0.5 text-base">
                      ⬆️
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border bg-surfaceMuted/30 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-sm font-extrabold text-gold-dark">
                  2
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">اختر "إضافة إلى الشاشة الرئيسية"</p>
                  <p className="mt-1 text-xs text-muted">
                    مرر للأسفل واختر{" "}
                    <span className="inline-block rounded bg-surfaceMuted px-1.5 py-0.5 text-sm">
                      ➕ إضافة إلى الشاشة
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-gold/5 p-3 text-center">
              <p className="text-xs text-gold-dark">
                ✅ بعد ذلك، ستجد أيقونة <strong>سكينة برو</strong> على شاشة هاتفك
              </p>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
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