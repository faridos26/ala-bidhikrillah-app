import "./globals.css";

export const metadata = {
  title: "ألا بذكر الله...",
  description: "آيات وأحاديث تُعين على لحظات الحزن والقلق والفرح",
  openGraph: {
    title: "ألا بذكر الله...",
    description: "آيات وأحاديث تُعين على لحظات الحزن والقلق والفرح",
    locale: "ar_AR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-quran: 'Amiri';
            --font-display: 'Amiri';
            --font-ui: 'Tajawal';
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
