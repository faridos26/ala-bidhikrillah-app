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

  const textToRead = useMemo(() => {
    if (tab === "home" && result) {
      const parts: string[] = [];
      parts.push(`تصنيف حالتك: ${result.category.name_ar}.`);
      content.forEach((item, i) => {
        parts.push(`محتوى ${i + 1}: ${item.text_ar}. المرجع: ${item.reference}.`);
      });
      return parts.join(" ");
    }
    if (tab === "home") {
      return "خذ لحظة واذكر الله. اكتب ما يثقل قلبك أو اختر من الإيموجي كيف تشعر.";
    }
    return "";
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

      {tab === "tasbih" && <TasbihCounter />}

      {tab === "favorites" && <FavoritesList items={favoriteItems} onToggleFavorite={toggleFavorite} />}

      <Footer />

      {tab === "home" && <ReadPageButton textToRead={textToRead} />}
    </main>
  );
}