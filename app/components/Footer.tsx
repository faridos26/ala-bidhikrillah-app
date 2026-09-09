import { sakinaData } from "@/lib/sakina";

export function Footer() {
  return (
    <footer className="px-2 pb-0 pt-6 text-center text-[11px] leading-[1.9] text-muted">
      <p>المحتوى الديني لا يُولَّد بواسطة الذكاء الاصطناعي. الذكاء الاصطناعي مخصص للتصنيف فقط.</p>
      <p>
        نسخة البيانات: {sakinaData.app.version} · حالة المحتوى: {sakinaData.app.status}
      </p>
      <p>سكينة برو · مشروع مجاني</p>
    </footer>
  );
}
