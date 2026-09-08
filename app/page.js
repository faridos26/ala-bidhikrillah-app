"use client";

import { useState } from "react";
import sakinaData from "../data/sakina.json";
import StarMotif from "./components/StarMotif";
import CornerFlourish from "./components/CornerFlourish";

const CATEGORY_CHIPS = sakinaData.categories.filter((c) => !c.is_safety_route);
const SAFETY_CATEGORY = sakinaData.categories.find((c) => c.is_safety_route);
const RECITER = sakinaData.reciters.find((r) => r.is_default) || sakinaData.reciters[0];
const SHARE_PROMPT = sakinaData.engagement_prompts.find((p) => p.prompt_type === "SHARE");
const DONATE_PROMPT = sakinaData.engagement_prompts.find((p) => p.prompt_type === "DONATE");

// عدّاد اهتمام بلا أي تعامل مع مال أو بيانات دفع — فقط لقياس الطلب قبل
// الانتقال للخطوة القانونية (تسجيل ككيان يقبل تبرعات). countapi.xyz خدمة
// عدّاد مجانية بلا تسجيل، لا تخزّن أي بيانات شخصية.
async function pingDonationInterest() {
  try {
    await fetch("https://api.countapi.xyz/hit/ala-bidhikrillah-app/donate-interest");
  } catch {
    // فشل صامت — قياس الاهتمام ثانوي ولا يجب أن يكسر تجربة المستخدم
  }
}

function quranAudioUrl(surahNumber) {
  const padded = String(surahNumber).padStart(3, "0");
  return `${RECITER.server_base_url}${padded}.mp3`;
}

function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ar-SA";
  window.speechSynthesis.speak(utter);
}

// عدّاد استفادة بسيط محليًا (localStorage) لأهلية ظهور رسائل التفاعل —
// لا خادم حالة هنا، القرار كله على جهاز المستخدم. تعمل SHARE وDONATE بنفس
// المنطق: عتبة استفادة دنيا + فترة تهدئة بعد الإغلاق + استبعاد مطلق بعد
// أي مسار أزمة.
function shouldShowPrompt(prompt, storageKey, lastWasSafety, views) {
  if (!prompt || !prompt.enabled || lastWasSafety) return false;
  if (views < prompt.trigger_min_content_views) return false;

  const dismissedAt = localStorage.getItem(`sakina_${storageKey}_dismissed_at`);
  if (dismissedAt) {
    const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
    if (daysSince < prompt.cooldown_days_after_dismiss) return false;
  }
  return true;
}

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [donateThanked, setDonateThanked] = useState(false);

  async function submitRequest(payload) {
    setLoading(true);
    setError("");
    setShowShare(false);
    setShowDonate(false);
    setDonateThanked(false);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("تعذّر الوصول للخادم");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);

      const views = Number(localStorage.getItem("sakina_views") || "0") + 1;
      localStorage.setItem("sakina_views", String(views));

      setShowShare(shouldShowPrompt(SHARE_PROMPT, "share", data.is_safety_route, views));
      // لا نُظهر الاثنين معًا في نفس اللحظة كي لا تُثقَل الشاشة برسالتين تفاعليتين
      setShowDonate(
        !shouldShowPrompt(SHARE_PROMPT, "share", data.is_safety_route, views) &&
        shouldShowPrompt(DONATE_PROMPT, "donate", data.is_safety_route, views)
      );
    } catch (err) {
      setError("حدث خطأ ولم نتمكن من إحضار المحتوى الآن. حاول مرة أخرى بعد قليل.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    submitRequest({ text });
  }

  function handleCategoryPick(categoryCode) {
    setText("");
    submitRequest({ category_code: categoryCode });
  }

  function handleReset() {
    setText("");
    setResult(null);
    setError("");
    setShowShare(false);
    setShowDonate(false);
    setDonateThanked(false);
  }

  function handleDonateInterest() {
    pingDonationInterest();
    setDonateThanked(true);
  }

  function dismissDonate() {
    localStorage.setItem("sakina_donate_dismissed_at", String(Date.now()));
    setShowDonate(false);
  }

  function handleShare() {
    const shareText = SHARE_PROMPT?.meta?.share_text_ar || "";
    const shareUrl = SHARE_PROMPT?.meta?.share_url || "";
    if (navigator.share) {
      navigator.share({ text: shareText, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${shareText} ${shareUrl}`.trim());
    }
  }

  function dismissShare() {
    localStorage.setItem("sakina_share_dismissed_at", String(Date.now()));
    setShowShare(false);
  }

  const content = result?.content;
  const isQuran = content?.type === "QURAN";
  const isSafety = result?.is_safety_route;

  return (
    <main>
      <div className="brand">
        <StarMotif className="brand-motif" />
        <h1>ألا بذكر الله...</h1>
        <p>شارك ما يشغل قلبك، ونرافقك بآية أو حديث يناسب لحظتك</p>
      </div>

      <form className="input-card" onSubmit={handleSubmit}>
        <label htmlFor="feeling" className="sr-only">اكتب ما تشعر به</label>
        <textarea
          id="feeling"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب هنا ما تشعر به الآن..."
        />
        <div className="submit-row">
          {result && (
            <button type="button" className="btn-ghost" onClick={handleReset}>
              سؤال جديد
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
            {loading ? "لحظة..." : "أرسل"}
          </button>
        </div>
      </form>

      <div className="chips-section">
        <p className="chips-label">أو اختر ما يصف حالتك الآن</p>
        <div className="chips-row">
          {CATEGORY_CHIPS.map((cat) => (
            <button
              key={cat.code}
              type="button"
              className="chip"
              onClick={() => handleCategoryPick(cat.code)}
              disabled={loading}
            >
              {cat.name_ar}
            </button>
          ))}
        </div>
        {SAFETY_CATEGORY && (
          <button
            type="button"
            className="chip chip-safety"
            onClick={() => handleCategoryPick(SAFETY_CATEGORY.code)}
            disabled={loading}
          >
            🤍 أحتاج مساعدة الآن
          </button>
        )}
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      {content && (
        <div className={`result-card ${isSafety ? "safety" : ""}`}>
          <CornerFlourish className="corner-flourish tl" />
          <CornerFlourish className="corner-flourish tr" />
          <div className="category-label">{result.category_name}</div>

          {isSafety ? (
            <p className="safety-message">{content.text_ar}</p>
          ) : (
            <p className="verse-text">{content.text_ar}</p>
          )}

          <div className="reference-line">
            {content.source} — {content.reference}
          </div>

          {content.status === "PENDING_REVIEW" && (
            <span className="pending-flag">قيد المراجعة الداخلية</span>
          )}

          <div className="actions-row">
            {isQuran ? (
              <audio controls src={quranAudioUrl(content.surah_number)} style={{ maxWidth: "100%" }} />
            ) : (
              <button className="btn-ghost" onClick={() => speak(content.text_ar)}>
                🔊 استماع
              </button>
            )}
          </div>
        </div>
      )}

      {showShare && (
        <div className="share-card">
          <p>{SHARE_PROMPT.headline_ar} — {SHARE_PROMPT.body_ar}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={handleShare}>{SHARE_PROMPT.cta_ar}</button>
            <button className="btn-ghost" onClick={dismissShare}>لاحقًا</button>
          </div>
        </div>
      )}

      {showDonate && (
        <div className="share-card">
          {donateThanked ? (
            <p>شكرًا لاهتمامك 🤍 سنُعلمك فور تفعيل التبرع فعليًا.</p>
          ) : (
            <>
              <p>{DONATE_PROMPT.headline_ar} — {DONATE_PROMPT.body_ar}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-ghost" onClick={handleDonateInterest}>{DONATE_PROMPT.cta_ar}</button>
                <button className="btn-ghost" onClick={dismissDonate}>لاحقًا</button>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
