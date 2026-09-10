import type { Metadata, Viewport } from "next";
import { Tajawal, Amiri } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const siteUrl = "https://ala-bidhikrillah-app.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "سكينة برو — مساحة هادئة لقلبك",
    template: "%s · سكينة برو",
  },
  description:
    "اكتب ما يثقل قلبك، ونقترح عليك آيات وأدعية موثوقة مناسبة لحالتك. مساحة هادئة، بلا إعلانات، ومحتواها الديني غير مولّد بالذكاء الاصطناعي.",
  keywords: ["سكينة", "أذكار", "آيات قرآنية", "دعاء", "طمأنينة", "قلق", "حزن", "سكينة برو"],
  authors: [{ name: "سكينة برو" }],
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: siteUrl,
    siteName: "سكينة برو",
    title: "سكينة برو — مساحة هادئة لقلبك",
    description: "اكتب ما يثقل قلبك، ونقترح عليك آيات وأدعية موثوقة مناسبة لحالتك.",
  },
  twitter: {
    card: "summary",
    title: "سكينة برو",
    description: "مساحة هادئة للعثور على محتوى ديني موثوق بحسب حالتك.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "سكينة برو",
    statusBarStyle: "black-translucent",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#101915" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint to avoid a flash of the wrong theme on load.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem("sakina-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored ? stored === "dark" : prefersDark;
    if (isDark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

// تسجيل Service Worker لتفعيل PWA
const swRegisterScript = `
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").catch(function() {});
  });
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${amiri.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: swRegisterScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}