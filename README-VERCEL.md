# Sakina V1 — Web App starter

هذه النسخة تحول قاعدة Sakina V1.6 إلى تطبيق Next.js أولي قابل للتشغيل محلياً والنشر على Vercel.

## التشغيل المحلي

```bash
npm install
npm run dev
```

ثم افتح `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Vercel

1. ارفع الملفات إلى GitHub داخل المستودع الحالي.
2. في Vercel اختر Import Project ثم اختر مستودع Sakina.
3. Framework: Next.js (يُكتشف تلقائياً).
4. Build Command: `next build`.
5. Install Command: `npm install`.
6. لا توجد Environment Variables مطلوبة في هذه المرحلة.

## ملاحظات V1

- المحتوى مأخوذ من `sakina_v1_6.json`.
- العرض يستعمل المحتوى الذي حالته `VERIFIED` فقط.
- التصنيف محلي بالكلمات المفتاحية في هذه النسخة التجريبية.
- Threshold = 0.75.
- `GENERAL_FALLBACK` للحالات التي لا تحقق العتبة.
- `SAFETY_CRISIS` له مسار مستقل.
- لا يتم توليد نص ديني بواسطة الذكاء الاصطناعي.
- قبل النشر العام يجب استكمال المراجعة النهائية للمحتوى العربي والمراجع والسياق.
