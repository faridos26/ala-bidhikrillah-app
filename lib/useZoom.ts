"use client";

import { useEffect, useState } from "react";

const ZOOM_KEY = "sakina-zoom";

export function useZoom() {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ZOOM_KEY);
      const zoomed = stored === "on";
      setIsZoomed(zoomed);
      if (zoomed) {
        document.documentElement.classList.add("zoomed");
      }
    } catch {
      // localStorage غير متاح
    }
  }, []);

  function toggle() {
    setIsZoomed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ZOOM_KEY, next ? "on" : "off");
      } catch {
        // ignore
      }
      if (next) {
        document.documentElement.classList.add("zoomed");
      } else {
        document.documentElement.classList.remove("zoomed");
      }
      return next;
    });
  }

  return { isZoomed, toggle };
}