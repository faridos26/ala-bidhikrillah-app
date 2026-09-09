"use client";

import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "./storage";

export const TASBIH_PHRASES = ["سبحان الله", "الحمد لله", "الله أكبر", "لا إله إلا الله", "أستغفر الله"];

const KEY = "sakina-tasbih";

type TasbihState = { phraseIndex: number; count: number; total: number };

const DEFAULT_STATE: TasbihState = { phraseIndex: 0, count: 0, total: 0 };

export function useTasbih() {
  const [state, setState] = useState<TasbihState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readJSON<TasbihState>(KEY, DEFAULT_STATE));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(KEY, state);
  }, [state, hydrated]);

  function increment() {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(8);
    setState((s) => {
      const next = s.count + 1;
      return { ...s, count: next >= 33 ? 0 : next, total: s.total + 1 };
    });
  }

  function reset() {
    setState((s) => ({ ...s, count: 0 }));
  }

  function setPhrase(index: number) {
    setState((s) => ({ ...s, phraseIndex: index, count: 0 }));
  }

  return {
    phrase: TASBIH_PHRASES[state.phraseIndex],
    phraseIndex: state.phraseIndex,
    count: state.count,
    total: state.total,
    increment,
    reset,
    setPhrase,
  };
}
