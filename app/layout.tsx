import "./globals.css";

export const metadata = {
  title: "إلا بذكر الله",
  description: "مساحة هادئة للعثور على محتوى ديني موثوق بحسب الحالة التي تصفها.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
