"use client";

import { useMemo, useState } from "react";
import { allVerifiedContent, classify, sakinaData, verifiedContent, Category } from "@/lib/sakina";
import { useFavorites, favoriteId } from "@/lib/useFavorites";
import { Header } from "./components/Header";
import { NavTabs, TabKey } from "./components/NavTabs";
import { Hero } from "./components/Hero";
import { MoodPicker } from "./components/MoodPicker";
import { SituationForm } from "./components/SituationForm";
import { ResultPanel } from "./components/ResultPanel";
import { DailyVerse } from "./components/DailyVerse";
import { CategoriesGrid } from "./components/CategoriesGrid";
import { SearchBar } from "./components/SearchBar";
import { SearchResults } from "./components/SearchResults";
import { TasbihCounter } from "./components/TasbihCounter";
import { FavoritesList } from "./components/FavoritesList";
import { StoriesSection } from "./components/StoriesSection";
import { ShahadaSection } from "./components/ShahadaSection";
import { MosquesSection } from "./components/MosquesSection";
import { AdhanSection } from "./components/AdhanSection";
import { UmrahSection } from "./components/UmrahSection";
import { MadhabsSection } from "./components/MadhabsSection";
import { AsmaAllahSection } from "./components/AsmaAllahSection";
import { PrayerTimesSection } from "./components/PrayerTimesSection";
import { ReadPageButton } from "./components/ReadPageButton";
import { Footer } from "./components/Footer";

export default function Home() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [tab, setTab] = useState<TabKey>("home");
  const [search, setSearch] = useState("");
  const { favorites, toggleFavorite } = useFavorites();

  const result = useMemo(() => (submitted ? classify(submitted) : null), [submitted]);
  const content = result ? verifiedContent(result.category) : [];
  const allContent = useMemo(() => allVerifiedContent(), []);
  const daily = allContent[new Date().getDate() % Math.max(allContent.length, 1)];
  const favoriteItems = allContent.filter(({ content: item }) => favorites.includes(favoriteId(item)));
  const searchResults = useMemo(() => {
    const q = search.trim();
    if (!q) return [];
    return allContent.filter(({ content: item }) => item.text_ar.includes(q) || item.reference.includes(q));
  }, [search, allContent]);

  // النص الذي سيُقرأ حسب القسم الحالي
  const textToRead = useMemo(() => {
    switch (tab) {
      case "home": {
        if (result) {
          const parts: string[] = [];
          parts.push(`تصنيف حالتك: ${result.category.name_ar}.`);
          content.forEach((item, i) => {
            parts.push(`محتوى ${i + 1}: ${item.text_ar}. المرجع: ${item.reference}.`);
          });
          return parts.join(" ");
        }
        return "خذ لحظة واذكر الله. اكتب ما يثقل قلبك أو اختر من الإيموجي كيف تشعر. ثم اضغط ابحث عن السكينة.";
      }
      case "prayer":
        return "قسم مواقيت الصلاة. إن الصلاة كانت على المؤمنين كتابا موقوتا. اختر مدينتك لمعرفة مواقيت الصلاة. يمكنك الاستماع إلى الأذان، ومشاهدة العد التنازلي للصلاة القادمة.";
      case "categories":
        return "قسم المواضيع. تصفح الفئات المختلفة مثل الحزن والقلق والفرح والأمل، أو ابحث في الآيات والأدعية. اضغط على أي موضوع لعرض المحتوى المرتبط به.";
      case "stories":
        return "قسم القصص. اختر قصة لتقرأها، فيها قصص الأنبياء وقصص هادفة للأطفال. كل قصة تحتوي على العبرة والدروس المستفادة.";
      case "shahada":
        return "قسم نطق الشهادة. أشهد أن لا إله إلا الله، وأشهد أن محمدا رسول الله. اضغط على كل كلمة لسماع نطقها الصحيح، واستمع للشهادة كاملة.";
      case "mosques":
        return "قسم المساجد. تعرّف على أجمل المساجد في العالم، ابتداء من المسجد الحرام والمسجد النبوي والمسجد الأقصى، وجامع عقبة بن نافع وجامع الزيتونة في تونس.";
      case "adhan":
        return "قسم الأذان. استمع إلى الأذان بأصوات مؤذنين مختلفين، واقرأ نص الأذان ومعانيه، وتعلم آداب الأذان والإقامة والدعاء بعد الأذان.";
      case "umrah":
        return "قسم العمرة. تعلم خطوات العمرة كاملة، من الإحرام إلى الحلق أو التقصير، مع الأدعية والملاحظات والمحظورات والأخطاء الشائعة.";
      case "madhabs":
        return "قسم المذاهب الفقهية. نبذة تعريفية محايدة عن المذاهب الأربعة: الحنفي والمالكي والشافعي والحنبلي. تعرف على مؤسسيها وأصولها وانتشارها.";
      case "asma":
        return "قسم أسماء الله الحسنى. تسعة وتسعون اسما من أسماء الله، مع معانيها وشرحها. يمكنك البحث في الأسماء، والاستماع لكل اسم.";
      case "tasbih":
        return "قسم التسبيح. عداد إلكتروني للتسبيح. اضغط على الدائرة للعد، واختر بين سبحان الله والحمد لله والله أكبر ولا إله إلا الله وأستغفر الله.";
      case "favorites":
        return "قسم المحفوظات. هنا تجد المحتوى الذي حفظته من الآيات والأدعية والقصص. يمكنك إزالته أو مشاركته.";
      default:
        return "";
    }
  }, [tab, result, content]);

  function handleSubmit(value: string) {
    setSubmitted(value);
    setTab("home");
  }

  function handleSelectCategory(category: Category) {
    setText(category.name_ar);
    setSubmitted(category.name_ar);
    setTab("home");
  }

  function handleMoodSelect(categoryCode: string, label: string) {
    setText(label);
    setSubmitted(label);
    setTab("home");
    setTimeout(() => {
      document.getElementById("result-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <main className="mx-auto w-[min(960px,calc(100%-28px))] pb-24 pt-4">
      <Header />
      <NavTabs active={tab} onChange={setTab} favoritesCount={favorites.length} />

      {tab === "home" && (
        <>
          <Hero />

          <section className="rounded-3xl border border-border bg-surface p-7 shadow-soft">
            <MoodPicker onSelect={handleMoodSelect} />

            <div className="mt-6">
              <SituationForm text={text} onTextChange={setText} onSubmit={handleSubmit} />
            </div>

            <div id="result-anchor">
              {result && (
                <ResultPanel
                  category={result.category}
                  score={result.score}
                  content={content}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </div>
          </section>

          {daily && (
            <DailyVerse
              category={daily.category}
              content={daily.content}
              favorite={favorites.includes(favoriteId(daily.content))}
              onFavorite={() => toggleFavorite(daily.content)}
            />
          )}
        </>
      )}

      {tab === "prayer" && <PrayerTimesSection />}

      {tab === "categories" && (
        <>
          <SearchBar value={search} onChange={setSearch} />
          {search.trim() ? (
            <SearchResults
              query={search.trim()}
              results={searchResults}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ) : (
            <CategoriesGrid
              categories={sakinaData.categories.filter(
                (c) => c.code !== "GENERAL_FALLBACK" && c.code !== "SAFETY_CRISIS"
              )}
              countFor={(category) => verifiedContent(category).length}
              onSelect={handleSelectCategory}
            />
          )}
        </>
      )}

      {tab === "stories" && <StoriesSection />}

      {tab === "shahada" && <ShahadaSection />}

      {tab === "mosques" && <MosquesSection />}

      {tab === "adhan" && <AdhanSection />}

      {tab === "umrah" && <UmrahSection />}

      {tab === "madhabs" && <MadhabsSection />}

      {tab === "asma" && <AsmaAllahSection />}

      {tab === "tasbih" && <TasbihCounter />}

      {tab === "favorites" && <FavoritesList items={favoriteItems} onToggleFavorite={toggleFavorite} />}

      <Footer />

      {/* زر اقرأ لي - يعمل في جميع الأقسام */}
      <ReadPageButton textToRead={textToRead} />
    </main>
  );
}