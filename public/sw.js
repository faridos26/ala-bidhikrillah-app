// Sakina Pro - Service Worker
// يخزن الملفات الأساسية ليعمل التطبيق بدون إنترنت

const CACHE_NAME = "sakina-pro-v1";
const OFFLINE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-icon.png",
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch(() => {
        // تجاهل الأخطاء إذا فشل تحميل بعض الملفات
      });
    })
  );
  self.skipWaiting();
});

// تنشيط Service Worker وحذف الكاش القديم
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// اعتراض الطلبات - استراتيجية network-first مع fallback للكاش
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // تجاهل الطلبات من domains خارجية (مثل mp3quran)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // تخزين النسخة الجديدة في الكاش
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // في حال فشل الإنترنت، نستخدم الكاش
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // إذا لم يوجد في الكاش، نعيد الصفحة الرئيسية
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});