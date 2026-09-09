"use client";

import { useMemo, useState } from "react";
import { allVerifiedContent, classify, sakinaData, verifiedContent, Category } from "@/lib/sakina";
import { useFavorites, favoriteId } from "@/lib/useFavorites";
import { Header } from "./components/Header";
import { NavTabs, TabKey } from "./components/NavTabs";
import { Hero } from "./components/Hero";
import { SituationForm } from "./components/SituationForm";
import { ResultPanel } from "./components/ResultPanel";
import { DailyVerse } from "./components/DailyVerse";
import { CategoriesGrid } from "./components/CategoriesGrid";
import { SearchBar } from "./components/SearchBar";
import { SearchResults } from "./components/SearchResults";
import { TasbihCounter } from "./components/TasbihCounter";
import { FavoritesList } from "./components/FavoritesList";
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

  function handleSubmit(value: string) {
    setSubmitted(value);
    setTab("home");
  }

  function handleSelectCategory(category: Category) {
    setText(category.name_ar);
    setSubmitted(category.name_ar);
    setTab("home");
  }

  return (
    <main className="mx-auto w-[min(960px,calc(100%-28px))] pb-9 pt-4">
      <Header />
      <NavTabs active={tab} onChange={setTab} favoritesCount={favorites.length} />

      {tab === "home" && (
        <>
          <Hero />

          <section className="rounded-3xl border border-border bg-surface p-7 shadow-soft">
            <SituationForm text={text} onTextChange={setText} onSubmit={handleSubmit} />
            {result && (
              <ResultPanel
                category={result.category}
                score={result.score}
                content={content}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}
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

      {tab === "tasbih" && <TasbihCounter />}

      {tab === "favorites" && <FavoritesList items={favoriteItems} onToggleFavorite={toggleFavorite} />}

      <Footer />
    </main>
  );
}
