"use client";

import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "./storage";

const KEY = "sakina-favorites";

export function favoriteId(item: { reference: string; text_ar: string }) {
  return `${item.reference}|${item.text_ar}`;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read persisted favorites once, after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setFavorites(readJSON<string[]>(KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(KEY, favorites);
  }, [favorites, hydrated]);

  function toggleFavorite(item: { reference: string; text_ar: string }) {
    const id = favoriteId(item);
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return { favorites, toggleFavorite };
}
