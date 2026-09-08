"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  allVerifiedContent,
  classify,
  sakinaData,
  verifiedContent,
  Category,
} from "../lib/sakina";

const examples = [
  "أشعر بالقلق والخوف وأحتاج إلى الطمأنينة",
  "مررت بمصيبة وفقدت شخصاً عزيزاً",
  "أمر بضيق في الرزق وأحتاج إلى الأمل",
  "أشعر بالحيرة ولا أعرف أي قرار أتخذ",
];

function ContentCard({
  item,
  category,
  favorite,
  onFavorite,
}: {
  item: ReturnType<typeof verifiedContent>[number];
  category: Category;
  favorite: boolean;
  onFavorite: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `${item.text_ar}\n\n${item.reference}\n— إلا بذكر الله`;
    if (navigator.share) {
      await navigator.share({ title: "إلا بذكر الله", text });
    } else {
      await navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <article className="contentItem">
      <div className="contentTop">
        <span className="contentType">{item.type === "QURAN" ? "آية من القرآن الكريم" : item.type}</span>
        <button className={`iconButton ${favorite ? "active" : ""}`} onClick={onFavorite} aria-label="حفظ" title="حفظ">
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      <blockquote>﴿{item.text_ar}﴾</blockquote>
      <div className="source">{item.source} · {item.reference}</div>
      <div className="contentActions">
        <button onClick={share}>{copied ? "تم النسخ" : "مشاركة"}</button>
        <button onClick={share}>إرسال لشخص</button>
      </div>
      <div className="why">اختير من المحتوى الموثّق المرتبط بتصنيف «{category.name_ar}».</div>
    </article>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [tab, setTab] = useState<"home" | "categories" | "favorites">("home");
  const [favorites, setFavorites] = useState<string[]>([]);

  const result = useMemo(() => (submitted ? classify(submitted) : null), [submitted]);
  const content = result ? verifiedContent(result.category) : [];
  const allContent = allVerifiedContent();
  const daily = allContent[new Date().getDate() % Math.max(allContent.length, 1)];
  const favoriteItems = allContent.filter(({ content: item }) => favorites.includes(`${item.reference}|${item.text_ar}`));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (text.trim()) {
      setSubmitted(text.trim());
      setTab("home");
    }
  }

  function toggleFavorite(item: { reference: string; text_ar: string }) {
    const id = `${item.reference}|${item.text_ar}`;
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brandMark">ذ</div>
        <div>
          <strong>إلا بذكر الله</strong>
          <small>وَتَطْمَئِنُّ الْقُلُوبُ</small>
        </div>
        <div className="statusDot" title="المحتوى من قاعدة موثوقة" />
      </header>

      <nav className="nav" aria-label="التنقل">
        <button className={tab === "home" ? "selected" : ""} onClick={() => setTab("home")}>الرئيسية</button>
        <button className={tab === "categories" ? "selected" : ""} onClick={() => setTab("categories")}>المواضيع</button>
        <button className={tab === "favorites" ? "selected" : ""} onClick={() => setTab("favorites")}>المحفوظات {favorites.length ? `(${favorites.length})` : ""}</button>
      </nav>

      {tab === "home" && (
        <>
          <section className="hero">
            <div className="ornament">✦</div>
            <h1>خذ لحظة… واذكر الله</h1>
            <p>اكتب ما يثقل قلبك، وسنبحث لك عن آية موثوقة مرتبطة بحالتك.</p>
          </section>

          <section className="card mainCard">
            <form onSubmit={submit}>
              <label htmlFor="situation">كيف تشعر الآن؟</label>
              <textarea
                id="situation"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="اكتب بحرية… مثال: أشعر بالقلق من المستقبل"
                rows={5}
              />
              <button className="primary" type="submit">ابحث عن السكينة <span>←</span></button>
            </form>
            <div className="examples">
              {examples.map((example) => <button key={example} onClick={() => setText(example)}>{example}</button>)}
            </div>

            {result && (
              <div className="result" aria-live="polite">
                {result.category.is_safety_route ? (
                  <div className="safety">
                    <div className="safetyIcon">!</div>
                    <h2>أنت لست وحدك</h2>
                    <p>إذا كان هناك خطر فوري أو احتمال لإيذاء النفس، لا تبقَ وحدك. تواصل الآن مع شخص تثق به أو مع خدمات الطوارئ المحلية. هذا التطبيق ليس بديلاً عن المساعدة الطبية أو الطارئة.</p>
                    <div className="safetyActions"><button onClick={() => alert("تواصل مع شخص موثوق أو بخدمات الطوارئ المحلية الآن.")}>أحتاج مساعدة من شخص</button></div>
                  </div>
                ) : (
                  <>
                    <div className="resultHeader">
                      <div><span className="eyebrow">نبحث لك في المحتوى الموثوق</span><h2>{result.category.name_ar}</h2></div>
                      <span className="confidence">مطابقة {Math.round(result.score * 100)}%</span>
                    </div>
                    <div className="contentList">
                      {content.map((item, index) => (
                        <ContentCard key={`${item.reference}-${index}`} item={item} category={result.category} favorite={favorites.includes(`${item.reference}|${item.text_ar}`)} onFavorite={() => toggleFavorite(item)} />
                      ))}
                      {!content.length && <p className="muted">لا يوجد محتوى موثّق متاح لهذا التصنيف حالياً.</p>}
                    </div>
                    {result.category.code === "GENERAL_FALLBACK" && <div className="fallbackNote">لم نصل إلى تصنيف واضح. يمكنك إعادة صياغة ما تشعر به بكلمات أكثر تحديداً، أو تصفح المواضيع مباشرة.</div>}
                  </>
                )}
              </div>
            )}
          </section>

          {daily && (
            <section className="daily card">
              <div className="sectionTitle"><span>لحظة اليوم</span><span>🌿</span></div>
              <p className="dailyCategory">{daily.category.name_ar}</p>
              <blockquote>﴿{daily.content.text_ar}﴾</blockquote>
              <p className="source">{daily.content.reference}</p>
              <button className="ghost" onClick={() => toggleFavorite(daily.content)}>{favorites.includes(`${daily.content.reference}|${daily.content.text_ar}`) ? "♥ محفوظة" : "♡ حفظ لحظتي"}</button>
            </section>
          )}
        </>
      )}

      {tab === "categories" && (
        <section className="card directory">
          <div className="sectionTitle"><div><span>استكشف المواضيع</span><small>اختر موضوعاً للبدء</small></div><span>20</span></div>
          <div className="categoryGrid">
            {sakinaData.categories.filter(c => c.code !== "GENERAL_FALLBACK" && c.code !== "SAFETY_CRISIS").map((category) => (
              <button key={category.code} onClick={() => { setText(category.name_ar); setSubmitted(category.name_ar); setTab("home"); }}>
                <span>{category.name_ar}</span><small>{verifiedContent(category).length} محتوى موثّق</small>
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === "favorites" && (
        <section className="card directory">
          <div className="sectionTitle"><div><span>المحفوظات</span><small>محتوى حفظته للعودة إليه</small></div><span>♥</span></div>
          {!favoriteItems.length ? <div className="empty"><div>♡</div><p>لا توجد محتويات محفوظة بعد.</p><small>اضغط على ♡ بجانب أي آية لحفظها.</small></div> : (
            <div className="contentList">{favoriteItems.map(({ content: item, category }, i) => <ContentCard key={i} item={item} category={category} favorite={true} onFavorite={() => toggleFavorite(item)} />)}</div>
          )}
        </section>
      )}

      <footer>
        <p>المحتوى الديني لا يُولَّد بواسطة الذكاء الاصطناعي. الذكاء الاصطناعي مخصص للتصنيف فقط.</p>
        <p>نسخة البيانات: {sakinaData.app.version} · حالة المحتوى: {sakinaData.app.status}</p>
        <p>إلا بذكر الله · مشروع مجاني</p>
      </footer>
    </main>
  );
}
