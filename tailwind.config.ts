import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surfaceMuted: "var(--surface-muted)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        border: "var(--border)",
        accent: "var(--accent)",
        accentStrong: "var(--accent-strong)",
        gold: "var(--gold)",
        danger: "var(--danger)",
        dangerSurface: "var(--danger-surface)",
      },
      fontFamily: {
        ui: ["var(--font-tajawal)", "Tahoma", "sans-serif"],
        quran: ["var(--font-amiri)", "serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      boxShadow: {
        soft: "0 14px 45px -20px rgba(24, 46, 36, 0.35)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.45s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
